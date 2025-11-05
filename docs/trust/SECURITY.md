# Security Documentation

**Last Updated:** 2025-01-XX  
**Review Frequency:** Quarterly

## Access Control

### Authentication

- **Method:** Supabase Auth with email/password
- **Password Policy:** Minimum 8 characters, complexity requirements enforced
- **MFA:** Multi-factor authentication available (TOTP via authenticator apps)
- **SSO:** Single Sign-On available for enterprise customers (SAML 2.0, OIDC)

**MFA/SSO Toggles:** Admin controls available at `/admin/settings` (coming soon).

### Authorization

- **Principle:** Least Privilege - users only access data they own
- **Implementation:** Row-Level Security (RLS) policies in Supabase
- **User Data Isolation:** Each user can only access their own data via RLS
- **Admin Access:** Separate admin roles with elevated permissions (audit logged)

### Role-Based Access Control (RBAC)

- **User:** Standard user access to own data
- **Admin:** Elevated access for platform management (TODO: admin UI)
- **Service Account:** Machine-to-machine access for integrations

## Secret Management

### Environment Variables

- **Storage:** Vercel environment variables, Supabase secrets
- **Access:** Limited to authorized personnel and CI/CD systems
- **Rotation:** Regular rotation schedule (see Rotation Policy)

### API Keys

- **Generation:** Cryptographically secure random generation
- **Storage:** Never committed to version control
- **Usage:** Scoped to specific services/functions
- **Revocation:** Immediate revocation capability

### Database Credentials

- **Storage:** Supabase-managed credentials
- **Access:** Service account only, no human access
- **Rotation:** Automated rotation by Supabase

### Rotation Policy

- **Secrets:** Rotated quarterly or after security incidents
- **API Keys:** Rotated annually or on-demand
- **Database Passwords:** Managed by Supabase (automated)

**Script:** `scripts/rotate-secrets.ts` for manual rotation.

## Encryption

### Encryption in Transit

- **Protocol:** TLS 1.3 for all connections
- **Certificate Management:** Automated via Vercel/Supabase
- **HSTS:** HTTP Strict Transport Security enabled
- **Certificate Pinning:** Not currently implemented (consider for mobile apps)

### Encryption at Rest

- **Database:** Supabase-managed encryption (AES-256)
- **Storage:** Supabase storage encryption (AES-256)
- **Backups:** Encrypted backups retained for disaster recovery

### Key Management

- **Database Keys:** Managed by Supabase
- **Application Keys:** Managed via environment variables
- **Backup Keys:** Stored securely, separate from data

## Audit Logging

### User Actions

- **Table:** `public.audit_log`
- **Access:** Personal audit log available at `/account/audit-log`
- **Retention:** 90 days for user actions
- **Fields:** user_id, action, meta (JSONB), timestamp

### System Events

- **Guardian Trust Ledger:** Privacy-relevant events logged
- **Access:** User-only access via RLS
- **Retention:** 90 days

### Admin Actions

- **TODO:** Admin audit log table (future work)
- **Scope:** All admin actions, privilege escalations, data exports

### Log Integrity

- **Hashing:** Cryptographic hashing of log entries
- **Chain:** Hash-chained ledger for integrity verification
- **Verification:** `npm run guardian:verify` to check integrity

## Dependency Management

### Scanning

- **Automated:** Dependency vulnerability scanning in CI (`npm audit`)
- **Frequency:** Every PR, daily cron job
- **Severity:** High and critical vulnerabilities block deployment

### Updates

- **Policy:** Regular updates, security patches prioritized
- **Schedule:** Monthly dependency updates, emergency patches as needed
- **Testing:** All updates tested in staging before production

### Approved Licenses

- **Allowlist:** MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC
- **Check:** `npm run audit:licenses` validates licenses
- **Exceptions:** Documented exceptions for critical dependencies

### Known Vulnerabilities

- **Tracking:** GitHub Security Advisories
- **Response:** Critical vulnerabilities patched within 24 hours
- **Disclosure:** Security advisories published when applicable

## Security Monitoring

### Threat Detection

- **Guardian System:** Privacy monitoring and anomaly detection
- **Log Analysis:** Automated log analysis for suspicious patterns
- **Rate Limiting:** API rate limiting to prevent abuse

### Incident Response

- **Plan:** Security incident response plan documented
- **Team:** Designated security team and on-call rotation
- **Communication:** Status page and email notifications for incidents
- **Escalation:** Defined escalation path for security incidents

### Penetration Testing

- **Frequency:** Annual penetration testing (TODO: schedule)
- **Scope:** Application, API, infrastructure
- **Reports:** Findings documented and remediated

## Compliance

### SOC 2 Type II

- **Status:** Preparation phase
- **Scope:** Security, availability, confidentiality
- **Audit:** (TODO: schedule external audit)

### GDPR

- **Status:** Compliant with GDPR requirements
- **Measures:** Data Subject Rights, DPO, breach notification procedures
- **Documentation:** Privacy policy, data processing agreements

### PIPEDA

- **Status:** Compliant with PIPEDA requirements
- **Measures:** Privacy policy, consent management, access rights

### HIPAA

- **Status:** Not currently HIPAA-compliant
- **Note:** Healthcare data handling requires additional safeguards (if applicable)

## Security Best Practices

### Development

- **Code Review:** All code changes require review
- **Security Linting:** ESLint security plugins enabled
- **SAST:** Static Application Security Testing in CI (TODO: implement)

### Deployment

- **CI/CD:** Automated testing and deployment pipelines
- **Staging:** All changes tested in staging before production
- **Rollback:** Quick rollback capability for security patches

### Operations

- **Least Privilege:** Minimal access granted, regularly reviewed
- **2FA:** Required for all admin accounts
- **Logging:** Comprehensive logging for security events

## Contact

**Security Issues:** security@example.com  
**Vulnerability Reports:** security@example.com  
**PGP Key:** (TODO: publish PGP key for encrypted reports)

**Response Time:** We aim to respond to security reports within 24 hours.

## References

- [Privacy Policy Draft](PRIVACY_POLICY_DRAFT.md)
- [Trust Documentation](TRUST.md)
- [Guardian Overview](../trust-fabric-overview.md)
- [Privacy API Reference](../privacy-api-reference.md)
