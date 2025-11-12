> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Zapier & Make.com Setup Guide

**Purpose:** Step-by-step guide to set up no-code automation workflows using the provided blueprints.

## Quick Start

### Choosing Between Zapier and Make

**Zapier:**
- ✅ Easier to use, more intuitive
- ✅ Better for simple workflows
- ✅ More popular integrations
- ❌ More expensive ($30-50/month)
- ❌ Limited free tier

**Make.com:**
- ✅ More affordable ($15-30/month)
- ✅ More powerful (visual builder)
- ✅ Better for complex workflows
- ❌ Steeper learning curve
- ❌ Fewer integrations

**Recommendation:** Start with Zapier if budget allows, switch to Make if you need more power.

## Setup Process

### Step 1: Create Account

**Zapier:**
1. Go to https://zapier.com
2. Sign up (free trial available)
3. Choose Professional plan ($30/month) for best features

**Make.com:**
1. Go to https://make.com
2. Sign up (free trial available)
3. Choose Core plan ($15/month) for most features

### Step 2: Import Workflows

The workflows are documented in `ops/automation-blueprints/zapier-make-flows.json`. You'll need to recreate them manually in each platform.

## Workflow 1: Form Fill → Notion CRM + Gmail Follow-up

### Zapier Setup

**Trigger:**
1. Click **Create Zap**
2. Choose trigger: **Google Forms** (or Typeform, Webflow, etc.)
3. Event: **New Form Submission**
4. Connect your form account
5. Test trigger with sample submission

**Action 1: Notion**
1. Add action: **Notion**
2. Action: **Create Database Entry**
3. Connect Notion account
4. Select database: **CRM Leads**
5. Map fields:
   - Name → `{{trigger.name}}`
   - Email → `{{trigger.email}}`
   - Company → `{{trigger.company}}`
   - Status → `New`
   - Source → `{{trigger.source}}`
   - Date → `{{trigger.date}}`
6. Test action

**Action 2: Gmail**
1. Add action: **Gmail**
2. Action: **Send Email**
3. To: `{{trigger.email}}`
4. Subject: `Thanks for reaching out!`
5. Body: Use template (see email templates below)
6. Test action

**Action 3: Slack** (Optional)
1. Add action: **Slack**
2. Action: **Send Direct Message**
3. Channel: `#leads`
4. Message: `New lead: {{trigger.name}} from {{trigger.source}}`
5. Test action

**Activate Zap:**
- Click **Turn on Zap**
- Monitor first few runs

### Make.com Setup

**Scenario Setup:**
1. Click **Create a new scenario**
2. Name it: "Form to CRM and Email"

**Module 1: Trigger**
1. Add trigger: **Google Forms** → **Watch Responses**
2. Connect Google account
3. Select form
4. Run scenario to get sample data

**Module 2: Notion**
1. Add module: **Notion** → **Create a Database Entry**
2. Connect Notion account
3. Select database
4. Map fields (same as Zapier above)

**Module 3: Gmail**
1. Add module: **Gmail** → **Send an Email**
2. Map email fields
3. Add email template

**Module 4: Slack** (Optional)
1. Add module: **Slack** → **Send a Direct Message**
2. Configure message

**Activate:**
- Click **Save** → **Run once** to test
- Enable **Schedule** if needed

## Workflow 2: Stripe Sale → Supabase → Google Sheet → Slack

### Prerequisites

- Stripe account with webhook access
- Supabase project with transactions table
- Google Sheet created
- Slack workspace

### Zapier Setup

**Trigger:**
1. Create Zap
2. Trigger: **Stripe** → **Payment Succeeded**
3. Connect Stripe account
4. Test trigger

**Action 1: Supabase**
1. Action: **Supabase** → **Insert Row**
2. Connect Supabase account
3. Table: `transactions`
4. Map fields:
   - `customer_email` → `{{trigger.customer_email}}`
   - `amount_cad` → `{{trigger.amount}}`
   - `currency` → `CAD`
   - `stripe_id` → `{{trigger.payment_intent_id}}`
   - `date` → `{{trigger.created}}`

**Action 2: Google Sheets**
1. Action: **Google Sheets** → **Append Row**
2. Spreadsheet: **Finance Dashboard**
3. Worksheet: **Transactions**
4. Values: Map each column

**Action 3: Slack**
1. Action: **Slack** → **Send Message**
2. Channel: `#revenue`
3. Message: `💰 New sale: ${{trigger.amount_cad}} CAD from {{trigger.customer_email}}`

### Supabase Table Setup

**Create transactions table:**
```sql
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  amount_cad DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'CAD',
  stripe_id TEXT UNIQUE,
  date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Google Sheet Setup

**Create Finance Dashboard Sheet:**
1. Create new Google Sheet
2. Name it: "Finance Dashboard"
3. Create worksheet: "Transactions"
4. Add headers:
   - Date, Transaction ID, Customer Email, Product/Service, Amount (CAD), GST/HST (CAD), Total (CAD), Payment Method, Status, Notes

## Workflow 3: Social Post → Auto-log to Marketing Dashboard

### Setup

**Trigger:**
- **Buffer** → Post Published
- OR **Hootsuite** → Post Published
- OR **Facebook** → Post Published

**Action:**
- **Google Sheets** → Append Row
- **Supabase** → Insert Row (optional)

**Map Fields:**
- Date, Platform, Content, URL, Engagement metrics

## Email Templates

### Welcome Email Template

**Subject:** Thanks for reaching out!

**Body:**
```
Hi {{name}},

Thanks for reaching out to {{company_name}}! We've received your message and will get back to you within 24 hours.

In the meantime, here are some resources you might find helpful:
- [Link to resource 1]
- [Link to resource 2]

If you have any urgent questions, feel free to reply to this email.

Best regards,
{{your_name}}
{{company_name}}
```

### Ticket Acknowledgment Template

**Subject:** Re: {{subject}}

**Body:**
```
Hi {{customer_name}},

Thanks for contacting us. We've received your support ticket and assigned it ticket #{{ticket_number}}.

Our team will review your request and get back to you within {{response_time}}.

We'll keep you updated on the progress.

Best regards,
{{support_team}}
```

## Testing Workflows

### Test Checklist

- [ ] Trigger works (test with sample data)
- [ ] All actions execute successfully
- [ ] Data appears correctly in destinations
- [ ] No errors in execution logs
- [ ] Email sends correctly
- [ ] Notifications work

### Common Issues

**Issue: "Authentication failed"**
- Solution: Reconnect account, check permissions

**Issue: "Field mapping error"**
- Solution: Check field names match exactly, use correct data format

**Issue: "Webhook not receiving data"**
- Solution: Verify webhook URL, check Stripe webhook settings

**Issue: "Rate limit exceeded"**
- Solution: Upgrade plan or reduce workflow frequency

## Cost Estimates

### Zapier
- **Starter:** $20/month (5 Zaps, 750 tasks)
- **Professional:** $30/month (20 Zaps, 2,000 tasks) ← Recommended
- **Team:** $75/month (unlimited Zaps)

### Make.com
- **Free:** $0 (1,000 operations/month)
- **Core:** $15/month (10,000 operations) ← Recommended
- **Pro:** $30/month (40,000 operations)

## Best Practices

1. **Start Simple** - One workflow at a time
2. **Test Thoroughly** - Test each step before activating
3. **Monitor First Runs** - Watch initial executions
4. **Handle Errors** - Set up error notifications
5. **Document** - Keep notes on what each workflow does
6. **Optimize** - Remove unused workflows to save costs

## Maintenance

### Weekly Review
- Check workflow execution logs
- Review error rates
- Optimize workflows
- Remove unused Zaps/scenarios

### Monthly Review
- Calculate automation ROI
- Review costs
- Identify new automation opportunities
- Update workflows as needed

## Next Steps

After setting up workflows:

1. ✅ Test all workflows
2. ✅ Monitor first few runs
3. ✅ Set up error notifications
4. ✅ Document customizations
5. ✅ Optimize based on usage

---

**Last Updated:** 2025-01-XX  
**Need Help?** Check Zapier/Make documentation or support
