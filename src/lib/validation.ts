/**
 * Input Validation System
 * Comprehensive validation schemas using Zod for the AIAS platform
 */

import { z } from 'zod';

// Common validation patterns
const emailSchema = z.string().email('Invalid email address').min(1, 'Email is required');
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .optional();

const urlSchema = z.string().url('Invalid URL format');
const cuidSchema = z.string().cuid('Invalid ID format');

// User validation schemas
export const userSchemas = {
  create: z.object({
    email: emailSchema,
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    password: passwordSchema,
    phone: phoneSchema,
    avatar: urlSchema.optional(),
  }),

  update: z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
    phone: phoneSchema,
    avatar: urlSchema.optional(),
  }),

  login: z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
  }),

  changePassword: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
};

// Organization validation schemas
export const organizationSchemas = {
  create: z.object({
    name: z.string().min(1, 'Organization name is required').max(100, 'Name too long'),
    description: z.string().max(500, 'Description too long').optional(),
    website: urlSchema.optional(),
    logo: urlSchema.optional(),
  }),

  update: z.object({
    name: z.string().min(1, 'Organization name is required').max(100, 'Name too long').optional(),
    description: z.string().max(500, 'Description too long').optional(),
    website: urlSchema.optional(),
    logo: urlSchema.optional(),
  }),

  invite: z.object({
    email: emailSchema,
    role: z.enum(['ADMIN', 'EDITOR', 'VIEWER'], {
      errorMap: () => ({ message: 'Invalid role' }),
    }),
  }),
};

// Project validation schemas
export const projectSchemas = {
  create: z.object({
    name: z.string().min(1, 'Project name is required').max(100, 'Name too long'),
    description: z.string().max(1000, 'Description too long').optional(),
    metadata: z.record(z.any()).optional(),
  }),

  update: z.object({
    name: z.string().min(1, 'Project name is required').max(100, 'Name too long').optional(),
    description: z.string().max(1000, 'Description too long').optional(),
    status: z.enum(['ACTIVE', 'ARCHIVED', 'COMPLETED']).optional(),
    metadata: z.record(z.any()).optional(),
  }),
};

// API Key validation schemas
export const apiKeySchemas = {
  create: z.object({
    name: z.string().min(1, 'API key name is required').max(50, 'Name too long'),
    expiresAt: z.date().optional(),
  }),

  update: z.object({
    name: z.string().min(1, 'API key name is required').max(50, 'Name too long').optional(),
    expiresAt: z.date().optional(),
  }),
};

// Subscription validation schemas
export const subscriptionSchemas = {
  create: z.object({
    plan: z.enum(['FREE', 'BASIC', 'PRO', 'ENTERPRISE']),
    stripePriceId: z.string().optional(),
  }),

  update: z.object({
    plan: z.enum(['FREE', 'BASIC', 'PRO', 'ENTERPRISE']).optional(),
    cancelAtPeriodEnd: z.boolean().optional(),
  }),
};

// Data source validation schemas
export const dataSourceSchemas = {
  create: z.object({
    name: z.string().min(1, 'Source name is required').max(100, 'Name too long'),
    type: z.enum(['SHOPIFY_JSON', 'GOOGLE_TRENDS_CSV', 'TIKTOK_BUSINESS_JSON', 'ALIEXPRESS_CSV', 'GENERIC_CSV', 'GENERIC_JSON']),
    config: z.record(z.any()),
    isActive: z.boolean().optional(),
  }),

  update: z.object({
    name: z.string().min(1, 'Source name is required').max(100, 'Name too long').optional(),
    config: z.record(z.any()).optional(),
    isActive: z.boolean().optional(),
  }),
};

// AI Run validation schemas
export const aiRunSchemas = {
  create: z.object({
    kind: z.enum(['CHAT', 'AUDIT', 'ESTIMATE', 'CONTENT_GENERATION', 'WORKFLOW_GENERATION']),
    provider: z.string().min(1, 'Provider is required'),
    model: z.string().min(1, 'Model is required'),
    maxTokens: z.number().positive().optional(),
    temperature: z.number().min(0).max(2).optional(),
    prompt: z.string().min(1, 'Prompt is required'),
  }),
};

// Report validation schemas
export const reportSchemas = {
  create: z.object({
    title: z.string().min(1, 'Report title is required').max(200, 'Title too long'),
    type: z.enum(['AUDIT', 'ESTIMATE', 'CONTENT_PLAN', 'WORKFLOW']),
    content: z.record(z.any()),
    metadata: z.record(z.any()).optional(),
  }),

  update: z.object({
    title: z.string().min(1, 'Report title is required').max(200, 'Title too long').optional(),
    content: z.record(z.any()).optional(),
    metadata: z.record(z.any()).optional(),
  }),
};

// Webhook validation schemas
export const webhookSchemas = {
  create: z.object({
    url: urlSchema,
    events: z.array(z.string()).min(1, 'At least one event is required'),
    secret: z.string().min(1, 'Webhook secret is required'),
    isActive: z.boolean().optional(),
  }),

  update: z.object({
    url: urlSchema.optional(),
    events: z.array(z.string()).min(1, 'At least one event is required').optional(),
    secret: z.string().min(1, 'Webhook secret is required').optional(),
    isActive: z.boolean().optional(),
  }),
};

// Feature flag validation schemas
export const featureFlagSchemas = {
  create: z.object({
    key: z.string().min(1, 'Feature flag key is required').max(50, 'Key too long'),
    name: z.string().min(1, 'Feature flag name is required').max(100, 'Name too long'),
    description: z.string().max(500, 'Description too long').optional(),
    enabled: z.boolean().optional(),
    config: z.record(z.any()).optional(),
  }),

  update: z.object({
    name: z.string().min(1, 'Feature flag name is required').max(100, 'Name too long').optional(),
    description: z.string().max(500, 'Description too long').optional(),
    enabled: z.boolean().optional(),
    config: z.record(z.any()).optional(),
  }),
};

// Query parameter validation schemas
export const querySchemas = {
  pagination: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),

  search: z.object({
    q: z.string().min(1, 'Search query is required').max(100, 'Query too long'),
    ...querySchemas.pagination.shape,
  }),

  dateRange: z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }),
};

// File upload validation schemas
export const fileSchemas = {
  image: z.object({
    file: z.instanceof(File),
    maxSize: z.number().positive().default(5 * 1024 * 1024), // 5MB
    allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/webp']),
  }),

  document: z.object({
    file: z.instanceof(File),
    maxSize: z.number().positive().default(10 * 1024 * 1024), // 10MB
    allowedTypes: z.array(z.string()).default(['application/pdf', 'text/csv', 'application/json']),
  }),
};

// Sanitization functions
export const sanitizers = {
  // HTML sanitization
  html: (input: string): string => {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  // SQL injection prevention
  sql: (input: string): string => {
    return input
      .replace(/'/g, "''")
      .replace(/--/g, '')
      .replace(/;/, '');
  },

  // XSS prevention
  xss: (input: string): string => {
    return input
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .replace(/<script/gi, '')
      .replace(/<\/script>/gi, '');
  },

  // Email sanitization
  email: (input: string): string => {
    return input.toLowerCase().trim();
  },

  // Phone number sanitization
  phone: (input: string): string => {
    return input.replace(/[^\d+]/g, '');
  },
};

// Validation error formatter
export const formatValidationError = (error: z.ZodError): Record<string, string> => {
  const formatted: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    formatted[path] = err.message;
  });
  
  return formatted;
};

// Generic validation function
export const validateInput = <T>(
  schema: z.ZodSchema<T>,
  input: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
  try {
    const data = schema.parse(input);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: formatValidationError(error) };
    }
    throw error;
  }
};

// Middleware for API validation
export const createValidationMiddleware = <T>(schema: z.ZodSchema<T>) => {
  return (input: unknown) => {
    const result = validateInput(schema, input);
    if (!result.success) {
      throw new Error(`Validation failed: ${JSON.stringify(result.errors)}`);
    }
    return result.data;
  };
};