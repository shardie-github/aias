> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Trust Layer Inventory

**Generated:** 2025-01-XX  
**Scope:** Stakeholder perspectives, trust signals, UX/ops gaps

## File Inventory

### Existing Trust-Related Files
- `docs/trust-fabric-overview.md` - Guardian system documentation
- `docs/privacy-api-reference.md` - Privacy API docs
- `docs/how-guardian-learns.md` - Adaptive learning docs
- `docs/agent-privacy.md` - Agent privacy considerations
- `AI_COMPLIANCE.md` - Compliance overview
- `guardian/` - Core Guardian implementation (core.ts, middleware.ts, inspector.ts, recommendations.ts, explainer.ts)
- `supabase/migrations/20250121000000_guardian_trust_ledger.sql` - Trust ledger table

### Feature Flags
- `config/flags.agent.json` - Agent feature flags
- `config/flags.gamify.json` - Gamification flags
- `config/flags.trust.json` - **NEW** Trust layer flags

### Routes & Pages
- `/app/` - Next.js App Router pages
- `/app/billing/` - Billing pages
- `/app/api/` - API routes (agent, ingest, stripe)

### Components
- `components/layout/footer.tsx` - Main footer (used in layout)
- `components/layout/header.tsx` - Header component
- `app/layout.tsx` - Root layout with skip link

### CI/CD
- `.github/workflows/deploy-main.yml` - Production deployment
- `.github/workflows/ci.yml` - CI pipeline
- `.github/workflows/security.yml` - Security checks

### Database Migrations
- `supabase/migrations/` - 11 existing migrations
- Latest: `20250121000000_guardian_trust_ledger.sql`

## Routes Inventory

### Existing Routes
- `/` - Home page
- `/billing` - Billing page
- `/challenges` - Challenges page
- `/community` - Community page
- `/journal` - Journal page
- `/leaderboard` - Leaderboard page
- `/play` - Play page
- `/offline` - Offline page

### API Routes
- `/api/agent/suggest` - Agent suggestions
- `/api/ingest` - Event ingestion
- `/api/stripe/create-checkout` - Stripe checkout
- `/api/stripe/webhook` - Stripe webhook

## Accessibility Features

### Existing
- Skip-to-content link in `app/layout.tsx` (line 37)
- Focus styles defined in `app/globals.css`
- Reduced motion preference CSS (`@media (prefers-reduced-motion: reduce)`)
- Skip link styles with focus state

### Missing
- Language attribute toggle (i18n)
- RTL support
- ARIA labels audit
- Keyboard navigation testing

## Security Features

### Existing
- RLS policies (Guardian trust ledger)
- Supabase auth integration
- Environment variable management
- Guardian privacy monitoring

### Missing
- Audit log table for user actions
- Admin controls UI
- SSO/MFA toggle UI
- Data export/portability endpoint

## Compliance Artifacts

### Existing
- `AI_COMPLIANCE.md` - High-level compliance overview
- Guardian trust ledger for audit trail
- Privacy API reference

### Missing
- Privacy Policy document (GDPR/PIPEDA aligned)
- Security documentation
- Status page and incident communication
- SLO/SLA documentation
- Data retention disclosure
- Data Subject Rights (DSR) request flow

## Documentation Gaps

### Missing Docs
- `/docs/trust/TRUST.md` - Product promises and trust signals
- `/docs/trust/PRIVACY_POLICY_DRAFT.md` - Privacy policy
- `/docs/trust/SECURITY.md` - Security posture
- `/docs/trust/STATUS.md` - Status and incident communication
- `/docs/trust/A11Y_REPORT_TEMPLATE.md` - Accessibility report template
- `/docs/trust/I18N_READINESS.md` - Internationalization readiness
- `/docs/trust/SLO_SLA.md` - SLO/SLA documentation

## UI Components Gaps

### Missing Pages
- `/app/trust/page.tsx` - Trust center hub
- `/app/privacy/page.tsx` - Privacy policy page
- `/app/status/page.tsx` - Status page
- `/app/help/page.tsx` - Help center
- `/app/account/audit-log/page.tsx` - Personal audit log viewer

### Missing API Endpoints
- `/app/api/audit/me/route.ts` - Personal audit log API
- `/app/api/feedback/route.ts` - Feedback submission API

## Configuration Gaps

### Missing Feature Flags
- `config/flags.trust.json` - Trust layer flags

## CI/CD Gaps

### Missing Checks
- Trust artifacts smoke test
- Trust page existence check
- Documentation completeness check

## Summary

**Total Files Scanned:** ~50 files  
**Existing Trust Features:** Guardian system, trust ledger, privacy API  
**Gaps Identified:** 12 documentation files, 5 UI pages, 2 API endpoints, 1 migration, CI checks
