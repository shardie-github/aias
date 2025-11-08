/**
 * API Route Handler Utilities
 * Secure, performant API route handlers with built-in security
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateInput, sanitizeObject, checkRequestSize, maskSensitiveData } from '../security/api-security';
import { tenantIsolation } from '../security/tenant-isolation';
import { cacheService } from '../performance/cache';
import { z } from 'zod';

export interface RouteHandlerOptions {
  requireAuth?: boolean;
  requireTenant?: boolean;
  requiredPermission?: string;
  rateLimit?: {
    windowMs: number;
    maxRequests: number;
  };
  maxBodySize?: number;
  validateBody?: z.ZodSchema<any>;
  cache?: {
    enabled: boolean;
    ttl?: number;
    tags?: string[];
  };
}

export interface RouteContext {
  request: NextRequest;
  userId: string | null;
  tenantId: string | null;
  tenantContext?: any;
}

/**
 * Create secure API route handler
 */
export function createRouteHandler(
  handler: (context: RouteContext) => Promise<NextResponse>,
  options: RouteHandlerOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    
    try {
      // Check request size
      if (options.maxBodySize) {
        const body = await request.text();
        if (!checkRequestSize(body, options.maxBodySize)) {
          return NextResponse.json(
            { error: 'Request too large' },
            { status: 413 }
          );
        }
      }
      
      // Get user ID from request
      let userId: string | null = null;
      if (options.requireAuth || options.requireTenant) {
        const authHeader = request.headers.get('authorization');
        if (authHeader?.startsWith('Bearer ')) {
          // Extract user ID from token (simplified - should verify JWT)
          userId = request.headers.get('x-user-id') || null;
        }
        
        if (options.requireAuth && !userId) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          );
        }
      }
      
      // Get tenant ID
      let tenantId: string | null = null;
      if (options.requireTenant) {
        tenantId = request.headers.get('x-tenant-id') || null;
        
        if (!tenantId) {
          return NextResponse.json(
            { error: 'Tenant ID required' },
            { status: 400 }
          );
        }
        
        // Validate tenant access
        if (userId) {
          const access = await tenantIsolation.validateAccess(
            tenantId,
            userId,
            options.requiredPermission
          );
          
          if (!access.allowed) {
            return NextResponse.json(
              { error: 'Forbidden' },
              { status: 403 }
            );
          }
        }
      }
      
      // Validate request body
      if (options.validateBody) {
        try {
          const body = await request.json();
          const validation = validateInput(options.validateBody, body);
          
          if (!validation.success) {
            return NextResponse.json(
              { error: 'Invalid request body', details: validation.error },
              { status: 400 }
            );
          }
        } catch (error) {
          return NextResponse.json(
            { error: 'Invalid JSON body' },
            { status: 400 }
          );
        }
      }
      
      // Check cache
      if (options.cache?.enabled) {
        const cacheKey = `api:${request.nextUrl.pathname}:${await request.text()}`;
        const cached = await cacheService.get(cacheKey, {
          ttl: options.cache.ttl,
          tenantId: tenantId || undefined,
          tags: options.cache.tags,
        });
        
        if (cached) {
          const response = NextResponse.json(cached);
          response.headers.set('X-Cache', 'HIT');
          response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
          return response;
        }
      }
      
      // Create context
      const context: RouteContext = {
        request,
        userId,
        tenantId,
      };
      
      // Execute handler
      const response = await handler(context);
      
      // Add security headers
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
      
      // Cache response if enabled
      if (options.cache?.enabled && response.status === 200) {
        try {
          const body = await response.clone().json();
          const cacheKey = `api:${request.nextUrl.pathname}:${await request.text()}`;
          await cacheService.set(cacheKey, body, {
            ttl: options.cache.ttl,
            tenantId: tenantId || undefined,
            tags: options.cache.tags,
          });
          response.headers.set('X-Cache', 'MISS');
        } catch {
          // Not JSON response, skip caching
        }
      }
      
      return response;
    } catch (error) {
      console.error('Route handler error:', maskSensitiveData(String(error)));
      
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: process.env.NODE_ENV === 'development' 
            ? String(error) 
            : 'An error occurred processing your request',
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Create GET route handler
 */
export function createGETHandler(
  handler: (context: RouteContext) => Promise<NextResponse>,
  options: RouteHandlerOptions = {}
) {
  return createRouteHandler(handler, {
    ...options,
    cache: options.cache ?? { enabled: true, ttl: 300 },
  });
}

/**
 * Create POST route handler
 */
export function createPOSTHandler(
  handler: (context: RouteContext) => Promise<NextResponse>,
  options: RouteHandlerOptions = {}
) {
  return createRouteHandler(handler, {
    ...options,
    cache: { enabled: false }, // Don't cache POST requests
  });
}
