# Full-Stack Guardian Setup Guide

## Overview

The Full-Stack Guardian is an autonomous agent that continuously monitors and maintains the health of the entire repository across five integrated domains:

1. **Environment & Secret Drift Elimination**
2. **Supabase Schema & Migration Sentinel**
3. **Vercel Deployment Forensics**
4. **Repo Integrity & Code Health**
5. **AI-Agent Mesh Orchestrator**

## Quick Start

### Run Full Audit

```bash
pnpm run guardian:audit
```

This will:
- Audit all five domains
- Generate a comprehensive report
- Save report to `reports/guardian/audit-{timestamp}.md`
- Exit with error code if critical issues found

### View Latest Report

```bash
cat reports/guardian/audit-*.md | tail -1
```

## Guardian Scripts

### Available Commands

```bash
# Run full audit across all domains
pnpm run guardian:audit
pnpm run guardian:full-audit

# Legacy guardian commands (if available)
pnpm run guardian:verify
pnpm run guardian:status
pnpm run guardian:report
```

## What Gets Audited

### 1. Environment & Secret Drift

**Checks:**
- ✅ `.env.example` completeness
- ✅ Required Supabase variables documented
- ✅ Vercel/GitHub secrets mapping
- ✅ Integration variables (TikTok, Meta, etc.)
- ✅ Consistency between server/client variables

**Output:**
- List of missing variables
- Recommendations for documentation
- Inconsistency warnings

### 2. Supabase Schema & Migration

**Checks:**
- ✅ Migration files exist and are properly named
- ✅ Prisma schema alignment
- ✅ Safe migration patterns (`if not exists`)
- ✅ RLS policies presence

**Output:**
- Migration naming issues
- Schema alignment recommendations
- Missing migrations warnings

### 3. Vercel Deployment

**Checks:**
- ✅ `vercel.json` configuration
- ✅ `next.config.ts` settings
- ✅ Build command correctness
- ✅ Security headers configuration
- ✅ Image domain configuration

**Output:**
- Configuration issues
- Optimization recommendations
- Deployment readiness status

### 4. Repo Integrity

**Checks:**
- ✅ Required documentation files
- ✅ Package.json scripts completeness
- ✅ Code quality tool configuration
- ✅ Project structure consistency

**Output:**
- Missing documentation
- Script recommendations
- Code quality status

### 5. AI-Agent Mesh

**Checks:**
- ✅ Zapier automation specs
- ✅ Webhook handlers implementation
- ✅ ETL API routes existence
- ✅ Integration documentation

**Output:**
- Missing integration routes
- Webhook handler status
- Integration completeness

## Report Format

Reports are generated in Markdown format with:

- **Executive Summary:** Overall health status
- **Domain Audits:** Detailed findings per domain
- **Issues:** Categorized by severity (critical/warning/info)
- **Recommendations:** Actionable improvement suggestions
- **Next Steps:** Prioritized action items

## Integration with CI/CD

### GitHub Actions

Add to your workflow:

```yaml
- name: Run Guardian Audit
  run: pnpm run guardian:audit
  continue-on-error: true  # Don't fail build on warnings
```

### Pre-commit Hook

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
pnpm run guardian:audit || echo "Guardian audit found issues - review report"
```

## Continuous Monitoring

### Scheduled Audits

Set up a cron job or scheduled GitHub Action to run audits regularly:

```yaml
# .github/workflows/guardian-audit.yml
name: Guardian Audit
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm run guardian:audit
      - uses: actions/upload-artifact@v3
        with:
          name: guardian-report
          path: reports/guardian/*.md
```

## Customization

### Adding Custom Checks

Edit `scripts/guardian/full-stack-audit.ts` to add domain-specific checks:

```typescript
async function auditCustomDomain(): Promise<AuditResult> {
  const issues: Issue[] = [];
  // Your custom checks here
  return {
    domain: 'Custom Domain',
    status: 'healthy',
    issues,
    recommendations: [],
  };
}
```

### Modifying Severity Levels

Adjust severity thresholds in the audit functions:

```typescript
status: issues.some((i) => i.severity === 'critical') ? 'critical' : 
        issues.some((i) => i.severity === 'warning') ? 'warning' : 'healthy',
```

## Troubleshooting

### Audit Script Fails

1. **Check Dependencies:**
   ```bash
   pnpm install
   ```

2. **Verify TypeScript:**
   ```bash
   pnpm run typecheck
   ```

3. **Check File Permissions:**
   ```bash
   ls -la scripts/guardian/
   ```

### Report Not Generated

1. **Check Reports Directory:**
   ```bash
   mkdir -p reports/guardian
   ```

2. **Verify Write Permissions:**
   ```bash
   touch reports/guardian/test.md && rm reports/guardian/test.md
   ```

### False Positives

If the audit reports issues that aren't actually problems:

1. Review the issue details in the report
2. Adjust the audit logic in `full-stack-audit.ts`
3. Add exceptions for known acceptable patterns

## Best Practices

### Regular Audits

- Run audits before major releases
- Run audits after environment changes
- Run audits weekly in CI/CD

### Action on Findings

1. **Critical Issues:** Fix immediately
2. **Warnings:** Address in next sprint
3. **Info/Recommendations:** Plan for future improvements

### Documentation

- Keep audit reports in version control
- Review reports in team meetings
- Track resolution of identified issues

## Support

For issues or questions:

1. Check this documentation
2. Review audit report details
3. Examine `scripts/guardian/full-stack-audit.ts` source
4. Contact platform team

---

**Last Updated:** 2025-01-27  
**Maintained By:** Platform Team
