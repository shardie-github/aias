/**
 * Billing Stub
 */

import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    })
  : null;

export function isBillingEnabled(): boolean {
  return process.env.ENABLE_BILLING !== 'false' && !!process.env.STRIPE_SECRET_KEY;
}

export async function handleStripeWebhook(
  payload: string,
  signature: string
): Promise<{ processed: boolean; error?: string }> {
  if (!isBillingEnabled() || !stripe) {
    return { processed: false, error: 'Billing disabled' };
  }

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not set');
    }

    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { processed: true };
  } catch (error: any) {
    return { processed: false, error: error.message };
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const prisma = await import('@prisma/client').then((m) => new m.PrismaClient());
  
  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    update: {
      status: mapStripeStatus(subscription.status),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    create: {
      id: subscription.id,
      status: mapStripeStatus(subscription.status),
      plan: 'BASIC',
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      orgId: '',
    },
  });
}

function mapStripeStatus(status: string): any {
  const mapping: Record<string, string> = {
    active: 'ACTIVE',
    canceled: 'CANCELED',
    incomplete: 'INCOMPLETE',
    past_due: 'PAST_DUE',
    trialing: 'TRIALING',
    unpaid: 'UNPAID',
  };
  return mapping[status] || 'UNPAID';
}
