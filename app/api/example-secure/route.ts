/**
 * Example Secure API Route
 * Demonstrates enterprise security and performance features
 */

import { createGETHandler, createPOSTHandler } from '@/lib/api/route-handler';
import { tenantIsolation } from '@/lib/security/tenant-isolation';
import { queryOptimizer } from '@/lib/performance/query-optimizer';
import { securityMonitor } from '@/lib/monitoring/security-monitor';
import { z } from 'zod';
import { NextResponse } from 'next/server';

// Validation schema
const createWorkflowSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  steps: z.array(z.object({
    type: z.string(),
    config: z.record(z.any()),
  })).min(1),
});

/**
 * GET /api/example-secure
 * Example secure GET endpoint with caching
 */
export const GET = createGETHandler(async (context) => {
  const { tenantId, userId } = context;
  
  if (!tenantId || !userId) {
    return NextResponse.json(
      { error: 'Tenant and user required' },
      { status: 400 }
    );
  }
  
  // Validate tenant access
  const access = await tenantIsolation.validateAccess(tenantId, userId);
  if (!access.allowed) {
    await securityMonitor.recordEvent({
      type: 'unauthorized',
      severity: 'medium',
      tenantId,
      userId,
      ipAddress: context.request.headers.get('x-forwarded-for') || 'unknown',
      endpoint: '/api/example-secure',
      method: 'GET',
    });
    
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }
  
  // Check resource limits
  const limits = await tenantIsolation.checkLimits(tenantId, 'workflows');
  if (!limits.allowed) {
    return NextResponse.json(
      {
        error: 'Resource limit exceeded',
        limit: limits.limit,
        remaining: limits.remaining,
      },
      { status: 429 }
    );
  }
  
  // Use optimized query with caching
  const workflows = await queryOptimizer.select('workflows', {
    cache: true,
    cacheTTL: 300, // 5 minutes
    tenantId,
    limit: 20,
  });
  
  return NextResponse.json({
    data: workflows,
    limits: {
      limit: limits.limit,
      remaining: limits.remaining,
    },
  });
}, {
  requireAuth: true,
  requireTenant: true,
  cache: {
    enabled: true,
    ttl: 300,
    tags: ['workflows'],
  },
});

/**
 * POST /api/example-secure
 * Example secure POST endpoint with validation
 */
export const POST = createPOSTHandler(async (context) => {
  const { tenantId, userId, request } = context;
  
  if (!tenantId || !userId) {
    return NextResponse.json(
      { error: 'Tenant and user required' },
      { status: 400 }
    );
  }
  
  // Validate tenant access with permission
  const access = await tenantIsolation.validateAccess(
    tenantId,
    userId,
    'workflow:create'
  );
  
  if (!access.allowed) {
    await securityMonitor.recordEvent({
      type: 'unauthorized',
      severity: 'medium',
      tenantId,
      userId,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      endpoint: '/api/example-secure',
      method: 'POST',
      details: { reason: 'Missing permission: workflow:create' },
    });
    
    return NextResponse.json(
      { error: 'Forbidden: Missing required permission' },
      { status: 403 }
    );
  }
  
  // Check resource limits
  const limits = await tenantIsolation.checkLimits(tenantId, 'workflows', 1);
  if (!limits.allowed) {
    await securityMonitor.recordEvent({
      type: 'rate_limit',
      severity: 'low',
      tenantId,
      userId,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      endpoint: '/api/example-secure',
      method: 'POST',
      details: {
        resource: 'workflows',
        limit: limits.limit,
        remaining: limits.remaining,
      },
    });
    
    return NextResponse.json(
      {
        error: 'Resource limit exceeded',
        limit: limits.limit,
        remaining: limits.remaining,
      },
      { status: 429 }
    );
  }
  
  // Parse and validate body (already validated by route handler)
  const body = await request.json();
  
  // Create workflow (example - would use actual Supabase client)
  // const workflow = await createWorkflow(tenantId, body);
  
  // Record usage
  await tenantIsolation.recordUsage(tenantId, 'workflows', 1);
  
  // Invalidate cache
  await queryOptimizer.invalidateTableCache('workflows', tenantId);
  
  return NextResponse.json({
    success: true,
    message: 'Workflow created successfully',
    // workflow,
  });
}, {
  requireAuth: true,
  requireTenant: true,
  requiredPermission: 'workflow:create',
  validateBody: createWorkflowSchema,
  maxBodySize: 1024 * 1024, // 1MB
});
