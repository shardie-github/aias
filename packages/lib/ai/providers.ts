import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider, ChatRequest, AuditRequest, EstimateRequest, ContentGenerationRequest, WorkflowGenerationRequest, AIResponse } from './types';
import { config } from '@ai-consultancy/config';

class OpenAIProvider implements AIProvider {
  name = 'openai';
  private client: OpenAI;

  constructor() {
    if (!config.ai.providers.openai) {
      throw new Error('OpenAI API key not configured');
    }
    this.client = new OpenAI({
      apiKey: config.ai.providers.openai,
    });
  }

  async chat(request: ChatRequest): Promise<any> {
    const response = await this.client.chat.completions.create({
      model: request.model || 'gpt-4',
      messages: request.messages as any,
      temperature: request.temperature || 0.7,
      max_tokens: request.maxTokens || 1000,
    });

    return {
      content: response.choices[0]?.message?.content || '',
      usage: response.usage,
      model: response.model,
      provider: this.name,
    };
  }

  async *streamChat(request: ChatRequest): AsyncIterable<string> {
    const stream = await this.client.chat.completions.create({
      model: request.model || 'gpt-4',
      messages: request.messages as any,
      temperature: request.temperature || 0.7,
      max_tokens: request.maxTokens || 1000,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }

  async generateAudit(request: AuditRequest): Promise<any> {
    const prompt = `Generate a comprehensive ${request.type} audit for ${request.website}. Include detailed analysis, recommendations, and metrics.`;
    
    const response = await this.chat({
      messages: [
        { role: 'system', content: 'You are an expert web auditor specializing in SEO, performance, accessibility, and security.' },
        { role: 'user', content: prompt }
      ],
      model: 'gpt-4',
    });

    return {
      type: request.type,
      website: request.website,
      analysis: response.content,
      recommendations: [],
      metrics: {},
      generatedAt: new Date().toISOString(),
    };
  }

  async generateEstimate(request: EstimateRequest): Promise<any> {
    const prompt = `Generate a detailed project estimate for a ${request.projectType} project with ${request.scope.pages} pages, features: ${request.scope.features.join(', ')}, timeline: ${request.scope.timeline}.`;
    
    const response = await this.chat({
      messages: [
        { role: 'system', content: 'You are an expert project manager and technical consultant.' },
        { role: 'user', content: prompt }
      ],
      model: 'gpt-4',
    });

    return {
      projectType: request.projectType,
      scope: request.scope,
      requirements: request.requirements,
      estimate: response.content,
      timeline: request.scope.timeline,
      generatedAt: new Date().toISOString(),
    };
  }

  async generateContent(request: ContentGenerationRequest): Promise<any> {
    const prompt = `Generate ${request.type} content about "${request.topic}" with a ${request.tone} tone, ${request.length} length. Target audience: ${request.targetAudience || 'general'}. Keywords: ${request.keywords?.join(', ') || 'none'}.`;
    
    const response = await this.chat({
      messages: [
        { role: 'system', content: 'You are a professional content writer and marketing expert.' },
        { role: 'user', content: prompt }
      ],
      model: 'gpt-4',
    });

    return {
      type: request.type,
      topic: request.topic,
      content: response.content,
      tone: request.tone,
      length: request.length,
      generatedAt: new Date().toISOString(),
    };
  }

  async generateWorkflow(request: WorkflowGenerationRequest): Promise<any> {
    const prompt = `Generate an automated workflow for a ${request.businessType} business. Goals: ${request.goals.join(', ')}. Current processes: ${request.currentProcesses.join(', ')}. Pain points: ${request.painPoints.join(', ')}. Budget: ${request.budget}, Timeline: ${request.timeline}.`;
    
    const response = await this.chat({
      messages: [
        { role: 'system', content: 'You are an expert business process automation consultant.' },
        { role: 'user', content: prompt }
      ],
      model: 'gpt-4',
    });

    return {
      businessType: request.businessType,
      goals: request.goals,
      workflow: response.content,
      budget: request.budget,
      timeline: request.timeline,
      generatedAt: new Date().toISOString(),
    };
  }
}

class AnthropicProvider implements AIProvider {
  name = 'anthropic';
  private client: Anthropic;

  constructor() {
    if (!config.ai.providers.anthropic) {
      throw new Error('Anthropic API key not configured');
    }
    this.client = new Anthropic({
      apiKey: config.ai.providers.anthropic,
    });
  }

  async chat(request: ChatRequest): Promise<any> {
    const response = await this.client.messages.create({
      model: request.model || 'claude-3-sonnet-20240229',
      max_tokens: request.maxTokens || 1000,
      temperature: request.temperature || 0.7,
      messages: request.messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : msg.role === 'system' ? 'assistant' : 'user',
        content: msg.content,
      })),
    });

    return {
      content: response.content[0]?.text || '',
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
      model: response.model,
      provider: this.name,
    };
  }

  async *streamChat(request: ChatRequest): AsyncIterable<string> {
    const stream = await this.client.messages.create({
      model: request.model || 'claude-3-sonnet-20240229',
      max_tokens: request.maxTokens || 1000,
      temperature: request.temperature || 0.7,
      messages: request.messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : msg.role === 'system' ? 'assistant' : 'user',
        content: msg.content,
      })),
      stream: true,
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        yield chunk.delta.text;
      }
    }
  }

  async generateAudit(request: AuditRequest): Promise<any> {
    const prompt = `Generate a comprehensive ${request.type} audit for ${request.website}. Include detailed analysis, recommendations, and metrics.`;
    
    const response = await this.chat({
      messages: [
        { role: 'system', content: 'You are an expert web auditor specializing in SEO, performance, accessibility, and security.' },
        { role: 'user', content: prompt }
      ],
      model: 'claude-3-sonnet-20240229',
    });

    return {
      type: request.type,
      website: request.website,
      analysis: response.content,
      recommendations: [],
      metrics: {},
      generatedAt: new Date().toISOString(),
    };
  }

  async generateEstimate(request: EstimateRequest): Promise<any> {
    const prompt = `Generate a detailed project estimate for a ${request.projectType} project with ${request.scope.pages} pages, features: ${request.scope.features.join(', ')}, timeline: ${request.scope.timeline}.`;
    
    const response = await this.chat({
      messages: [
        { role: 'system', content: 'You are an expert project manager and technical consultant.' },
        { role: 'user', content: prompt }
      ],
      model: 'claude-3-sonnet-20240229',
    });

    return {
      projectType: request.projectType,
      scope: request.scope,
      requirements: request.requirements,
      estimate: response.content,
      timeline: request.scope.timeline,
      generatedAt: new Date().toISOString(),
    };
  }

  async generateContent(request: ContentGenerationRequest): Promise<any> {
    const prompt = `Generate ${request.type} content about "${request.topic}" with a ${request.tone} tone, ${request.length} length. Target audience: ${request.targetAudience || 'general'}. Keywords: ${request.keywords?.join(', ') || 'none'}.`;
    
    const response = await this.chat({
      messages: [
        { role: 'system', content: 'You are a professional content writer and marketing expert.' },
        { role: 'user', content: prompt }
      ],
      model: 'claude-3-sonnet-20240229',
    });

    return {
      type: request.type,
      topic: request.topic,
      content: response.content,
      tone: request.tone,
      length: request.length,
      generatedAt: new Date().toISOString(),
    };
  }

  async generateWorkflow(request: WorkflowGenerationRequest): Promise<any> {
    const prompt = `Generate an automated workflow for a ${request.businessType} business. Goals: ${request.goals.join(', ')}. Current processes: ${request.currentProcesses.join(', ')}. Pain points: ${request.painPoints.join(', ')}. Budget: ${request.budget}, Timeline: ${request.timeline}.`;
    
    const response = await this.chat({
      messages: [
        { role: 'system', content: 'You are an expert business process automation consultant.' },
        { role: 'user', content: prompt }
      ],
      model: 'claude-3-sonnet-20240229',
    });

    return {
      businessType: request.businessType,
      goals: request.goals,
      workflow: response.content,
      budget: request.budget,
      timeline: request.timeline,
      generatedAt: new Date().toISOString(),
    };
  }
}

class GoogleProvider implements AIProvider {
  name = 'google';
  private client: GoogleGenerativeAI;

  constructor() {
    if (!config.ai.providers.google) {
      throw new Error('Google API key not configured');
    }
    this.client = new GoogleGenerativeAI(config.ai.providers.google);
  }

  async chat(request: ChatRequest): Promise<any> {
    const model = this.client.getGenerativeModel({ model: request.model || 'gemini-pro' });
    
    const prompt = request.messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      content: text,
      usage: {
        promptTokens: 0, // Google doesn't provide token counts in the same way
        completionTokens: 0,
        totalTokens: 0,
      },
      model: request.model || 'gemini-pro',
      provider: this.name,
    };
  }

  async *streamChat(request: ChatRequest): AsyncIterable<string> {
    const model = this.client.getGenerativeModel({ model: request.model || 'gemini-pro' });
    
    const prompt = request.messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const result = await model.generateContentStream(prompt);
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        yield chunkText;
      }
    }
  }

  async generateAudit(request: AuditRequest): Promise<any> {
    const prompt = `Generate a comprehensive ${request.type} audit for ${request.website}. Include detailed analysis, recommendations, and metrics.`;
    
    const response = await this.chat({
      messages: [
        { role: 'system', content: 'You are an expert web auditor specializing in SEO, performance, accessibility, and security.' },
        { role: 'user', content: prompt }
      ],
      model: 'gemini-pro',
    });

    return {
      type: request.type,
      website: request.website,
      analysis: response.content,
      recommendations: [],
      metrics: {},
      generatedAt: new Date().toISOString(),
    };
  }

  async generateEstimate(request: EstimateRequest): Promise<any> {
    const prompt = `Generate a detailed project estimate for a ${request.projectType} project with ${request.scope.pages} pages, features: ${request.scope.features.join(', ')}, timeline: ${request.scope.timeline}.`;
    
    const response = await this.chat({
      messages: [
        { role: 'system', content: 'You are an expert project manager and technical consultant.' },
        { role: 'user', content: prompt }
      ],
      model: 'gemini-pro',
    });

    return {
      projectType: request.projectType,
      scope: request.scope,
      requirements: request.requirements,
      estimate: response.content,
      timeline: request.scope.timeline,
      generatedAt: new Date().toISOString(),
    };
  }

  async generateContent(request: ContentGenerationRequest): Promise<any> {
    const prompt = `Generate ${request.type} content about "${request.topic}" with a ${request.tone} tone, ${request.length} length. Target audience: ${request.targetAudience || 'general'}. Keywords: ${request.keywords?.join(', ') || 'none'}.`;
    
    const response = await this.chat({
      messages: [
        { role: 'system', content: 'You are a professional content writer and marketing expert.' },
        { role: 'user', content: prompt }
      ],
      model: 'gemini-pro',
    });

    return {
      type: request.type,
      topic: request.topic,
      content: response.content,
      tone: request.tone,
      length: request.length,
      generatedAt: new Date().toISOString(),
    };
  }

  async generateWorkflow(request: WorkflowGenerationRequest): Promise<any> {
    const prompt = `Generate an automated workflow for a ${request.businessType} business. Goals: ${request.goals.join(', ')}. Current processes: ${request.currentProcesses.join(', ')}. Pain points: ${request.painPoints.join(', ')}. Budget: ${request.budget}, Timeline: ${request.timeline}.`;
    
    const response = await this.chat({
      messages: [
        { role: 'system', content: 'You are an expert business process automation consultant.' },
        { role: 'user', content: prompt }
      ],
      model: 'gemini-pro',
    });

    return {
      businessType: request.businessType,
      goals: request.goals,
      workflow: response.content,
      budget: request.budget,
      timeline: request.timeline,
      generatedAt: new Date().toISOString(),
    };
  }
}

export function createAIProvider(providerName?: string): AIProvider {
  const provider = providerName || config.ai.primaryProvider;
  
  switch (provider) {
    case 'openai':
      return new OpenAIProvider();
    case 'anthropic':
      return new AnthropicProvider();
    case 'gemini':
      return new GoogleProvider();
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

export function createFallbackAIProvider(): AIProvider {
  const providers = ['openai', 'anthropic', 'gemini'];
  
  for (const provider of providers) {
    try {
      return createAIProvider(provider);
    } catch (error) {
      console.warn(`Failed to initialize ${provider} provider:`, error);
      continue;
    }
  }
  
  throw new Error('No AI providers available');
}