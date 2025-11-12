> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Pricing Page A/B Test
**Owner:** Growth Team  
**Objective:** Increase conversion rate by 15% or ARPU by 10% through optimized pricing page design, increasing revenue by $2,650/month at current scale.

**Steps:**
1. Design treatment variant with value-focused headlines, social proof, and clearer CTAs
2. Build pricing page components for both variants
3. Set up feature flag `pricing_page_v2` with 50/50 split
4. Implement conversion tracking (pricing page views, plan selections, checkout starts)
5. Launch 50/50 split and collect data until 100,000 visitors reached
6. Analyze results (conversion rate, ARPU, plan distribution)
7. Decide on full rollout or iteration

**Dependencies:**
- `events` table for tracking
- `orders` table for ARPU calculation
- Feature flag middleware
- Pricing page components

**KPI:** Conversion Rate, ARPU | **30-day signal:** Conversion rate increases by >5% OR ARPU increases by >3%

**Done when:**
- Experiment reaches statistical significance (100,000 visitors)
- Conversion rate increases by at least 10% OR ARPU increases by 5% (minimum success)
- No negative impact on other metrics
- Results documented and decision made

**Impact × Confidence ÷ Effort:** 7.5  
**Financial Impact:** +$2,650/month revenue (Month 1), +$13,250/month revenue (Month 12)
