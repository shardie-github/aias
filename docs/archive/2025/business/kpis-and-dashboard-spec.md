> Archived on 2025-11-12. Superseded by: (see docs/final index)

# KPIs & Dashboard Spec — AIAS Platform

**Purpose:** Define key performance indicators (KPIs) and dashboard specifications for AIAS Platform  
**Last Updated:** January 15, 2024

---

## Core KPIs

### Acquisition Metrics

#### Sign-Ups
- **Definition:** Number of new user sign-ups (free + paid)
- **Target:** 100-650 sign-ups/month (growing)
- **Dashboard:** Sign-ups chart (daily, weekly, monthly)

#### Activation Rate
- **Definition:** Percentage of sign-ups who create first workflow within 7 days
- **Target:** 60%+ activation rate
- **Dashboard:** Activation rate gauge, activation funnel

#### Paid Conversion Rate
- **Definition:** Percentage of free users who convert to paid within 30 days
- **Target:** 20%+ paid conversion rate
- **Dashboard:** Conversion rate gauge, conversion funnel

---

### Engagement Metrics

#### Weekly Active Users (WAU)
- **Definition:** Number of users who use the platform at least once per week
- **Target:** 70%+ of total users (weekly active)
- **Dashboard:** WAU chart, WAU trend

#### Daily Active Users (DAU)
- **Definition:** Number of users who use the platform at least once per day
- **Target:** 30%+ of total users (daily active)
- **Dashboard:** DAU chart, DAU trend

#### 7-Day Retention
- **Definition:** Percentage of users who return 7 days after sign-up
- **Target:** 70%+ 7-day retention
- **Dashboard:** Retention cohort chart, retention curve

#### 30-Day Retention
- **Definition:** Percentage of users who return 30 days after sign-up
- **Target:** 60%+ 30-day retention
- **Dashboard:** Retention cohort chart, retention curve

---

### Revenue Metrics

#### MRR (Monthly Recurring Revenue)
- **Definition:** Monthly recurring revenue from paid subscriptions
- **Target:** CAD $4,900 MRR (Q1 2024), CAD $24,500 MRR (Q2 2024)
- **Dashboard:** MRR chart, MRR trend, MRR breakdown by plan

#### ARPU (Average Revenue Per User)
- **Definition:** Average revenue per user (blended: Starter + Pro)
- **Target:** CAD $75/month (blended ARPU)
- **Dashboard:** ARPU chart, ARPU by plan

#### Churn Rate
- **Definition:** Percentage of paid users who cancel per month
- **Target:** <5% monthly churn (Starter), <3% monthly churn (Pro)
- **Dashboard:** Churn rate chart, churn trend

---

### Growth Metrics

#### CAC (Customer Acquisition Cost)
- **Definition:** Cost to acquire a new paid customer (marketing + sales)
- **Target:** CAD $50-100 CAC
- **Dashboard:** CAC chart, CAC by channel

#### LTV (Lifetime Value)
- **Definition:** Average lifetime value of a paid customer
- **Target:** CAD $588-1,176 LTV (12-24 month lifetime)
- **Dashboard:** LTV chart, LTV by plan

#### Payback Period
- **Definition:** Time to recover CAC (months)
- **Target:** 2-4 months payback period
- **Dashboard:** Payback period chart, payback trend

---

## Dashboard Specifications

### Executive Dashboard

**Purpose:** High-level overview for founders/investors

**Metrics:**
- MRR (monthly recurring revenue)
- Active Users (WAU, DAU)
- Paid Conversion Rate
- Churn Rate
- CAC vs. LTV

**Visualizations:**
- MRR trend chart (line chart)
- Active users chart (line chart)
- Conversion funnel (funnel chart)
- CAC vs. LTV comparison (bar chart)

---

### Product Dashboard

**Purpose:** Product usage and engagement metrics

**Metrics:**
- Workflow Runs (total, successful, failed)
- Active Workflows
- Integration Usage (Shopify, Wave, etc.)
- Feature Usage (templates, AI agents)

**Visualizations:**
- Workflow runs chart (line chart)
- Integration usage chart (bar chart)
- Feature usage chart (pie chart)
- Error rate chart (line chart)

---

### Marketing Dashboard

**Purpose:** Marketing performance and acquisition metrics

**Metrics:**
- Sign-Ups (by channel: organic, paid, referral)
- CAC (by channel)
- Conversion Rate (by channel)
- Marketing Spend (by channel)

**Visualizations:**
- Sign-ups by channel (bar chart)
- CAC by channel (bar chart)
- Conversion funnel (funnel chart)
- Marketing ROI (line chart)

---

## Event Logging Schema

### Minimal Event Schema

```typescript
interface Event {
  event_id: string;           // Unique event ID
  user_id: string;            // User ID (hashed/anonymized)
  event_type: string;         // Event type (signup, workflow_run, etc.)
  timestamp: number;          // Unix timestamp
  properties: {
    // Event-specific properties
    workflow_id?: string;
    integration?: string;
    plan?: string;
    // ... other properties
  };
}
```

### Core Events

#### User Events
- `user.signup` — User signs up
- `user.activate` — User creates first workflow
- `user.convert` — User converts to paid
- `user.churn` — User cancels subscription

#### Workflow Events
- `workflow.created` — Workflow created
- `workflow.run` — Workflow executed
- `workflow.success` — Workflow successful
- `workflow.error` — Workflow failed

#### Integration Events
- `integration.connected` — Integration connected
- `integration.disconnected` — Integration disconnected
- `integration.error` — Integration error

---

## Dashboard Wireframe

### Layout (3-Column Grid)

```
┌─────────────────┬─────────────────┬─────────────────┐
│   MRR Chart     │  Active Users   │  Conversion     │
│   (Line Chart)  │   (Line Chart)  │   (Funnel)      │
├─────────────────┼─────────────────┼─────────────────┤
│  Workflow Runs  │  Integration    │   Feature       │
│   (Line Chart)  │   Usage (Bar)   │   Usage (Pie)   │
├─────────────────┼─────────────────┼─────────────────┤
│   CAC vs. LTV   │   Churn Rate    │   Retention     │
│   (Bar Chart)   │   (Line Chart)  │   (Cohort)      │
└─────────────────┴─────────────────┴─────────────────┘
```

---

## Implementation Notes

### Data Collection
- **Telemetry:** Consent-gated telemetry (explicit opt-in)
- **Storage:** Minimal event logging (event_id, user_id, event_type, timestamp, properties)
- **Retention:** 90 days (aggregated data retained longer)

### Privacy
- **PIPEDA Compliance:** User consent required, data anonymized
- **Data Minimization:** Minimal data collection (only necessary events)
- **User Control:** Users can opt-out of telemetry (settings)

---

**Last Updated:** January 15, 2024  
**Next Review:** April 15, 2024 (Quarterly)
