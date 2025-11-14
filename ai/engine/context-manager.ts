/**
 * Context Manager - Rolling Token Cap (2K tokens per agent)
 * Maintains efficient context windows with automatic pruning
 */

import { AgentContext, ToolExecution } from './types';

export interface ContextEntry {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tokens: number;
  timestamp: number;
  priority: number; // Higher = keep longer
}

export class ContextManager {
  private context: AgentContext;
  private entries: ContextEntry[] = [];
  private maxTokens: number;
  private currentTokens = 0;

  constructor(context: AgentContext, maxTokens = 2000) {
    this.context = context;
    this.maxTokens = maxTokens;
  }

  /**
   * Estimate token count (simple heuristic: ~4 chars per token)
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Add entry to context
   */
  addEntry(
    role: ContextEntry['role'],
    content: string,
    priority = 0
  ): void {
    const tokens = this.estimateTokens(content);
    const entry: ContextEntry = {
      role,
      content,
      tokens,
      timestamp: Date.now(),
      priority,
    };

    this.entries.push(entry);
    this.currentTokens += tokens;

    // Prune if over limit
    this.prune();
  }

  /**
   * Prune context to stay under token limit
   */
  private prune(): void {
    while (this.currentTokens > this.maxTokens && this.entries.length > 1) {
      // Keep system messages and high-priority entries
      // Remove oldest low-priority entries first
      let removed = false;

      for (let i = 0; i < this.entries.length; i++) {
        const entry = this.entries[i];
        
        // Never remove system messages
        if (entry.role === 'system') continue;
        
        // Remove low-priority entries first
        if (entry.priority < 0) {
          this.currentTokens -= entry.tokens;
          this.entries.splice(i, 1);
          removed = true;
          break;
        }
      }

      // If no low-priority entries, remove oldest non-system entry
      if (!removed) {
        for (let i = 0; i < this.entries.length; i++) {
          const entry = this.entries[i];
          if (entry.role !== 'system') {
            this.currentTokens -= entry.tokens;
            this.entries.splice(i, 1);
            break;
          }
        }
      }
    }
  }

  /**
   * Get current context as messages (for LLM)
   */
  getMessages(): Array<{ role: string; content: string }> {
    return this.entries.map(entry => ({
      role: entry.role,
      content: entry.content,
    }));
  }

  /**
   * Get context summary (token-efficient)
   */
  getSummary(): string {
    const toolCalls = this.context.executionHistory.length;
    const recentTools = this.context.executionHistory
      .slice(-5)
      .map(e => e.toolName)
      .join(', ');

    return `Context: ${toolCalls} tool executions, recent: ${recentTools || 'none'}`;
  }

  /**
   * Add tool execution to context
   */
  addToolExecution(execution: ToolExecution): void {
    this.context.executionHistory.push(execution);
    this.context.currentTokens += execution.tokensUsed;

    // Add summary to context (not full result)
    const summary = execution.success
      ? `Tool ${execution.toolName} succeeded (${execution.latencyMs}ms)`
      : `Tool ${execution.toolName} failed: ${execution.error}`;

    this.addEntry('tool', summary, execution.success ? 1 : -1);
  }

  /**
   * Get current token count
   */
  getTokenCount(): number {
    return this.currentTokens;
  }

  /**
   * Get remaining token budget
   */
  getRemainingBudget(): number {
    return Math.max(0, this.maxTokens - this.currentTokens);
  }

  /**
   * Clear context (keep system messages)
   */
  clear(): void {
    const systemEntries = this.entries.filter(e => e.role === 'system');
    this.entries = systemEntries;
    this.currentTokens = systemEntries.reduce((sum, e) => sum + e.tokens, 0);
  }

  /**
   * Compress context: summarize old entries
   */
  compress(): void {
    if (this.entries.length < 10) return; // Don't compress small contexts

    // Summarize entries older than 5 minutes
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i];
      if (entry.timestamp < fiveMinutesAgo && entry.role !== 'system') {
        // Compress to summary
        const summary = this.summarizeEntry(entry);
        const oldTokens = entry.tokens;
        entry.content = summary;
        entry.tokens = this.estimateTokens(summary);
        this.currentTokens += entry.tokens - oldTokens;
      }
    }

    this.prune();
  }

  /**
   * Summarize entry content
   */
  private summarizeEntry(entry: ContextEntry): string {
    if (entry.content.length < 100) return entry.content;
    
    // Simple summarization: first sentence + "..."
    const sentences = entry.content.split(/[.!?]/);
    if (sentences.length > 1) {
      return sentences[0] + '...';
    }
    
    // Truncate to 50 chars
    return entry.content.substring(0, 50) + '...';
  }

  /**
   * Get context stats
   */
  getStats(): {
    totalTokens: number;
    maxTokens: number;
    entries: number;
    utilizationPercent: number;
  } {
    return {
      totalTokens: this.currentTokens,
      maxTokens: this.maxTokens,
      entries: this.entries.length,
      utilizationPercent: (this.currentTokens / this.maxTokens) * 100,
    };
  }
}
