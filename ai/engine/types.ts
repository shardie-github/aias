/**
 * Core types for MCP-powered AI Agent Engine
 * Token-efficient, composable, production-grade types
 */

export interface ToolManifest {
  name: string;
  path: string;
  version: string;
  author?: string;
  description: string;
  category: 'mcp' | 'native' | 'connector';
  schema?: ToolSchema;
  dependencies?: string[];
  enabled: boolean;
}

export interface ToolSchema {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  outputSchema?: Record<string, any>;
}

export interface ToolExecution {
  toolName: string;
  params: Record<string, any>;
  timestamp: number;
  latencyMs: number;
  tokensUsed: number;
  success: boolean;
  error?: string;
  result?: any;
}

export interface AgentContext {
  agentId: string;
  workflowId: string;
  tokenBudget: number;
  currentTokens: number;
  loadedTools: Set<string>;
  executionHistory: ToolExecution[];
  metadata: Record<string, any>;
}

export interface WorkflowConfig {
  workflowId: string;
  steps: WorkflowStep[];
  fallbacks?: FallbackConfig[];
  timeoutMs?: number;
  tokenBudget?: number;
}

export interface WorkflowStep {
  stepId: string;
  toolName: string;
  params: Record<string, any>;
  condition?: (ctx: AgentContext) => boolean;
  retries?: number;
  timeoutMs?: number;
}

export interface FallbackConfig {
  stepId: string;
  fallbackTool: string;
  fallbackParams?: Record<string, any>;
  condition?: (error: Error) => boolean;
}

export interface ProcessedData {
  originalCount: number;
  processedCount: number;
  reductionPercent: number;
  insights: string[];
  summary: Record<string, any>;
}

export interface WorkflowResult {
  workflowId: string;
  success: boolean;
  stepsExecuted: number;
  totalLatencyMs: number;
  totalTokensUsed: number;
  results: Record<string, any>;
  insights: string[];
  nextActions: string[];
  costDelta?: number;
  error?: string;
}

export interface TelemetryRecord {
  tool_name: string;
  token_used: number;
  latency_ms: number;
  success: boolean;
  timestamp: string;
  workflow_id?: string;
  agent_id?: string;
}

export interface MCPServerConfig {
  name: string;
  transport: 'stdio' | 'http' | 'websocket';
  command?: string;
  args?: string[];
  url?: string;
  headers?: Record<string, string>;
}

export interface TokenizedData {
  original: any;
  tokenized: any;
  piiFields: string[];
  anonymized: boolean;
}
