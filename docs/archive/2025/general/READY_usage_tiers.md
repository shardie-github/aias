> Archived on 2025-11-12. Superseded by: (see docs/final index)

# READY: Usage-Based SaaS Pricing Tiers

**Owner:** Product Lead  
**KPI:** SaaS upgrade rate > 15% within 30 days  
**Priority:** P0  
**30-Day Signal:** 15%+ upgrade rate, $5K+ additional MRR  
**Effort:** Low (7 days)  
**Impact Score:** 8/10

---

## Problem Statement

Current SaaS pricing is flat-rate. Missing usage-based tiers that would increase upgrade rates and revenue. Estimated opportunity: +30% upgrade rate.

## Solution

Add usage-based pricing tiers:
1. Free: 3 workflows, 1000 API calls/month
2. Starter: $29/mo - 10 workflows, 10K API calls
3. Pro: $99/mo - Unlimited workflows, 100K API calls
4. Enterprise: Custom pricing

## Implementation Plan

### Phase 1: Usage Tracking (Days 1-2)
- Track workflow count per user
- Track API usage per user
- Create usage aggregation

### Phase 2: Pricing Page Update (Days 3-4)
- Redesign pricing page with usage tiers
- Add usage calculator
- Add "Current Usage" widget

### Phase 3: Upgrade Flow (Days 5-6)
- Add upgrade prompts in-app
- Create upgrade checkout flow
- Add usage warnings (80% threshold)

### Phase 4: Launch (Day 7)
- A/B test pricing page
- Monitor upgrade rates
- Iterate based on feedback

## Success Metrics

- **30-Day:** 15%+ upgrade rate, $5K+ additional MRR
- **60-Day:** 20%+ upgrade rate, $15K+ additional MRR
- **90-Day:** 25%+ upgrade rate, $30K+ additional MRR

## Guardrails

- Grandfather existing customers for 90 days
- Allow downgrades (no lock-in)
- Clear usage limits in UI

## Dependencies

- Stripe subscription management
- Usage tracking system
- Pricing page access

## Notes

- Test pricing sensitivity before launch
- Consider annual discounts (2 months free)
