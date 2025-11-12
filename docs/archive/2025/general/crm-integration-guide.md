> Archived on 2025-11-12. Superseded by: (see docs/final index)

# CRM Integration Guide

**Purpose:** How to integrate your CRM (Notion, Airtable, Google Sheets) with your lead capture, sales, and customer support workflows.

## CRM Options Comparison

### Notion CRM
- **Pros:** Free tier available, flexible database structure, good for solo/small teams
- **Cons:** Limited API rate limits, not built specifically for CRM
- **Best for:** Solo founders, small teams, content-heavy workflows
- **Cost:** $0 (Free) - $10/month (Personal Pro)

### Airtable CRM
- **Pros:** Spreadsheet-like interface, powerful automations, good API
- **Cons:** Pricing can escalate quickly, learning curve
- **Best for:** Teams needing spreadsheet familiarity with CRM power
- **Cost:** $20/month (Plus) - $45/month (Pro)

### Google Sheets CRM
- **Pros:** Free, familiar interface, easy sharing
- **Cons:** Limited automation, no native CRM features
- **Best for:** Bootstrapped startups, simple use cases
- **Cost:** $0 (Free) - $6/month/user (Google Workspace)

### HubSpot CRM
- **Pros:** Powerful, free tier available, comprehensive features
- **Cons:** Can be overwhelming, upselling pressure
- **Best for:** Growth-stage companies, complex sales processes
- **Cost:** $0 (Free) - $50/month (Starter)

## Notion CRM Setup

### 1. Create Lead Database

**Properties:**
- Name (Title)
- Email (Email)
- Company (Text)
- Phone (Text)
- Status (Select: New, Contacted, Qualified, Proposal Sent, Negotiating, Closed Won, Closed Lost)
- Source (Select: Website, LinkedIn, Referral, Content, Other)
- Value (Number) - Deal value in CAD
- Close Date (Date)
- Owner (Person) - Assign team member
- Notes (Text)
- Tags (Multi-select)
- Created (Created time)
- Last Contacted (Date)

### 2. Create Deal Pipeline View

**Views:**
- "All Leads" - Default view
- "My Leads" - Filter by Owner = Me
- "Hot Leads" - Filter by Status = Qualified or Negotiating
- "This Week" - Filter by Close Date = This week
- "By Source" - Group by Source

### 3. Integration Setup

**Via Zapier:**
1. Connect Notion account
2. Select database: "CRM Leads"
3. Map form fields to database properties
4. Test and activate

**Via Make:**
1. Add Notion module
2. Authenticate
3. Select database
4. Map fields
5. Test scenario

### 4. Automation Rules

**When lead added:**
- Send welcome email
- Create Slack notification
- Assign owner (round-robin or by source)

**When status changes to "Qualified":**
- Create calendar event for follow-up
- Send internal notification
- Update forecast

**When status changes to "Closed Won":**
- Create customer record
- Send celebration message
- Update revenue dashboard

## Airtable CRM Setup

### 1. Create Base Structure

**Tables:**
- **Leads** (Main table)
  - Name, Email, Company, Phone, Status, Source, Value, Close Date, Owner, Notes
  
- **Companies** (Linked table)
  - Company Name, Industry, Website, Employee Count, Annual Revenue
  
- **Activities** (Linked table)
  - Type (Call, Email, Meeting), Date, Notes, Related Lead

### 2. Create Views

- "All Leads" - All records
- "My Pipeline" - Filter by Owner
- "Hot Prospects" - Filter by Status + Value
- "Conversion Funnel" - Group by Status

### 3. Automation Setup

**Airtable Automations:**
- When record created → Send email
- When field changes → Update related record
- Schedule → Weekly pipeline review email

**External Integrations:**
- Zapier/Make for cross-platform automation
- Webhooks for custom integrations

## Google Sheets CRM Setup

### 1. Create Spreadsheet Structure

**Sheet 1: Leads**
Columns: Date, Name, Email, Company, Phone, Status, Source, Value, Owner, Notes

**Sheet 2: Activities**
Columns: Date, Lead Name, Type, Notes, Next Follow-up

**Sheet 3: Forecast**
Columns: Month, Target, Closed, Pipeline, Forecast

### 2. Add Formulas

**Conversion Rate:**
```
=COUNTIF(Leads!F:F,"Closed Won")/COUNT(Leads!A:A)
```

**Pipeline Value:**
```
=SUMIF(Leads!F:F,"<>Closed Lost",Leads!H:H)
```

**This Month Closed:**
```
=SUMIFS(Leads!H:H,Leads!F:F,"Closed Won",Leads!I:I,">="&EOMONTH(TODAY(),-1)+1)
```

### 3. Integration Setup

**Via Zapier:**
1. Google Sheets "Append Row" action
2. Map form fields to columns
3. Test and activate

**Via Apps Script (Advanced):**
- Custom automation scripts
- Email triggers
- API integrations

## CRM Best Practices

### Data Hygiene

1. **Deduplication**
   - Check for duplicate emails before adding
   - Merge duplicate records
   - Use email as unique identifier

2. **Data Validation**
   - Validate email format
   - Standardize company names
   - Normalize phone numbers

3. **Regular Cleanup**
   - Archive old leads (6+ months inactive)
   - Update statuses regularly
   - Remove bounced email addresses

### Pipeline Management

1. **Status Definitions**
   - New: Just added, not contacted
   - Contacted: Initial outreach done
   - Qualified: Interested and budget available
   - Proposal Sent: Formal proposal delivered
   - Negotiating: Discussing terms
   - Closed Won: Deal closed
   - Closed Lost: Not moving forward

2. **Follow-up Cadence**
   - New → Contacted: Within 24 hours
   - Contacted → Qualified: Within 1 week
   - Qualified → Proposal: Within 2 weeks
   - Proposal → Follow-up: Within 3 days

3. **Owner Assignment**
   - Round-robin for fairness
   - By source/expertise
   - By geographic region

### Reporting & Analytics

**Weekly Metrics:**
- New leads added
- Conversion rate by source
- Average deal size
- Sales cycle length

**Monthly Metrics:**
- Pipeline value
- Win rate
- Lost reasons analysis
- Source ROI

**Dashboard Integration:**
- Export to `/ops/dashboards/kpi-tracker-template.csv`
- Update weekly via automation
- Review in daily routine

## Privacy & Compliance

### GDPR/CCPA Requirements

1. **Consent Tracking**
   - Store consent timestamp
   - Record consent source
   - Include unsubscribe mechanism

2. **Data Retention**
   - Auto-delete after 24 months inactive
   - Archive instead of delete (for compliance)
   - Provide export on request

3. **Access Controls**
   - Limit who can view/edit CRM
   - Use role-based access
   - Audit log access

### Data Flow Map

```
Form Submission → CRM Entry
                    ↓
            Email Automation
                    ↓
            Activity Tracking
                    ↓
            Conversion Tracking
                    ↓
            Revenue Dashboard
```

## Troubleshooting

### Common Issues

1. **Duplicate Leads**
   - Solution: Add deduplication check in automation
   - Use email as unique identifier

2. **Missing Data**
   - Solution: Add required field validation
   - Set default values where appropriate

3. **Sync Failures**
   - Solution: Check API rate limits
   - Add retry logic
   - Review automation logs

### Support Resources

- Zapier Help: https://help.zapier.com
- Make Documentation: https://www.make.com/en/help
- Notion API: https://developers.notion.com
- Airtable API: https://airtable.com/api

---

**Last Updated:** 2025-01-XX  
**Next Review:** Quarterly
