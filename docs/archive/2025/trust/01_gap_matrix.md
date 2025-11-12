> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Trust Layer Gap Matrix

**Stakeholder Coverage Assessment**  
**Scoring:** 0 = Missing, 1 = Partial, 2 = Adequate, 3 = Excellent

## Stakeholder × Gap Matrix

| Stakeholder | Gap | Current Score | Target Score | Fix Priority | Artifact |
|-------------|-----|---------------|--------------|--------------|----------|
| **End Users** | Privacy policy visibility | 0 | 3 | HIGH | `/app/privacy/page.tsx` |
| **End Users** | Data export/portability | 0 | 3 | HIGH | `/app/account/export` + API |
| **End Users** | Help center access | 1 | 3 | MEDIUM | `/app/help/page.tsx` |
| **End Users** | Status/uptime visibility | 0 | 3 | MEDIUM | `/app/status/page.tsx` |
| **End Users** | Personal audit log | 0 | 2 | MEDIUM | `/app/account/audit-log/page.tsx` |
| **End Users** | Trust center hub | 0 | 3 | HIGH | `/app/trust/page.tsx` |
| **Customer Support** | Help center content | 1 | 3 | MEDIUM | `/app/help/page.tsx` + content |
| **Customer Support** | In-app feedback loop | 0 | 2 | MEDIUM | `/app/api/feedback/route.ts` |
| **Customer Support** | Diagnostic tools | 1 | 2 | LOW | Existing Guardian tools |
| **Security & Compliance** | Privacy policy document | 0 | 3 | HIGH | `docs/trust/PRIVACY_POLICY_DRAFT.md` |
| **Security & Compliance** | Security documentation | 0 | 3 | HIGH | `docs/trust/SECURITY.md` |
| **Security & Compliance** | Data map/retention disclosure | 0 | 3 | HIGH | `docs/trust/TRUST.md` |
| **Security & Compliance** | SOC2 prep artifacts | 1 | 3 | MEDIUM | Enhanced docs |
| **Security & Compliance** | PIPEDA/GDPR alignment | 1 | 3 | HIGH | Privacy policy draft |
| **Security & Compliance** | DPIA/TRA readiness | 0 | 2 | MEDIUM | Trust docs |
| **Legal & Privacy** | Privacy policy (plain language) | 0 | 3 | HIGH | `docs/trust/PRIVACY_POLICY_DRAFT.md` |
| **Legal & Privacy** | Consent model documentation | 1 | 3 | MEDIUM | Trust docs |
| **Legal & Privacy** | DSR request flow | 0 | 2 | MEDIUM | Export/delete endpoints |
| **Legal & Privacy** | Retention policy disclosure | 0 | 3 | MEDIUM | Trust docs |
| **Legal & Privacy** | International transfers disclosure | 0 | 2 | LOW | Privacy policy |
| **Accessibility** | WCAG 2.2 AA checklist | 1 | 3 | MEDIUM | `docs/trust/A11Y_REPORT_TEMPLATE.md` |
| **Accessibility** | Reduced motion implementation | 2 | 3 | LOW | Already in CSS |
| **Accessibility** | Skip link implementation | 2 | 3 | LOW | Already in layout |
| **Accessibility** | i18n readiness | 0 | 2 | LOW | `docs/trust/I18N_READINESS.md` |
| **Accessibility** | RTL support | 0 | 1 | LOW | I18n docs |
| **Reliability & SRE** | SLO/SLA documentation | 0 | 3 | MEDIUM | `docs/trust/SLO_SLA.md` |
| **Reliability & SRE** | Status page | 0 | 3 | MEDIUM | `/app/status/page.tsx` |
| **Reliability & SRE** | Incident communication channel | 0 | 2 | MEDIUM | Status page + docs |
| **Reliability & SRE** | Error budget tracking | 1 | 2 | LOW | Existing monitoring |
| **Product/UX Research** | Feedback collection | 0 | 2 | MEDIUM | `/app/api/feedback/route.ts` |
| **Product/UX Research** | NPS/CSAT infrastructure | 0 | 1 | LOW | Feedback API |
| **Product/UX Research** | Experiment infrastructure | 1 | 2 | LOW | Existing flags |
| **Partnerships/Integrators** | API documentation | 1 | 3 | MEDIUM | Existing docs |
| **Partnerships/Integrators** | API portal | 0 | 2 | LOW | Future work |
| **Partnerships/Integrators** | Versioning policy | 1 | 2 | LOW | Existing docs |
| **Partnerships/Integrators** | Webhook documentation | 1 | 2 | LOW | Existing docs |
| **Finance/Billing** | Pricing clarity | 1 | 2 | LOW | Existing billing page |
| **Finance/Billing** | Rate limit disclosure | 0 | 2 | LOW | Trust docs |
| **Finance/Billing** | Fair-use guardrails | 1 | 2 | LOW | Existing checks |
| **Admins** | Admin controls UI | 0 | 2 | LOW | Future work |
| **Admins** | Audit log (admin view) | 0 | 2 | LOW | Future work |
| **Admins** | SSO/MFA toggles | 0 | 1 | LOW | Future work |
| **Admins** | Export/import tools | 0 | 1 | LOW | Future work |
| **Localization** | i18n key extraction | 0 | 2 | LOW | `docs/trust/I18N_READINESS.md` |
| **Localization** | Date/time formatting | 1 | 2 | LOW | I18n docs |
| **Localization** | RTL readiness | 0 | 1 | LOW | I18n docs |
| **Governance** | Changelog | 1 | 2 | LOW | Existing CHANGELOG.md |
| **Governance** | Deprecation policy | 0 | 2 | LOW | Future work |
| **Governance** | Model cards for AI | 0 | 2 | LOW | Future work |

## Summary Statistics

- **Total Gaps:** 50
- **Critical (Score 0 → 3):** 10
- **High Priority:** 8
- **Medium Priority:** 15
- **Low Priority:** 17

## Coverage by Stakeholder

| Stakeholder | Current Avg | Target Avg | Gap |
|-------------|-------------|------------|-----|
| End Users | 0.5 | 2.8 | -2.3 |
| Customer Support | 0.7 | 2.3 | -1.6 |
| Security & Compliance | 0.3 | 2.7 | -2.4 |
| Legal & Privacy | 0.2 | 2.4 | -2.2 |
| Accessibility | 1.3 | 2.4 | -1.1 |
| Reliability & SRE | 0.3 | 2.5 | -2.2 |
| Product/UX Research | 0.3 | 1.7 | -1.4 |
| Partnerships/Integrators | 1.0 | 2.3 | -1.3 |
| Finance/Billing | 0.7 | 2.0 | -1.3 |
| Admins | 0.0 | 1.5 | -1.5 |
| Localization | 0.3 | 1.7 | -1.4 |
| Governance | 0.3 | 2.0 | -1.7 |

## Prioritized Fix Plan

### Phase 1: Critical (Must Have)
1. Privacy policy document (Legal, Security)
2. Trust center hub page (End Users)
3. Security documentation (Security)
4. Data map/retention disclosure (Security, Legal)
5. Privacy policy page (End Users)
6. Status page (End Users, SRE)
7. Audit log table + personal viewer (End Users)
8. Feature flags config (Foundation)

### Phase 2: High Priority (Should Have)
9. Help center page (End Users, Support)
10. Feedback API (Support, Research)
11. SLO/SLA documentation (SRE)
12. Export/portability endpoint (Legal, End Users)

### Phase 3: Medium Priority (Nice to Have)
13. Accessibility report template (A11y)
14. i18n readiness doc (Localization)
15. Incident communication enhancement (SRE)
16. Footer trust links (End Users)

### Phase 4: Low Priority (Future)
17. Admin controls UI
18. API portal
19. Model cards
20. Enhanced i18n implementation
