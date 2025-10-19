/**
 * Multi-Tenant SaaS Platform Types
 * Core types for the next-dimension AIAS platform
 */

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  plan: SubscriptionPlan;
  features: string[];
  limits: TenantLimits;
  billing: BillingInfo;
  settings: TenantSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  limits: TenantLimits;
  active: boolean;
  tier: 'starter' | 'professional' | 'enterprise' | 'custom';
}

export interface TenantLimits {
  workflows: number;
  executions: number;
  storage: number; // in GB
  users: number;
  apiCalls: number;
  aiProcessing: number; // in minutes
  customAgents: number;
  integrations: number;
}

export interface BillingInfo {
  status: 'active' | 'suspended' | 'cancelled' | 'past_due';
  nextBilling: Date;
  amount: number;
  currency: string;
  paymentMethod: string;
  trialEnds?: Date;
}

export interface TenantSettings {
  timezone: string;
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  security: SecuritySettings;
  integrations: IntegrationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  webhook: boolean;
  channels: string[];
}

export interface SecuritySettings {
  twoFactorRequired: boolean;
  sessionTimeout: number; // in minutes
  ipWhitelist: string[];
  allowedDomains: string[];
  auditLogging: boolean;
}

export interface IntegrationSettings {
  allowedOrigins: string[];
  webhookSecret: string;
  apiKeys: ApiKey[];
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed?: Date;
  expiresAt?: Date;
  active: boolean;
}

// Workflow and Automation Types
export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'ai_processing' | 'data_transform' | 'notification';
  position: { x: number; y: number };
  config: Record<string, any>;
  connections: string[];
  metadata: {
    label: string;
    description?: string;
    category: string;
    icon: string;
  };
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  price: number; // 0 for free, >0 for paid
  nodes: WorkflowNode[];
  preview: string; // Base64 encoded preview image
  downloads: number;
  rating: number;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  tenantId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  triggerData: Record<string, any>;
  context: Record<string, any>;
  startTime: Date;
  endTime?: Date;
  errorMessage?: string;
  metrics: ExecutionMetrics;
}

export interface ExecutionMetrics {
  duration: number; // in seconds
  stepsCompleted: number;
  totalSteps: number;
  aiProcessingTime: number;
  cost: number;
  successRate: number;
}

// AI Agent Types
export interface AIAgent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  model: 'gpt-4' | 'claude-3' | 'custom' | 'multi-model';
  trainingData: string[];
  personality: AgentPersonality;
  pricing: AgentPricing;
  status: 'active' | 'inactive' | 'training' | 'error';
  metrics: AgentMetrics;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentPersonality {
  tone: 'professional' | 'casual' | 'friendly' | 'technical' | 'creative';
  expertise: string[];
  responseStyle: string;
  language: string;
  culturalContext: string;
}

export interface AgentPricing {
  type: 'per_use' | 'subscription' | 'one_time' | 'free';
  amount: number;
  currency: string;
  freeTier?: {
    requests: number;
    period: string;
  };
}

export interface AgentMetrics {
  totalInteractions: number;
  successRate: number;
  averageResponseTime: number;
  userRating: number;
  revenue: number;
}

// Marketplace Types
export interface MarketplaceItem {
  id: string;
  type: 'template' | 'agent' | 'integration' | 'app';
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
  };
  downloads: number;
  rating: number;
  reviews: number;
  tags: string[];
  preview: string;
  documentation: string;
  requirements: string[];
  compatibility: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface APIService {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  pricing: APIPricing;
  documentation: string;
  sdkLanguages: string[];
  rateLimits: RateLimit[];
  authentication: AuthMethod[];
  examples: APIExample[];
  status: 'active' | 'beta' | 'deprecated';
}

export interface APIPricing {
  freeTier: {
    requests: number;
    period: string;
  };
  paidTiers: Array<{
    name: string;
    price: number;
    requests: number;
    features: string[];
  }>;
}

export interface RateLimit {
  requests: number;
  period: string; // 'minute', 'hour', 'day'
  burst?: number;
}

export interface AuthMethod {
  type: 'api_key' | 'oauth2' | 'bearer' | 'basic';
  description: string;
  required: boolean;
}

export interface APIExample {
  language: string;
  code: string;
  description: string;
}

// Revenue and Analytics Types
export interface RevenueStream {
  id: string;
  type: 'subscription' | 'usage' | 'one_time' | 'commission' | 'licensing';
  name: string;
  description: string;
  amount: number;
  currency: string;
  period: string;
  tenantId?: string;
  itemId?: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface UsageMetrics {
  tenantId: string;
  period: string;
  workflows: number;
  executions: number;
  apiCalls: number;
  aiProcessing: number;
  storage: number;
  users: number;
  cost: number;
  revenue: number;
}

export interface PlatformAnalytics {
  totalTenants: number;
  activeTenants: number;
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  averageRevenuePerUser: number;
  churnRate: number;
  customerAcquisitionCost: number;
  lifetimeValue: number;
  netPromoterScore: number;
}

// Integration Types
export interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'crm' | 'calendar' | 'communication' | 'storage' | 'analytics' | 'payment';
  provider: string;
  status: 'active' | 'beta' | 'deprecated';
  configuration: IntegrationConfig;
  capabilities: string[];
  pricing: IntegrationPricing;
  documentation: string;
  support: SupportInfo;
}

export interface IntegrationConfig {
  authType: 'oauth2' | 'api_key' | 'basic' | 'custom';
  scopes: string[];
  webhooks: WebhookConfig[];
  rateLimits: RateLimit[];
  endpoints: EndpointConfig[];
}

export interface WebhookConfig {
  event: string;
  url: string;
  secret: string;
  retryPolicy: RetryPolicy;
}

export interface RetryPolicy {
  maxAttempts: number;
  backoffMultiplier: number;
  maxDelay: number;
}

export interface EndpointConfig {
  name: string;
  url: string;
  method: string;
  parameters: ParameterConfig[];
  response: ResponseConfig;
}

export interface ParameterConfig {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example: any;
}

export interface ResponseConfig {
  schema: Record<string, any>;
  examples: Record<string, any>[];
}

export interface IntegrationPricing {
  free: boolean;
  price?: number;
  currency?: string;
  period?: string;
  limits?: Record<string, number>;
}

export interface SupportInfo {
  documentation: string;
  supportEmail: string;
  statusPage: string;
  community: string;
  sla: string;
}

// Showcase and Demo Types
export interface DemoEnvironment {
  id: string;
  name: string;
  description: string;
  type: 'workflow' | 'agent' | 'integration' | 'app';
  configuration: Record<string, any>;
  data: Record<string, any>;
  permissions: string[];
  timeLimit: number; // in minutes
  maxUsers: number;
  active: boolean;
}

export interface InteractiveTutorial {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  prerequisites: string[];
  outcomes: string[];
  resources: TutorialResource[];
}

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  type: 'instruction' | 'interactive' | 'quiz' | 'demo';
  configuration?: Record<string, any>;
  validation?: ValidationRule[];
  hints?: string[];
}

export interface ValidationRule {
  type: 'exact' | 'contains' | 'regex' | 'custom';
  value: any;
  message: string;
}

export interface TutorialResource {
  type: 'documentation' | 'video' | 'code' | 'template';
  title: string;
  url: string;
  description: string;
}

// Community and Social Types
export interface CommunityPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
  };
  title: string;
  content: string;
  type: 'question' | 'tip' | 'showcase' | 'announcement';
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpertProfile {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  avatar?: string;
  expertise: string[];
  certifications: string[];
  rating: number;
  projects: number;
  followers: number;
  verified: boolean;
  availability: 'available' | 'busy' | 'unavailable';
  hourlyRate?: number;
  currency?: string;
}

// Notification and Communication Types
export interface Notification {
  id: string;
  userId: string;
  tenantId?: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  title: string;
  message: string;
  action?: {
    label: string;
    url: string;
    method?: string;
  };
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channels: ('email' | 'push' | 'sms' | 'in_app')[];
  scheduledFor?: Date;
  createdAt: Date;
}

export interface CommunicationChannel {
  id: string;
  name: string;
  type: 'email' | 'slack' | 'teams' | 'discord' | 'webhook';
  configuration: Record<string, any>;
  active: boolean;
  tenantId: string;
  createdAt: Date;
}

// Audit and Compliance Types
export interface AuditLog {
  id: string;
  userId: string;
  tenantId?: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ComplianceReport {
  id: string;
  tenantId: string;
  type: 'gdpr' | 'ccpa' | 'sox' | 'hipaa' | 'pci';
  status: 'compliant' | 'non_compliant' | 'partial' | 'pending';
  score: number;
  issues: ComplianceIssue[];
  recommendations: string[];
  generatedAt: Date;
  validUntil: Date;
}

export interface ComplianceIssue {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedResources: string[];
  remediation: string;
  deadline?: Date;
}