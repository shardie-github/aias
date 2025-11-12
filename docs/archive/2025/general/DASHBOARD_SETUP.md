> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Dashboard Setup Guide

**Purpose:** Complete guide to set up and customize dashboard templates with your data sources.

## Overview

Three dashboard templates are provided:
1. **Marketing Dashboard** - Social media & lead tracking
2. **Finance Dashboard** - Revenue & expenses (CAD)
3. **KPI Tracker** - Key performance indicators

## Quick Start

### Option 1: Google Sheets (Recommended)

1. Open Google Sheets
2. File → Import → Upload
3. Select CSV template from `ops/dashboards/`
4. Customize columns/formulas as needed

### Option 2: Excel / Numbers

1. Open CSV file in Excel/Numbers
2. Save as Excel format (.xlsx)
3. Add formulas and formatting
4. Set up data refresh (if using external data)

### Option 3: Airtable

1. Create new Airtable base
2. Import CSV from template
3. Set up views and automations
4. Connect to data sources

## Dashboard 1: Marketing Dashboard

### Setup Steps

**1. Import Template**
- Copy `ops/dashboards/marketing-dashboard-template.csv`
- Import to Google Sheets/Excel
- Rename sheet: "Marketing Dashboard"

**2. Add Columns** (if needed)
- Campaign Name
- Budget
- Cost per Lead
- Conversion Rate
- Revenue Attributed

**3. Set Up Data Sources**

**From Social Media APIs:**
```javascript
// Example: LinkedIn API integration
// Use Zapier/Make to auto-populate
// Or manual export from Buffer/Hootsuite
```

**From Analytics:**
```javascript
// Google Analytics → Export → Import to Sheet
// Or use Google Analytics API
```

**From CRM:**
```javascript
// Notion/Airtable → Export → Import
// Or use API integration
```

**4. Add Formulas**

**Total Engagement:**
```excel
=SUM(E2:E1000)
```

**Average CTR:**
```excel
=AVERAGE(G2:G1000)
```

**Total Leads Generated:**
```excel
=SUM(I2:I1000)
```

**ROI Calculation:**
```excel
=IF(J2>0, (I2*50-J2)/J2, 0)
// Assumes $50 average lead value
```

**5. Create Charts**

- Engagement over time (line chart)
- Platform comparison (bar chart)
- ROI by platform (pie chart)

**6. Set Up Automation**

**Via Zapier/Make:**
- Trigger: New social post published
- Action: Append row to Google Sheet
- Map fields from social platform

**Via Google Apps Script:**
```javascript
// Example script to fetch from API
function updateMarketingDashboard() {
  // Fetch data from API
  // Append to sheet
  // Run daily via trigger
}
```

## Dashboard 2: Finance Dashboard

### Setup Steps

**1. Import Template**
- Copy `ops/dashboards/finance-dashboard-template.csv`
- Import to Google Sheets/Excel
- Rename sheet: "Finance Dashboard"

**2. Connect to Stripe**

**Option A: Stripe Export**
1. Stripe Dashboard → Reports → Export
2. Import CSV to sheet
3. Set up daily/weekly export

**Option B: Stripe API**
```javascript
// Via Zapier/Make:
// Trigger: Payment Succeeded
// Action: Append to Google Sheet

// Via Apps Script:
const stripe = require('stripe')(STRIPE_SECRET_KEY);
const charges = await stripe.charges.list({limit: 100});
// Import to sheet
```

**3. Add GST/HST Calculation**

**GST (5%) Calculation:**
```excel
=IF(OR(LEFT(A2,2)="AB", LEFT(A2,2)="BC", LEFT(A2,2)="MB", LEFT(A2,2)="NT", LEFT(A2,2)="NU", LEFT(A2,2)="QC", LEFT(A2,2)="SK", LEFT(A2,2)="YT"), E2*0.05, E2*0.13)
```

**HST (13%) Calculation:**
```excel
=IF(OR(LEFT(A2,2)="ON", LEFT(A2,2)="NB", LEFT(A2,2)="NL", LEFT(A2,2)="NS", LEFT(A2,2)="PE"), E2*0.13, E2*0.05)
```

**Total with Tax:**
```excel
=E2+F2
```

**4. Add Summary Formulas**

**Total Revenue (This Month):**
```excel
=SUMIF(A:A, ">="&EOMONTH(TODAY(),-1)+1, E:E)
```

**Total Revenue (This Year):**
```excel
=SUMIF(YEAR(A:A), YEAR(TODAY()), E:E)
```

**Average Transaction Value:**
```excel
=AVERAGE(E:E)
```

**MRR (Monthly Recurring Revenue):**
```excel
=SUMIFS(E:E, F:F, "Monthly subscription", A:A, ">="&EOMONTH(TODAY(),-1)+1)
```

**5. Create Financial Reports**

**Monthly Summary Sheet:**
```excel
Month: January 2025
Total Revenue: $X,XXX CAD
Total Transactions: XX
Average Transaction: $XX CAD
GST Collected: $XX CAD
HST Collected: $XX CAD
```

**6. Set Up Automation**

**Via Stripe Webhook:**
```yaml
# Zapier/Make workflow:
# Trigger: Stripe Payment Succeeded
# Action: Append to Google Sheet
# Fields: Date, Transaction ID, Email, Amount, etc.
```

**Via Supabase Function:**
```sql
-- Create function to sync Stripe → Supabase → Sheet
CREATE OR REPLACE FUNCTION sync_stripe_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert to transactions table
  -- Trigger webhook to update sheet
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Dashboard 3: KPI Tracker

### Setup Steps

**1. Import Template**
- Copy `ops/dashboards/kpi-tracker-template.csv`
- Import to Google Sheets/Excel
- Rename sheet: "KPI Tracker"

**2. Connect Data Sources**

**User Metrics (Supabase):**
```sql
-- Active users (last 30 days)
SELECT COUNT(DISTINCT user_id) 
FROM users 
WHERE last_active_at > NOW() - INTERVAL '30 days';

-- New signups (today)
SELECT COUNT(*) 
FROM users 
WHERE created_at::date = CURRENT_DATE;
```

**Revenue Metrics (Stripe/Supabase):**
```sql
-- MRR
SELECT SUM(amount) 
FROM subscriptions 
WHERE status = 'active' 
AND billing_period = 'month';
```

**Support Metrics (Helpdesk):**
```sql
-- Open tickets
SELECT COUNT(*) 
FROM support_tickets 
WHERE status = 'open';

-- Average response time
SELECT AVG(response_time_hours) 
FROM support_tickets 
WHERE resolved_at IS NOT NULL;
```

**3. Add Formulas**

**Growth Rate (MoM):**
```excel
=(B3-B2)/B2*100
```

**Churn Rate:**
```excel
=IF(B2>0, (B2-B3)/B2*100, 0)
```

**Customer LTV:**
```excel
=B4/B6*12
// MRR / Churn Rate * 12 months
```

**Conversion Rate:**
```excel
=IF(B2>0, B2/B1*100, 0)
// Signups / Visitors * 100
```

**4. Create Visualizations**

- KPI trend lines (line chart)
- Month-over-month comparison (bar chart)
- Goal vs. actual (gauge chart)

**5. Set Up Daily Updates**

**Via Analytics Script:**
```bash
# Run daily via GitHub Actions
node scripts/analytics-kpi.js
# Outputs to ops/dashboards/reports/kpi-YYYYMMDD.csv
# Import to dashboard
```

**Via Zapier/Make:**
```yaml
# Daily workflow:
# Trigger: Schedule (daily 9 AM)
# Action 1: Query Supabase for metrics
# Action 2: Query Stripe for revenue
# Action 3: Update Google Sheet
```

## Advanced: Real-Time Dashboards

### Option 1: Google Sheets + Apps Script

**Set up refresh trigger:**
```javascript
function refreshDashboard() {
  // Fetch data from APIs
  // Update sheet cells
  // Run every 15 minutes
}

// Set trigger: Edit → Current project's triggers
// Add trigger: refreshDashboard, Time-driven, Every 15 minutes
```

### Option 2: Airtable + Automations

**Set up automation:**
1. Create automation
2. Trigger: Schedule (hourly)
3. Actions: Update records from API
4. Sync to dashboard view

### Option 3: Supabase + Google Sheets

**Use Supabase webhooks:**
```sql
-- Create webhook function
CREATE OR REPLACE FUNCTION update_google_sheet()
RETURNS TRIGGER AS $$
BEGIN
  -- Call Google Sheets API
  -- Update row
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Data Source Integration Examples

### Stripe Integration

**Get Transactions:**
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function getTransactions() {
  const charges = await stripe.charges.list({
    limit: 100,
    created: {
      gte: Math.floor(Date.now() / 1000) - 86400 // Last 24 hours
    }
  });
  
  return charges.data.map(charge => ({
    date: new Date(charge.created * 1000).toISOString().split('T')[0],
    transaction_id: charge.id,
    customer_email: charge.billing_details.email,
    amount_cad: charge.amount / 100, // Convert from cents
    status: charge.status
  }));
}
```

### Supabase Integration

**Get User Metrics:**
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function getUserMetrics() {
  const { data: users } = await supabase
    .from('users')
    .select('id, created_at, last_active_at')
    .gte('last_active_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
  
  return {
    active_users: users.length,
    new_signups: users.filter(u => 
      new Date(u.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length
  };
}
```

### Google Analytics Integration

**Get Analytics Data:**
```javascript
// Using Google Analytics API
const { google } = require('googleapis');

async function getAnalyticsData() {
  const analytics = google.analytics('v3');
  const response = await analytics.data.ga.get({
    'auth': auth,
    'ids': 'ga:' + profileId,
    'start-date': '30daysAgo',
    'end-date': 'today',
    'metrics': 'ga:sessions,ga:users,ga:pageviews'
  });
  
  return response.data;
}
```

## Troubleshooting

### Data Not Updating

**Check:**
- API keys are correct
- Permissions are set correctly
- Automation is running
- Sheet formulas are correct

### Formulas Not Working

**Common Issues:**
- Cell format (text vs. number)
- Date format inconsistencies
- Missing data causing errors
- Circular references

**Solutions:**
- Format cells as numbers/dates
- Use IFERROR() to handle errors
- Check for null/empty values

### Automation Failing

**Check:**
- Zapier/Make execution logs
- API rate limits
- Authentication tokens
- Webhook URLs

## Best Practices

1. **Backup Regularly** - Export sheets weekly
2. **Document Formulas** - Add comments explaining calculations
3. **Version Control** - Keep CSV templates in git
4. **Validate Data** - Check for errors before relying on metrics
5. **Set Alerts** - Notify on anomalies or failures

## Next Steps

1. ✅ Import all three dashboard templates
2. ✅ Connect to your data sources
3. ✅ Set up automation workflows
4. ✅ Add custom formulas and charts
5. ✅ Schedule regular updates
6. ✅ Review dashboards daily/weekly

---

**Last Updated:** 2025-01-XX  
**Need Help?** Check data source API documentation
