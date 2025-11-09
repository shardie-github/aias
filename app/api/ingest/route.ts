import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { SystemError, NetworkError, formatError } from "@/src/lib/errors";
import { recordError } from "@/lib/utils/error-detection";
import { retry } from "@/lib/utils/retry";

export const runtime = "edge";

interface IngestResponse {
  success?: boolean;
  error?: string;
}

/**
 * Event ingestion endpoint
 * Proxies to Supabase Edge Function (avoids exposing service key)
 * All configuration loaded dynamically from environment variables
 */
export async function POST(req: NextRequest): Promise<NextResponse<IngestResponse>> {
  try {
    const body = await req.text();

    if (!body) {
      const error = new SystemError("Request body is required");
      const formatted = formatError(error);
      return NextResponse.json(
        { error: formatted.message },
        { status: formatted.statusCode }
      );
    }

    // Retry Supabase Edge Function call with exponential backoff
    const response = await retry(
      async () => {
        const r = await fetch(`${env.supabase.url}/functions/v1/ingest-events`, {
          method: "POST",
          headers: { 
            "content-type":"application/json", 
            "authorization": `Bearer ${env.supabase.anonKey}` 
          },
          body,
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        if (!r.ok) {
          throw new NetworkError(
            `Supabase function returned ${r.status}`,
            r.status >= 500, // Retryable for 5xx errors
            { status: r.status, statusText: r.statusText }
          );
        }

        return r;
      },
      {
        maxAttempts: 3,
        initialDelayMs: 1000,
        onRetry: (attempt, err) => {
          console.warn(`Retrying ingest (attempt ${attempt})`, { error: err.message });
        },
      }
    );

    const responseText = await response.text();
    return new NextResponse(responseText, { 
      status: response.status, 
      headers: { "content-type":"application/json" } 
    });
  } catch (error: unknown) {
    const systemError = error instanceof SystemError || error instanceof NetworkError
      ? error
      : new SystemError(
          "Event ingestion error",
          error instanceof Error ? error : new Error(String(error))
        );
    
    recordError(systemError, { endpoint: '/api/ingest' });
    const formatted = formatError(systemError);
    
    return NextResponse.json(
      { error: formatted.message },
      { status: formatted.statusCode }
    );
  }
}
