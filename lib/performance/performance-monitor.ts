/**
 * Performance Monitoring Utilities
 * Tracks and reports performance metrics
 */

export interface PerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
  size?: number;
}

export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  /**
   * Measure function execution time
   */
  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(`${name}_error`, duration);
      throw error;
    }
  }

  /**
   * Record performance metric
   */
  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  /**
   * Get metric statistics
   */
  getStats(name: string): { avg: number; min: number; max: number; count: number } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;

    return {
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length,
    };
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Map<string, number[]> {
    return new Map(this.metrics);
  }

  /**
   * Clear metrics
   */
  clear(): void {
    this.metrics.clear();
  }
}

export const performanceMonitor = typeof window !== 'undefined' ? new PerformanceMonitor() : {
  measure: async <T>(_name: string, fn: () => Promise<T>) => fn(),
  recordMetric: () => {},
  getStats: () => null,
  getAllMetrics: () => new Map(),
  clear: () => {},
} as PerformanceMonitor;
