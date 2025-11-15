import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { SystemError, ValidationError, formatError } from "@/src/lib/errors";
import { recordError } from "@/lib/utils/error-detection";
import { retry } from "@/lib/utils/retry";
import { telemetry } from "@/lib/monitoring/enhanced-telemetry";
import { z } from "zod";

// Load environment variables dynamically - no hardcoded values
const stripe = new Stripe(env.stripe.secretKey!, {
  apiVersion: "2024-11-20.acacia",
});

const supabase = createClient(
  env.supabase.url,
  env.supabase.serviceRoleKey
);

const XP_MULTIPLIERS: Record<string, number> = {
  starter: 1.25,
  pro: 1.5,
  enterprise: 2.0,
};

interface CheckoutResponse {
  sessionId?: string;
  error?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<CheckoutResponse>> {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch (error) {
      const validationError = new ValidationError("Invalid JSON body");
      const formatted = formatError(validationError);
      return NextResponse.json(
        { error: formatted.message },
        { status: formatted.statusCode }
      );
    }

    const { priceId, userId, tier } = body as { priceId?: string; userId?: string; tier?: string };

    if (!priceId || !userId || !tier) {
      const error = new ValidationError("Missing required fields: priceId, userId, tier");
      const formatted = formatError(error);
      return NextResponse.json(
        { error: formatted.message },
        { status: formatted.statusCode }
      );
    }

    // Retry Stripe API call with exponential backoff
    const session = await retry(
      async () => {
        return await stripe.checkout.sessions.create({
          mode: "subscription",
          payment_method_types: ["card"],
          line_items: [{ price: priceId, quantity: 1 }],
          success_url: `${req.nextUrl.origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.nextUrl.origin}/billing`,
          client_reference_id: userId,
          metadata: {
            userId,
            tier,
          },
        });
      },
      {
        maxAttempts: 3,
        initialDelayMs: 1000,
        onRetry: (attempt, err) => {
          console.warn(`Retrying Stripe checkout (attempt ${attempt})`, { error: err.message });
        },
      }
    );

    return NextResponse.json({ sessionId: session.id });
  } catch (error: unknown) {
    const systemError = new SystemError(
      "Checkout error",
      error instanceof Error ? error : new Error(String(error))
    );
    recordError(systemError, { endpoint: '/api/stripe/webhook', action: 'checkout' });
    console.error("Checkout error:", systemError);
    const formatted = formatError(systemError);
    return NextResponse.json(
      { error: formatted.message },
      { status: formatted.statusCode }
    );
  }
}

interface WebhookResponse {
  received?: boolean;
  error?: string;
}

// Webhook handler - uses PUT method (Stripe sends webhooks as POST, but we use PUT to distinguish)
// Note: Stripe webhooks require raw body for signature verification, so we can't use route handler utility
// However, we still use proper error handling and validation
export async function PUT(req: NextRequest): Promise<NextResponse<WebhookResponse>> {
  const startTime = Date.now();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = env.stripe.webhookSecret;

  if (!sig || !webhookSecret) {
    const error = new SystemError("Missing Stripe webhook configuration");
    recordError(error, { endpoint: '/api/stripe/webhook', action: 'webhook' });
    const formatted = formatError(error);
    return NextResponse.json(
      { error: formatted.message },
      { status: formatted.statusCode }
    );
  }

  const body = await req.text();
  
  // Track webhook receipt
  telemetry.trackPerformance({
    name: "stripe_webhook_received",
    value: Date.now() - startTime,
    unit: "ms",
    tags: { status: "received" },
  });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const error = new ValidationError(
      "Webhook signature verification failed",
      undefined,
      { originalError: err instanceof Error ? err.message : String(err) }
    );
    recordError(error, { endpoint: '/api/stripe/webhook', action: 'webhook_verification' });
    console.error("Webhook signature verification failed:", error);
    const formatted = formatError(error);
    return NextResponse.json(
      { error: formatted.message },
      { status: formatted.statusCode }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Validate metadata with Zod schema
        const metadataSchema = z.object({
          userId: z.string().uuid("User ID must be a valid UUID"),
          tier: z.enum(["starter", "pro", "enterprise"], {
            errorMap: () => ({ message: "Tier must be one of: starter, pro, enterprise" }),
          }),
        });
        
        const metadataValidation = metadataSchema.safeParse(session.metadata);
        if (!metadataValidation.success) {
          const error = new ValidationError(
            "Invalid session metadata",
            metadataValidation.error.errors.map((e) => ({
              path: e.path,
              message: e.message,
            }))
          );
          recordError(error, { endpoint: '/api/stripe/webhook', action: 'checkout_session_validation' });
          const formatted = formatError(error);
          return NextResponse.json(
            { error: formatted.message, details: formatted.details },
            { status: formatted.statusCode }
          );
        }
        
        const { userId, tier } = metadataValidation.data;

        if (userId && tier) {
          const expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + 1);

          // Retry database operation with exponential backoff
          await retry(
            async () => {
              const { error } = await supabase.from("subscription_tiers").upsert({
                user_id: userId,
                tier,
                xp_multiplier: XP_MULTIPLIERS[tier] || 1.0,
                expires_at: expiresAt.toISOString(),
              });
              if (error) {
                throw new Error(error.message);
              }
            },
            {
              maxAttempts: 3,
              initialDelayMs: 1000,
            }
          );
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        // Handle subscription updates/cancellations
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    const duration = Date.now() - startTime;
    
    // Track success
    telemetry.trackPerformance({
      name: "stripe_webhook_processed",
      value: duration,
      unit: "ms",
      tags: { status: "success", eventType: event.type },
    });
    
    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    const systemError = new SystemError(
      "Webhook handler error",
      error instanceof Error ? error : new Error(String(error))
    );
    recordError(systemError, { endpoint: '/api/stripe/webhook', action: 'webhook_handler' });
    
    // Track error
    telemetry.trackPerformance({
      name: "stripe_webhook_processed",
      value: duration,
      unit: "ms",
      tags: { status: "error" },
    });
    
    console.error("Webhook handler error:", systemError);
    const formatted = formatError(systemError);
    return NextResponse.json(
      { error: formatted.message },
      { status: formatted.statusCode }
    );
  }
}
