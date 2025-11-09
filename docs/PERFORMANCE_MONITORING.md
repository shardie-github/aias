# Performance Monitoring Guide

## Overview

This guide explains the performance monitoring system, including benchmarks, CI integration, and PR performance comments.

## Benchmark Harness

### Running Benchmarks

```typescript
import { benchmark, compare, formatResult } from '@/bench/runner';

// Single benchmark
const result = await benchmark('fibonacci(10)', () => fibonacci(10), {
  iterations: 1000,
});
console.log(formatResult(result));

// Compare multiple implementations
const results = await compare(
  [
    { name: 'fibonacci(10)', fn: () => fibonacci(10) },
    { name: 'fibonacci(20)', fn: () => fibonacci(20) },
  ],
  { iterations: 100 }
);
```

### Benchmark Results

Results include:
- Iterations: Number of runs
- Total Time: Total execution time
- Average Time: Average per iteration
- Min/Max Time: Fastest/slowest iterations
- Ops/Second: Operations per second
- Memory Used: Memory consumption (if available)

## CI Integration

### Pre-Merge Validation

The `pre-merge-validation.yml` workflow runs on every PR:
- Type checking
- Linting
- Format checking
- Security scanning

Results are automatically commented on PRs.

### Performance PR Monitoring

The `performance-pr.yml` workflow:
- Runs benchmarks
- Analyzes bundle size
- Compares with baseline
- Comments performance diffs on PRs

### Weekly Benchmarks

The `benchmarks.yml` workflow runs weekly:
- Executes all benchmarks
- Analyzes trends
- Detects regressions
- Stores historical data

## Trend Analysis

```bash
# Analyze benchmark trends
node scripts/bench-trend.js analyze bench/results/latest.json

# View trend history
node scripts/bench-trend.js trends
```

## Performance Budgets

Set performance budgets in CI:
- Bundle size limits
- Lighthouse scores
- API response times
- Database query times

## Best Practices

1. **Add benchmarks for critical paths** - Focus on hot code
2. **Run benchmarks regularly** - Catch regressions early
3. **Compare with baseline** - Track performance over time
4. **Set realistic budgets** - Don't be too strict or too lenient
5. **Monitor trends** - Look for gradual degradation

## Configuration

Benchmark configuration:
- `iterations`: Number of runs (default: 1000)
- `warmup`: Warmup runs (default: 10)
- `timeout`: Maximum time (default: 5000ms)

---

For more details, see `bench/runner.ts` and `.github/workflows/performance-pr.yml`.
