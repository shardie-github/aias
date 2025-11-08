import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schema
const leadGenRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long (max 100 characters)"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
});

// Initialize Supabase client - Load from environment variables dynamically
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing required environment variables: SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY\n' +
    'Please set these variables in Supabase Dashboard → Settings → API'
  );
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Distributed rate limit check
async function checkRateLimit(identifier: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin.rpc('check_rate_limit', {
    p_identifier: identifier,
    p_endpoint: 'lead-gen-api',
    p_max_requests: 3,
    p_window_seconds: 3600
  });

  if (error) {
    console.error('Rate limit check error:', error);
    return true;
  }

  return data === true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input with Zod
    const validation = leadGenRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: validation.error.errors[0].message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { name, email } = validation.data;

    // Distributed rate limiting by email
    const isAllowed = await checkRateLimit(email);
    if (!isAllowed) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again in 1 hour.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // TODO: Generate PDF with 10-page master system prompts
    // TODO: Send PDF via email (use SendGrid, Mailgun, or Resend)
    // TODO: Add to CRM/mailing list

    console.log('Lead captured:', {
      name: name.trim(),
      email: email.toLowerCase().trim(),
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thank you! Check your email for your free guide.' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in lead-gen-api:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
