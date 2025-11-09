# Dead Code Removal Plan

Generated: $(date)
Tools: ts-prune, knip, depcheck, eslint

## Summary

This document identifies unused code, dead files, and structural issues found through automated analysis.

## Analysis Methodology

1. **ts-prune**: Identifies unused exports
2. **knip**: Finds unused files, dependencies, and exports
3. **depcheck**: Detects unused dependencies
4. **ESLint**: Flags unused imports and variables

## Dead Code Candidates

### High Confidence (Multi-Signal Proof)

| File/Module | Proof | Action | Risk | Notes |
|------------|-------|--------|------|-------|
| `app/layout.tsx.bak.20251105_051442` | File exists, backup pattern | ✅ Deleted | Low | Backup file, not imported |
| `lib/env-validation.ts:validateEnvOnStartup` | ts-prune (no "(used in module)") | Remove export | Medium | May be called dynamically |
| `lib/env-validation.ts:validateApiEnv` | ts-prune (no "(used in module)") | Remove export | Medium | May be called dynamically |
| `ops/notify.ts:sendAlert` | ts-prune (no "(used in module)") | Remove export | Low | Internal function |
| `ops/notify.ts:shouldAlert` | ts-prune (no "(used in module)") | Remove export | Low | Internal function |
| `ops/notify.ts:createReliabilityAlert` | ts-prune (no "(used in module)") | Remove export | Low | Internal function |
| `ops/notify.ts:createSecurityAlert` | ts-prune (no "(used in module)") | Remove export | Low | Internal function |
| `ops/notify.ts:createCostAlert` | ts-prune (no "(used in module)") | Remove export | Low | Internal function |
| `scripts/security-self-check.ts:runSecurityCheck` | ts-prune (no "(used in module)") | Remove export | Low | CLI entry point, check usage |
| `guardian/explainer.ts:guardianGPT` | ts-prune (no "(used in module)") | Remove export | Low | May be used dynamically |

### Medium Confidence (Single Signal)

| File/Module | Proof | Action | Risk | Notes |
|------------|-------|--------|------|-------|
| `lib/gamification/email.ts:sendChallengeNotificationEmail` | ts-prune | Quarantine | Medium | May be called via string |
| `lib/gamification/email.ts:sendMilestoneEmail` | ts-prune | Quarantine | Medium | May be called via string |
| `lib/gamification/email.ts:checkAndSendStreakReminders` | ts-prune | Quarantine | Medium | May be scheduled |
| `lib/gamification/utils.ts:updateStreak` | ts-prune | Quarantine | Medium | May be called dynamically |
| `lib/gamification/utils.ts:processReferral` | ts-prune | Quarantine | Medium | May be called dynamically |
| `lib/monetization/affiliate.ts:generateAffiliateLink` | ts-prune | Quarantine | Medium | May be used in API routes |
| `lib/monetization/affiliate.ts:calculateAffiliateRevenue` | ts-prune | Quarantine | Medium | May be used in API routes |
| `lib/monetization/feature-flags.ts:getEnabledFeatures` | ts-prune | Quarantine | Medium | May be used in API routes |
| `lib/monetization/feature-flags.ts:estimateRevenuePotential` | ts-prune | Quarantine | Medium | May be used in API routes |
| `lib/security/api-security.ts:sanitizeHTML` | ts-prune | Quarantine | Medium | May be used in middleware |
| `lib/security/api-security.ts:detectSQLInjection` | ts-prune | Quarantine | Medium | May be used in middleware |
| `lib/security/api-security.ts:detectXSS` | ts-prune | Quarantine | Medium | May be used in middleware |
| `lib/security/api-security.ts:validateRequestBody` | ts-prune | Quarantine | Medium | May be used in middleware |
| `lib/security/api-security.ts:generateRateLimitKey` | ts-prune | Quarantine | Medium | May be used in middleware |
| `lib/security/api-security.ts:validateAPIKey` | ts-prune | Quarantine | Medium | May be used in middleware |
| `lib/security/api-security.ts:securityHeaders` | ts-prune | Quarantine | Medium | May be used in middleware |
| `lib/offline/sync.ts:syncUp` | ts-prune | Quarantine | Medium | May be called dynamically |
| `lib/offline/sync.ts:syncDown` | ts-prune | Quarantine | Medium | May be called dynamically |
| `ops/growth/engine.ts:generateGrowthReport` | ts-prune | Quarantine | Medium | May be scheduled |
| `ops/growth/engine.ts:trackUTM` | ts-prune | Quarantine | Medium | May be used in API routes |
| `ops/i18n/utils.ts:i18n` | ts-prune | Quarantine | Medium | May be used dynamically |
| `ops/incident/quiet-mode.ts:setQuietMode` | ts-prune | Quarantine | Medium | May be used in API routes |
| `ops/incident/quiet-mode.ts:isQuietMode` | ts-prune | Quarantine | Medium | May be used in API routes |
| `ops/incident/quiet-mode.ts:shouldDegradeFeature` | ts-prune | Quarantine | Medium | May be used in API routes |
| `ops/incident/quiet-mode.ts:getBannerMessage` | ts-prune | Quarantine | Medium | May be used in API routes |
| `ops/observability/index.ts:costCounter` | ts-prune | Quarantine | Medium | May be used dynamically |
| `ops/partners/contracts.ts:validateContractPayload` | ts-prune | Quarantine | Medium | May be used in API routes |
| `ops/partners/contracts.ts:partnerContracts` | ts-prune | Quarantine | Medium | May be used in API routes |
| `ops/store/manifests.ts:generateAppStoreManifest` | ts-prune | Quarantine | Medium | May be used in API routes |
| `ops/store/manifests.ts:generateGooglePlayManifest` | ts-prune | Quarantine | Quarantine | May be used in API routes |
| `ops/store/manifests.ts:generatePrivacyLabels` | ts-prune | Quarantine | Medium | May be used in API routes |
| `ops/utils/env.ts:requireEnv` | ts-prune | Quarantine | Medium | May be used dynamically |
| `ops/utils/env.ts:requireEnvWithDefault` | ts-prune | Quarantine | Medium | May be used dynamically |
| `ops/utils/env.ts:validateEnv` | ts-prune | Quarantine | Medium | May be used dynamically |

### False Positives (Used but flagged)

These exports are marked as "(used in module)" by ts-prune but appear in the report. They are **KEEP**:

- All Next.js page exports (`default`, `metadata`, `generateMetadata`, `generateStaticParams`)
- All config file exports (`default` from `next.config.ts`, `tailwind.config.ts`, `vite.config.ts`)
- All middleware exports (`middleware`, `config`)
- Type exports used within the same module
- Component exports used in Next.js app router

## Dependency Issues

From depcheck analysis:

### Missing Dependencies (Used but not declared)

- `@octokit/rest` - Used in watchers and AI modules
- `@tanstack/react-query` - Used in `src/App.tsx`
- `react-router-dom` - Used in multiple src files
- `i18next`, `react-i18next`, `i18next-browser-languagedetector` - Used in `src/lib/i18n.ts`
- `recharts` - Used in chart components
- Multiple `@radix-ui/*` packages - Used in UI components
- `openai` - Used in scripts
- `@prisma/client` - Used in ops modules
- `ioredis` - Used in cache
- `idb-keyval` - Used in offline DB

### Unused DevDependencies

- `@axe-core/playwright` - May be used in tests
- `autoprefixer` - Used by PostCSS
- `axe-playwright` - May be used in tests
- `depcheck`, `knip`, `ts-prune`, `eslint-plugin-unused-imports` - Just added, keep

## Structural Issues

### Duplicate Components

- `components/ui/badge.tsx` vs `src/components/ui/badge.tsx` - Need to consolidate
- `hooks/use-toast.ts` vs `src/hooks/use-toast.ts` - Need to consolidate
- Multiple toast implementations - Consolidate to single source

### File Organization

- `src/` directory has duplicate structure with root-level `components/`, `lib/`, `hooks/`
- Consider consolidating to single structure or clearly documenting purpose

### Backup Files

- `app/layout.tsx.bak.20251105_051442` - Should be deleted

## Action Plan

### Wave 1: Safe Deletions (Low Risk)

1. ✅ Delete backup file: `app/layout.tsx.bak.20251105_051442` - **COMPLETED**
2. Remove unused exports from `ops/notify.ts` (if confirmed unused)
3. Remove unused export from `guardian/explainer.ts:guardianGPT` (if confirmed unused)

### Wave 2: Quarantine & Review (Medium Risk)

1. Review all "Quarantine" items with team
2. Check dynamic usage patterns (string-based imports, API routes, middleware)
3. Add explicit exports if needed or remove if confirmed unused

### Wave 3: Dependency Cleanup

1. Add missing dependencies to `package.json`
2. Review unused devDependencies
3. Update import statements to use correct paths

### Wave 4: Structural Consolidation

1. Consolidate duplicate components/hooks
2. Document folder structure conventions
3. Update import paths to use consolidated locations

## Notes

- Many exports flagged by ts-prune are actually used in Next.js app router or via dynamic imports
- Always verify with `grep` or IDE search before deletion
- Test build and runtime after each wave
- Keep PRs small (≤30 files per wave)
