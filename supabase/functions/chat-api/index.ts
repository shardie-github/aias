import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schema
const chatRequestSchema = z.object({
  message: z.string().trim().min(1, "Message cannot be empty").max(5000, "Message too long (max 5000 characters)"),
  conversationId: z.string().uuid().optional(),
});

// Distributed rate limit check using Supabase function
async function checkRateLimit(supabaseAdmin: unknown, userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin.rpc('check_rate_limit', {
    p_identifier: userId,
    p_endpoint: 'chat-api',
    p_max_requests: 20,
    p_window_seconds: 60
  });

  if (error) {
    console.error('Rate limit check error:', error);
    return true; // Fail open for now
  }

  return data === true;
}

// Log audit event
async function logAudit(supabaseAdmin: unknown, userId: string, action: string, resourceType: string, resourceId?: string, metadata?: Record<string, unknown>) {
  await supabaseAdmin.rpc('log_audit_event', {
    p_user_id: userId,
    p_action: action,
    p_resource_type: resourceType,
    p_resource_id: resourceId,
    p_metadata: metadata || {}
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });
    
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    
    // Validate input with Zod
    const validation = chatRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: validation.error.errors[0].message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, conversationId } = validation.data;

    // Distributed rate limiting
    const isAllowed = await checkRateLimit(supabaseAdmin, user.id);
    if (!isAllowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again in 1 minute.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize message content (basic XSS prevention)
    const sanitizedMessage = message.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Get or create conversation
    let convId = conversationId;
    if (!convId) {
      const { data: newConv, error: convError } = await supabase
        .from('chat_conversations')
        .insert({ user_id: user.id, title: sanitizedMessage.substring(0, 50) })
        .select()
        .single();

      if (convError) throw convError;
      convId = newConv.id;
    }

    // Save user message
    const { error: msgError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: convId,
        content: sanitizedMessage,
        role: 'user',
      });

    if (msgError) throw msgError;

    // Log audit event
    await logAudit(supabaseAdmin, user.id, 'message_sent', 'chat_message', convId, { message_length: sanitizedMessage.length });

    // TODO: Integrate with OpenAI API here
    // For now, return a placeholder response
    const aiResponse = "I'm your AI automation assistant. This is a placeholder response. Integration with OpenAI pending.";

    // Save AI response
    const { error: aiMsgError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: convId,
        content: aiResponse,
        role: 'assistant',
      });

    if (aiMsgError) throw aiMsgError;

    return new Response(
      JSON.stringify({ reply: aiResponse, conversationId: convId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat-api:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
