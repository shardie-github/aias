import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { env } from "@/lib/env";
import { logger } from "@/lib/logging/structured-logger";
import { handleApiError } from "@/lib/api/route-handler";

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);

// Settings update schema
const settingsUpdateSchema = z.object({
  email_notifications_enabled: z.boolean().optional(),
  push_notifications_enabled: z.boolean().optional(),
  sms_notifications_enabled: z.boolean().optional(),
  notification_types: z.record(z.boolean()).optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  date_format: z.string().optional(),
  time_format: z.enum(["12h", "24h"]).optional(),
  profile_visibility: z.enum(["public", "private", "friends"]).optional(),
  analytics_opt_in: z.boolean().optional(),
  data_sharing_enabled: z.boolean().optional(),
  beta_features_enabled: z.boolean().optional(),
  experimental_features_enabled: z.boolean().optional(),
  custom_settings: z.record(z.unknown()).optional(),
  tenant_id: z.string().uuid().optional(),
});

export const dynamic = "force-dynamic";

/**
 * GET /api/settings
 * Get user settings
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

    // Get tenant_id from header or query
    const tenantId = request.headers.get("x-tenant-id") || 
                     new URL(request.url).searchParams.get("tenant_id");

    // Get or create settings
    const { data: settings, error } = await supabase.rpc("get_or_create_user_settings", {
      p_user_id: user.id,
      p_tenant_id: tenantId || null,
    });

    if (error) {
      logger.error("Failed to get user settings", { error, userId: user.id });
      return handleApiError(error, "Failed to retrieve settings");
    }

    return NextResponse.json({ settings });
  } catch (error) {
    logger.error("Error in GET /api/settings", { error });
    return handleApiError(error, "Failed to retrieve settings");
  }
}

/**
 * PUT /api/settings
 * Update user settings
 */
export async function PUT(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json();
    const validatedData = settingsUpdateSchema.parse(body);

    // Get tenant_id from header, query, or body
    const tenantId = request.headers.get("x-tenant-id") || 
                     new URL(request.url).searchParams.get("tenant_id") ||
                     validatedData.tenant_id;

    // Remove tenant_id from update data
    const { tenant_id, ...updateData } = validatedData;

    // Ensure settings exist
    await supabase.rpc("get_or_create_user_settings", {
      p_user_id: user.id,
      p_tenant_id: tenantId || null,
    });

    // Update settings
    const { data: settings, error } = await supabase
      .from("user_settings")
      .update(updateData)
      .eq("user_id", user.id)
      .eq("tenant_id", tenantId || null)
      .select()
      .single();

    if (error) {
      logger.error("Failed to update user settings", { error, userId: user.id });
      return handleApiError(error, "Failed to update settings");
    }

    logger.info("User settings updated", { userId: user.id, tenantId });

    return NextResponse.json({ settings });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    logger.error("Error in PUT /api/settings", { error });
    return handleApiError(error, "Failed to update settings");
  }
}
