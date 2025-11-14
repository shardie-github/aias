/**
 * In-Environment Data Processing
 * Filter, aggregate, enrich before model access
 * Reduce 10,000 rows → 10 insights
 */

import { ProcessedData } from './types';

export interface ProcessingOptions {
  maxResults?: number;
  filterFn?: (item: any) => boolean;
  sortFn?: (a: any, b: any) => number;
  groupBy?: string | ((item: any) => string);
  aggregate?: Record<string, (items: any[]) => any>;
  enrich?: (item: any) => any;
}

export class DataProcessor {
  /**
   * Process large dataset into minimal insights
   */
  static process<T = any>(
    data: T[],
    options: ProcessingOptions = {}
  ): ProcessedData {
    const originalCount = data.length;
    let processed = [...data];

    // Step 1: Filter
    if (options.filterFn) {
      processed = processed.filter(options.filterFn);
    }

    // Step 2: Sort
    if (options.sortFn) {
      processed = processed.sort(options.sortFn);
    }

    // Step 3: Group & Aggregate
    if (options.groupBy || options.aggregate) {
      processed = this.groupAndAggregate(processed, options);
    }

    // Step 4: Enrich
    if (options.enrich) {
      processed = processed.map(options.enrich);
    }

    // Step 5: Limit results
    const maxResults = options.maxResults || 10;
    processed = processed.slice(0, maxResults);

    const processedCount = processed.length;
    const reductionPercent = ((originalCount - processedCount) / originalCount) * 100;

    // Generate insights
    const insights = this.generateInsights(processed, originalCount, processedCount);

    // Create summary
    const summary = this.createSummary(processed, originalCount);

    return {
      originalCount,
      processedCount,
      reductionPercent,
      insights,
      summary,
    };
  }

  /**
   * Group and aggregate data
   */
  private static groupAndAggregate<T>(
    data: T[],
    options: ProcessingOptions
  ): T[] {
    if (!options.groupBy && !options.aggregate) {
      return data;
    }

    const groups = new Map<string, T[]>();

    // Group
    for (const item of data) {
      let key: string;
      
      if (typeof options.groupBy === 'string') {
        key = (item as any)[options.groupBy] || 'unknown';
      } else if (typeof options.groupBy === 'function') {
        key = options.groupBy(item) || 'unknown';
      } else {
        key = 'all';
      }

      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(item);
    }

    // Aggregate
    if (options.aggregate) {
      const aggregated: any[] = [];
      
      for (const [key, items] of groups.entries()) {
        const aggregatedItem: any = { _group: key };
        
        for (const [field, fn] of Object.entries(options.aggregate)) {
          aggregatedItem[field] = fn(items);
        }
        
        aggregated.push(aggregatedItem);
      }
      
      return aggregated as T[];
    }

    // Return first item from each group
    return Array.from(groups.values()).map(group => group[0]);
  }

  /**
   * Generate insights from processed data
   */
  private static generateInsights(
    processed: any[],
    originalCount: number,
    processedCount: number
  ): string[] {
    const insights: string[] = [];

    insights.push(
      `Reduced ${originalCount} items to ${processedCount} high-value insights (${((originalCount - processedCount) / originalCount * 100).toFixed(1)}% reduction)`
    );

    if (processed.length > 0) {
      // Analyze patterns
      const numericFields = this.findNumericFields(processed[0]);
      
      if (numericFields.length > 0) {
        for (const field of numericFields.slice(0, 3)) {
          const values = processed.map((item: any) => item[field]).filter((v: any) => typeof v === 'number');
          if (values.length > 0) {
            const avg = values.reduce((a: number, b: number) => a + b, 0) / values.length;
            const max = Math.max(...values);
            const min = Math.min(...values);
            insights.push(`${field}: avg ${avg.toFixed(2)}, range [${min}, ${max}]`);
          }
        }
      }

      // Top items insight
      if (processed.length >= 3) {
        insights.push(`Top ${Math.min(3, processed.length)} items identified for review`);
      }
    }

    return insights;
  }

  /**
   * Find numeric fields in object
   */
  private static findNumericFields(obj: any): string[] {
    const fields: string[] = [];
    for (const key in obj) {
      if (typeof obj[key] === 'number') {
        fields.push(key);
      }
    }
    return fields;
  }

  /**
   * Create summary object
   */
  private static createSummary(processed: any[], originalCount: number): Record<string, any> {
    return {
      count: processed.length,
      originalCount,
      sample: processed.slice(0, 3), // First 3 items as sample
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Filter high-value items (business logic)
   */
  static filterHighValue<T extends Record<string, any>>(
    items: T[],
    valueField: string,
    threshold?: number
  ): T[] {
    const values = items.map(item => item[valueField] || 0).filter(v => typeof v === 'number');
    const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
    const minValue = threshold || avgValue;

    return items.filter(item => {
      const value = item[valueField];
      return typeof value === 'number' && value >= minValue;
    });
  }

  /**
   * Aggregate by time window
   */
  static aggregateByTimeWindow<T extends Record<string, any>>(
    items: T[],
    timeField: string,
    windowMinutes: number
  ): T[] {
    const windows = new Map<number, T[]>();

    for (const item of items) {
      const time = new Date(item[timeField]).getTime();
      const windowStart = Math.floor(time / (windowMinutes * 60 * 1000)) * (windowMinutes * 60 * 1000);
      
      if (!windows.has(windowStart)) {
        windows.set(windowStart, []);
      }
      windows.get(windowStart)!.push(item);
    }

    // Return aggregated windows
    return Array.from(windows.entries()).map(([start, items]) => ({
      windowStart: new Date(start).toISOString(),
      count: items.length,
      items: items.slice(0, 5), // Sample
    })) as T[];
  }
}
