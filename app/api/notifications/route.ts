import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { env } from "@/lib/env";
import { logger } from "@/lib/logging/structured-logger";
import { handleApiError } from "@/lib/api/route-handler";

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);

// Notification query schema
const notificationQuerySchema = z.object({
  type: z.enum([
    "system", "security", "marketing", "product_updates",
    "community", "billing", "achievement", "reminder", "alert"
  ]).optional(),
  read: z.boolean().optional(),
  archived: z.boolean().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

// Notification create schema
const notificationCreateSchema = z.object({
  user_id: z.string().uuid(),
  tenant_id: z.string().uuid().optional(),
  type: z.enum([
    "system", "security", "marketing", "product_updates",
    "community", "billing", "achievement", "reminder", "alert"
  ]),
  title: z.string().min(1).max(255),
  message: z.string().min(1),
  action_url: z.string().url().optional(),
  action_label: z.string().max(100).optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  expires_at: z.string().datetime().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const dynamic = "force-dynamic";

/**
 * GET /api/notifications
 * Get user notifications
 */
export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const searchParams = new URL(request.url).searchParams;
    const query = notificationQuerySchema.parse({
      type: searchParams.get("type") || undefined,
      read: searchParams.get("read") === "true" ? true : searchParams.get("read") === "false" ? false : undefined,
      archived: searchParams.get("archived") === "true" ? true : searchParams.get("archived") === "false" ? false : undefined,
      limit: searchParams.get("limit") || 20,
      offset: searchParams.get("offset") || 0,
    });

    // Get tenant_id from header or query
    const tenantId = request.headers.get("x-tenant-id") || 
                     searchParams.get("tenant_id");

    // Build query
    let queryBuilder = supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(query.offset, query.offset + query.limit - 1);

    if (tenantId) {
      queryBuilder = queryBuilder.eq("tenant_id", tenantId);
    }

    if (query.type) {
      queryBuilder = queryBuilder.eq("type", query.type);
    }

    if (query.read !== undefined) {
      queryBuilder = queryBuilder.eq("read", query.read);
    }

    if (query.archived !== undefined) {
      queryBuilder = queryBuilder.eq("archived", query.archived);
    }

    // Filter out expired notifications
    queryBuilder = queryBuilder.or("expires_at.is.null,expires_at.gt.now()");

    const { data: notifications, error } = await queryBuilder;

    if (error) {
      logger.error("Failed to get notifications", { error, userId: user.id });
      return handleApiError(error, "Failed to retrieve notifications");
    }

    // Get unread count
    const { data: unreadCount } = await supabase.rpc("get_unread_notification_count", {
      p_user_id: user.id,
      p_tenant_id: tenantId || null,
    });

    return NextResponse.json({
      notifications: notifications || [],
      unread_count: unreadCount || 0,
      pagination: {
        limit: query.limit,
        offset: query.offset,
        total: notifications?.length || 0,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    logger.error("Error in GET /api/notifications", { error });
    return handleApiError(error, "Failed to retrieve notifications");
  }
}

/**
 * POST /api/notifications
 * Create a notification (admin/service role only)
 */
export async function POST(request: NextRequest) {
  try {
    // This endpoint should be protected and only accessible by service role
    // In production, add additional authorization checks

    const body = await request.json();
    const validatedData = notificationCreateSchema.parse(body);

    const { data: notification, error } = await supabase
      .from("notifications")
      .insert({
        ...validatedData,
        expires_at: validatedData.expires_at || null,
      })
      .select()
      .single();

    if (error) {
      logger.error("Failed to create notification", { error });
      return handleApiError(error, "Failed to create notification");
    }

    logger.info("Notification created", { notificationId: notification.id, userId: validatedData.user_id });

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    logger.error("Error in POST /api/notifications", { error });
    return handleApiError(error, "Failed to create notification");
  }
}
