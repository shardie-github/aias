> Archived on 2025-11-12. Superseded by: (see docs/final index)

# AIAS Platform - Quality Gates

## Overview
This document defines the quality gates and tooling configuration for the AIAS platform to ensure code quality, security, and performance standards.

## TypeScript Configuration

### Strict Mode Settings
- **strict**: true - Enable all strict type checking options
- **noImplicitAny**: true - Disallow implicit any types
- **strictNullChecks**: true - Enable strict null checks
- **noUnusedLocals**: true - Error on unused locals
- **noUnusedParameters**: true - Error on unused parameters
- **exactOptionalPropertyTypes**: true - Disallow undefined in optional properties

### Build Configuration
- **Target**: ES2022 for modern browser support
- **Module Resolution**: bundler for Vite compatibility
- **JSX**: react-jsx for React 17+ transform

## ESLint Configuration

### Core Rules
- **TypeScript**: Recommended rules with strict type checking
- **React**: Recommended rules with hooks support
- **Accessibility**: jsx-a11y rules for WCAG compliance
- **Security**: Script URL and target blank protection

### Performance Rules
- **react/jsx-no-bind**: Warn on inline function creation
- **react/jsx-no-constructed-context-values**: Warn on context value recreation
- **react/no-array-index-key**: Warn on array index as key
- **react/no-unstable-nested-components**: Warn on unstable nested components

### Security Rules
- **react/jsx-no-script-url**: Error on javascript: URLs
- **react/jsx-no-target-blank**: Error on unsafe target="_blank"
- **@typescript-eslint/no-explicit-any**: Warn on explicit any usage

## Prettier Configuration

### Code Formatting
- **Semi**: true - Use semicolons
- **Single Quote**: false - Use double quotes
- **Tab Width**: 2 - 2 spaces for indentation
- **Trailing Comma**: es5 - Trailing commas where valid in ES5
- **Print Width**: 80 - Wrap lines at 80 characters
- **End of Line**: lf - Use LF line endings

### Tailwind Integration
- **Plugin**: prettier-plugin-tailwindcss
- **Class Sorting**: Automatic class ordering

## Quality Gates

### Pre-commit Hooks (Husky)
```bash
# Install dependencies
pnpm install

# Run pre-commit checks
pnpm run lint-staged
```

### Pre-commit Checks
1. **TypeScript**: Type checking with strict mode
2. **ESLint**: Linting with error prevention
3. **Prettier**: Code formatting
4. **Tests**: Unit tests for changed files

### CI/CD Quality Gates

#### Pull Request Checks
```bash
# Type checking
pnpm run typecheck

# Linting
pnpm run lint

# Formatting check
pnpm run format:check

# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Build verification
pnpm run build

# Security audit
pnpm run audit:deps
```

#### Coverage Thresholds
- **Global Coverage**: ≥80%
- **Critical Modules**: ≥90%
- **New Code**: ≥85%

#### Performance Budgets
- **Bundle Size**: ≤1MB total
- **Chunk Size**: ≤250KB per chunk
- **LCP**: ≤2.5s (p75)
- **CLS**: ≤0.1
- **INP**: ≤200ms
- **TTFB**: ≤0.8s

## Package.json Scripts

### Development
```json
{
  "dev": "vite",
  "typecheck": "tsc --noEmit",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "lint:fix": "eslint . --ext ts,tsx --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

### Testing
```json
{
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "a11y": "playwright test --grep @accessibility"
}
```

### Build & Analysis
```json
{
  "build": "vite build",
  "build:analyze": "ANALYZE=true vite build",
  "preview": "vite preview",
  "analyze": "npm run build:analyze"
}
```

### Security & Dependencies
```json
{
  "audit:deps": "npm audit --audit-level moderate",
  "audit:licenses": "license-checker --onlyAllow 'MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC'",
  "audit:security": "npm audit --audit-level high"
}
```

### Performance
```json
{
  "perf:budgets": "lighthouse-ci autorun",
  "perf:analyze": "npm run build:analyze && open dist/stats.html"
}
```

## Editor Configuration

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true
}
```

### EditorConfig
```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

## Dependency Management

### Package Manager
- **Primary**: pnpm (faster, disk efficient)
- **Lockfile**: pnpm-lock.yaml
- **Node Version**: ≥18.17.0

### Dependency Policies
- **Security**: Regular vulnerability scanning
- **Updates**: Automated dependency updates with testing
- **Licenses**: Whitelist approved licenses only
- **Abandoned**: Block abandoned packages

### Audit Commands
```bash
# Security audit
pnpm audit

# License compliance
pnpm run audit:licenses

# Outdated packages
pnpm outdated

# Update dependencies
pnpm update
```

## Code Quality Metrics

### Maintainability
- **Cyclomatic Complexity**: ≤10 per function
- **Function Length**: ≤50 lines
- **File Length**: ≤300 lines
- **Nesting Depth**: ≤4 levels

### Performance
- **Bundle Size**: Monitored in CI
- **Runtime Performance**: Core Web Vitals
- **Build Time**: <2 minutes
- **Test Time**: <5 minutes

### Security
- **Vulnerabilities**: 0 high/critical
- **Dependencies**: All up to date
- **Secrets**: No hardcoded secrets
- **Input Validation**: All inputs validated

## Quality Gate Enforcement

### Pre-commit
- Husky hooks prevent commits with issues
- Lint-staged runs only on changed files
- TypeScript errors block commits

### CI/CD
- All quality gates must pass
- Coverage thresholds enforced
- Performance budgets checked
- Security scans required

### Production
- Quality gates run before deployment
- Rollback on quality gate failure
- Monitoring of production metrics

## Troubleshooting

### Common Issues

#### TypeScript Errors
```bash
# Check TypeScript configuration
pnpm run typecheck

# Fix type errors
# 1. Add proper type annotations
# 2. Use type assertions carefully
# 3. Enable strict mode gradually
```

#### ESLint Errors
```bash
# Fix auto-fixable issues
pnpm run lint:fix

# Check specific rules
pnpm run lint -- --rule "rule-name"
```

#### Prettier Issues
```bash
# Format all files
pnpm run format

# Check formatting
pnpm run format:check
```

#### Test Failures
```bash
# Run tests in watch mode
pnpm run test

# Run specific test
pnpm run test -- --grep "test-name"

# Debug tests
pnpm run test:ui
```

## Continuous Improvement

### Monthly Reviews
- Quality metrics analysis
- Rule effectiveness review
- Performance trend analysis
- Security posture assessment

### Quarterly Updates
- Dependency updates
- Tool version updates
- Rule configuration updates
- Process improvements

### Annual Overhaul
- Complete tooling review
- Architecture quality assessment
- Security framework updates
- Performance optimization review