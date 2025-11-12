> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Performance Budgets

## Core Web Vitals

| Metric | Budget | Target |
|--------|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s | < 2.0s |
| CLS (Cumulative Layout Shift) | < 0.1 | < 0.05 |
| TBT (Total Blocking Time) | < 300ms | < 200ms |
| FCP (First Contentful Paint) | < 1.8s | < 1.5s |
| SI (Speed Index) | < 3.4s | < 3.0s |

## Bundle Size

| Resource | Budget | Target |
|----------|--------|--------|
| JavaScript (total) | < 170KB | < 150KB |
| CSS (total) | < 50KB | < 40KB |
| Images (per page) | < 500KB | < 400KB |

## Performance Score

- Lighthouse Performance Score: > 90
- Accessibility Score: 100
- Best Practices Score: > 90
- SEO Score: > 90

## Enforcement

These budgets are enforced in CI via:
- Lighthouse CI
- Bundle analyzer
- Performance monitoring

Failure to meet budgets will block merges and deployments.
