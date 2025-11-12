> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Experiment: Referral Program Launch

**Slug:** `referral-program`  
**Status:** Ready to Launch  
**Created:** 2025-01-28  
**Owner:** Growth Team

---

## Hypothesis

**If** we launch a referral program that rewards both referrer and referee,  
**Then** existing customers will refer new customers, reducing paid acquisition costs,  
**Because** referrals are typically higher quality and lower cost than paid channels.

---

## Target Metrics

### Primary Metric
- **CAC** (target: reduce by 20%, from $50 to $40)

### Secondary Metrics
- **Referral Rate** (target: 10% of new customers from referrals)
- **Referral CAC** (target: <$10 per referred customer)
- **LTV of Referred Customers** (target: same or higher than paid customers)

---

## Success Threshold

**Minimum Success:** CAC reduces by 10% (from $50 to $45)  
**Target Success:** CAC reduces by 20% (from $50 to $40)  
**Stretch Goal:** CAC reduces by 30% (from $50 to $35) AND 15% of customers from referrals

---

## Sample Size Calculation

**Statistical Significance:** 95% confidence, 80% power  
**Baseline CAC:** $50  
**Minimum Detectable Effect:** $5 reduction (10% relative)  
**Required Sample Size:** ~2,000 new customers per period

**Sample Size Heuristic:** Run for 8-12 weeks or until 2,000 referred customers acquired

---

## Program Design

### Rewards Structure
- **Referrer:** $20 credit or 1 month free (whichever is higher value)
- **Referee:** 20% discount on first month

### Referral Flow
1. Customer receives referral link/code
2. Referee signs up using link/code
3. Referee completes first payment
4. Both referrer and referee receive rewards
5. Track referral attribution

### Variants

#### Variant A (Control)
- No referral program
- All customers from paid channels

#### Variant B (Treatment)
- Referral program active
- Track referral vs. paid attribution

---

## Rollout Plan

### Phase 1: Beta Launch (Week 1-2)
- **Audience:** Top 20% of customers (by LTV or engagement)
- **Goal:** Validate program mechanics and reward structure
- **Success Criteria:** >5% of beta customers refer someone

### Phase 2: Full Launch (Week 3-12)
- **Audience:** All customers
- **Goal:** Scale referrals and measure CAC impact
- **Success Criteria:** 10% of new customers from referrals

### Phase 3: Optimization (Week 13+)
- **Goal:** Optimize rewards and messaging
- **Success Criteria:** Maintain or improve referral rate

---

## Rollback Plan

**Trigger Conditions:**
- CAC increases (program costs more than it saves)
- Referral fraud detected (>5% of referrals)
- Customer complaints about program (>10 complaints/week)

**Rollback Steps:**
1. Pause new referral signups
2. Honor existing referrals in pipeline
3. Analyze program economics
4. Redesign or cancel program

---

## Metrics Tracking

### Events to Track
- `referral_link_shared`
- `referral_link_clicked`
- `referral_signup_started`
- `referral_signup_completed`
- `referral_reward_earned` (for both referrer and referee)
- `referral_fraud_detected`

### Database Queries
```sql
-- CAC by acquisition channel
SELECT 
  acquisition_channel,
  SUM(spend) as total_spend,
  COUNT(DISTINCT user_id) as new_customers,
  SUM(spend) / COUNT(DISTINCT user_id) as cac
FROM customer_acquisition
WHERE signup_date >= '2025-01-28'
GROUP BY acquisition_channel;

-- Referral program ROI
SELECT 
  COUNT(*) as referrals,
  SUM(referrer_reward_cost + referee_discount_cost) as total_cost,
  COUNT(*) * (SELECT AVG(ltv) FROM customers) as estimated_ltv,
  (COUNT(*) * (SELECT AVG(ltv) FROM customers) - SUM(referrer_reward_cost + referee_discount_cost)) as net_value
FROM referrals
WHERE completed = true;
```

---

## Dependencies

- **Feature Flag:** `referral_program_enabled` (in flags.json)
- **Database Tables:** `referrals`, `orders`, `spend`
- **Frontend Components:** Referral dashboard, sharing UI
- **Backend:** Referral tracking and reward distribution

---

## Financial Impact

### Base Scenario (Month 1)
- **Current CAC:** $50
- **Current Monthly Spend:** $20,000 (400 new customers)
- **Target CAC:** $40 (20% reduction)
- **Monthly Spend Savings:** $4,000/month
- **Referral Program Cost:** ~$1,000/month (rewards)
- **Net Savings:** $3,000/month
- **Annual Impact:** +$36,000/year

### At Scale (Month 12)
- **Current CAC:** $26
- **Current Monthly Spend:** $42,000 (1,615 new customers)
- **Target CAC:** $21 (20% reduction)
- **Monthly Spend Savings:** $8,075/month
- **Referral Program Cost:** ~$3,000/month (rewards)
- **Net Savings:** $5,075/month
- **Annual Impact:** +$60,900/year

---

## Timeline

- **Week 1:** Design referral program mechanics and rewards
- **Week 2:** Build referral tracking and reward distribution
- **Week 3:** Beta launch with top 20% of customers
- **Week 4-11:** Full launch, collect data
- **Week 12:** Analyze results, optimize program
- **Week 13+:** Scale and optimize

---

## Risks

1. **Referral fraud:** Users gaming the system
   - **Mitigation:** Fraud detection, minimum purchase requirements, IP tracking

2. **Program costs exceed savings:** CAC doesn't reduce enough
   - **Mitigation:** Monitor program ROI weekly, adjust rewards if needed

3. **Low referral rate:** Customers don't refer others
   - **Mitigation:** Test different reward structures, improve messaging

---

## Done When

- [ ] Referral program reaches 10% of new customers
- [ ] CAC reduces by at least 10% (minimum success)
- [ ] Referral CAC < $10 per customer
- [ ] Program ROI positive (savings > costs)
- [ ] No significant fraud detected
- [ ] Results documented and program optimized

---

**Last Updated:** 2025-01-28  
**Next Review:** Weekly during experiment
