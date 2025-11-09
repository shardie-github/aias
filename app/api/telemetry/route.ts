import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export const runtime = "edge";

/**
 * Performance Telemetry Ingestion Endpoint
 * Receives performance beacons from client-side code
 * Stores anonymized metrics to metrics_log table
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Extract performance data
    const {
      url,
      ttfb,
      lcp,
      cls,
      inp,
      fcp,
      fid,
      ts,
      userAgent,
      connection,
    } = body;

    // Anonymize IP (don't store full IP)
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const anonymizedIp = clientIp.split(".").slice(0, 2).join(".") + ".x.x";

    // Prepare metric payload
    const metric = {
      url: url || "/",
      ttfb: ttfb || null,
      lcp: lcp || null,
      cls: cls || null,
      inp: inp || null,
      fcp: fcp || null,
      fid: fid || null,
      timestamp: ts || Date.now(),
      // Anonymized metadata
      userAgent: userAgent ? userAgent.substring(0, 100) : null,
      connection: connection || null,
      ipPrefix: anonymizedIp,
    };

    // Store in Supabase
    const supabase = createClient(
      env.supabase.url,
      env.supabase.serviceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const { error } = await supabase.from("metrics_log").insert({
      source: "telemetry",
      metric,
    });

    if (error) {
      console.error("Error storing telemetry:", error);
      // Don't fail the request - telemetry is best effort
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, received: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Telemetry ingestion error:", error);
    // Always return success to avoid breaking client-side code
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 200 }
    );
  }
}
