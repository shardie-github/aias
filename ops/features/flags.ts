/**
 * Feature Flags & A/B Testing
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  config?: Record<string, any>;
  orgId?: string;
}

export async function getFeatureFlag(key: string, orgId?: string): Promise<boolean> {
  const flag = await prisma.featureFlag.findFirst({
    where: {
      key,
      ...(orgId ? { orgId } : {}),
    },
  });

  return flag?.enabled || false;
}

export async function getABVariant(key: string, userId: string): Promise<string> {
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return hash % 2 === 0 ? 'A' : 'B';
}

export async function getPricing(orgId: string): Promise<{ plan: string; price: number }> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      org: {
        id: orgId,
      },
    },
  });

  if (!subscription) {
    return { plan: 'FREE', price: 0 };
  }

  const pricing = {
    FREE: 0,
    BASIC: 9,
    PRO: 29,
    ENTERPRISE: 99,
  };

  return {
    plan: subscription.plan,
    price: pricing[subscription.plan as keyof typeof pricing] || 0,
  };
}

export async function isOfferEnabled(offerId: string, orgId?: string): Promise<boolean> {
  return getFeatureFlag(`offer:${offerId}`, orgId);
}
