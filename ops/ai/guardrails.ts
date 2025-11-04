/**
 * AI Agent Guardrails
 */

import { z } from 'zod';

export interface AICallOptions {
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  schema?: z.ZodSchema;
  circuitBreaker?: boolean;
}

export class AIGuardrail {
  private circuitBreakers: Map<string, any> = new Map();

  constructor(
    private defaultTimeout: number = 30000,
    private defaultMaxRetries: number = 3,
    private defaultRetryDelay: number = 1000
  ) {}

  async call<T>(
    provider: string,
    fn: () => Promise<T>,
    options: AICallOptions = {}
  ): Promise<T> {
    const {
      timeout = this.defaultTimeout,
      maxRetries = this.defaultMaxRetries,
      retryDelay = this.defaultRetryDelay,
      schema,
    } = options;

    let lastError: Error | undefined;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.withTimeout(fn, timeout);

        if (schema) {
          return schema.parse(result) as T;
        }

        return result;
      } catch (error: any) {
        lastError = error;

        if (error instanceof z.ZodError) {
          throw error;
        }

        if (attempt < maxRetries) {
          await this.sleep(retryDelay * Math.pow(2, attempt));
        }
      }
    }

    throw lastError || new Error('AI call failed after retries');
  }

  private async withTimeout<T>(fn: () => Promise<T>, timeout: number): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('AI call timeout')), timeout)
      ),
    ]);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const aiGuardrail = new AIGuardrail();
