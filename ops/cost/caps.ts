/**
 * Cost Caps
 */

interface CostLimit {
  daily: number;
  monthly: number;
  perUser: number;
}

interface Usage {
  userId?: string;
  daily: number;
  monthly: number;
  timestamp: Date;
}

export class CostCaps {
  private limits: CostLimit;
  private usage: Map<string, Usage> = new Map();

  constructor(limits: CostLimit) {
    this.limits = limits;
  }

  async checkLimit(userId: string, cost: number): Promise<{ allowed: boolean; reason?: string }> {
    const key = userId || 'global';
    const current = this.usage.get(key) || {
      userId,
      daily: 0,
      monthly: 0,
      timestamp: new Date(),
    };

    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (current.timestamp < dayStart) {
      current.daily = 0;
    }

    if (current.daily + cost > this.limits.daily) {
      return {
        allowed: false,
        reason: `Daily limit exceeded: ${current.daily + cost} > ${this.limits.daily}`,
      };
    }

    if (current.monthly + cost > this.limits.monthly) {
      return {
        allowed: false,
        reason: `Monthly limit exceeded: ${current.monthly + cost} > ${this.limits.monthly}`,
      };
    }

    if (userId && cost > this.limits.perUser) {
      return {
        allowed: false,
        reason: `Per-user limit exceeded: ${cost} > ${this.limits.perUser}`,
      };
    }

    current.daily += cost;
    current.monthly += cost;
    current.timestamp = now;
    this.usage.set(key, current);

    return { allowed: true };
  }
}

export const defaultCostCaps = new CostCaps({
  daily: 100,
  monthly: 2000,
  perUser: 10,
});
