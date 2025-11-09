// [STAKE+TRUST:BEGIN:feedback_api]
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createValidatedRoute } from "@/lib/api/validation-middleware";
import { z } from "zod";
import { logger } from "@/lib/logging/structured-logger";
import { telemetry } from "@/lib/monitoring/enhanced-telemetry";

export const runtime = "edge";

const feedbackSchema = z.object({
  userId: z.string().optional().default("anon"),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const POST = createValidatedRoute(feedbackSchema, async (data, req: NextRequest) => {
  try {
    // Load environment variables dynamically
    const { env } = await import("@/lib/env");
    const supabaseUrl = env.supabase.url;
    const supabaseKey = env.supabase.anonKey;

    if (!supabaseUrl || !supabaseKey) {
      logger.error("Supabase configuration missing");
      return NextResponse.json(
        { error: "Supabase configuration missing" },
        { status: 500 }
      );
    }

    const supa = createClient(supabaseUrl, supabaseKey);

    const { userId, rating, comment } = data;

    // TODO: Replace with real auth user id from session
    // const { data: { user } } = await supa.auth.getUser();
    // const userId = user?.id || "anon";

    const { error } = await supa.from("audit_log").insert({
      user_id: userId,
      action: "feedback",
      meta: { rating, comment, timestamp: new Date().toISOString() },
    });

    if (error) {
      logger.error("Feedback submission error", error as Error, { userId, rating });
      return NextResponse.json(
        { error: "Failed to submit feedback", details: error.message },
        { status: 500 }
      );
    }

    // Track feedback submission
    telemetry.track({
      name: "feedback_submitted",
      category: "business",
      properties: { rating, hasComment: !!comment },
    });

    logger.info("Feedback submitted successfully", { userId, rating });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    logger.error("Feedback API error", error, { userId: data.userId });
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
});
// [STAKE+TRUST:END:feedback_api]
