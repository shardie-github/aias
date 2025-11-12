> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Metrics Dashboard Specification

**Last Updated:** 2025-01-29  
**Owner:** Data Team

## KPIs + Data Quality Tiles

### Primary KPIs

1. **Revenue Metrics**
   - Total Revenue (MRR)
   - Revenue by Stream (SaaS, API, Marketplace, Partnerships)
   - Revenue Growth Rate (MoM)
   - Target: $30K MRR by Month 3

2. **Cost Metrics**
   - Total Costs (Infrastructure, Team, Marketing, CAC)
   - CAC by Channel
   - LTV:CAC Ratio
   - Target: LTV:CAC > 3:1

3. **Growth Metrics**
   - New Customers (MoM)
   - Churn Rate
   - Upgrade Rate
   - Target: Churn < 5%, Upgrade Rate > 15%

4. **Product Metrics**
   - Active Users (DAU, MAU)
   - Feature Adoption Rate
   - API Calls/Day
   - Target: 1000+ API calls/day

### Data Quality Tiles

1. **Freshness Check**
   - Last ETL Run Time
   - Metrics Last Updated
   - Status: ✅ Fresh / ⚠️ Stale / ❌ Missing
   - Threshold: < 24 hours old

2. **Completeness Check**
   - Missing Data Points
   - Null Values Count
   - Status: ✅ Complete / ⚠️ Partial / ❌ Incomplete
   - Threshold: < 1% missing

3. **Accuracy Check**
   - Duplicate Records
   - Negative Amounts
   - Future Dates
   - Status: ✅ Valid / ⚠️ Warnings / ❌ Errors
   - Threshold: 0 violations

4. **Consistency Check**
   - Schema Validation
   - Data Type Mismatches
   - Status: ✅ Consistent / ⚠️ Inconsistent / ❌ Broken
   - Threshold: 100% consistent

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  Revenue Metrics          │  Cost Metrics               │
│  - MRR: $X               │  - Total Costs: $X          │
│  - Growth: X%            │  - CAC: $X                  │
│  - By Stream (chart)     │  - LTV:CAC: X:1            │
├─────────────────────────────────────────────────────────┤
│  Growth Metrics          │  Product Metrics            │
│  - New Customers: X      │  - Active Users: X         │
│  - Churn Rate: X%        │  - API Calls: X/day        │
│  - Upgrade Rate: X%      │  - Feature Adoption: X%     │
├─────────────────────────────────────────────────────────┤
│  Data Quality Status                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                  │
│  │Fresh │ │Complete│ │Accurate│ │Consistent│            │
│  │ ✅   │ │ ✅     │ │ ✅     │ │ ✅       │            │
│  └──────┘ └──────┘ └──────┘ └──────┘                  │
└─────────────────────────────────────────────────────────┘
```

## Implementation

- **Frontend:** React + Recharts
- **Backend:** Supabase queries
- **Refresh:** Real-time (Supabase Realtime) or 5-minute polling
- **Alerts:** Slack notifications on DQ failures

## Next Steps

1. Build dashboard components
2. Connect to Supabase
3. Set up real-time subscriptions
4. Add alerting logic
5. Deploy to production
