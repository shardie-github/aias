> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Influencer Outreach Automation

**Purpose:** Streamlined process for identifying, contacting, and collaborating with influencers to grow brand awareness and drive qualified leads.

## Overview

Influencer partnerships can be powerful for growth, but manual outreach doesn't scale. This guide outlines how to automate the process while maintaining authenticity.

## Strategy

### Target Influencer Profiles

**Micro-Influencers (1K-10K followers)**
- Higher engagement rates
- More affordable
- Better for niche audiences
- Easier to establish relationships

**Mid-Tier Influencers (10K-100K followers)**
- Good reach + engagement balance
- More professional approach needed
- Higher cost but better ROI potential

**Macro-Influencers (100K+ followers)**
- Maximum reach
- High cost
- Best for brand awareness campaigns

### Ideal Influencer Criteria

- Audience matches your target market
- Engagement rate > 3%
- Regular posting schedule
- Authentic content style
- Positive brand alignment

## Finding Influencers

### Tools & Platforms

**Free Tools:**
- Instagram search (hashtags, locations)
- Twitter search (keywords, mentions)
- LinkedIn (industry thought leaders)
- YouTube (relevant channels)

**Paid Tools:**
- **Upfluence** ($99/month) - Comprehensive influencer database
- **AspireIQ** ($200/month) - Creator marketplace
- **BuzzStream** ($99/month) - Outreach + relationship management

### Search Strategy

**Keywords to Search:**
- "[Your industry] tips"
- "[Your product category] review"
- "[Your problem] solution"
- "[Your target audience] advice"

**Hashtags:**
- Industry-specific hashtags
- Product-related hashtags
- Community hashtags

**Competitor Analysis:**
- Who's promoting competitors?
- What creators mention competitors?
- Similar audience, different product

## Outreach Templates

### Initial Outreach (Cold Email/DM)

**Template 1: Value-First Approach**
```
Hi {{influencer_name}},

I've been following your content on {{platform}} and love your insights on {{topic}}. Your post about {{specific_post}} really resonated with me.

I'm building {{product_description}} and think it could be valuable for your audience. Would you be open to a quick chat about a potential collaboration?

No pressure - just thought there might be a fit.

Best,
{{your_name}}
```

**Template 2: Product Offer**
```
Hi {{influencer_name}},

Big fan of your content! I noticed you're interested in {{topic}}, and I think you'd find {{product_name}} useful.

I'd love to send you free access to try it out. No strings attached - just genuinely think you'd like it.

If you find it valuable and want to share with your audience, great! If not, no worries at all.

Interested?

Best,
{{your_name}}
```

**Template 3: Partnership Proposal**
```
Hi {{influencer_name}},

I'm reaching out because I think there's a great alignment between your audience and what we're building.

We're {{company_description}}, and we'd love to explore a partnership. Here's what we're thinking:

- {{offer_details}}
- {{compensation_structure}}
- {{expectations}}

Would you be interested in a quick call to discuss?

Best,
{{your_name}}
```

### Follow-up Templates

**First Follow-up (5-7 days):**
```
Hi {{influencer_name}},

Just wanted to follow up on my previous message about {{collaboration_topic}}. I know you're busy, so no worries if it's not a fit right now.

If you'd like to learn more, I'm happy to hop on a quick call or send more details.

Best,
{{your_name}}
```

**Final Follow-up (2 weeks):**
```
Hi {{influencer_name}},

One last follow-up - I know you get a lot of outreach, so I'll leave it here.

If you're ever interested in {{collaboration_topic}}, feel free to reach out anytime.

Best,
{{your_name}}
```

## Automation Setup

### CRM Tracking

**Create Influencer Database (Notion/Airtable):**

**Properties:**
- Name, Handle, Platform, Followers, Engagement Rate, Email, Status, Notes, Last Contacted, Next Follow-up, Offer Made, Response

**Status Values:**
- Researching
- Outreach Sent
- Follow-up Sent
- Interested
- Negotiating
- Active Partnership
- Declined
- Archive

### Outreach Automation

**Via Zapier/Make:**

**Workflow:**
1. Add influencer to CRM
2. Send initial outreach email
3. Schedule follow-up (5 days)
4. Track responses
5. Update status

**Setup:**
```json
{
  "trigger": "New row in Influencer CRM",
  "actions": [
    {
      "service": "Gmail",
      "action": "Send Email",
      "template": "influencer-outreach-template",
      "to": "{{influencer.email}}"
    },
    {
      "service": "Notion",
      "action": "Update Row",
      "status": "Outreach Sent",
      "last_contacted": "{{today}}"
    },
    {
      "service": "Calendar",
      "action": "Create Event",
      "title": "Follow-up: {{influencer.name}}",
      "date": "{{today + 5 days}}"
    }
  ]
}
```

### Response Tracking

**Automated:**
- Monitor email replies
- Update CRM status
- Trigger next action based on response

**Manual:**
- Review responses weekly
- Personalize follow-ups
- Negotiate terms

## Collaboration Types

### 1. Product Review

**Offer:**
- Free product access
- No obligation to post
- Option for affiliate link

**Deliverables:**
- Honest review (positive or negative)
- Share on their platform
- Tag your brand

**Compensation:**
- Free product
- 10-20% affiliate commission
- Additional fee for guaranteed post

### 2. Sponsored Post

**Offer:**
- $X CAD per post
- Product access
- Creative freedom (with guidelines)

**Deliverables:**
- 1-3 posts/stories
- Brand mention + link
- Usage rights for reposting

**Compensation:**
- $50-500 CAD per post (depending on follower count)
- Higher for guaranteed engagement

### 3. Affiliate Partnership

**Offer:**
- Custom affiliate link
- 15-30% commission
- Marketing materials
- Performance bonuses

**Deliverables:**
- Regular mentions/sharing
- Authentic integration
- Trackable conversions

**Compensation:**
- Commission-based
- Bonus for top performers

### 4. Guest Content

**Offer:**
- Co-create content
- Feature on your platform
- Cross-promotion

**Deliverables:**
- Collaborative content piece
- Shared promotion
- Mutual audience exposure

**Compensation:**
- Exposure + backlink
- Optional fee

## Tracking & Measurement

### Metrics to Track

**Reach:**
- Impressions
- Views
- Shares

**Engagement:**
- Likes, comments, saves
- Click-through rate
- Sign-ups from link

**Conversion:**
- Leads generated
- Sales attributed
- Cost per acquisition

**ROI:**
- Revenue from partnership
- Cost of partnership
- ROI calculation

### Tracking Setup

**UTM Parameters:**
- Add UTM tags to all influencer links
- Track in Google Analytics
- Attribute conversions

**Example:**
```
https://yourdomain.com?utm_source=influencer&utm_medium=instagram&utm_campaign={{influencer_name}}
```

**CRM Integration:**
- Track influencer-attributed leads
- Calculate conversion rates
- Measure partnership ROI

## Best Practices

1. **Authenticity First** - Only partner with influencers who align with your brand
2. **Clear Expectations** - Set deliverables and timelines upfront
3. **Fair Compensation** - Pay fairly for their time and audience
4. **Long-term Relationships** - Build ongoing partnerships, not one-offs
5. **Track Everything** - Measure what works and double down
6. **Legal Compliance** - Ensure influencers disclose partnerships

## Legal Considerations

### FTC Requirements

**Disclosure Requirements:**
- Influencers must disclose sponsored content
- Use hashtags: #ad, #sponsored, #partner
- Clear and conspicuous disclosure

### Contract Template

**Include:**
- Deliverables and timeline
- Compensation and payment terms
- Content usage rights
- Disclosure requirements
- Performance expectations
- Termination clauses

## Monthly Workflow

### Week 1: Research & Outreach
- Research 10-20 new influencers
- Add to CRM
- Send initial outreach

### Week 2: Follow-ups
- Follow up with previous outreach
- Review responses
- Schedule calls with interested parties

### Week 3: Negotiations
- Discuss partnership terms
- Send contracts
- Onboard new partners

### Week 4: Analysis & Optimization
- Review partnership performance
- Calculate ROI
- Plan next month's outreach

## Tools & Resources

**Outreach Tools:**
- Lemlist ($59/month) - Email outreach automation
- Reply.io ($70/month) - Cold email campaigns
- Mailshake ($58/month) - Simple email outreach

**Relationship Management:**
- Notion/Airtable CRM
- Google Sheets (free alternative)
- HubSpot CRM (free tier)

**Analytics:**
- Google Analytics (UTM tracking)
- Your CRM (conversion tracking)
- Social media insights

---

**Last Updated:** 2025-01-XX  
**Next Review:** Quarterly
