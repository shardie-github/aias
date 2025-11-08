import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(
      JSON.stringify({ ok: false, error: "Missing Supabase configuration" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ ok: false, error: "Method not allowed" }),
      { status: 405, headers: { "content-type": "application/json" } }
    );
  }

  try {
    const payload = await req.json().catch(() => ({}));
    const {
      method = req.method,
      path = new URL(req.url).pathname,
      status_code,
      response_time_ms,
      user_id,
      ip_address,
      user_agent = req.headers.get("user-agent") || null,
      request_body,
      response_body,
      error_message,
    } = payload;

    const { error } = await supabase.from("api_logs").insert({
      method,
      path,
      status_code,
      response_time_ms,
      user_id: user_id || null,
      ip_address: ip_address || null,
      user_agent,
      request_body: request_body || null,
      response_body: response_body || null,
      error_message: error_message || null,
    });

    if (error) {
      return new Response(
        JSON.stringify({ ok: false, error: error.message }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, logged: true }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
});
