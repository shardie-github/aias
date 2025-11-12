> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Content Seeding Checklist

**Purpose:** Systematic approach to distributing content across platforms to maximize reach, engagement, and organic growth.

## Overview

Content seeding is the practice of strategically placing and promoting content across multiple channels to increase visibility and engagement. This checklist ensures nothing is missed.

## Pre-Publishing Checklist

### Content Preparation

- [ ] Content is finalized and edited
- [ ] SEO keywords identified and integrated
- [ ] Headlines written (3-5 variations)
- [ ] Meta descriptions written
- [ ] Featured image created (1200x630px for social)
- [ ] Additional images created (for carousel posts)
- [ ] Alt text written for all images
- [ ] Call-to-action (CTA) defined
- [ ] Links prepared (UTM parameters added)

### UTM Parameter Setup

**Format:**
```
https://yourdomain.com/article?utm_source={{platform}}&utm_medium={{medium}}&utm_campaign={{campaign_name}}&utm_content={{content_type}}
```

**Example:**
```
https://yourdomain.com/blog-post?utm_source=linkedin&utm_medium=social&utm_campaign=content_seeding&utm_content=article
```

## Publishing Checklist

### Primary Platform (Your Blog/Website)

- [ ] Post published on website/blog
- [ ] SEO metadata added
- [ ] Featured image set
- [ ] Categories/tags assigned
- [ ] Internal links added
- [ ] External links added (where relevant)
- [ ] CTA added at end of post
- [ ] Social sharing buttons enabled
- [ ] Comments enabled (if applicable)
- [ ] Sitemap updated

### Social Media Platforms

#### LinkedIn

- [ ] Post published with link to article
- [ ] Compelling headline used
- [ ] Image included
- [ ] Hashtags added (3-5 relevant)
- [ ] Tag relevant people/companies (if appropriate)
- [ ] Post in relevant LinkedIn groups (2-3 groups)
- [ ] Comment on your own post (pin if possible)
- [ ] Share to personal profile (if separate from company)

#### Twitter/X

- [ ] Initial tweet with link
- [ ] Image included
- [ ] Hashtags added (2-3 relevant)
- [ ] Thread version created (if applicable)
- [ ] Retweet from company account
- [ ] Engage with replies
- [ ] Quote tweet relevant industry posts

#### Facebook

- [ ] Post to company page
- [ ] Image included
- [ ] Link preview optimized
- [ ] Hashtags added (sparingly)
- [ ] Share to relevant Facebook groups (if allowed)
- [ ] Pin post (if important)

#### Instagram

- [ ] Post image carousel with link in bio
- [ ] Caption with compelling hook
- [ ] Hashtags added (10-20 relevant)
- [ ] Stories created with swipe-up/link sticker
- [ ] IGTV/Reels version (if applicable)
- [ ] Tag relevant accounts (if appropriate)

#### Reddit

- [ ] Find relevant subreddits (3-5)
- [ ] Read subreddit rules
- [ ] Post in appropriate format (text post with link, not direct link)
- [ ] Add value in post text (not just link drop)
- [ ] Engage with comments
- [ ] Don't spam - space out posts

#### Hacker News / Indie Hackers

- [ ] Post if relevant to tech/startup audience
- [ ] Use "Show HN" format if showcasing product
- [ ] Engage with comments
- [ ] Provide value, not just self-promotion

### Content Communities

#### Medium

- [ ] Republish article (if allowed by canonical tag)
- [ ] Add to relevant publications
- [ ] Engage with responses
- [ ] Follow up with readers

#### Dev.to

- [ ] Post if technical content
- [ ] Use appropriate tags
- [ ] Engage with community
- [ ] Cross-link to your site

#### Product Hunt

- [ ] Post if product-related
- [ ] Follow Product Hunt guidelines
- [ ] Prepare for launch day
- [ ] Engage with hunters

### Email Distribution

- [ ] Newsletter sent to email list
- [ ] Subject line A/B tested (if list large enough)
- [ ] Preview text optimized
- [ ] Personalization added (if applicable)
- [ ] CTA button included
- [ ] Mobile-friendly layout

### Direct Outreach

- [ ] Email to relevant contacts
- [ ] Slack/Discord communities (if allowed)
- [ ] Direct messages to interested parties
- [ ] Share with team for amplification

## Post-Publishing Checklist

### Immediate (First 24 Hours)

- [ ] Monitor comments and respond
- [ ] Engage with shares
- [ ] Thank people who share
- [ ] Track initial metrics
- [ ] Fix any issues reported

### Short-term (First Week)

- [ ] Continue engaging with comments
- [ ] Share in additional groups/communities
- [ ] Create follow-up content
- [ ] Analyze performance metrics
- [ ] Optimize based on feedback

### Long-term (Ongoing)

- [ ] Repost periodically (not too frequently)
- [ ] Link from new content
- [ ] Include in email sequences
- [ ] Reference in other content
- [ ] Update if content becomes outdated

## Automation Setup

### Social Media Scheduling

**Tools:**
- Buffer ($6/month) - Simple scheduling
- Hootsuite ($99/month) - Comprehensive
- Later ($25/month) - Visual calendar

**Automation:**
- Schedule posts across platforms
- Auto-post from RSS feed (if blog)
- Recurring posts for evergreen content

### Cross-Posting Automation

**Via Zapier/Make:**
```json
{
  "trigger": "New blog post published",
  "actions": [
    {
      "service": "Buffer",
      "action": "Schedule Post",
      "platforms": ["LinkedIn", "Twitter", "Facebook"],
      "content": "{{post.title}} - {{post.url}}"
    },
    {
      "service": "Email",
      "action": "Send Newsletter",
      "subject": "{{post.title}}",
      "body": "{{post.excerpt}}"
    }
  ]
}
```

## Metrics to Track

### Engagement Metrics

- Views/impressions
- Likes/reactions
- Comments
- Shares/retweets
- Saves/bookmarks
- Click-through rate

### Conversion Metrics

- Website visits
- Sign-ups
- Email subscriptions
- Product trials
- Sales

### Platform-Specific

- LinkedIn: Impressions, engagement rate, clicks
- Twitter: Impressions, engagements, link clicks
- Instagram: Reach, impressions, profile visits
- Facebook: Reach, engagement, link clicks

## Content Repurposing

### One Piece → Multiple Formats

**Original:** Blog post

**Repurpose Into:**
- [ ] LinkedIn article
- [ ] Twitter thread
- [ ] Instagram carousel
- [ ] YouTube video script
- [ ] Podcast episode
- [ ] Email newsletter
- [ ] Infographic
- [ ] Slide deck
- [ ] Quote graphics

## Best Practices

1. **Quality Over Quantity** - Better to seed fewer, high-quality pieces than many low-quality ones
2. **Be Authentic** - Don't spam, add value to communities
3. **Engage Genuinely** - Respond to comments, build relationships
4. **Track Everything** - Use UTM parameters, measure what works
5. **Respect Platforms** - Follow each platform's rules and culture
6. **Be Consistent** - Regular content seeding builds audience
7. **Iterate** - Learn what works and double down

## Weekly Content Seeding Routine

### Monday: Planning
- [ ] Review content calendar
- [ ] Prepare content for week
- [ ] Set up scheduling

### Tuesday-Thursday: Publishing
- [ ] Publish primary content
- [ ] Distribute across platforms
- [ ] Engage with audience

### Friday: Analysis
- [ ] Review metrics
- [ ] Identify top performers
- [ ] Plan improvements

## Tools & Resources

**Scheduling:**
- Buffer, Hootsuite, Later

**Analytics:**
- Google Analytics (website)
- Platform native analytics
- Sprout Social ($249/month)

**Content Creation:**
- Canva (images)
- Loom (video)
- Descript (audio/video)

**Distribution:**
- Zapier/Make (automation)
- IFTTT (simple automation)

---

**Last Updated:** 2025-01-XX  
**Next Review:** Monthly
