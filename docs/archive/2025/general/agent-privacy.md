> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Agent Layer — Privacy & Explainability

- Consent: signals collection requires explicit opt-in (functional/analytics).
- Scope: only in-app behavioral metadata; no keylogging or cross-app surveillance.
- Storage: PII tied to auth.user id; user-only RLS. Deletion via DSR endpoint.
- Explainability: each suggestion includes key signals used ("Why" line).
- Opt-out: switch off in settings; stop data flow; clear local caches.
