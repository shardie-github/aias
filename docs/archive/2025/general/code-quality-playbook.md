> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Code Quality Playbook

This document outlines our code quality standards, tooling, and processes for maintaining a clean, maintainable codebase.

## Purpose

This playbook helps developers:
- Understand what tools we use for code quality
- Know how to triage false positives
- Learn how to quarantine code safely
- Understand deletion policies
- Follow folder conventions and naming rules

## Tools We Run

### 1. TypeScript Compiler (`tsc`)

**Purpose**: Type checking and unused variable detection

**Configuration**: `tsconfig.json`
- `noUnusedLocals: true` - Flags unused local variables
- `noUnusedParameters: true` - Flags unused function parameters

**How to run**:
```bash
pnpm typecheck
```

**Common false positives**:
- Parameters prefixed with `_` are ignored (e.g., `_unusedParam`)
- Variables prefixed with `_` are ignored

### 2. ts-prune

**Purpose**: Finds unused exports across the codebase

**How to run**:
```bash
pnpm prune:exports
```

**Output**: `reports/ts-prune.txt`

**Understanding output**:
- `file.ts:42 - exportName` - Unused export
- `file.ts:42 - exportName (used in module)` - Used within the same file, safe to ignore

**False positives**:
- Next.js page exports (`default`, `metadata`, `generateMetadata`) are used by the framework
- Config file exports are used by build tools
- Middleware exports are used by Next.js
- Dynamic imports may not be detected

### 3. knip

**Purpose**: Finds unused files, dependencies, and exports

**How to run**:
```bash
pnpm scan:usage
```

**Output**: `reports/knip.json`

**What it finds**:
- Unused files
- Unused dependencies
- Unused exports
- Unresolved imports

**False positives**:
- Files imported via string (e.g., `import('./dynamic')`)
- Files used in configuration (e.g., `tailwind.config.ts`)
- Entry points may be flagged as unused

### 4. depcheck

**Purpose**: Finds missing and unused dependencies

**How to run**:
```bash
pnpm audit:deps
```

**Output**: `reports/depcheck.json`

**What it finds**:
- Dependencies used but not declared in `package.json`
- Dependencies declared but never used

**Common issues**:
- Missing peer dependencies
- Dev dependencies used in production code
- Type-only imports may be flagged

### 5. ESLint

**Purpose**: Code quality, unused imports, and best practices

**How to run**:
```bash
pnpm lint
pnpm lint:unused  # Check unused ESLint disable directives
```

**Key rules**:
- `unused-imports/no-unused-imports` - Removes unused imports
- `@typescript-eslint/no-unused-vars` - Flags unused variables
- `import/no-extraneous-dependencies` - Flags dependencies in wrong section

## How to Triage False Positives

### 1. Verify Usage

Before marking as false positive, search the codebase:

```bash
# Search for usage
grep -r "exportName" --include="*.ts" --include="*.tsx"

# Check dynamic imports
grep -r "import.*exportName" --include="*.ts" --include="*.tsx"

# Check string-based imports
grep -r "'exportName'" --include="*.ts" --include="*.tsx"
```

### 2. Check Framework Usage

- **Next.js**: Page exports (`default`, `metadata`) are used by the router
- **React**: Component exports are used via JSX
- **Config files**: Exports are used by build tools

### 3. Check Dynamic Usage

- API routes may use exports via string matching
- Middleware may use exports dynamically
- Scheduled jobs may import files dynamically

### 4. Document False Positives

If confirmed false positive, add a comment:

```typescript
// Used by Next.js app router
export default function Page() { ... }

// Used dynamically in API routes
export function handler() { ... }
```

## Quarantine Process

When code is potentially unused but risky to delete:

### 1. Move to Archive

```bash
mkdir -p archive/$(date +%Y%m%d)
mv suspicious-file.ts archive/$(date +%Y%m%d)/
```

### 2. Add to Quarantine List

Update `reports/dead-code-plan.md` with:
- File path
- Reason for quarantine
- Date quarantined
- Review date (typically 30-90 days)

### 3. Create Issue

Create a GitHub issue with:
- Title: `[Quarantine] Review: file.ts`
- Labels: `code-quality`, `quarantine`
- Description: Why it was quarantined and when to review

### 4. Set Reminder

Set a calendar reminder to review quarantined code after the review period.

## Deletion Policy

### Safe to Delete

✅ **High confidence** (delete immediately):
- Backup files (`.bak`, `.old`, `.backup`)
- Files with 0 test coverage and no imports
- Unused exports confirmed by multiple tools
- Duplicate files (after consolidation)

### Requires Review

⚠️ **Medium confidence** (review before deletion):
- Exports flagged by one tool only
- Files used in tests but not production
- Files imported dynamically
- API route handlers

### Never Delete

❌ **Never delete** without explicit approval:
- Public API exports (entry points)
- Files referenced in documentation
- Migration files
- Configuration files
- Type definitions used by external packages

### Deletion Process

1. **Create PR** with title: `refactor: dead code removal (wave N)`
2. **Add evidence**:
   - Links to tool outputs
   - Bundle size reduction (if applicable)
   - Test results showing no breakage
3. **Label PR**: `auto/perf`, `auto/maint`
4. **Keep PRs small**: ≤30 files per wave
5. **Run tests**: Ensure all tests pass
6. **Verify build**: Ensure production build succeeds

## Folder Conventions

### Structure

```
/
├── app/              # Next.js app router pages
├── components/       # Shared React components
├── lib/              # Utility functions and helpers
├── hooks/            # React hooks
├── src/              # Additional source files (legacy)
├── scripts/          # Build and utility scripts
├── ops/              # Operations and infrastructure code
├── ai/               # AI agent code
├── guardian/         # Guardian security code
├── packages/         # Monorepo packages
└── tests/            # Test files
```

### Naming Rules

- **Files**: kebab-case (e.g., `user-profile.tsx`)
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Utils**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL.ts`)

### Path Aliases

Use `@/*` for imports from root:

```typescript
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
```

**Configuration**: `tsconfig.json`
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Barrel Files (index.ts)

### Do

✅ **Use barrel files** for:
- Public API exports
- Component libraries
- Utility modules

Example:
```typescript
// lib/utils/index.ts
export { formatDate } from './date';
export { formatCurrency } from './currency';
export { validateEmail } from './validation';
```

### Don't

❌ **Avoid barrel files** for:
- Internal modules (use direct imports)
- Large modules (causes bundle bloat)
- Wildcard re-exports (`export * from './module'`)

## Test Placement

### Option 1: Co-located (Recommended)

Place test files next to source files:

```
lib/
├── utils.ts
└── utils.test.ts
```

### Option 2: Separate Directory

Place all tests in `tests/`:

```
lib/
└── utils.ts

tests/
└── utils.test.ts
```

**Current convention**: Co-located tests preferred, but `tests/` directory exists for E2E tests.

## Import Organization

### Order

1. External dependencies
2. Internal modules (`@/...`)
3. Relative imports (`./`, `../`)
4. Type-only imports (`import type ...`)

### ESLint Rule

```json
{
  "import/order": ["warn", {
    "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
    "newlines-between": "always",
    "alphabetize": { "order": "asc" }
  }]
}
```

## CI Integration

Code hygiene checks run automatically:

- **On PR**: Full hygiene check with PR comment
- **On main push**: Full hygiene check
- **Weekly**: Scheduled run on Mondays

**Workflow**: `.github/workflows/code-hygiene.yml`

**Reports**: Available as workflow artifacts for 30 days

## Running Hygiene Checks Locally

### Full Check

```bash
pnpm hygiene
```

This runs:
1. Type checking
2. Linting
3. ts-prune
4. knip
5. depcheck

### Individual Checks

```bash
pnpm typecheck      # TypeScript
pnpm lint           # ESLint
pnpm prune:exports  # ts-prune
pnpm scan:usage     # knip
pnpm audit:deps     # depcheck
```

## Best Practices

### 1. Regular Cleanup

- Run hygiene checks before PRs
- Address issues in the same PR that introduces them
- Review quarantined code quarterly

### 2. Prevent Regressions

- Enable pre-commit hooks (lint-staged)
- Run CI checks locally before pushing
- Review PR comments from hygiene bot

### 3. Documentation

- Document why code exists if it looks unused
- Add comments for dynamic usage patterns
- Update this playbook when adding new tools

### 4. Team Communication

- Discuss large deletions in team meetings
- Share findings from hygiene reports
- Review false positives together

## Getting Help

- **Questions**: Ask in #engineering Slack channel
- **False Positives**: Add to `reports/dead-code-plan.md`
- **Tool Issues**: Create GitHub issue with `code-quality` label
- **Process Improvements**: Propose changes via PR

## References

- [ts-prune Documentation](https://github.com/nadeesha/ts-prune)
- [knip Documentation](https://knip.dev)
- [depcheck Documentation](https://github.com/depcheck/depcheck)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)
