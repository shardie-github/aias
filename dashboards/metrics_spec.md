# Metrics Dashboard Specification

**Last Updated:** 2025-01-29

---

## Overview

Unified business intelligence dashboard pulling from `metrics_daily`, `orders`, `spend`, and `events` tables.

---

## Key Metrics

### Revenue Metrics
- **MRR** (Monthly Recurring Revenue) - from orders + subscriptions
- **ARR** (Annual Recurring Revenue) - MRR × 12
- **Revenue Trend** - 30/90/365 day views
- **Revenue by Source** - Shopify, API, Marketplace, Partnerships

### Growth Metrics
- **New Customers** - Count of new orders/users
- **Churn Rate** - Monthly churn percentage
- **LTV** (Lifetime Value) - Average customer lifetime value
- **CAC** (Customer Acquisition Cost) - from spend table

### Conversion Metrics
- **Conversion Rate** - Orders / Sessions
- **AOV** (Average Order Value) - Revenue / Orders
- **Add-to-Cart Rate** - Add-to-carts / Sessions
- **Cart Abandonment Rate** - (Add-to-carts - Orders) / Add-to-carts

### Marketing Metrics
- **Ad Spend** - Total spend from Meta + TikTok
- **ROAS** (Return on Ad Spend) - Revenue / Ad Spend
- **CPC** (Cost Per Click) - Spend / Clicks
- **CPA** (Cost Per Acquisition) - Spend / Conversions

### Operational Metrics
- **Traffic** - Sessions from events table
- **API Usage** - API calls from events table
- **Active Users** - DAU/MAU from events table
- **Gross Margin** - Revenue - COGS (from metrics_daily)

---

## Dashboard Views

### 1. Executive Summary
- MRR, ARR, Growth Rate
- Top 5 metrics at a glance
- 30-day trend chart

### 2. Revenue Deep Dive
- Revenue by source (pie chart)
- Revenue trend (line chart)
- AOV trend
- Refunds/chargebacks

### 3. Marketing Performance
- Ad spend by platform
- ROAS by campaign
- CAC trend
- Conversion funnel

### 4. Product Metrics
- API usage trends
- Feature adoption
- User engagement
- Retention cohorts

### 5. Financial Health
- Gross margin
- Operating expenses
- Runway calculation
- Break-even projection

---

## Data Sources

| Metric | Source Table | Aggregation |
|--------|--------------|-------------|
| MRR | orders, subscriptions | SUM(total_cents) / 100, monthly |
| Sessions | events | COUNT(DISTINCT user_id), daily |
| Orders | orders | COUNT(*), daily |
| Revenue | orders | SUM(total_cents) / 100, daily |
| Ad Spend | spend | SUM(spend_cents) / 100, daily |
| CAC | spend, orders | SUM(spend_cents) / SUM(conv), daily |
| AOV | orders | AVG(total_cents) / 100, daily |
| Conversion Rate | events, orders | Orders / Sessions, daily |

---

## Implementation Notes

- Use `metrics_daily` for pre-aggregated daily metrics
- Real-time metrics from `events` and `orders` tables
- Cache expensive aggregations (30-day, 90-day, 365-day)
- Update dashboard every hour (or real-time for key metrics)

---

## Visualization Recommendations

- **Line Charts:** Trends over time (revenue, traffic, CAC)
- **Bar Charts:** Comparisons (revenue by source, platform spend)
- **Pie Charts:** Composition (revenue breakdown, traffic sources)
- **Funnel Charts:** Conversion funnel
- **Cohort Tables:** Retention analysis
- **Gauge Charts:** KPI targets (MRR, churn rate)

---

## Alert Thresholds

- **MRR Drop:** >5% month-over-month
- **Churn Rate:** >8% monthly
- **CAC Spike:** >50% increase week-over-week
- **API Errors:** >1% error rate
- **Ad Spend:** >$10K/day without corresponding revenue

---

**Next Steps:**
1. Build dashboard UI (React + Recharts)
2. Create API endpoints for metrics
3. Set up real-time updates (Supabase Realtime)
4. Configure alerts (Slack/email)
