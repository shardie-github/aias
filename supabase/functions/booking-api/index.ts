import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schema
const bookingRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long (max 100 characters)"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional().or(z.literal('')),
  company: z.string().max(200, "Company name too long (max 200 characters)").optional(),
  meetingType: z.enum(['video', 'phone', 'chat'], { errorMap: () => ({ message: "Invalid meeting type" }) }),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  notes: z.string().max(2000, "Notes too long (max 2000 characters)").optional(),
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
    p_endpoint: 'booking-api',
    p_max_requests: 5,
    p_window_seconds: 300
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
    const validation = bookingRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: validation.error.errors[0].message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { name, email, phone, company, meetingType, date, time, notes } = validation.data;

    // Distributed rate limiting by email
    const isAllowed = await checkRateLimit(email);
    if (!isAllowed) {
      return new Response(
        JSON.stringify({ error: 'Too many booking requests. Please try again in 5 minutes.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // TODO: Integrate with booking system (Calendly, Cal.com, or custom)
    // TODO: Send confirmation email
    // TODO: Store in CRM

    console.log('Booking request:', {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone,
      company,
      meetingType,
      date,
      time,
      notes: notes?.substring(0, 200),
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Booking request received. You will receive a confirmation email shortly.' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in booking-api:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
