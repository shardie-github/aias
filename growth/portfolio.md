# Growth Experiment Portfolio

**Last Updated:** 2025-01-29  
**Total Experiments:** 5  
**Status:** Planning

---

## Overview

Prioritized growth experiments based on Impact × Confidence × TTV analysis. Focus on high-impact, high-confidence experiments with fast time-to-value.

---

## Experiment 1: API Usage Billing

**Status:** 🟡 Planned  
**Priority:** P0  
**Impact:** 9/10  
**Confidence:** 0.9  
**TTV:** 14 days

### Hypothesis
If we implement usage-based API billing with clear pricing tiers, then API revenue will reach $1K/month within 30 days.

### Metrics
- API revenue (target: $1K/month)
- API calls/day (target: 100+)
- Upgrade rate (target: 15%)

### Sample Size
- Minimum: 100 API users
- Target: 500 API users
- Duration: 30 days

### Rollout Plan
1. Week 1: Implement metering + billing logic
2. Week 2: Build paywall + dashboard
3. Week 3: Beta test with 10 users
4. Week 4: Launch to all users

### Rollback Plan
- Grandfather existing users for 30 days
- Allow opt-out to free tier
- Monitor for billing errors

### Guardrails
- Billing cap: $1000/month per customer
- Alert on anomalies (>2x previous month)
- Rate limit: 1000 req/min per key

---

## Experiment 2: Usage-Based SaaS Tiers

**Status:** 🟡 Planned  
**Priority:** P0  
**Impact:** 8/10  
**Confidence:** 0.85  
**TTV:** 7 days

### Hypothesis
If we add usage-based pricing tiers (Free/Starter/Pro/Enterprise), then upgrade rate will increase to 15%+ within 30 days.

### Metrics
- Upgrade rate (target: 15%)
- Additional MRR (target: $5K/month)
- Churn rate (target: <5%)

### Sample Size
- All existing SaaS customers
- Duration: 30 days

### Rollout Plan
1. Day 1-2: Track usage (workflows, API calls)
2. Day 3-4: Update pricing page
3. Day 5-6: Add upgrade prompts
4. Day 7: Launch

### Rollback Plan
- Grandfather existing customers for 90 days
- Allow downgrades (no lock-in)
- Clear usage limits in UI

### Guardrails
- Usage warnings at 80% threshold
- No surprise charges
- Transparent pricing calculator

---

## Experiment 3: Agent Marketplace Launch

**Status:** 🟡 Planned  
**Priority:** P1  
**Impact:** 8/10  
**Confidence:** 0.7  
**TTV:** 45 days

### Hypothesis
If we launch an agent marketplace with revenue share (70/30), then we'll have 50+ agents listed and $5K+ marketplace revenue within 60 days.

### Metrics
- Agents listed (target: 50+)
- Marketplace revenue (target: $5K/month)
- Agent creator revenue (target: $3.5K/month)

### Sample Size
- Minimum: 10 agents at launch
- Target: 50 agents within 60 days
- Duration: 60 days

### Rollout Plan
1. Week 1-3: Build marketplace UI
2. Week 4-6: Implement payment + revenue share
3. Week 7: Beta launch with 10 agents
4. Week 8+: Full launch, iterate

### Rollback Plan
- Pause new agent submissions if quality issues
- Refund policy: 7-day money-back
- Content moderation for abuse

### Guardrails
- Agent approval process (prevent spam)
- Revenue share: 70/30 (creator/platform)
- Minimum payout: $10

---

## Experiment 4: Enterprise Onboarding Flow

**Status:** 🟡 Planned  
**Priority:** P1  
**Impact:** 7/10  
**Confidence:** 0.8  
**TTV:** 21 days

### Hypothesis
If we build an enterprise onboarding flow with SOC 2 marketing, then enterprise conversion rate will reach 10%+ with <7 day time-to-value.

### Metrics
- Enterprise conversion rate (target: 10%)
- Time-to-value (target: <7 days)
- Enterprise MRR (target: $50K/month)

### Sample Size
- Minimum: 5 enterprise trials
- Target: 20 enterprise customers
- Duration: 60 days

### Rollout Plan
1. Week 1: Enterprise signup flow
2. Week 2: SOC 2 marketing + landing page
3. Week 3: Onboarding wizard
4. Week 4: Launch to beta enterprises

### Rollback Plan
- Manual approval for enterprise accounts
- Fallback to standard onboarding
- Dedicated support for issues

### Guardrails
- Require company email for enterprise
- 4-hour support SLA
- Custom domain setup wizard

---

## Experiment 5: Nightly ETL Automation

**Status:** 🟡 Planned  
**Priority:** P1  
**Impact:** 7/10  
**Confidence:** 0.95  
**TTV:** 3 days

### Hypothesis
If we automate nightly ETL for ads/orders data, then metrics will be available by 9am ET with 100% success rate.

### Metrics
- ETL success rate (target: 100%)
- Runtime (target: <5 minutes)
- Data freshness (target: <1 hour delay)

### Sample Size
- All data sources (Meta, TikTok, Shopify)
- Duration: 30 days

### Rollout Plan
1. Day 1: Create ETL scripts
2. Day 2: Set up GitHub Actions cron
3. Day 3: Test + monitor

### Rollback Plan
- Fallback to manual ETL
- Alert on failures
- Retry logic (3 attempts)

### Guardrails
- Idempotent (safe to re-run)
- Rate limiting (avoid API limits)
- Error notifications (Slack/email)

---

## Portfolio Summary

| Experiment | Impact | Confidence | TTV | Score | Status |
|------------|--------|------------|-----|-------|--------|
| API Usage Billing | 9 | 0.9 | 14 | 7.29 | Planned |
| Usage-Based SaaS Tiers | 8 | 0.85 | 7 | 6.8 | Planned |
| Agent Marketplace | 8 | 0.7 | 45 | 5.6 | Planned |
| Enterprise Onboarding | 7 | 0.8 | 21 | 5.6 | Planned |
| Nightly ETL Automation | 7 | 0.95 | 3 | 6.65 | Planned |

**Total Estimated Impact:** +$30K MRR, -10hrs/week manual work  
**Total Estimated Effort:** 90 days  
**Risk Level:** 🟢 Low (high confidence, clear rollback plans)

---

## Next Steps

1. **This Week:** Start API billing + usage tiers (P0)
2. **Next Week:** Set up ETL automation (P1)
3. **Month 2:** Launch agent marketplace (P1)
4. **Month 3:** Enterprise onboarding (P1)

---

**Confidence Level:** 🟢 High (85%)  
**Assumptions:** Market demand, API adoption rate, enterprise conversion rate
