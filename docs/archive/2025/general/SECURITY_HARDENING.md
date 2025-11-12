> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Security Hardening & Performance Optimization Guide

## Overview

This document outlines the comprehensive security hardening and performance optimizations implemented for enterprise-scale multi-tenant access.

## Security Enhancements

### 1. Next.js Middleware (`middleware.ts`)

**Features:**
- **Rate Limiting**: Per-endpoint rate limiting with configurable limits
- **Multi-Tenant Isolation**: Automatic tenant validation and context injection
- **Security Headers**: Comprehensive security headers on all responses
- **IP Extraction**: Support for various proxy configurations (Cloudflare, Vercel, etc.)
- **Performance Tracking**: Response time headers for monitoring

**Configuration:**
```typescript
const rateLimitConfig = {
  '/api/auth': { windowMs: 60 * 1000, maxRequests: 5 },
  '/api/stripe': { windowMs: 60 * 1000, maxRequests: 20 },
  '/api/telemetry': { windowMs: 60 * 1000, maxRequests: 100 },
  default: { windowMs: 60 * 1000, maxRequests: 100 },
};
```

### 2. Tenant Isolation Service (`lib/security/tenant-isolation.ts`)

**Features:**
- **Tenant Context Management**: Secure tenant context retrieval and validation
- **Access Control**: Role-based access control (RBAC) with permissions
- **Resource Limits**: Per-tenant resource limit checking and enforcement
- **Usage Tracking**: Automatic usage tracking for billing and limits
- **RLS Enforcement**: Row-Level Security context setting

**Usage:**
```typescript
import { tenantIsolation } from '@/lib/security/tenant-isolation';

// Validate tenant access
const access = await tenantIsolation.validateAccess(
  tenantId,
  userId,
  'workflow:create'
);

// Check resource limits
const limits = await tenantIsolation.checkLimits(
  tenantId,
  'workflows',
  1
);

// Record usage
await tenantIsolation.recordUsage(tenantId, 'workflows', 1);
```

### 3. API Security Utilities (`lib/security/api-security.ts`)

**Features:**
- **Input Validation**: Zod-based schema validation
- **Input Sanitization**: XSS and SQL injection prevention
- **Output Sanitization**: HTML sanitization for user-generated content
- **Request Size Limits**: Protection against large payload attacks
- **Sensitive Data Masking**: Log sanitization for security

**Usage:**
```typescript
import { validateInput, sanitizeInput, detectSQLInjection } from '@/lib/security/api-security';

// Validate input
const schema = z.object({ email: z.string().email() });
const result = validateInput(schema, input);

// Sanitize input
const clean = sanitizeInput(userInput);

// Detect attacks
if (detectSQLInjection(input)) {
  throw new Error('Invalid input detected');
}
```

### 4. Enhanced Security Headers

**Headers Added:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `Content-Security-Policy`: Comprehensive CSP policy
- `Permissions-Policy`: Restrictive permissions policy
- `Referrer-Policy: strict-origin-when-cross-origin`

## Performance Optimizations

### 1. Multi-Layer Caching (`lib/performance/cache.ts`)

**Features:**
- **Redis Caching**: Primary cache layer with Redis
- **Memory Cache Fallback**: In-memory cache when Redis unavailable
- **Cache Tagging**: Tag-based cache invalidation
- **Tenant-Specific Caching**: Isolated cache per tenant
- **Automatic Cleanup**: Expired entry cleanup

**Usage:**
```typescript
import { cacheService } from '@/lib/performance/cache';

// Get from cache
const data = await cacheService.get('key', {
  ttl: 3600,
  tenantId: 'tenant-123',
  tags: ['table:workflows'],
});

// Set in cache
await cacheService.set('key', data, {
  ttl: 3600,
  tenantId: 'tenant-123',
  tags: ['table:workflows'],
});

// Invalidate by tags
await cacheService.invalidateTags(['table:workflows']);
```

### 2. Query Optimizer (`lib/performance/query-optimizer.ts`)

**Features:**
- **Automatic Caching**: Query result caching
- **Batch Queries**: Optimized batch data fetching
- **Tenant Filtering**: Automatic tenant filtering
- **Pagination Support**: Built-in pagination
- **Cache Invalidation**: Automatic cache invalidation on updates

**Usage:**
```typescript
import { queryOptimizer } from '@/lib/performance/query-optimizer';

// Optimized select
const workflows = await queryOptimizer.select('workflows', {
  cache: true,
  cacheTTL: 300,
  tenantId: 'tenant-123',
  limit: 20,
});

// Batch select
const items = await queryOptimizer.batchSelect('workflows', ['id1', 'id2'], {
  tenantId: 'tenant-123',
});
```

### 3. API Route Handler (`lib/api/route-handler.ts`)

**Features:**
- **Built-in Security**: Automatic security checks
- **Request Validation**: Schema-based validation
- **Response Caching**: Automatic response caching
- **Error Handling**: Comprehensive error handling
- **Performance Tracking**: Response time tracking

**Usage:**
```typescript
import { createGETHandler, createPOSTHandler } from '@/lib/api/route-handler';
import { z } from 'zod';

const bodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export const GET = createGETHandler(async (context) => {
  // Handler logic
  return NextResponse.json({ data: [] });
}, {
  requireAuth: true,
  requireTenant: true,
  cache: { enabled: true, ttl: 300 },
});

export const POST = createPOSTHandler(async (context) => {
  const body = await context.request.json();
  // Handler logic
  return NextResponse.json({ success: true });
}, {
  requireAuth: true,
  requireTenant: true,
  validateBody: bodySchema,
  maxBodySize: 1024 * 1024, // 1MB
});
```

## Multi-Tenant Architecture

### Tenant Isolation Strategy

1. **Row-Level Security (RLS)**: Database-level tenant isolation
2. **Middleware Validation**: Request-level tenant validation
3. **Context Injection**: Automatic tenant context in requests
4. **Resource Limits**: Per-tenant resource quotas
5. **Usage Tracking**: Per-tenant usage monitoring

### Tenant Identification

Tenants can be identified via:
- `X-Tenant-ID` header
- Subdomain (e.g., `tenant1.example.com`)
- Query parameter (`?tenantId=...`)

### Access Control

- **Role-Based**: Owner, Admin, Member, Viewer
- **Permission-Based**: Granular permissions per action
- **Resource-Based**: Per-resource access control

## Performance Metrics

### Target Metrics

- **API Response Time**: < 200ms (p95)
- **Cache Hit Rate**: > 80%
- **Database Query Time**: < 50ms (p95)
- **Throughput**: 10,000+ requests/second
- **Concurrent Users**: 10,000+ simultaneous users

### Monitoring

- Response time headers (`X-Response-Time`)
- Cache hit/miss headers (`X-Cache`)
- Rate limit headers (`X-RateLimit-*`)
- Performance metrics in logs

## Security Best Practices

### 1. Input Validation

- Always validate input with Zod schemas
- Sanitize user input before processing
- Check for SQL injection and XSS patterns
- Enforce request size limits

### 2. Authentication & Authorization

- Require authentication for sensitive endpoints
- Validate tenant access for multi-tenant endpoints
- Check permissions before allowing actions
- Use secure token storage and validation

### 3. Rate Limiting

- Configure appropriate limits per endpoint
- Use tenant-aware rate limiting
- Monitor rate limit violations
- Implement progressive backoff

### 4. Caching

- Cache frequently accessed data
- Use appropriate TTLs
- Invalidate cache on updates
- Use tenant-specific cache keys

### 5. Error Handling

- Don't expose sensitive information in errors
- Log errors with sanitized data
- Return appropriate HTTP status codes
- Implement proper error recovery

## Deployment Considerations

### Environment Variables

```bash
# Redis (for caching and rate limiting)
REDIS_URL=redis://localhost:6379

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Security
JWT_SECRET=your-jwt-secret
```

### Infrastructure Requirements

- **Redis**: For caching and rate limiting (recommended)
- **Database Connection Pooling**: Configured in Supabase
- **CDN**: For static asset delivery
- **Load Balancer**: For high availability

### Monitoring & Alerting

- Monitor rate limit violations
- Track cache hit rates
- Monitor response times
- Alert on security events
- Track tenant resource usage

## Migration Guide

### Step 1: Install Dependencies

```bash
npm install ioredis zod
```

### Step 2: Configure Environment

Add Redis URL and other required environment variables.

### Step 3: Update API Routes

Migrate existing API routes to use the new route handlers:

```typescript
// Before
export async function GET(request: NextRequest) {
  // Handler logic
}

// After
import { createGETHandler } from '@/lib/api/route-handler';

export const GET = createGETHandler(async (context) => {
  // Handler logic
}, {
  requireAuth: true,
  requireTenant: true,
});
```

### Step 4: Enable Middleware

The middleware is automatically enabled when `middleware.ts` exists in the root.

### Step 5: Test

- Test rate limiting
- Test tenant isolation
- Test caching
- Test security headers
- Load test for performance

## Troubleshooting

### Rate Limiting Issues

- Check Redis connection
- Verify rate limit configuration
- Check for IP address extraction issues
- Review rate limit headers in responses

### Cache Issues

- Verify Redis connection
- Check cache key generation
- Review cache TTLs
- Check cache invalidation logic

### Tenant Isolation Issues

- Verify tenant ID extraction
- Check tenant membership
- Review RLS policies
- Check permission validation

### Performance Issues

- Review cache hit rates
- Check database query performance
- Review response times
- Check for N+1 queries
- Review connection pooling

## Additional Resources

- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Supabase Row-Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
