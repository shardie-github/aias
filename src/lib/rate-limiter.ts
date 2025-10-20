/**
 * Rate Limiting System
 * Redis-based rate limiting with sliding window algorithm
 */

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: any) => string; // Custom key generator
  skipSuccessfulRequests?: boolean; // Skip counting successful requests
  skipFailedRequests?: boolean; // Skip counting failed requests
  message?: string; // Custom error message
  standardHeaders?: boolean; // Add rate limit headers
  legacyHeaders?: boolean; // Add legacy rate limit headers
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
  retryAfter?: number; // Seconds until reset
}

export class RateLimiter {
  private config: Required<RateLimitConfig>;
  private redis: any; // Redis client
  private cache: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(config: RateLimitConfig, redis?: any) {
    this.config = {
      windowMs: config.windowMs,
      maxRequests: config.maxRequests,
      keyGenerator: config.keyGenerator || this.defaultKeyGenerator,
      skipSuccessfulRequests: config.skipSuccessfulRequests || false,
      skipFailedRequests: config.skipFailedRequests || false,
      message: config.message || 'Too many requests, please try again later.',
      standardHeaders: config.standardHeaders || true,
      legacyHeaders: config.legacyHeaders || false,
    };
    this.redis = redis;
  }

  private defaultKeyGenerator(req: any): string {
    // Extract IP address from request
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    return `rate_limit:${ip}`;
  }

  private async getRedisValue(key: string): Promise<{ count: number; resetTime: number } | null> {
    if (!this.redis) {
      // Fallback to in-memory cache
      return this.cache.get(key) || null;
    }

    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis error:', error);
      return null;
    }
  }

  private async setRedisValue(key: string, value: { count: number; resetTime: number }): Promise<void> {
    if (!this.redis) {
      // Fallback to in-memory cache
      this.cache.set(key, value);
      return;
    }

    try {
      const ttl = Math.ceil((value.resetTime - Date.now()) / 1000);
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Redis error:', error);
      // Fallback to in-memory cache
      this.cache.set(key, value);
    }
  }

  private async incrementCounter(key: string): Promise<{ count: number; resetTime: number }> {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    let data = await this.getRedisValue(key);
    
    if (!data || data.resetTime < now) {
      // Create new window
      data = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };
    } else {
      // Increment existing window
      data.count += 1;
    }

    await this.setRedisValue(key, data);
    return data;
  }

  private calculateRetryAfter(resetTime: number): number {
    return Math.ceil((resetTime - Date.now()) / 1000);
  }

  private createRateLimitInfo(data: { count: number; resetTime: number }): RateLimitInfo {
    const remaining = Math.max(0, this.config.maxRequests - data.count);
    const reset = Math.ceil(data.resetTime / 1000);
    const retryAfter = data.count >= this.config.maxRequests 
      ? this.calculateRetryAfter(data.resetTime)
      : undefined;

    return {
      limit: this.config.maxRequests,
      remaining,
      reset,
      retryAfter,
    };
  }

  /**
   * Check if request is within rate limit
   */
  async checkLimit(req: any): Promise<{
    allowed: boolean;
    info: RateLimitInfo;
    message?: string;
  }> {
    const key = this.config.keyGenerator(req);
    const data = await this.incrementCounter(key);
    const info = this.createRateLimitInfo(data);

    if (data.count > this.config.maxRequests) {
      return {
        allowed: false,
        info,
        message: this.config.message,
      };
    }

    return {
      allowed: true,
      info,
    };
  }

  /**
   * Middleware function for Express/Next.js
   */
  middleware() {
    return async (req: any, res: any, next: any) => {
      try {
        const result = await this.checkLimit(req);
        
        // Add rate limit headers
        if (this.config.standardHeaders) {
          res.setHeader('X-RateLimit-Limit', result.info.limit.toString());
          res.setHeader('X-RateLimit-Remaining', result.info.remaining.toString());
          res.setHeader('X-RateLimit-Reset', result.info.reset.toString());
        }

        if (this.config.legacyHeaders) {
          res.setHeader('X-RateLimit-Limit', result.info.limit.toString());
          res.setHeader('X-RateLimit-Remaining', result.info.remaining.toString());
          res.setHeader('X-RateLimit-Reset', new Date(result.info.reset * 1000).toISOString());
        }

        if (result.info.retryAfter) {
          res.setHeader('Retry-After', result.info.retryAfter.toString());
        }

        if (!result.allowed) {
          return res.status(429).json({
            error: 'Too Many Requests',
            message: result.message,
            retryAfter: result.info.retryAfter,
          });
        }

        // Store rate limit info in request for logging
        req.rateLimit = result.info;
        
        next();
      } catch (error) {
        console.error('Rate limiter error:', error);
        // Fail open - allow request if rate limiter fails
        next();
      }
    };
  }

  /**
   * Get current rate limit status for a key
   */
  async getStatus(key: string): Promise<RateLimitInfo | null> {
    const data = await this.getRedisValue(key);
    if (!data) return null;
    
    return this.createRateLimitInfo(data);
  }

  /**
   * Reset rate limit for a key
   */
  async reset(key: string): Promise<void> {
    if (this.redis) {
      await this.redis.del(key);
    } else {
      this.cache.delete(key);
    }
  }

  /**
   * Clean up expired entries (for in-memory cache)
   */
  cleanup(): void {
    if (this.redis) return; // Redis handles TTL automatically

    const now = Date.now();
    for (const [key, data] of this.cache.entries()) {
      if (data.resetTime < now) {
        this.cache.delete(key);
      }
    }
  }
}

// Predefined rate limiters for common use cases
export const rateLimiters = {
  // API endpoints - 100 requests per minute
  api: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    message: 'API rate limit exceeded. Please try again later.',
  }),

  // Authentication - 5 attempts per minute
  auth: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
    message: 'Too many authentication attempts. Please try again later.',
  }),

  // Forms - 10 submissions per minute
  forms: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    message: 'Too many form submissions. Please try again later.',
  }),

  // File uploads - 5 uploads per minute
  uploads: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
    message: 'Too many file uploads. Please try again later.',
  }),

  // Password reset - 3 attempts per hour
  passwordReset: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
    message: 'Too many password reset attempts. Please try again later.',
  }),

  // Email verification - 5 attempts per hour
  emailVerification: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,
    message: 'Too many email verification attempts. Please try again later.',
  }),
};

// Utility function to create custom rate limiter
export const createRateLimiter = (config: RateLimitConfig, redis?: any): RateLimiter => {
  return new RateLimiter(config, redis);
};

// Rate limit decorator for functions
export const rateLimit = (limiter: RateLimiter) => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const req = args[0]; // Assuming first argument is request object
      const result = await limiter.checkLimit(req);
      
      if (!result.allowed) {
        throw new Error(result.message);
      }
      
      return method.apply(this, args);
    };
  };
};