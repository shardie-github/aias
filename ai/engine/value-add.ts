/**
 * Value-Add Layer - Smart Summaries & Actionable Insights
 * Business impact interpretation, optimized JSON reports, natural language narratives
 */

import { WorkflowResult, ToolExecution, ProcessedData } from './types';

export interface BusinessInsight {
  metric: string;
  value: number | string;
  delta?: number;
  impact: 'positive' | 'negative' | 'neutral';
  priority: 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface OptimizedReport {
  summary: {
    workflowId: string;
    success: boolean;
    executionTime: number;
    costEstimate: number;
    efficiencyScore: number;
  };
  metrics: Record<string, any>;
  insights: BusinessInsight[];
  narrative: string;
  nextBestAction: string;
}

export class ValueAddLayer {
  /**
   * Generate optimized report from workflow result
   */
  static generateReport(result: WorkflowResult, executions: ToolExecution[]): OptimizedReport {
    const costEstimate = this.calculateCostEstimate(executions);
    const efficiencyScore = this.calculateEfficiencyScore(result, executions);
    const insights = this.generateBusinessInsights(result, executions);
    const narrative = this.generateNarrative(result, insights);
    const nextBestAction = this.determineNextBestAction(insights, result);

    return {
      summary: {
        workflowId: result.workflowId,
        success: result.success,
        executionTime: result.totalLatencyMs,
        costEstimate,
        efficiencyScore,
      },
      metrics: this.extractMetrics(result.results),
      insights,
      narrative,
      nextBestAction,
    };
  }

  /**
   * Calculate cost estimate (token-based)
   */
  private static calculateCostEstimate(executions: ToolExecution[]): number {
    // Rough estimate: $0.002 per 1K tokens (GPT-4 pricing)
    const totalTokens = executions.reduce((sum, e) => sum + e.tokensUsed, 0);
    return (totalTokens / 1000) * 0.002;
  }

  /**
   * Calculate efficiency score (0-100)
   */
  private static calculateEfficiencyScore(
    result: WorkflowResult,
    executions: ToolExecution[]
  ): number {
    let score = 100;

    // Penalize for latency
    if (result.totalLatencyMs > 1500) {
      score -= 20;
    }

    // Penalize for failures
    if (!result.success) {
      score -= 30;
    }

    // Penalize for high token usage
    const avgTokensPerStep = result.totalTokensUsed / result.stepsExecuted;
    if (avgTokensPerStep > 500) {
      score -= 15;
    }

    // Reward for efficiency
    const successRate = executions.filter(e => e.success).length / executions.length;
    score += successRate * 20;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate business insights
   */
  private static generateBusinessInsights(
    result: WorkflowResult,
    executions: ToolExecution[]
  ): BusinessInsight[] {
    const insights: BusinessInsight[] = [];

    // Latency insight
    insights.push({
      metric: 'Execution Latency',
      value: `${result.totalLatencyMs}ms`,
      impact: result.totalLatencyMs > 1500 ? 'negative' : 'positive',
      priority: result.totalLatencyMs > 1500 ? 'high' : 'low',
      recommendation: result.totalLatencyMs > 1500
        ? 'Optimize slow steps or increase timeout thresholds'
        : 'Latency within acceptable range',
    });

    // Token efficiency insight
    const avgTokens = result.totalTokensUsed / result.stepsExecuted;
    insights.push({
      metric: 'Token Efficiency',
      value: `${avgTokens.toFixed(0)} tokens/step`,
      impact: avgTokens > 500 ? 'negative' : 'positive',
      priority: avgTokens > 500 ? 'medium' : 'low',
      recommendation: avgTokens > 500
        ? 'Reduce context size or optimize data processing'
        : 'Token usage is efficient',
    });

    // Success rate insight
    const successRate = executions.filter(e => e.success).length / executions.length;
    insights.push({
      metric: 'Success Rate',
      value: `${(successRate * 100).toFixed(1)}%`,
      impact: successRate < 0.8 ? 'negative' : 'positive',
      priority: successRate < 0.8 ? 'high' : 'low',
      recommendation: successRate < 0.8
        ? 'Review failed steps and implement better fallbacks'
        : 'Workflow reliability is good',
    });

    // Cost insight
    const costEstimate = this.calculateCostEstimate(executions);
    insights.push({
      metric: 'Estimated Cost',
      value: `$${costEstimate.toFixed(4)}`,
      impact: costEstimate > 0.01 ? 'negative' : 'positive',
      priority: costEstimate > 0.01 ? 'medium' : 'low',
      recommendation: costEstimate > 0.01
        ? 'Consider optimizing token usage or using cheaper models'
        : 'Cost is within budget',
    });

    return insights;
  }

  /**
   * Generate natural language narrative
   */
  private static generateNarrative(
    result: WorkflowResult,
    insights: BusinessInsight[]
  ): string {
    const lines: string[] = [];

    lines.push(`Workflow "${result.workflowId}" ${result.success ? 'completed successfully' : 'encountered errors'}.`);

    lines.push(
      `Executed ${result.stepsExecuted} steps in ${result.totalLatencyMs}ms, consuming approximately ${result.totalTokensUsed} tokens.`
    );

    const highPriorityInsights = insights.filter(i => i.priority === 'high');
    if (highPriorityInsights.length > 0) {
      lines.push('\nKey findings:');
      highPriorityInsights.forEach(insight => {
        lines.push(
          `- ${insight.metric}: ${insight.value} (${insight.impact} impact) - ${insight.recommendation}`
        );
      });
    }

    if (result.insights.length > 0) {
      lines.push('\nTechnical insights:');
      result.insights.forEach(insight => {
        lines.push(`- ${insight}`);
      });
    }

    return lines.join('\n');
  }

  /**
   * Determine next best action
   */
  private static determineNextBestAction(
    insights: BusinessInsight[],
    result: WorkflowResult
  ): string {
    const highPriority = insights.filter(i => i.priority === 'high' && i.impact === 'negative');
    
    if (highPriority.length > 0) {
      return highPriority[0].recommendation;
    }

    if (!result.success) {
      return 'Review error logs and fix workflow configuration';
    }

    const mediumPriority = insights.filter(i => i.priority === 'medium' && i.impact === 'negative');
    if (mediumPriority.length > 0) {
      return mediumPriority[0].recommendation;
    }

    return 'Workflow is performing well - consider optimization opportunities';
  }

  /**
   * Extract metrics from results
   */
  private static extractMetrics(results: Record<string, any>): Record<string, any> {
    const metrics: Record<string, any> = {};

    for (const [key, value] of Object.entries(results)) {
      if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string') {
        metrics[key] = value;
      } else if (typeof value === 'object' && value !== null) {
        // Extract numeric fields
        for (const [subKey, subValue] of Object.entries(value)) {
          if (typeof subValue === 'number') {
            metrics[`${key}.${subKey}`] = subValue;
          }
        }
      }
    }

    return metrics;
  }

  /**
   * Generate cost delta analysis
   */
  static calculateCostDelta(
    currentCost: number,
    previousCost?: number
  ): { delta: number; percentChange: number; trend: 'increasing' | 'decreasing' | 'stable' } {
    if (!previousCost) {
      return { delta: 0, percentChange: 0, trend: 'stable' };
    }

    const delta = currentCost - previousCost;
    const percentChange = (delta / previousCost) * 100;

    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (Math.abs(percentChange) > 5) {
      trend = percentChange > 0 ? 'increasing' : 'decreasing';
    }

    return { delta, percentChange, trend };
  }
}
