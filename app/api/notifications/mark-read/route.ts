import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { env } from "@/lib/env";
import { logger } from "@/lib/logging/structured-logger";
import { handleApiError } from "@/lib/api/route-handler";

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);

// Mark read schema
const markReadSchema = z.object({
  notification_ids: z.array(z.string().uuid()).optional(),
  all: z.boolean().default(false),
});

export const dynamic = "force-dynamic";

/**
 * POST /api/notifications/mark-read
 * Mark notifications as read
 */
export async function POST(request: NextRequest) {
  try {
    // Get user from auth header or cookie
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") 
      ? authHeader.substring(7)
      : request.cookies.get("sb-access-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { notification_ids, all } = markReadSchema.parse(body);

    // Get tenant_id from header or query
    const tenantId = request.headers.get("x-tenant-id") || 
                     new URL(request.url).searchParams.get("tenant_id");

    // Use RPC function to mark as read
    const { data: count, error } = await supabase.rpc("mark_notifications_read", {
      p_user_id: user.id,
      p_notification_ids: all ? null : notification_ids || null,
    });

    if (error) {
      logger.error("Failed to mark notifications as read", { error, userId: user.id });
      return handleApiError(error, "Failed to mark notifications as read");
    }

    logger.info("Notifications marked as read", { userId: user.id, count });

    return NextResponse.json({ 
      success: true, 
      count: count || 0 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    logger.error("Error in POST /api/notifications/mark-read", { error });
    return handleApiError(error, "Failed to mark notifications as read");
  }
}
