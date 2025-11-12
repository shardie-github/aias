> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Quick Start: Security & Performance Features

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install ioredis zod
```

### 2. Configure Environment

Add to your `.env.local`:

```bash
# Redis (optional but recommended for production)
REDIS_URL=redis://localhost:6379

# Supabase (should already be configured)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Start Using

The middleware is automatically enabled. Start using secure route handlers:

```typescript
// app/api/my-endpoint/route.ts
import { createGETHandler } from '@/lib/api/route-handler';

export const GET = createGETHandler(async (context) => {
  // Your handler logic
  return NextResponse.json({ data: [] });
}, {
  requireAuth: true,
  requireTenant: true,
  cache: { enabled: true, ttl: 300 },
});
```

## 📋 Common Patterns

### Secure GET Endpoint

```typescript
import { createGETHandler } from '@/lib/api/route-handler';
import { tenantIsolation } from '@/lib/security/tenant-isolation';
import { queryOptimizer } from '@/lib/performance/query-optimizer';

export const GET = createGETHandler(async (context) => {
  const { tenantId, userId } = context;
  
  // Validate access
  const access = await tenantIsolation.validateAccess(tenantId, userId);
  if (!access.allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Use optimized query
  const data = await queryOptimizer.select('table_name', {
    cache: true,
    tenantId,
  });
  
  return NextResponse.json({ data });
}, {
  requireAuth: true,
  requireTenant: true,
  cache: { enabled: true, ttl: 300 },
});
```

### Secure POST Endpoint

```typescript
import { createPOSTHandler } from '@/lib/api/route-handler';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export const POST = createPOSTHandler(async (context) => {
  const { tenantId, userId, request } = context;
  const body = await request.json();
  
  // Check limits
  const limits = await tenantIsolation.checkLimits(tenantId, 'resource', 1);
  if (!limits.allowed) {
    return NextResponse.json(
      { error: 'Limit exceeded', remaining: limits.remaining },
      { status: 429 }
    );
  }
  
  // Create resource
  // ... your logic ...
  
  // Record usage
  await tenantIsolation.recordUsage(tenantId, 'resource', 1);
  
  return NextResponse.json({ success: true });
}, {
  requireAuth: true,
  requireTenant: true,
  validateBody: schema,
});
```

### Tenant Isolation

```typescript
import { tenantIsolation } from '@/lib/security/tenant-isolation';

// Validate access with permission
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

### Caching

```typescript
import { cacheService } from '@/lib/performance/cache';

// Get from cache
const data = await cacheService.get('my-key', {
  ttl: 3600,
  tenantId: 'tenant-123',
  tags: ['table:workflows'],
});

// Set in cache
await cacheService.set('my-key', data, {
  ttl: 3600,
  tenantId: 'tenant-123',
  tags: ['table:workflows'],
});

// Invalidate cache
await cacheService.invalidateTags(['table:workflows']);
```

## 🔒 Security Features

### Rate Limiting

Rate limiting is automatically applied via middleware. Configure limits in `middleware.ts`:

```typescript
const rateLimitConfig = {
  '/api/auth': { windowMs: 60 * 1000, maxRequests: 5 },
  '/api/stripe': { windowMs: 60 * 1000, maxRequests: 20 },
  default: { windowMs: 60 * 1000, maxRequests: 100 },
};
```

### Input Validation

```typescript
import { validateInput, sanitizeInput } from '@/lib/security/api-security';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

// Validate
const result = validateInput(schema, input);
if (!result.success) {
  return NextResponse.json({ error: result.error }, { status: 400 });
}

// Sanitize
const clean = sanitizeInput(userInput);
```

### Security Monitoring

```typescript
import { securityMonitor } from '@/lib/monitoring/security-monitor';

// Record security event
await securityMonitor.recordEvent({
  type: 'unauthorized',
  severity: 'medium',
  tenantId: 'tenant-123',
  userId: 'user-456',
  ipAddress: '1.2.3.4',
  endpoint: '/api/endpoint',
  method: 'GET',
});

// Get events
const events = await securityMonitor.getEvents({
  tenantId: 'tenant-123',
  severity: 'critical',
});
```

## ⚡ Performance Features

### Query Optimization

```typescript
import { queryOptimizer } from '@/lib/performance/query-optimizer';

// Optimized select with caching
const data = await queryOptimizer.select('table_name', {
  cache: true,
  cacheTTL: 300,
  tenantId: 'tenant-123',
  limit: 20,
});

// Batch select
const items = await queryOptimizer.batchSelect(
  'table_name',
  ['id1', 'id2', 'id3'],
  { tenantId: 'tenant-123' }
);

// Invalidate cache
await queryOptimizer.invalidateTableCache('table_name', 'tenant-123');
```

## 📊 Monitoring

### Response Headers

All responses include performance and security headers:

- `X-Response-Time`: Response time in milliseconds
- `X-Cache`: Cache hit/miss status (HIT/MISS)
- `X-RateLimit-Limit`: Rate limit maximum
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

### Security Events

Security events are automatically logged. Query them:

```typescript
import { securityMonitor } from '@/lib/monitoring/security-monitor';

// Get statistics
const stats = await securityMonitor.getStatistics('tenant-123');
console.log(stats);
// {
//   totalEvents: 150,
//   eventsByType: { rate_limit: 50, unauthorized: 100 },
//   eventsBySeverity: { low: 100, medium: 50 },
//   recentCriticalEvents: 0
// }
```

## 🎯 Best Practices

1. **Always use route handlers** for API routes
2. **Enable caching** for GET endpoints
3. **Validate input** with Zod schemas
4. **Check resource limits** before creating resources
5. **Record usage** after successful operations
6. **Invalidate cache** after updates
7. **Monitor security events** for suspicious activity

## 📚 More Information

- **Full Documentation**: `docs/SECURITY_HARDENING.md`
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY_SECURITY.md`
- **Example Implementation**: `app/api/example-secure/route.ts`

## 🆘 Troubleshooting

### Rate Limiting Not Working

- Check Redis connection (if using Redis)
- Verify rate limit configuration in `middleware.ts`
- Check rate limit headers in response

### Cache Not Working

- Verify Redis connection (if using Redis)
- Check cache key generation
- Review cache TTL settings

### Tenant Isolation Issues

- Verify tenant ID extraction
- Check tenant membership in database
- Review RLS policies

### Performance Issues

- Check cache hit rates
- Review database query performance
- Monitor response times
- Check for N+1 queries
