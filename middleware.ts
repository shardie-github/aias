/**
 * Next.js Middleware
 * Enterprise-grade security, rate limiting, and multi-tenant isolation
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

// Security headers configuration
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://*.supabase.in",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co wss://*.supabase.in",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests",
  ].join('; '),
};

// Rate limiting configuration per endpoint
const rateLimitConfig = {
  '/api/auth': { windowMs: 60 * 1000, maxRequests: 5 },
  '/api/stripe': { windowMs: 60 * 1000, maxRequests: 20 },
  '/api/telemetry': { windowMs: 60 * 1000, maxRequests: 100 },
  '/api/ingest': { windowMs: 60 * 1000, maxRequests: 50 },
  default: { windowMs: 60 * 1000, maxRequests: 100 },
};

// In-memory rate limit store (fallback when Redis unavailable)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Cleanup expired rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Cleanup every minute

/**
 * Get client IP address from request
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  return 'unknown';
}

/**
 * Check rate limit for request
 */
function checkRateLimit(
  pathname: string,
  identifier: string
): { allowed: boolean; remaining: number; resetTime: number } {
  const config = rateLimitConfig[pathname as keyof typeof rateLimitConfig] || rateLimitConfig.default;
  const key = `rate_limit:${pathname}:${identifier}`;
  const now = Date.now();
  
  const entry = rateLimitStore.get(key);
  
  if (!entry || entry.resetTime < now) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }
  
  entry.count++;
  rateLimitStore.set(key, entry);
  
  if (entry.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }
  
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Extract tenant ID from request
 */
function extractTenantId(request: NextRequest): string | null {
  // Check header first
  const headerTenantId = request.headers.get('x-tenant-id');
  if (headerTenantId) return headerTenantId;
  
  // Check subdomain
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
    return subdomain;
  }
  
  // Check query parameter (for API routes)
  const url = new URL(request.url);
  const queryTenantId = url.searchParams.get('tenantId');
  if (queryTenantId) return queryTenantId;
  
  return null;
}

/**
 * Validate tenant access
 */
async function validateTenantAccess(
  tenantId: string | null,
  userId: string | null
): Promise<{ allowed: boolean; tenantId: string | null }> {
  if (!tenantId) {
    // Public routes don't require tenant
    return { allowed: true, tenantId: null };
  }
  
  if (!userId) {
    // Tenant routes require authentication
    return { allowed: false, tenantId: null };
  }
  
  try {
    const supabase = createClient(
      env.supabase.url,
      env.supabase.serviceRoleKey
    );
    
    // Check if user is member of tenant
    const { data, error } = await supabase
      .from('tenant_members')
      .select('tenant_id')
      .eq('tenant_id', tenantId)
      .eq('user_id', userId)
      .single();
    
    if (error || !data) {
      return { allowed: false, tenantId: null };
    }
    
    return { allowed: true, tenantId };
  } catch (error) {
    console.error('Tenant validation error:', error);
    return { allowed: false, tenantId: null };
  }
}

/**
 * Check admin access (Basic Auth or Vercel Access Control)
 * For Vercel deployments, use Vercel Access Controls
 * For other deployments, use Basic Auth via ADMIN_BASIC_AUTH secret
 */
function checkAdminAccess(request: NextRequest): boolean {
  // Check for Vercel deployment (use Vercel Access Controls)
  if (process.env.VERCEL) {
    // Vercel Access Controls are handled at platform level
    // Return true - access control is managed by Vercel
    return true;
  }
  
  // For non-Vercel deployments, use Basic Auth
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }
  
  // Get expected credentials from secret (name only, never echo value)
  const adminAuthSecret = process.env.ADMIN_BASIC_AUTH;
  if (!adminAuthSecret) {
    // No secret configured - deny access
    return false;
  }
  
  // Decode and verify Basic Auth
  try {
    const encoded = authHeader.substring(6);
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    const [username, password] = decoded.split(':');
    
    // Compare with secret (format: "username:password")
    return decoded === adminAuthSecret;
  } catch {
    return false;
  }
}

/**
 * Get user ID from request (JWT or session)
 */
async function getUserId(request: NextRequest): Promise<string | null> {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
      try {
        const supabase = createClient(
          env.supabase.url,
          env.supabase.anonKey
        );
        const { data: { user } } = await supabase.auth.getUser(token);
        return user?.id || null;
      } catch {
        return null;
      }
  }
  
  // Check cookie
  const sessionCookie = request.cookies.get('sb-access-token');
  if (sessionCookie) {
      try {
        const supabase = createClient(
          env.supabase.url,
          env.supabase.anonKey
        );
        const { data: { user } } = await supabase.auth.getUser(sessionCookie.value);
        return user?.id || null;
      } catch {
        return null;
      }
  }
  
  return null;
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const startTime = Date.now();
  
  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/manifest.json') ||
    pathname.startsWith('/sw.js')
  ) {
    return NextResponse.next();
  }
  
  // Health check endpoint - minimal processing
  if (pathname === '/api/healthz') {
    return NextResponse.next();
  }
  
  // Admin dashboard protection
  if (pathname.startsWith('/admin/')) {
    const hasAdminAccess = checkAdminAccess(request);
    
    if (!hasAdminAccess) {
      // Return 401 Unauthorized with WWW-Authenticate header for Basic Auth
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Dashboard"',
        },
      });
    }
  }
  
  // Get client identifier
  const clientIP = getClientIP(request);
  const userId = await getUserId(request);
  const identifier = userId || clientIP;
  
  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const rateLimit = checkRateLimit(pathname, identifier);
    
    if (!rateLimit.allowed) {
      const response = NextResponse.json(
        {
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        },
        { status: 429 }
      );
      
      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', '100');
      response.headers.set('X-RateLimit-Remaining', '0');
      response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimit.resetTime / 1000).toString());
      response.headers.set('Retry-After', Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString());
      
      return response;
    }
  }
  
  // Multi-tenant isolation for API routes
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/healthz')) {
    const tenantId = extractTenantId(request);
    
    if (tenantId) {
      const tenantAccess = await validateTenantAccess(tenantId, userId);
      
      if (!tenantAccess.allowed) {
        return NextResponse.json(
          {
            error: 'Forbidden',
            message: 'Access denied. Invalid tenant or insufficient permissions.',
          },
          { status: 403 }
        );
      }
      
      // Add tenant ID to request headers for downstream use
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-tenant-id', tenantAccess.tenantId || '');
      requestHeaders.set('x-tenant-validated', 'true');
      
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      
      // Add security headers
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      // Add rate limit headers
      if (pathname.startsWith('/api/')) {
        const rateLimit = checkRateLimit(pathname, identifier);
        response.headers.set('X-RateLimit-Limit', '100');
        response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
        response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimit.resetTime / 1000).toString());
      }
      
      // Add performance headers
      response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
      
      return response;
    }
  }
  
  // Create response with security headers
  const response = NextResponse.next();
  
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add rate limit headers for API routes
  if (pathname.startsWith('/api/')) {
    const rateLimit = checkRateLimit(pathname, identifier);
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimit.resetTime / 1000).toString());
  }
  
  // Add performance headers
  response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
  
  return response;
}

/**
 * Middleware matcher - only run on specific paths
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
