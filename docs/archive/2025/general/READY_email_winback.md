> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Email Win-Back Campaign
**Owner:** Growth Team  
**Objective:** Reduce churn rate by 20% (from 5% to 4%) or increase LTV by 15% through targeted win-back emails, retaining $1,800/month in revenue at current scale.

**Steps:**
1. Design email templates for 3 segments (at-risk, churned, low engagement)
2. Build customer segmentation logic (14-day inactivity, cancelled customers, low engagement)
3. Set up email automation (SendGrid/Mailchimp/Resend integration)
4. Set up feature flag `email_winback_enabled`
5. Launch soft rollout with 10% of at-risk customers for 2 weeks
6. Scale to all segments with 50/50 split
7. Monitor win-back rate, churn rate, and LTV impact
8. Optimize email content and timing based on results

**Dependencies:**
- `customers` table with engagement scoring
- `events` table for activity tracking
- `orders` table for LTV calculation
- Email service integration
- Feature flag middleware

**KPI:** Churn Rate, LTV | **30-day signal:** Win-back rate >3% of emailed customers

**Done when:**
- Experiment reaches statistical significance (6,000 customers)
- Churn rate reduces by at least 10% OR LTV increases by 5% (minimum success)
- Win-back rate >5% of emailed customers
- Campaign ROI positive (retained revenue > campaign costs)
- No significant unsubscribe spike

**Impact × Confidence ÷ Effort:** 7.0  
**Financial Impact:** +$1,800/month retained revenue (Month 1), +$20,500/month retained revenue (Month 12)
