import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 300000; // 5 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(identifier);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (limit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  limit.count++;
  return true;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone: string): boolean {
  // Basic international phone validation
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, company, meetingType, date, time, notes } = await req.json();

    // Rate limiting by email
    if (!checkRateLimit(email)) {
      return new Response(
        JSON.stringify({ error: 'Too many booking requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Input validation
    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
      throw new Error('Invalid name (max 100 characters)');
    }

    if (!email || !validateEmail(email) || email.length > 255) {
      throw new Error('Invalid email address');
    }

    if (phone && !validatePhone(phone)) {
      throw new Error('Invalid phone number');
    }

    if (company && company.length > 200) {
      throw new Error('Company name too long (max 200 characters)');
    }

    if (notes && notes.length > 2000) {
      throw new Error('Notes too long (max 2000 characters)');
    }

    if (!meetingType || !['video', 'phone', 'chat'].includes(meetingType)) {
      throw new Error('Invalid meeting type');
    }

    if (!date || !time) {
      throw new Error('Date and time are required');
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
