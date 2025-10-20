import { createAIProvider, createFallbackAIProvider } from './providers';
import { ChatRequest, AuditRequest, EstimateRequest, ContentGenerationRequest, WorkflowGenerationRequest } from './types';
import { config } from '@ai-consultancy/config';

export class AIClient {
  private primaryProvider: any;
  private fallbackProvider: any;

  constructor() {
    try {
      this.primaryProvider = createAIProvider();
    } catch (error) {
      console.warn('Failed to initialize primary AI provider:', error);
      this.primaryProvider = null;
    }

    try {
      this.fallbackProvider = createFallbackAIProvider();
    } catch (error) {
      console.warn('Failed to initialize fallback AI provider:', error);
      this.fallbackProvider = null;
    }
  }

  private async executeWithFallback<T>(
    operation: (provider: any) => Promise<T>,
    operationName: string
  ): Promise<T> {
    if (this.primaryProvider) {
      try {
        return await operation(this.primaryProvider);
      } catch (error) {
        console.warn(`Primary provider failed for ${operationName}:`, error);
      }
    }

    if (this.fallbackProvider) {
      try {
        return await operation(this.fallbackProvider);
      } catch (error) {
        console.warn(`Fallback provider failed for ${operationName}:`, error);
      }
    }

    throw new Error(`All AI providers failed for ${operationName}`);
  }

  async chat(request: ChatRequest) {
    return this.executeWithFallback(
      (provider) => provider.chat(request),
      'chat'
    );
  }

  async *streamChat(request: ChatRequest) {
    if (this.primaryProvider) {
      try {
        yield* this.primaryProvider.streamChat(request);
        return;
      } catch (error) {
        console.warn('Primary provider failed for streamChat:', error);
      }
    }

    if (this.fallbackProvider) {
      try {
        yield* this.fallbackProvider.streamChat(request);
        return;
      } catch (error) {
        console.warn('Fallback provider failed for streamChat:', error);
      }
    }

    throw new Error('All AI providers failed for streamChat');
  }

  async generateAudit(request: AuditRequest) {
    return this.executeWithFallback(
      (provider) => provider.generateAudit(request),
      'generateAudit'
    );
  }

  async generateEstimate(request: EstimateRequest) {
    return this.executeWithFallback(
      (provider) => provider.generateEstimate(request),
      'generateEstimate'
    );
  }

  async generateContent(request: ContentGenerationRequest) {
    return this.executeWithFallback(
      (provider) => provider.generateContent(request),
      'generateContent'
    );
  }

  async generateWorkflow(request: WorkflowGenerationRequest) {
    return this.executeWithFallback(
      (provider) => provider.generateWorkflow(request),
      'generateWorkflow'
    );
  }
}

export const aiClient = new AIClient();