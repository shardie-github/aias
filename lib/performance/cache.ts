/**
 * Performance Caching Utilities
 * Multi-layer caching for enterprise performance
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import IORedis from 'ioredis';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
  tenantId?: string; // Tenant-specific cache
}

export class CacheService {
  private redis: IORedis | null = null;
  private memoryCache: Map<string, { value: any; expires: number }> = new Map();
  private memoryCacheSize = 1000; // Max items in memory cache
  
  constructor() {
    // Initialize Redis if available
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      try {
        this.redis = new IORedis(redisUrl, {
          maxRetriesPerRequest: 3,
          retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
        });
        
        this.redis.on('error', (error) => {
          console.error('Redis error:', error);
          this.redis = null; // Fallback to memory cache
        });
      } catch (error) {
        console.error('Failed to initialize Redis:', error);
        this.redis = null;
      }
    }
    
    // Cleanup expired memory cache entries
    setInterval(() => {
      this.cleanupMemoryCache();
    }, 60000); // Every minute
  }
  
  /**
   * Generate cache key
   */
  private generateKey(key: string, options?: CacheOptions): string {
    const parts = ['cache', key];
    
    if (options?.tenantId) {
      parts.push(`tenant:${options.tenantId}`);
    }
    
    return parts.join(':');
  }
  
  /**
   * Get value from cache
   */
  async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
    const cacheKey = this.generateKey(key, options);
    
    // Try Redis first
    if (this.redis) {
      try {
        const value = await this.redis.get(cacheKey);
        if (value) {
          return JSON.parse(value);
        }
      } catch (error) {
        console.error('Redis get error:', error);
      }
    }
    
    // Fallback to memory cache
    const memoryEntry = this.memoryCache.get(cacheKey);
    if (memoryEntry && memoryEntry.expires > Date.now()) {
      return memoryEntry.value;
    }
    
    if (memoryEntry) {
      this.memoryCache.delete(cacheKey);
    }
    
    return null;
  }
  
  /**
   * Set value in cache
   */
  async set(
    key: string,
    value: any,
    options?: CacheOptions
  ): Promise<void> {
    const cacheKey = this.generateKey(key, options);
    const ttl = options?.ttl || 3600; // Default 1 hour
    
    // Set in Redis
    if (this.redis) {
      try {
        await this.redis.setex(
          cacheKey,
          ttl,
          JSON.stringify(value)
        );
        
        // Set cache tags if provided
        if (options?.tags && options.tags.length > 0) {
          for (const tag of options.tags) {
            await this.redis.sadd(`cache:tag:${tag}`, cacheKey);
            await this.redis.expire(`cache:tag:${tag}`, ttl);
          }
        }
        
        return;
      } catch (error) {
        console.error('Redis set error:', error);
      }
    }
    
    // Fallback to memory cache
    if (this.memoryCache.size >= this.memoryCacheSize) {
      // Remove oldest entry
      const firstKey = this.memoryCache.keys().next().value;
      if (firstKey) {
        this.memoryCache.delete(firstKey);
      }
    }
    
    this.memoryCache.set(cacheKey, {
      value,
      expires: Date.now() + ttl * 1000,
    });
  }
  
  /**
   * Delete value from cache
   */
  async delete(key: string, options?: CacheOptions): Promise<void> {
    const cacheKey = this.generateKey(key, options);
    
    if (this.redis) {
      try {
        await this.redis.del(cacheKey);
      } catch (error) {
        console.error('Redis delete error:', error);
      }
    }
    
    this.memoryCache.delete(cacheKey);
  }
  
  /**
   * Invalidate cache by tags
   */
  async invalidateTags(tags: string[]): Promise<void> {
    if (!this.redis) return;
    
    try {
      for (const tag of tags) {
        const keys = await this.redis.smembers(`cache:tag:${tag}`);
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
        await this.redis.del(`cache:tag:${tag}`);
      }
    } catch (error) {
      console.error('Redis tag invalidation error:', error);
    }
  }
  
  /**
   * Clear all cache for a tenant
   */
  async clearTenantCache(tenantId: string): Promise<void> {
    if (!this.redis) {
      // Clear memory cache entries for tenant
      const tenantPrefix = `cache:tenant:${tenantId}`;
      for (const key of this.memoryCache.keys()) {
        if (key.startsWith(tenantPrefix)) {
          this.memoryCache.delete(key);
        }
      }
      return;
    }
    
    try {
      const pattern = `cache:*:tenant:${tenantId}*`;
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error('Redis tenant cache clear error:', error);
    }
  }
  
  /**
   * Cleanup expired memory cache entries
   */
  private cleanupMemoryCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.expires < now) {
        this.memoryCache.delete(key);
      }
    }
  }
  
  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    memorySize: number;
    redisConnected: boolean;
  }> {
    return {
      memorySize: this.memoryCache.size,
      redisConnected: this.redis !== null && this.redis.status === 'ready',
    };
  }
}

export const cacheService = new CacheService();

/**
 * Cache decorator for functions
 */
export function cached(
  key: string,
  options?: CacheOptions
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${key}:${JSON.stringify(args)}`;
      const cached = await cacheService.get(cacheKey, options);
      
      if (cached !== null) {
        return cached;
      }
      
      const result = await method.apply(this, args);
      await cacheService.set(cacheKey, result, options);
      
      return result;
    };
  };
}
