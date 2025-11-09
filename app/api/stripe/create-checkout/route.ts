import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase/client";
import { env } from "@/lib/env";

// Load environment variables dynamically - no hardcoded values
const stripe = new Stripe(env.stripe.secretKey!, {
  apiVersion: "2024-11-20.acacia",
});

const XP_MULTIPLIERS: Record<string, number> = {
  starter: 1.25,
  pro: 1.5,
  enterprise: 2.0,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { priceId, userId, tier } = req.body;

    if (!priceId || !userId || !tier) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.headers.origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/billing`,
      client_reference_id: userId,
      metadata: {
        userId,
        tier,
      },
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Checkout error";
    console.error("Checkout error:", error);
    return res.status(500).json({ error: errorMessage });
  }
}

// Note: Webhook handler is in app/api/stripe/webhook/route.ts
// This file only handles checkout session creation
