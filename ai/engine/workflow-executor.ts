/**
 * Control Flow Engine - Deterministic Logic with Fallbacks
 * Avoid "let the model decide" - use code for branching
 */

import { WorkflowConfig, WorkflowStep, FallbackConfig, AgentContext, ToolExecution, WorkflowResult } from './types';
import { ToolRegistry } from './tool-registry';
import { ContextManager } from './context-manager';
import { DataProcessor } from './data-processor';
import { PrivacyGuard } from './privacy';

export class WorkflowExecutor {
  private registry: ToolRegistry;
  private context: AgentContext;
  private contextManager: ContextManager;
  private maxRetries = 3;
  private defaultTimeout = 1500; // 1.5s per workflow roundtrip

  constructor(
    registry: ToolRegistry,
    context: AgentContext,
    contextManager: ContextManager
  ) {
    this.registry = registry;
    this.context = context;
    this.contextManager = contextManager;
  }

  /**
   * Execute workflow with deterministic control flow
   */
  async execute(config: WorkflowConfig): Promise<WorkflowResult> {
    const startTime = Date.now();
    const results: Record<string, any> = {};
    let stepsExecuted = 0;
    let totalTokensUsed = 0;
    const errors: string[] = [];

    try {
      for (const step of config.steps) {
        // Check condition (deterministic)
        if (step.condition && !step.condition(this.context)) {
          continue;
        }

        // Check timeout
        const elapsed = Date.now() - startTime;
        const timeout = config.timeoutMs || this.defaultTimeout;
        if (elapsed > timeout) {
          errors.push(`Workflow timeout after ${elapsed}ms`);
          break;
        }

        // Check token budget
        const remainingBudget = this.contextManager.getRemainingBudget();
        if (remainingBudget < 100) {
          errors.push('Token budget exhausted');
          break;
        }

        // Execute step with retries and fallbacks
        const stepResult = await this.executeStep(step, config.fallbacks || []);
        
        results[step.stepId] = stepResult.result;
        stepsExecuted++;
        totalTokensUsed += stepResult.tokensUsed || 0;

        // If step failed and no fallback, stop workflow
        if (!stepResult.success && !this.hasFallback(step.stepId, config.fallbacks || [])) {
          errors.push(`Step ${step.stepId} failed: ${stepResult.error}`);
          break;
        }
      }

      const totalLatencyMs = Date.now() - startTime;

      // Generate insights and next actions
      const insights = this.generateInsights(results, stepsExecuted, totalLatencyMs);
      const nextActions = this.generateNextActions(results, errors);

      return {
        workflowId: config.workflowId,
        success: errors.length === 0,
        stepsExecuted,
        totalLatencyMs,
        totalTokensUsed,
        results,
        insights,
        nextActions,
        error: errors.length > 0 ? errors.join('; ') : undefined,
      };
    } catch (error: any) {
      return {
        workflowId: config.workflowId,
        success: false,
        stepsExecuted,
        totalLatencyMs: Date.now() - startTime,
        totalTokensUsed,
        results,
        insights: [],
        nextActions: ['Review workflow configuration', 'Check tool availability'],
        error: error.message,
      };
    }
  }

  /**
   * Execute single step with retries and fallbacks
   */
  private async executeStep(
    step: WorkflowStep,
    fallbacks: FallbackConfig[]
  ): Promise<{ success: boolean; result?: any; error?: string; tokensUsed?: number }> {
    const retries = step.retries || this.maxRetries;
    let lastError: Error | null = null;

    // Try primary tool
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const startTime = Date.now();
        const tool = await this.registry.loadTool(step.toolName);
        
        // Process params (sanitize PII)
        const sanitizedParams = PrivacyGuard.sanitizeForTelemetry(step.params);
        
        // Execute tool
        const result = await this.executeWithTimeout(
          () => tool(sanitizedParams),
          step.timeoutMs || 5000
        );

        const latencyMs = Date.now() - startTime;
        const tokensUsed = this.estimateTokens(JSON.stringify(result));

        // Record execution
        const execution: ToolExecution = {
          toolName: step.toolName,
          params: sanitizedParams,
          timestamp: Date.now(),
          latencyMs,
          tokensUsed,
          success: true,
          result,
        };

        this.context.executionHistory.push(execution);
        this.contextManager.addToolExecution(execution);

        return { success: true, result, tokensUsed };
      } catch (error: any) {
        lastError = error;
        
        // If not last attempt, wait and retry
        if (attempt < retries) {
          await this.sleep(100 * (attempt + 1)); // Exponential backoff
          continue;
        }
      }
    }

    // Primary tool failed - try fallback
    const fallback = fallbacks.find(f => f.stepId === step.stepId);
    if (fallback && (!fallback.condition || fallback.condition(lastError!))) {
      try {
        const startTime = Date.now();
        const fallbackTool = await this.registry.loadTool(fallback.fallbackTool);
        const result = await this.executeWithTimeout(
          () => fallbackTool(fallback.fallbackParams || step.params),
          step.timeoutMs || 5000
        );

        const latencyMs = Date.now() - startTime;
        const tokensUsed = this.estimateTokens(JSON.stringify(result));

        const execution: ToolExecution = {
          toolName: fallback.fallbackTool,
          params: fallback.fallbackParams || step.params,
          timestamp: Date.now(),
          latencyMs,
          tokensUsed,
          success: true,
          result,
        };

        this.context.executionHistory.push(execution);
        this.contextManager.addToolExecution(execution);

        return { success: true, result, tokensUsed };
      } catch (fallbackError: any) {
        return {
          success: false,
          error: `Primary failed: ${lastError!.message}; Fallback failed: ${fallbackError.message}`,
        };
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Unknown error',
    };
  }

  /**
   * Execute with timeout
   */
  private async executeWithTimeout<T>(
    fn: () => Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
      ),
    ]);
  }

  /**
   * Check if fallback exists for step
   */
  private hasFallback(stepId: string, fallbacks: FallbackConfig[]): boolean {
    return fallbacks.some(f => f.stepId === stepId);
  }

  /**
   * Estimate tokens
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Generate insights from workflow results
   */
  private generateInsights(
    results: Record<string, any>,
    stepsExecuted: number,
    latencyMs: number
  ): string[] {
    const insights: string[] = [];

    insights.push(`Executed ${stepsExecuted} steps in ${latencyMs}ms`);

    if (latencyMs > 1500) {
      insights.push(`⚠️ Latency exceeds target (${latencyMs}ms > 1500ms)`);
    }

    const toolNames = Object.keys(results);
    if (toolNames.length > 0) {
      insights.push(`Tools used: ${toolNames.join(', ')}`);
    }

    return insights;
  }

  /**
   * Generate next actions
   */
  private generateNextActions(
    results: Record<string, any>,
    errors: string[]
  ): string[] {
    const actions: string[] = [];

    if (errors.length > 0) {
      actions.push('Review error logs');
      actions.push('Check tool availability');
    } else {
      actions.push('Review workflow results');
      actions.push('Optimize for next run');
    }

    return actions;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
