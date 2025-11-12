> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Referral Program Launch
**Owner:** Growth Team  
**Objective:** Reduce CAC by 20% (from $50 to $40) through organic referrals, saving $3,000/month in marketing spend at current scale.

**Steps:**
1. Design referral program mechanics (rewards structure, referral flow)
2. Build referral tracking system (link generation, attribution, reward distribution)
3. Create referral dashboard UI for customers
4. Set up feature flag `referral_program_enabled`
5. Launch beta with top 20% of customers (by LTV) for 2 weeks
6. Scale to all customers and track referral vs. paid attribution
7. Monitor program ROI and optimize rewards if needed

**Dependencies:**
- `referrals` table in Supabase (may need to create)
- `orders` table for attribution
- `spend` table for CAC calculation
- Feature flag middleware
- Email service for referral notifications

**KPI:** CAC | **30-day signal:** 5% of new customers from referrals

**Done when:**
- Referral program reaches 10% of new customers
- CAC reduces by at least 10% (minimum success threshold)
- Referral CAC < $10 per customer
- Program ROI positive (savings > costs)
- No significant fraud detected

**Impact × Confidence ÷ Effort:** 8.0  
**Financial Impact:** +$3,000/month savings (Month 1), +$5,075/month savings (Month 12)
