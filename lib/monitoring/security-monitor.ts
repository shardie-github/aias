/**
 * Security Monitoring & Observability
 * Real-time security event monitoring and alerting
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

export interface SecurityEvent {
  type: 'rate_limit' | 'unauthorized' | 'suspicious' | 'attack' | 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  tenantId?: string;
  userId?: string;
  ipAddress: string;
  endpoint: string;
  method: string;
  userAgent?: string;
  details?: Record<string, any>;
  timestamp: Date;
}

export class SecurityMonitor {
  private supabase;
  private eventBuffer: SecurityEvent[] = [];
  private bufferSize = 100;
  private flushInterval = 60000; // 1 minute
  
  constructor() {
    this.supabase = createClient(
      env.supabase.url,
      env.supabase.serviceRoleKey
    );
    
    // Flush buffer periodically
    setInterval(() => {
      this.flushEvents();
    }, this.flushInterval);
  }
  
  /**
   * Record security event
   */
  async recordEvent(event: Omit<SecurityEvent, 'timestamp'>): Promise<void> {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: new Date(),
    };
    
    this.eventBuffer.push(fullEvent);
    
    // Flush if buffer is full
    if (this.eventBuffer.length >= this.bufferSize) {
      await this.flushEvents();
    }
    
    // Alert on critical events
    if (event.severity === 'critical') {
      await this.sendAlert(fullEvent);
    }
  }
  
  /**
   * Flush events to database
   */
  private async flushEvents(): Promise<void> {
    if (this.eventBuffer.length === 0) return;
    
    const events = [...this.eventBuffer];
    this.eventBuffer = [];
    
    try {
      await this.supabase
        .from('security_events')
        .insert(
          events.map(event => ({
            type: event.type,
            severity: event.severity,
            tenant_id: event.tenantId,
            user_id: event.userId,
            ip_address: event.ipAddress,
            endpoint: event.endpoint,
            method: event.method,
            user_agent: event.userAgent,
            details: event.details,
            timestamp: event.timestamp.toISOString(),
          }))
        );
    } catch (error) {
      console.error('Error flushing security events:', error);
      // Re-add events to buffer on error
      this.eventBuffer.unshift(...events);
    }
  }
  
  /**
   * Send alert for critical events
   */
  private async sendAlert(event: SecurityEvent): Promise<void> {
    // Implement alerting logic (email, Slack, PagerDuty, etc.)
    console.error('SECURITY ALERT:', {
      type: event.type,
      severity: event.severity,
      endpoint: event.endpoint,
      ipAddress: event.ipAddress,
      details: event.details,
    });
    
    // TODO: Integrate with alerting service
  }
  
  /**
   * Get security events
   */
  async getEvents(filters: {
    tenantId?: string;
    userId?: string;
    type?: SecurityEvent['type'];
    severity?: SecurityEvent['severity'];
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<SecurityEvent[]> {
    try {
      let query = this.supabase
        .from('security_events')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (filters.tenantId) {
        query = query.eq('tenant_id', filters.tenantId);
      }
      
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      
      if (filters.severity) {
        query = query.eq('severity', filters.severity);
      }
      
      if (filters.startDate) {
        query = query.gte('timestamp', filters.startDate.toISOString());
      }
      
      if (filters.endDate) {
        query = query.lte('timestamp', filters.endDate.toISOString());
      }
      
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return (data || []).map((row: any) => ({
        type: row.type,
        severity: row.severity,
        tenantId: row.tenant_id,
        userId: row.user_id,
        ipAddress: row.ip_address,
        endpoint: row.endpoint,
        method: row.method,
        userAgent: row.user_agent,
        details: row.details,
        timestamp: new Date(row.timestamp),
      }));
    } catch (error) {
      console.error('Error getting security events:', error);
      return [];
    }
  }
  
  /**
   * Get security statistics
   */
  async getStatistics(tenantId?: string): Promise<{
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    recentCriticalEvents: number;
  }> {
    try {
      let query = this.supabase
        .from('security_events')
        .select('type, severity');
      
      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      const events = data || [];
      const eventsByType: Record<string, number> = {};
      const eventsBySeverity: Record<string, number> = {};
      
      events.forEach((event: any) => {
        eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
        eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
      });
      
      // Get recent critical events (last 24 hours)
      const oneDayAgo = new Date();
      oneDayAgo.setHours(oneDayAgo.getHours() - 24);
      
      let criticalQuery = this.supabase
        .from('security_events')
        .select('id', { count: 'exact' })
        .eq('severity', 'critical')
        .gte('timestamp', oneDayAgo.toISOString());
      
      if (tenantId) {
        criticalQuery = criticalQuery.eq('tenant_id', tenantId);
      }
      
      const { count } = await criticalQuery;
      
      return {
        totalEvents: events.length,
        eventsByType,
        eventsBySeverity,
        recentCriticalEvents: count || 0,
      };
    } catch (error) {
      console.error('Error getting security statistics:', error);
      return {
        totalEvents: 0,
        eventsByType: {},
        eventsBySeverity: {},
        recentCriticalEvents: 0,
      };
    }
  }
}

export const securityMonitor = new SecurityMonitor();
