import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { env } from "@/lib/env";
import { logger } from "@/lib/logging/structured-logger";
import { handleApiError } from "@/lib/api/route-handler";

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);

// Notification update schema
const notificationUpdateSchema = z.object({
  read: z.boolean().optional(),
  archived: z.boolean().optional(),
});

export const dynamic = "force-dynamic";

/**
 * PATCH /api/notifications/[id]
 * Update a notification (mark as read, archive, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const notificationId = params.id;
    const body = await request.json();
    const updateData = notificationUpdateSchema.parse(body);

    // Build update object
    const updates: Record<string, unknown> = {};
    if (updateData.read !== undefined) {
      updates.read = updateData.read;
      if (updateData.read) {
        updates.read_at = new Date().toISOString();
      }
    }
    if (updateData.archived !== undefined) {
      updates.archived = updateData.archived;
      if (updateData.archived) {
        updates.archived_at = new Date().toISOString();
      }
    }

    const { data: notification, error } = await supabase
      .from("notifications")
      .update(updates)
      .eq("id", notificationId)
      .eq("user_id", user.id) // Ensure user owns this notification
      .select()
      .single();

    if (error) {
      logger.error("Failed to update notification", { error, notificationId, userId: user.id });
      return handleApiError(error, "Failed to update notification");
    }

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    logger.info("Notification updated", { notificationId, userId: user.id, updates });

    return NextResponse.json({ notification });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    logger.error("Error in PATCH /api/notifications/[id]", { error });
    return handleApiError(error, "Failed to update notification");
  }
}

/**
 * DELETE /api/notifications/[id]
 * Delete a notification
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const notificationId = params.id;

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId)
      .eq("user_id", user.id); // Ensure user owns this notification

    if (error) {
      logger.error("Failed to delete notification", { error, notificationId, userId: user.id });
      return handleApiError(error, "Failed to delete notification");
    }

    logger.info("Notification deleted", { notificationId, userId: user.id });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error in DELETE /api/notifications/[id]", { error });
    return handleApiError(error, "Failed to delete notification");
  }
}
