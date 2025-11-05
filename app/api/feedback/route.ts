// [STAKE+TRUST:BEGIN:feedback_api]
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { userId = "anon", rating, comment } = body;

    // TODO: Replace with real auth user id from session
    // const { data: { user } } = await supa.auth.getUser();
    // const userId = user?.id || "anon";

    const { error } = await supa.from("audit_log").insert({
      user_id: userId,
      action: "feedback",
      meta: { rating, comment, timestamp: new Date().toISOString() },
    });

    if (error) {
      console.error("Feedback submission error:", error);
      return NextResponse.json(
        { error: "Failed to submit feedback", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
// [STAKE+TRUST:END:feedback_api]
