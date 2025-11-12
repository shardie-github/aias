> Archived on 2025-11-12. Superseded by: (see docs/final index)

# READY: API Usage Billing Implementation

**Owner:** Engineering Lead  
**KPI:** API revenue > $1K/month within 30 days  
**Priority:** P0  
**30-Day Signal:** $1K+ API revenue, 100+ API calls/day  
**Effort:** Medium (14 days)  
**Impact Score:** 9/10

---

## Problem Statement

API exists but billing is incomplete. Missing usage metering, paywall, and automated billing. Estimated leakage: $15K/month potential revenue.

## Solution

Implement usage-based API billing with:
1. Request metering (per-call or per-token)
2. Usage dashboard for customers
3. Stripe integration for automated billing
4. Rate limiting based on plan tier

## Implementation Plan

### Phase 1: Metering (Days 1-3)
- Add request logging to API middleware
- Create `api_usage` table (user_id, endpoint, tokens, timestamp)
- Implement usage aggregation function

### Phase 2: Billing Logic (Days 4-7)
- Create pricing tiers (Free: 1000 calls, Pro: 10K calls, Enterprise: unlimited)
- Implement usage calculation (daily/monthly)
- Add Stripe usage-based subscription items

### Phase 3: Paywall & Dashboard (Days 8-11)
- Add rate limiting middleware (403 if over limit)
- Create usage dashboard UI
- Add upgrade prompts

### Phase 4: Testing & Launch (Days 12-14)
- Test billing accuracy
- Monitor for anomalies
- Launch to beta customers

## Success Metrics

- **30-Day:** $1K+ API revenue, 100+ API calls/day
- **60-Day:** $5K+ API revenue, 500+ API calls/day
- **90-Day:** $15K+ API revenue, 2000+ API calls/day

## Guardrails

- Billing cap: Max $1000/month per customer without approval
- Alert on billing anomalies (>2x previous month)
- Rate limit: 1000 req/min per API key

## Dependencies

- Stripe account configured
- API middleware exists
- Database access

## Notes

- Start with per-call pricing, add per-token later
- Consider grandfathering existing API users for 30 days
