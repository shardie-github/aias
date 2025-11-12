> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Automated Lead Flow Guide

**Purpose:** Complete step-by-step guide for capturing leads from various sources and routing them through CRM, email sequences, and follow-up automation.

## Overview

This guide outlines the automated lead flow from initial capture through conversion, using no-code/low-code tools (Zapier, Make, Supabase, Airtable, Google Sheets).

## Architecture

```
Lead Source → Form Capture → CRM (Notion/Airtable) → Email Sequence → Follow-up → Conversion Tracking
```

## Step 1: Lead Capture Setup

### Sources

1. **Website Contact Form**
   - Tool: Typeform / Google Forms / Webflow Forms
   - Fields: Name, Email, Company, Message, Source (auto-detected)
   - Webhook: Configure to send to Zapier/Make

2. **Landing Pages**
   - Tool: Unbounce / Leadpages / Webflow
   - Integration: Webhook to automation platform
   - Auto-tagging: Source = "Landing Page"

3. **Social Media**
   - Tool: LinkedIn Lead Gen Forms / Facebook Lead Ads
   - Integration: Native Zapier connectors
   - Auto-tagging: Source = "Social Media"

4. **Content Downloads**
   - Tool: Lead magnets (PDFs, guides)
   - Integration: Email capture → CRM entry
   - Auto-tagging: Source = "Content Download"

### Form Fields (Standard)

- Full Name (required)
- Email (required, validated)
- Company/Organization (optional)
- Phone (optional)
- Message/Interest (optional)
- Source (auto-populated)
- UTM Parameters (auto-captured)

## Step 2: CRM Integration

### Option A: Notion CRM

**Setup:**
1. Create Notion database: "CRM Leads"
2. Properties:
   - Name (Title)
   - Email (Email)
   - Company (Text)
   - Status (Select: New, Contacted, Qualified, Converted, Lost)
   - Source (Select)
   - Date Added (Date)
   - Notes (Text)
   - Tags (Multi-select)

**Zapier/Make Action:**
```json
{
  "service": "Notion",
  "action": "Create Database Entry",
  "database": "CRM Leads",
  "mapping": {
    "Name": "{{form.name}}",
    "Email": "{{form.email}}",
    "Company": "{{form.company}}",
    "Status": "New",
    "Source": "{{form.source}}",
    "Date Added": "{{form.date}}"
  }
}
```

### Option B: Airtable CRM

**Setup:**
1. Create Airtable base: "Lead Management"
2. Table: "Leads"
3. Fields:
   - Name, Email, Company, Status, Source, Date Added

**Integration:** Use Airtable Zapier connector or Make module

### Option C: Google Sheets (Simple)

**Setup:**
1. Create Google Sheet: "CRM Leads"
2. Columns: Date, Name, Email, Company, Source, Status, Notes

**Integration:** Append row via Zapier/Make Google Sheets action

## Step 3: Email Automation

### Welcome Email Sequence

**Trigger:** New lead added to CRM

**Email 1: Welcome (Immediate)**
- Template: "Thanks for reaching out!"
- Content: Acknowledgment, next steps, resource links
- Delay: 0 minutes

**Email 2: Value Add (Day 2)**
- Template: "Here's how we can help"
- Content: Case studies, product overview, demo link
- Delay: 2 days

**Email 3: Social Proof (Day 5)**
- Template: "See what customers are saying"
- Content: Testimonials, reviews, success stories
- Delay: 5 days

**Email 4: Offer (Day 10)**
- Template: "Special offer for you"
- Content: Discount, free trial extension, consultation
- Delay: 10 days

**Email 5: Final Check-in (Day 14)**
- Template: "Still interested?"
- Content: Soft ask, unsubscribe option
- Delay: 14 days

### Tools for Email Automation

- **Resend** (if using custom domain)
- **SendGrid** (transactional + marketing)
- **Mailchimp** (marketing automation)
- **Gmail** (via Zapier, simple use cases)

## Step 4: Follow-up Automation

### Slack Notifications

**Trigger:** New lead added to CRM

**Action:** Send Slack DM to #leads channel
```
New lead: {{name}} from {{source}}
Email: {{email}}
Company: {{company}}
View in CRM: [link]
```

### Calendar Reminders

**For High-Value Leads:**
- If Company field contains certain keywords
- Create calendar event for follow-up call
- Set reminder 24 hours after lead capture

### Task Creation

**Trigger:** Lead status = "Qualified"

**Action:** Create task in project management tool:
- Tool: Notion, Asana, Trello
- Task: "Follow up with {{name}} from {{company}}"
- Due date: +3 days

## Step 5: Conversion Tracking

### Tagging Conversions

**When lead converts:**
1. Update CRM status → "Converted"
2. Add conversion date
3. Tag with product/service purchased
4. Calculate LTV (Lifetime Value)

### Reporting

**Daily:**
- New leads count
- Conversion rate
- Top sources

**Weekly:**
- Lead quality score
- Email open rates
- Follow-up completion rate

**Monthly:**
- Full funnel analysis
- Cost per lead
- ROI by source

## Step 6: Privacy & Compliance

### GDPR/CCPA Compliance

1. **Consent Capture**
   - Checkbox: "I agree to receive marketing emails"
   - Store consent timestamp in CRM

2. **Data Retention**
   - Auto-delete leads after 24 months of inactivity
   - Provide unsubscribe link in all emails

3. **DSAR (Data Subject Access Requests)**
   - Export lead data on request
   - Delete on request (automated via Supabase function)

### Data Flow Map

```
User Form → Zapier/Make → Notion/Airtable (CRM)
                    ↓
            Supabase (Backup/Archive)
                    ↓
            Google Sheets (Reporting)
                    ↓
            Slack (Notifications)
```

## Manual Fallback Procedures

### If Automation Fails

1. **Export leads manually**
   - Download CSV from form tool
   - Import to CRM manually
   - Send welcome email template

2. **Check automation logs**
   - Review Zapier/Make execution history
   - Identify failure point
   - Re-run failed tasks

3. **Emergency contact**
   - Check support channel (#automation-support)
   - Review `/ops/logs/automation-audit.log`

## Testing Checklist

- [ ] Test form submission → CRM entry
- [ ] Verify email sequence triggers
- [ ] Check Slack notifications
- [ ] Validate UTM parameter capture
- [ ] Test unsubscribe flow
- [ ] Verify data retention policies

## Cost Estimates (CAD)

- Zapier: $30-50/month (Professional plan)
- Make: $15-30/month (Core plan)
- Notion: $10/month (Personal Pro)
- Airtable: $20/month (Plus plan)
- Resend: $20/month (up to 50k emails)
- **Total: ~$95-130/month**

---

**Last Updated:** 2025-01-XX  
**Next Review:** Quarterly
