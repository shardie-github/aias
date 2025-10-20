import { z } from 'zod';

export const ChatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
});

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),
  stream: z.boolean().default(false),
});

export const AuditRequestSchema = z.object({
  website: z.string().url(),
  type: z.enum(['seo', 'performance', 'accessibility', 'security', 'comprehensive']),
  options: z.object({
    includeScreenshots: z.boolean().default(false),
    includeRecommendations: z.boolean().default(true),
    includeMetrics: z.boolean().default(true),
  }).optional(),
});

export const EstimateRequestSchema = z.object({
  projectType: z.enum(['website', 'ecommerce', 'saas', 'mobile', 'ai-integration']),
  scope: z.object({
    pages: z.number().positive(),
    features: z.array(z.string()),
    integrations: z.array(z.string()),
    timeline: z.enum(['rush', 'standard', 'flexible']),
  }),
  requirements: z.object({
    design: z.boolean().default(false),
    development: z.boolean().default(true),
    testing: z.boolean().default(true),
    deployment: z.boolean().default(false),
    maintenance: z.boolean().default(false),
  }),
});

export const ContentGenerationRequestSchema = z.object({
  type: z.enum(['blog-post', 'social-media', 'email', 'ad-copy', 'product-description']),
  topic: z.string(),
  tone: z.enum(['professional', 'casual', 'technical', 'creative', 'persuasive']),
  length: z.enum(['short', 'medium', 'long']),
  targetAudience: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

export const WorkflowGenerationRequestSchema = z.object({
  businessType: z.string(),
  goals: z.array(z.string()),
  currentProcesses: z.array(z.string()),
  painPoints: z.array(z.string()),
  budget: z.enum(['low', 'medium', 'high']),
  timeline: z.enum(['immediate', '1-3months', '3-6months', '6-12months']),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type AuditRequest = z.infer<typeof AuditRequestSchema>;
export type EstimateRequest = z.infer<typeof EstimateRequestSchema>;
export type ContentGenerationRequest = z.infer<typeof ContentGenerationRequestSchema>;
export type WorkflowGenerationRequest = z.infer<typeof WorkflowGenerationRequestSchema>;

export interface AIProvider {
  name: string;
  chat(request: ChatRequest): Promise<ChatMessage>;
  streamChat(request: ChatRequest): AsyncIterable<string>;
  generateAudit(request: AuditRequest): Promise<any>;
  generateEstimate(request: EstimateRequest): Promise<any>;
  generateContent(request: ContentGenerationRequest): Promise<any>;
  generateWorkflow(request: WorkflowGenerationRequest): Promise<any>;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: string;
}