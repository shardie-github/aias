/**
 * Main Agent Engine - Orchestrates all components
 * Production-grade AI agent with MCP integration
 */

import { AgentContext, WorkflowConfig, WorkflowResult, TelemetryRecord } from './types';
import { ToolRegistry, getToolRegistry } from './tool-registry';
import { ContextManager } from './context-manager';
import { WorkflowExecutor } from './workflow-executor';
import { ValueAddLayer } from './value-add';
import { PrivacyGuard } from './privacy';
import { createClient } from '@supabase/supabase-js';

export interface AgentEngineConfig {
  agentId: string;
  tokenBudget?: number;
  enableTelemetry?: boolean;
  supabaseUrl?: string;
  supabaseKey?: string;
}

export class AgentEngine {
  private context: AgentContext;
  private contextManager: ContextManager;
  private registry: ToolRegistry;
  private executor: WorkflowExecutor;
  private config: AgentEngineConfig;
  private supabase?: any;

  constructor(config: AgentEngineConfig) {
    this.config = config;
    
    // Initialize context
    this.context = {
      agentId: config.agentId,
      workflowId: '',
      tokenBudget: config.tokenBudget || 2000,
      currentTokens: 0,
      loadedTools: new Set(),
      executionHistory: [],
      metadata: {},
    };

    // Initialize components
    this.registry = getToolRegistry();
    this.contextManager = new ContextManager(this.context, config.tokenBudget || 2000);
    
    // Initialize Supabase for telemetry
    if (config.enableTelemetry && config.supabaseUrl && config.supabaseKey) {
      this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
    }

    this.executor = new WorkflowExecutor(
      this.registry,
      this.context,
      this.contextManager
    );
  }

  /**
   * Initialize agent (load manifest, etc.)
   */
  async initialize(): Promise<void> {
    await this.registry.loadManifest();
    
    // Add system message to context
    this.contextManager.addEntry(
      'system',
      `You are an efficient AI agent (${this.config.agentId}) with access to tools. Use tools judiciously and maintain token efficiency.`,
      100 // High priority, never prune
    );
  }

  /**
   * Execute workflow
   */
  async executeWorkflow(config: WorkflowConfig): Promise<WorkflowResult> {
    this.context.workflowId = config.workflowId;

    // Execute workflow
    const result = await this.executor.execute(config);

    // Generate value-add report
    const report = ValueAddLayer.generateReport(result, this.context.executionHistory);

    // Log telemetry
    if (this.config.enableTelemetry) {
      await this.logTelemetry(result);
    }

    // Update result with insights
    result.insights = [
      ...result.insights,
      ...report.insights.map(i => `${i.metric}: ${i.value} (${i.impact})`),
    ];
    result.nextActions = [report.nextBestAction, ...result.nextActions];

    return result;
  }

  /**
   * Log telemetry (sanitized, minimal)
   */
  private async logTelemetry(result: WorkflowResult): Promise<void> {
    if (!this.supabase) return;

    try {
      const records: TelemetryRecord[] = this.context.executionHistory.map(exec => ({
        tool_name: exec.toolName,
        token_used: exec.tokensUsed,
        latency_ms: exec.latencyMs,
        success: exec.success,
        timestamp: new Date(exec.timestamp).toISOString(),
        workflow_id: result.workflowId,
        agent_id: this.config.agentId,
      }));

      // Batch insert (sanitized)
      if (records.length > 0) {
        await this.supabase.from('ai_telemetry').insert(records);
      }
    } catch (error) {
      console.warn(`Telemetry logging failed: ${error.message}`);
    }
  }

  /**
   * Get context summary
   */
  getContextSummary(): string {
    return this.contextManager.getSummary();
  }

  /**
   * Get agent stats
   */
  getStats(): {
    agentId: string;
    tokenUsage: number;
    tokenBudget: number;
    toolsLoaded: number;
    executions: number;
    contextStats: ReturnType<ContextManager['getStats']>;
  } {
    return {
      agentId: this.config.agentId,
      tokenUsage: this.context.currentTokens,
      tokenBudget: this.context.tokenBudget,
      toolsLoaded: this.context.loadedTools.size,
      executions: this.context.executionHistory.length,
      contextStats: this.contextManager.getStats(),
    };
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    // Unload tools
    for (const toolName of this.context.loadedTools) {
      this.registry.unloadTool(toolName);
    }
    
    this.context.loadedTools.clear();
    this.contextManager.clear();
  }
}

/**
 * Factory: Create agent engine
 */
export function createAgentEngine(config: AgentEngineConfig): AgentEngine {
  return new AgentEngine(config);
}
