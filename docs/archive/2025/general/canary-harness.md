> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Canary & Shadow Deploy Harness

**Generated:** 2025-01-27  
**Module:** `checkout`  
**Platform:** Vercel (Next.js) + Expo (if mobile)

---

## Overview

Canary deployments allow gradual rollout of changes to a subset of users, with automatic rollback on error threshold breaches. Shadow deployments run new code alongside production without user impact.

---

## Feature Flags

### Flag Configuration

**Flag Name:** `canary_checkout`  
**Type:** Percentage rollout  
**Default:** `false` (0%)

**Configuration:**
```typescript
// lib/flags.ts or feature flag service
export const flags = {
  canary_checkout: {
    enabled: process.env.CANARY_CHECKOUT_ENABLED === 'true',
    percentage: parseInt(process.env.CANARY_CHECKOUT_PERCENTAGE || '0', 10),
    stopLoss: {
      errorRate: 0.05, // 5% error rate threshold
      p95Latency: 1000, // 1 second p95 latency threshold
      enabled: true,
    },
  },
};
```

### Flag Usage

**File:** `app/api/stripe/create-checkout/route.ts`

```typescript
import { flags } from '@/lib/flags';

export async function POST(req: NextRequest) {
  const isCanary = flags.canary_checkout.enabled && 
    (hashUserId(req.userId) % 100 < flags.canary_checkout.percentage);
  
  if (isCanary) {
    // Use new checkout implementation
    return await newCheckoutHandler(req);
  } else {
    // Use stable checkout implementation
    return await stableCheckoutHandler(req);
  }
}
```

---

## Shadow Route Configuration

### Vercel Preview Rules

**File:** `vercel.json`

```json
{
  "routes": [
    {
      "source": "/api/stripe/create-checkout",
      "headers": {
        "X-Canary-Version": "canary"
      },
      "has": [
        {
          "type": "header",
          "key": "x-canary-enabled",
          "value": "true"
        }
      ]
    }
  ]
}
```

### Shadow Route Implementation

**File:** `app/api/stripe/create-checkout/route.ts`

```typescript
export async function POST(req: NextRequest) {
  const isShadow = req.headers.get('x-shadow-enabled') === 'true';
  
  if (isShadow) {
    // Run shadow implementation but return stable response
    const shadowResult = await newCheckoutHandler(req);
    // Log shadow metrics but don't return to user
    await logShadowMetrics(shadowResult);
    return await stableCheckoutHandler(req);
  }
  
  // Normal flow
  return await stableCheckoutHandler(req);
}
```

---

## Stop-Loss Thresholds

### Error Rate Threshold

**Threshold:** 5% error rate  
**Window:** 5-minute rolling window  
**Action:** Automatic rollback if exceeded

**Implementation:**
```typescript
// lib/canary/monitor.ts
export class CanaryMonitor {
  private errorCount = 0;
  private requestCount = 0;
  private windowStart = Date.now();
  private readonly WINDOW_MS = 5 * 60 * 1000; // 5 minutes
  
  recordRequest(success: boolean) {
    this.requestCount++;
    if (!success) this.errorCount++;
    
    // Check threshold
    const errorRate = this.errorCount / this.requestCount;
    if (errorRate > 0.05) {
      this.triggerRollback('error_rate_exceeded');
    }
    
    // Reset window
    if (Date.now() - this.windowStart > this.WINDOW_MS) {
      this.errorCount = 0;
      this.requestCount = 0;
      this.windowStart = Date.now();
    }
  }
}
```

### Latency Threshold

**Threshold:** p95 latency < 1000ms  
**Window:** 5-minute rolling window  
**Action:** Automatic rollback if exceeded

**Implementation:**
```typescript
// lib/canary/monitor.ts
export class CanaryMonitor {
  private latencies: number[] = [];
  private readonly WINDOW_MS = 5 * 60 * 1000;
  
  recordLatency(latency: number) {
    this.latencies.push(latency);
    
    // Calculate p95
    const sorted = [...this.latencies].sort((a, b) => a - b);
    const p95Index = Math.floor(sorted.length * 0.95);
    const p95 = sorted[p95Index];
    
    if (p95 > 1000) {
      this.triggerRollback('latency_exceeded');
    }
    
    // Clean old latencies
    this.latencies = this.latencies.filter(
      (_, i) => Date.now() - this.windowStart < this.WINDOW_MS
    );
  }
}
```

### Rollback Trigger

**Implementation:**
```typescript
// lib/canary/monitor.ts
async triggerRollback(reason: string) {
  // Disable canary flag
  await updateFlag('canary_checkout', { enabled: false, percentage: 0 });
  
  // Alert team
  await notifyTeam({
    type: 'canary_rollback',
    reason,
    timestamp: new Date().toISOString(),
  });
  
  // Log rollback event
  await logEvent('canary_rollback', { reason });
}
```

---

## Vercel Preview Rules

### Preview Environment Configuration

**File:** `.github/workflows/canary-deploy.yml`

```yaml
- name: Deploy Canary Preview
  run: |
    vercel deploy --prebuilt \
      --token $VERCEL_TOKEN \
      --env CANARY_CHECKOUT_ENABLED=true \
      --env CANARY_CHECKOUT_PERCENTAGE=10
```

### Preview Protection

**Status:** ⚠️ Not configured  
**Action:** Add preview protection in Vercel dashboard

**Configuration:**
1. Go to Vercel Dashboard → Project Settings → Deployment Protection
2. Enable "Preview Deployment Protection"
3. Require password or team member access

---

## Expo Channel Gates (Mobile)

### Channel Configuration

**If mobile app exists:**

```typescript
// app.json or expo config
{
  "expo": {
    "updates": {
      "channels": {
        "canary": {
          "channel": "canary-checkout"
        },
        "production": {
          "channel": "production"
        }
      }
    }
  }
}
```

### Channel Gating

```typescript
// lib/mobile/canary.ts
export function shouldUseCanary(userId: string): boolean {
  const channel = Updates.channel || 'production';
  if (channel !== 'canary-checkout') return false;
  
  // Percentage rollout
  const hash = hashUserId(userId);
  return hash % 100 < 10; // 10% canary
}
```

---

## Monitoring & Metrics

### Metrics to Track

1. **Error Rate**
   - Canary vs Stable comparison
   - Per-endpoint breakdown
   - Error type distribution

2. **Latency**
   - p50, p95, p99 latencies
   - Canary vs Stable comparison
   - Per-endpoint breakdown

3. **Throughput**
   - Requests per second
   - Canary vs Stable comparison

4. **Business Metrics**
   - Conversion rate (for checkout)
   - Revenue impact
   - User satisfaction scores

### Dashboard

**Location:** `/admin/metrics` (if exists)  
**Add Canary Metrics Section:**

```typescript
// components/admin/canary-metrics.tsx
export function CanaryMetrics() {
  const { data } = useQuery('canary-metrics', fetchCanaryMetrics);
  
  return (
    <div>
      <h2>Canary Deployment Metrics</h2>
      <MetricComparison
        canary={data.canary}
        stable={data.stable}
        metrics={['errorRate', 'p95Latency', 'throughput']}
      />
    </div>
  );
}
```

---

## Rollback Plan

### Automatic Rollback

**Triggers:**
1. Error rate > 5% (5-minute window)
2. p95 latency > 1000ms (5-minute window)
3. Manual trigger via API/dashboard

**Process:**
1. Disable canary flag (`canary_checkout.enabled = false`)
2. Set percentage to 0 (`canary_checkout.percentage = 0`)
3. Alert team via Slack/email
4. Log rollback event

### Manual Rollback

**Command:**
```bash
# Via API
curl -X POST https://api.vercel.com/v1/projects/$PROJECT_ID/env \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -d '{"key": "CANARY_CHECKOUT_ENABLED", "value": "false"}'

# Via Vercel CLI
vercel env rm CANARY_CHECKOUT_ENABLED production
```

**One-Command Rollback:**
```bash
# scripts/rollback-canary.sh
#!/bin/bash
set -e
vercel env rm CANARY_CHECKOUT_ENABLED production --token $VERCEL_TOKEN
vercel env rm CANARY_CHECKOUT_PERCENTAGE production --token $VERCEL_TOKEN
echo "Canary deployment rolled back"
```

---

## Testing

### Pre-Deploy Checklist

- [ ] Feature flag configured
- [ ] Stop-loss thresholds set
- [ ] Monitoring dashboard ready
- [ ] Rollback plan documented
- [ ] Team notified

### Post-Deploy Checklist

- [ ] Monitor error rates (first 5 minutes)
- [ ] Monitor latency (first 5 minutes)
- [ ] Check business metrics
- [ ] Review logs for anomalies

---

## Implementation Status

**Status:** 🟡 Stub — Framework defined, implementation pending

**Next Steps:**
1. Implement feature flag system (if not exists)
2. Add canary monitoring to checkout endpoint
3. Set up stop-loss thresholds
4. Create monitoring dashboard
5. Test rollback procedure

**PR Title:** `ops: add canary harness for checkout`  
**Label:** `auto/systems`  
**Estimated Effort:** 8-16 hours

---

## References

- [Vercel Deployment Protection](https://vercel.com/docs/deployments/deployment-protection)
- [Feature Flags Best Practices](https://docs.getunleash.io/topics/feature-flags)
- [Canary Deployment Guide](https://www.atlassian.com/continuous-delivery/continuous-deployment/canary-deployment)
