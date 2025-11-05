# Integrations Documentation

## Overview

This document describes the integrated third-party services and APIs used in Hardonia to enhance trust, UX, FOMO, and overall user experience. All integrations are consent-gated, lazy-loaded, and feature-flagged to protect performance and privacy.

## Scoring System

Each integration is scored using the following weighted criteria:

| Criteria | Weight | Description |
|----------|--------|-------------|
| UX Impact | 5 | How much the integration improves user experience |
| Trust/FOMO | 4 | Ability to build trust and create urgency |
| Dev Effort | -3 | Negative weight (higher dev effort = lower score) |
| Cost Efficiency | 4 | Cost-effectiveness and free tier availability |
| Privacy Fit | 4 | GDPR/PIPEDA compliance and privacy-friendly |

**Minimum Pass Score**: 18

## Enabled Integrations

Based on scoring, the following integrations are currently enabled:

### Analytics & Monitoring

#### Vercel Analytics
- **Score**: 22
- **Status**: ✅ Enabled
- **Consent Key**: `analytics`
- **Cost**: Free (on Vercel)
- **Privacy**: GDPR-friendly, no cookies, privacy-first
- **Package**: `@vercel/analytics`

#### Plausible Analytics
- **Score**: 21
- **Status**: ✅ Enabled
- **Consent Key**: `analytics`
- **Cost**: Free tier: 10k events/month
- **Privacy**: GDPR/PIPEDA compliant, no cookies
- **Package**: `plausible-tracker`

#### Sentry
- **Score**: 21
- **Status**: ✅ Enabled
- **Consent Key**: `functional`
- **Cost**: Free tier: 5k events/month
- **Privacy**: Error tracking only, GDPR-friendly
- **Package**: `@sentry/nextjs`

### Media & Assets

#### Cloudinary
- **Score**: 22
- **Status**: ✅ Enabled
- **Consent Key**: `functional`
- **Cost**: Free tier: 25GB storage
- **Privacy**: CDN/optimization, no tracking
- **Package**: `cloudinary`

### Motion & Animation

#### Lottie
- **Score**: 21
- **Status**: ✅ Enabled
- **Consent Key**: `functional`
- **Cost**: Free
- **Privacy**: Client-side animations, no tracking
- **Package**: `lottie-react`

#### Lenis Smooth Scroll
- **Score**: 20
- **Status**: ✅ Enabled
- **Consent Key**: `functional`
- **Cost**: Free
- **Privacy**: Pure JS, no tracking
- **Package**: `@studio-freight/lenis`

#### Framer Motion
- **Score**: 22
- **Status**: ✅ Enabled
- **Consent Key**: `functional`
- **Cost**: Free
- **Privacy**: Client-side animations, no tracking
- **Package**: `framer-motion`

### Real-Time Features

#### Pusher
- **Score**: 19
- **Status**: ✅ Enabled
- **Consent Key**: `functional`
- **Cost**: Free tier: 200k messages/day
- **Privacy**: GDPR-compliant, SOC 2
- **Package**: `pusher-js`

### Social Proof & Trust

#### Trustpilot
- **Score**: 21
- **Status**: ✅ Enabled
- **Consent Key**: `analytics`
- **Cost**: Free basic plan
- **Privacy**: Requires consent for GDPR
- **Package**: None (widget script)

### Chat & Support

#### Tidio Chat
- **Score**: 20
- **Status**: ✅ Enabled
- **Consent Key**: `marketing`
- **Cost**: Free up to 3 operators
- **Privacy**: Requires consent for GDPR
- **Package**: None (widget script)

## Disabled Integrations

The following integrations scored below the minimum threshold or were not selected:

- PostHog (Score: 20) - Alternative analytics
- Microsoft Clarity (Score: 19) - Session recording
- Uploadcare (Score: 19) - File handling
- Crisp Chat (Score: 19) - Alternative chat
- hCaptcha (Score: 18) - Security
- reCAPTCHA v3 (Score: 17) - Security
- Ably (Score: 18) - Alternative real-time
- Algolia (Score: 19) - Search
- Meilisearch (Score: 18) - Self-hosted search
- Lemon Squeezy (Score: 18) - Billing

## Implementation Details

### Consent Management

All integrations that require user consent are wrapped with `<ConsentGate>` components:

```tsx
<ConsentGate requireKey="analytics">
  <TrustpilotBadge />
</ConsentGate>
```

Consent keys:
- `analytics`: Analytics and tracking services
- `marketing`: Marketing tools (chat, ads)
- `functional`: Essential functionality (error tracking, CDN)

### Lazy Loading

All integration components are lazy-loaded using Next.js `dynamic()`:

```tsx
const LottiePlayer = dynamic(
  () => import("@/components/ui/LottiePlayer").then(m => m.default),
  { ssr: false }
);
```

### Feature Flags

Integration flags are managed in `/config/integrations.json`:

```json
{
  "integrations": {
    "lottie": {
      "enabled": true,
      "name": "Lottie",
      "category": "motion",
      "consentKey": "functional"
    }
  }
}
```

## Performance Targets

The CI pipeline enforces the following performance targets:

- **LCP (Largest Contentful Paint)**: ≤ 2.5s
- **INP (Interaction to Next Paint)**: ≤ 200ms
- **CLS (Cumulative Layout Shift)**: ≤ 0.05
- **Accessibility**: WCAG 2.1 AA compliance (0 critical/serious violations)

## CI/CD Integration

The `integration-audit.yml` workflow runs on every PR:

1. Builds the Next.js application
2. Starts production server
3. Runs Lighthouse CI (mobile focus)
4. Runs Pa11y (axe) accessibility checks
5. Uploads artifacts with results

## Environment Variables

See `.env.example` for all required environment variables. Key variables:

```bash
# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key

# Media
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Real-time
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key

# Social Proof
TRUSTPILOT_BUSINESS_UNIT_ID=your_business_unit_id
```

## Demo Page

Visit `/integrations` to see all enabled integrations in action. The page includes:

- Lottie animations
- Live visitor count (mock)
- Trust badges
- Chat widget indicators

All components respect consent settings and only load when appropriate permissions are granted.

## Privacy Compliance

- **GDPR**: All analytics/tracking require explicit consent
- **PIPEDA**: Canadian privacy law compliance
- **Cookie Policy**: Functional cookies allowed by default; analytics/marketing require consent
- **Data Minimization**: Only necessary data is collected

## Troubleshooting

### Integration not loading

1. Check feature flag in `/config/integrations.json`
2. Verify consent is granted (check browser localStorage: `hardonia-consent`)
3. Check browser console for errors
4. Verify environment variables are set

### Performance issues

1. Check Lighthouse CI results in GitHub Actions artifacts
2. Verify lazy loading is working (check Network tab)
3. Ensure consent gating is preventing unnecessary loads

### Accessibility failures

1. Review Pa11y results in GitHub Actions artifacts
2. Check for missing ARIA labels
3. Verify keyboard navigation works

## Adding New Integrations

To add a new integration:

1. Add entry to `/config/integrations.json` with scoring
2. Create component in `/components/integrations/`
3. Wrap with `<ConsentGate>` if consent required
4. Add lazy loading with `dynamic()`
5. Add to `/app/integrations/page.tsx` demo page
6. Update this documentation
7. Add environment variables to `.env.example`

## References

- [Vercel Analytics Docs](https://vercel.com/docs/analytics)
- [Plausible Privacy](https://plausible.io/privacy)
- [Sentry Docs](https://docs.sentry.io/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Lottie Files](https://lottiefiles.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Pusher Docs](https://pusher.com/docs/)
- [Trustpilot Widget](https://business.trustpilot.com/api-documentation)
- [Tidio Docs](https://www.tidio.com/docs/)