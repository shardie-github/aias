/**
 * Multi-Tenant Security & Isolation
 * Enterprise-grade tenant isolation and access control
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

export interface TenantContext {
  tenantId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  permissions: string[];
}

export interface TenantLimits {
  workflows: number;
  executions: number;
  storage: number; // bytes
  users: number;
  apiCalls: number;
  aiTokens: number;
}

export class TenantIsolationService {
  private supabase;
  
  constructor() {
    this.supabase = createClient(
      env.supabase.url,
      env.supabase.serviceRoleKey
    );
  }
  
  /**
   * Get tenant context for user
   */
  async getTenantContext(
    tenantId: string,
    userId: string
  ): Promise<TenantContext | null> {
    try {
      const { data, error } = await this.supabase
        .from('tenant_members')
        .select(`
          tenant_id,
          user_id,
          role,
          tenants!inner(
            id,
            plan_id,
            subscription_plans(permissions)
          )
        `)
        .eq('tenant_id', tenantId)
        .eq('user_id', userId)
        .single();
      
      if (error || !data) {
        return null;
      }
      
      const permissions = data.tenants?.subscription_plans?.permissions || [];
      
      return {
        tenantId: data.tenant_id,
        userId: data.user_id,
        role: data.role,
        permissions: Array.isArray(permissions) ? permissions : [],
      };
    } catch (error) {
      console.error('Error getting tenant context:', error);
      return null;
    }
  }
  
  /**
   * Validate tenant access
   */
  async validateAccess(
    tenantId: string,
    userId: string,
    requiredPermission?: string
  ): Promise<{ allowed: boolean; context?: TenantContext }> {
    const context = await this.getTenantContext(tenantId, userId);
    
    if (!context) {
      return { allowed: false };
    }
    
    if (requiredPermission && !context.permissions.includes(requiredPermission)) {
      return { allowed: false, context };
    }
    
    return { allowed: true, context };
  }
  
  /**
   * Get tenant limits
   */
  async getTenantLimits(tenantId: string): Promise<TenantLimits | null> {
    try {
      const { data, error } = await this.supabase
        .from('tenants')
        .select(`
          id,
          subscription_plans(limits)
        `)
        .eq('id', tenantId)
        .single();
      
      if (error || !data) {
        return null;
      }
      
      const limits = data.subscription_plans?.limits || {};
      
      return {
        workflows: limits.workflows || 0,
        executions: limits.executions || 0,
        storage: limits.storage || 0,
        users: limits.users || 0,
        apiCalls: limits.apiCalls || 0,
        aiTokens: limits.aiTokens || 0,
      };
    } catch (error) {
      console.error('Error getting tenant limits:', error);
      return null;
    }
  }
  
  /**
   * Check if tenant has exceeded limits
   */
  async checkLimits(
    tenantId: string,
    resource: keyof TenantLimits,
    amount: number = 1
  ): Promise<{ allowed: boolean; remaining: number; limit: number }> {
    const limits = await this.getTenantLimits(tenantId);
    
    if (!limits) {
      return { allowed: false, remaining: 0, limit: 0 };
    }
    
    const limit = limits[resource];
    
    // Get current usage
    const usage = await this.getCurrentUsage(tenantId, resource);
    
    const remaining = Math.max(0, limit - usage);
    const allowed = remaining >= amount;
    
    return {
      allowed,
      remaining,
      limit,
    };
  }
  
  /**
   * Get current usage for a resource
   */
  async getCurrentUsage(
    tenantId: string,
    resource: keyof TenantLimits
  ): Promise<number> {
    try {
      const { data, error } = await this.supabase
        .from('tenant_usage')
        .select('usage_count')
        .eq('tenant_id', tenantId)
        .eq('metric_type', resource)
        .gte('period_end', new Date().toISOString())
        .single();
      
      if (error || !data) {
        return 0;
      }
      
      return data.usage_count || 0;
    } catch (error) {
      console.error('Error getting current usage:', error);
      return 0;
    }
  }
  
  /**
   * Record usage for a resource
   */
  async recordUsage(
    tenantId: string,
    resource: keyof TenantLimits,
    amount: number = 1
  ): Promise<void> {
    try {
      const now = new Date();
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      // Get or create usage record
      const { data: existing } = await this.supabase
        .from('tenant_usage')
        .select('id, usage_count')
        .eq('tenant_id', tenantId)
        .eq('metric_type', resource)
        .eq('period_start', periodStart.toISOString())
        .single();
      
      if (existing) {
        // Update existing record
        await this.supabase
          .from('tenant_usage')
          .update({
            usage_count: existing.usage_count + amount,
            updated_at: now.toISOString(),
          })
          .eq('id', existing.id);
      } else {
        // Create new record
        await this.supabase
          .from('tenant_usage')
          .insert({
            tenant_id: tenantId,
            metric_type: resource,
            usage_count: amount,
            period_start: periodStart.toISOString(),
            period_end: periodEnd.toISOString(),
          });
      }
    } catch (error) {
      console.error('Error recording usage:', error);
    }
  }
  
  /**
   * Enforce Row-Level Security (RLS) context
   */
  async enforceRLS(tenantId: string, userId: string): Promise<void> {
    // Set RLS context in Supabase
    // This ensures all queries are automatically filtered by tenant_id
    await this.supabase.rpc('set_tenant_context', {
      p_tenant_id: tenantId,
      p_user_id: userId,
    });
  }
  
  /**
   * Create tenant-scoped Supabase client
   */
  createTenantClient(tenantId: string, userId: string) {
    const client = createClient(
      env.supabase.url,
      env.supabase.anonKey,
      {
        global: {
          headers: {
            'x-tenant-id': tenantId,
            'x-user-id': userId,
          },
        },
      }
    );
    
    return client;
  }
}

export const tenantIsolation = new TenantIsolationService();
