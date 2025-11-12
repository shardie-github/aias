# Experiment Plan: API Usage Billing

**Experiment ID:** api-billing-001  
**Status:** 🟡 Planned  
**Owner:** Engineering Lead  
**Start Date:** TBD  
**Duration:** 30 days

---

## Hypothesis

If we implement usage-based API billing with clear pricing tiers (Free: 1000 calls, Pro: 10K calls, Enterprise: unlimited), then API revenue will reach $1K/month within 30 days.

---

## Metrics

### Primary Metrics
- **API Revenue** (target: $1K/month)
- **API Calls/Day** (target: 100+)
- **Upgrade Rate** (target: 15%)

### Secondary Metrics
- API error rate
- Customer satisfaction (NPS)
- Support tickets related to billing

---

## Sample Size Heuristic

- **Minimum:** 100 API users
- **Target:** 500 API users
- **Duration:** 30 days
- **Statistical Significance:** 95% confidence, 5% margin of error

---

## Rollout Plan

### Phase 1: Metering (Days 1-3)
- Add request logging to API middleware
- Create `api_usage` table
- Implement usage aggregation

### Phase 2: Billing Logic (Days 4-7)
- Create pricing tiers
- Implement usage calculation
- Add Stripe usage-based subscriptions

### Phase 3: Paywall & Dashboard (Days 8-11)
- Add rate limiting middleware
- Create usage dashboard UI
- Add upgrade prompts

### Phase 4: Testing & Launch (Days 12-14)
- Test billing accuracy
- Monitor for anomalies
- Launch to beta customers (10 users)

### Phase 5: Full Launch (Days 15-30)
- Launch to all API users
- Monitor metrics daily
- Iterate based on feedback

---

## Rollback Plan

1. **Grandfather Existing Users:** Free tier for 30 days
2. **Opt-Out Option:** Allow downgrade to free tier
3. **Billing Errors:** Pause billing, investigate, fix
4. **Customer Complaints:** Immediate refund, investigate

---

## Guardrails

- **Billing Cap:** Max $1000/month per customer without approval
- **Anomaly Alert:** Alert if billing >2x previous month
- **Rate Limiting:** 1000 req/min per API key
- **Support SLA:** 4-hour response for billing issues

---

## Success Criteria

- ✅ API revenue > $1K/month within 30 days
- ✅ API calls/day > 100
- ✅ Upgrade rate > 15%
- ✅ Billing error rate < 1%
- ✅ Customer satisfaction (NPS) > 50

---

## Failure Criteria

- ❌ API revenue < $500/month after 30 days
- ❌ Upgrade rate < 5%
- ❌ Billing error rate > 5%
- ❌ Customer churn > 10%

---

## Next Steps

1. Get approval from stakeholders
2. Set up Stripe usage-based subscriptions
3. Build metering infrastructure
4. Create pricing page updates
5. Launch beta test

---

**Confidence Level:** 🟢 High (90%)  
**Risk Level:** 🟡 Medium (billing complexity)
