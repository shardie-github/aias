// [STAKE+TRUST:BEGIN:audit_api]
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Supabase configuration missing" },
        { status: 500 }
      );
    }

    const supa = createClient(supabaseUrl, supabaseKey);

    // TODO: Replace with real auth user id from session
    // For now, this is a placeholder that would need proper authentication
    // const { data: { user } } = await supa.auth.getUser();
    // if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // const userId = user.id;

    // Placeholder: In production, get userId from authenticated session
    const userId = "me"; // This should be replaced with actual auth

    const { data, error } = await supa
      .from("audit_log")
      .select("*")
      .eq("user_id", userId)
      .order("ts", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Audit log query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch audit log", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ rows: data || [] });
  } catch (error: any) {
    console.error("Audit log API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
// [STAKE+TRUST:END:audit_api]
