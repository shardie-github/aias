/**
 * Performance Budgets Configuration
 */

export const PERFORMANCE_BUDGETS = {
  lcp: 2500, // Largest Contentful Paint < 2.5s
  cls: 0.1, // Cumulative Layout Shift < 0.1
  tbt: 300, // Total Blocking Time < 300ms
  jsSize: 170 * 1024, // JavaScript bundle < 170KB
  fcp: 1800, // First Contentful Paint < 1.8s
  si: 3400, // Speed Index < 3.4s
};

export function validatePerformanceBudgets(metrics: {
  lcp?: number;
  cls?: number;
  tbt?: number;
  jsSize?: number;
  fcp?: number;
  si?: number;
}): { passed: boolean; failures: string[] } {
  const failures: string[] = [];

  if (metrics.lcp && metrics.lcp > PERFORMANCE_BUDGETS.lcp) {
    failures.push(`LCP ${metrics.lcp}ms exceeds budget ${PERFORMANCE_BUDGETS.lcp}ms`);
  }

  if (metrics.cls && metrics.cls > PERFORMANCE_BUDGETS.cls) {
    failures.push(`CLS ${metrics.cls} exceeds budget ${PERFORMANCE_BUDGETS.cls}`);
  }

  if (metrics.tbt && metrics.tbt > PERFORMANCE_BUDGETS.tbt) {
    failures.push(`TBT ${metrics.tbt}ms exceeds budget ${PERFORMANCE_BUDGETS.tbt}ms`);
  }

  if (metrics.jsSize && metrics.jsSize > PERFORMANCE_BUDGETS.jsSize) {
    failures.push(`JS size ${metrics.jsSize} bytes exceeds budget ${PERFORMANCE_BUDGETS.jsSize} bytes`);
  }

  if (metrics.fcp && metrics.fcp > PERFORMANCE_BUDGETS.fcp) {
    failures.push(`FCP ${metrics.fcp}ms exceeds budget ${PERFORMANCE_BUDGETS.fcp}ms`);
  }

  if (metrics.si && metrics.si > PERFORMANCE_BUDGETS.si) {
    failures.push(`SI ${metrics.si}ms exceeds budget ${PERFORMANCE_BUDGETS.si}ms`);
  }

  return {
    passed: failures.length === 0,
    failures,
  };
}
