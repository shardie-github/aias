# Trust & Transparency

**Last Updated:** 2025-01-XX  
**Version:** 1.0

## Product Promises

### What We Do

- **Privacy-First Design:** Your data is yours. We use Row-Level Security (RLS) to ensure you can only access your own data.
- **Transparent Operations:** We maintain a trust ledger of all privacy-relevant events, accessible to you.
- **Consent-Based:** We ask for consent before collecting analytics, marketing, or functional data.
- **Secure by Default:** All data is encrypted in transit (TLS) and at rest (Supabase encryption).
- **Accessible:** We strive for WCAG 2.2 AA compliance and support reduced motion preferences.

### What We Don't Do

- **Sell Your Data:** We do not sell, rent, or share your personal data with third parties for marketing purposes.
- **Surveillance:** We do not track you across other websites or use invasive tracking techniques.
- **Hidden Processing:** All AI processing is explainable through our Guardian system.
- **Data Hoarding:** We retain data only as long as necessary for service provision and legal requirements.

## Data Map

### Data Categories

| Category | Purpose | Storage Location | Retention Period | Lawful Basis |
|----------|---------|------------------|------------------|--------------|
| **Account Data** | User authentication, profile | Supabase (PostgreSQL) | Until account deletion | Contract |
| **Usage Data** | Service improvement, analytics | Supabase (PostgreSQL) | 12 months | Legitimate Interest |
| **Content Data** | User-generated content | Supabase (PostgreSQL) | Until deletion request | Consent |
| **Telemetry Data** | Privacy monitoring, Guardian | Local + Supabase | 90 days | Legitimate Interest |
| **Billing Data** | Payment processing | Stripe | 7 years (legal requirement) | Legal Obligation |
| **Support Data** | Customer support tickets | Supabase (PostgreSQL) | 3 years | Contract |

### Data Processors

- **Supabase:** Hosting, database, authentication, storage
- **Vercel:** Application hosting, CDN, edge functions
- **Stripe:** Payment processing
- **Resend:** Email delivery (if enabled)

### International Transfers

Data may be processed in the following regions:
- **United States:** Supabase, Vercel, Stripe
- **EU:** Supabase EU regions (if configured)

We rely on Standard Contractual Clauses (SCCs) and adequacy decisions for transfers.

## Consent Model

### Consent Types

1. **Functional:** Required for core service functionality (cannot be disabled)
2. **Analytics:** Optional, helps us improve the service
3. **Marketing:** Optional, for promotional communications

### Consent Toggles

Access your consent preferences at `/account/preferences` (coming soon).

## Security Posture

### Access Control

- **Authentication:** Supabase Auth with email/password, OAuth providers
- **Authorization:** Row-Level Security (RLS) policies enforce data isolation
- **MFA:** Multi-factor authentication available (TODO: admin toggle)
- **SSO:** Single Sign-On available for enterprise (TODO: admin toggle)

### Encryption

- **In Transit:** TLS 1.3 for all connections
- **At Rest:** Supabase-managed encryption for database and storage
- **Secrets:** Environment variables managed securely, rotated regularly

### Audit Logging

- **User Actions:** Personal audit log available at `/account/audit-log`
- **System Events:** Guardian trust ledger records privacy-relevant events
- **Admin Actions:** (TODO: Admin audit log)

### Dependency Management

- **Scanning:** Automated dependency vulnerability scanning in CI
- **Updates:** Regular dependency updates, security patches prioritized
- **Policy:** See `docs/trust/SECURITY.md` for details

## SLA/SLO Overview

See `docs/trust/SLO_SLA.md` for detailed Service Level Objectives.

**High-Level Commitments:**
- **Availability:** 99.9% uptime target (subject to error budget)
- **Latency:** P95 < 500ms for API endpoints
- **Error Rate:** < 0.1% error rate target

**Incident Communication:** Status updates available at `/status` and `docs/trust/STATUS.md`.

## Data Subject Rights (DSR)

### Your Rights

Under GDPR, PIPEDA, and similar regulations, you have the right to:

1. **Access:** Request a copy of your personal data
2. **Rectification:** Correct inaccurate data
3. **Erasure:** Request deletion of your data
4. **Portability:** Export your data in a machine-readable format
5. **Restriction:** Limit processing of your data
6. **Objection:** Object to certain types of processing

### How to Request

- **Export Data:** Visit `/account/export` (coming soon)
- **Delete Account:** Visit `/account/settings` and request deletion
- **Contact:** Email privacy@example.com for DSR requests

**Response Time:** We aim to respond within 30 days, as required by law.

## Contact

**Privacy Inquiries:** privacy@example.com  
**Security Issues:** security@example.com  
**General Support:** support@example.com

## Updates

This document is reviewed quarterly. Last review: 2025-01-XX.

## Related Documents

- [Privacy Policy Draft](PRIVACY_POLICY_DRAFT.md)
- [Security Documentation](SECURITY.md)
- [Status & Incident Communication](STATUS.md)
- [SLO/SLA Details](SLO_SLA.md)
