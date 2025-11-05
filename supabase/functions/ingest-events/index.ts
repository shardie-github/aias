import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Minimal auth via header token or anon (if only client-side signals; tighten as needed)
serve(async (req) => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  const payload = await req.json().catch(() => ({}));
  const { user_id, session_id, app = "web", type, path, meta } = payload || {};
  if (!user_id || !type) return new Response("Missing fields", { status: 400 });

  const { error } = await supabase.from("events").insert({ user_id, session_id, app, type, path, meta });
  if (error) return new Response(error.message, { status: 500 });
  return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } });
});
