/**
 * Database Query Optimization
 * Query optimization and connection pooling for enterprise scale
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { cacheService } from './cache';

export interface QueryOptions {
  cache?: boolean;
  cacheTTL?: number;
  tenantId?: string;
  select?: string[];
  limit?: number;
  offset?: number;
}

export class QueryOptimizer {
  private supabase;
  
  constructor() {
    this.supabase = createClient(
      env.supabase.url,
      env.supabase.serviceRoleKey,
      {
        db: {
          schema: 'public',
        },
        global: {
          headers: {
            'x-client-info': 'query-optimizer',
          },
        },
      }
    );
  }
  
  /**
   * Optimized select query with caching
   */
  async select<T>(
    table: string,
    options: QueryOptions = {}
  ): Promise<T[]> {
    const cacheKey = `query:${table}:${JSON.stringify(options)}`;
    
    // Check cache
    if (options.cache !== false) {
      const cached = await cacheService.get<T[]>(cacheKey, {
        ttl: options.cacheTTL || 300, // Default 5 minutes
        tenantId: options.tenantId,
      });
      
      if (cached) {
        return cached;
      }
    }
    
    // Build query
    let query = this.supabase.from(table).select(options.select?.join(',') || '*');
    
    // Add tenant filter if provided
    if (options.tenantId) {
      query = query.eq('tenant_id', options.tenantId);
    }
    
    // Add pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Query error: ${error.message}`);
    }
    
    // Cache result
    if (options.cache !== false && data) {
      await cacheService.set(cacheKey, data, {
        ttl: options.cacheTTL || 300,
        tenantId: options.tenantId,
        tags: [`table:${table}`],
      });
    }
    
    return data as T[];
  }
  
  /**
   * Optimized single record query
   */
  async findOne<T>(
    table: string,
    id: string,
    options: QueryOptions = {}
  ): Promise<T | null> {
    const cacheKey = `query:${table}:${id}`;
    
    // Check cache
    if (options.cache !== false) {
      const cached = await cacheService.get<T>(cacheKey, {
        ttl: options.cacheTTL || 600, // Default 10 minutes
        tenantId: options.tenantId,
      });
      
      if (cached) {
        return cached;
      }
    }
    
    // Build query
    let query = this.supabase
      .from(table)
      .select(options.select?.join(',') || '*')
      .eq('id', id)
      .single();
    
    // Add tenant filter if provided
    if (options.tenantId) {
      query = query.eq('tenant_id', options.tenantId);
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Query error: ${error.message}`);
    }
    
    // Cache result
    if (options.cache !== false && data) {
      await cacheService.set(cacheKey, data, {
        ttl: options.cacheTTL || 600,
        tenantId: options.tenantId,
        tags: [`table:${table}`, `record:${id}`],
      });
    }
    
    return data as T;
  }
  
  /**
   * Batch query optimization
   */
  async batchSelect<T>(
    table: string,
    ids: string[],
    options: QueryOptions = {}
  ): Promise<Map<string, T>> {
    const results = new Map<string, T>();
    const uncachedIds: string[] = [];
    
    // Check cache for each ID
    if (options.cache !== false) {
      for (const id of ids) {
        const cacheKey = `query:${table}:${id}`;
        const cached = await cacheService.get<T>(cacheKey, {
          ttl: options.cacheTTL || 600,
          tenantId: options.tenantId,
        });
        
        if (cached) {
          results.set(id, cached);
        } else {
          uncachedIds.push(id);
        }
      }
    } else {
      uncachedIds.push(...ids);
    }
    
    // Query uncached IDs
    if (uncachedIds.length > 0) {
      let query = this.supabase
        .from(table)
        .select(options.select?.join(',') || '*')
        .in('id', uncachedIds);
      
      if (options.tenantId) {
        query = query.eq('tenant_id', options.tenantId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Batch query error: ${error.message}`);
      }
      
      // Cache and add to results
      if (data) {
        for (const item of data) {
          const id = (item as any).id;
          results.set(id, item as T);
          
          if (options.cache !== false) {
            const cacheKey = `query:${table}:${id}`;
            await cacheService.set(cacheKey, item, {
              ttl: options.cacheTTL || 600,
              tenantId: options.tenantId,
              tags: [`table:${table}`, `record:${id}`],
            });
          }
        }
      }
    }
    
    return results;
  }
  
  /**
   * Invalidate cache for a table
   */
  async invalidateTableCache(table: string, tenantId?: string): Promise<void> {
    await cacheService.invalidateTags([`table:${table}`]);
    
    if (tenantId) {
      await cacheService.clearTenantCache(tenantId);
    }
  }
}

export const queryOptimizer = new QueryOptimizer();
