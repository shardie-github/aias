/**
 * Enhanced Telemetry and Instrumentation
 * Provides comprehensive monitoring, analytics, and user engagement tracking
 */

export interface TelemetryEvent {
  name: string;
  category: 'user' | 'performance' | 'error' | 'business' | 'security';
  properties?: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percentage';
  tags?: Record<string, string>;
}

export interface UserEngagement {
  sessionId: string;
  userId?: string;
  pageViews: number;
  interactions: number;
  timeOnSite: number;
  events: TelemetryEvent[];
  conversionFunnel?: string[];
}

class EnhancedTelemetry {
  private events: TelemetryEvent[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private engagement: Map<string, UserEngagement> = new Map();

  constructor() {
    // Initialize session ID
    if (typeof window !== 'undefined' && !sessionStorage.getItem('sessionId')) {
      sessionStorage.setItem('sessionId', `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    }
  }

  private getSessionId(): string {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('sessionId') || 'anonymous';
    }
    return 'server';
  }

  track(event: Omit<TelemetryEvent, 'timestamp'>): void {
    const fullEvent: TelemetryEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId: event.sessionId || this.getSessionId(),
    };

    this.events.push(fullEvent);
    this.updateEngagement(fullEvent);
    this.sendToBackend(fullEvent);
  }

  trackPerformance(metric: PerformanceMetric): void {
    this.performanceMetrics.push(metric);
    this.sendToBackend({ name: 'performance', category: 'performance', properties: metric, timestamp: Date.now(), sessionId: this.getSessionId() });
  }

  trackPageView(path: string, properties?: Record<string, any>): void {
    this.track({
      name: 'page_view',
      category: 'user',
      properties: { path, ...properties },
    });
  }

  trackInteraction(element: string, action: string, properties?: Record<string, any>): void {
    this.track({
      name: 'interaction',
      category: 'user',
      properties: { element, action, ...properties },
    });
  }

  trackConversion(funnel: string, step: string, properties?: Record<string, any>): void {
    this.track({
      name: 'conversion',
      category: 'business',
      properties: { funnel, step, ...properties },
    });
  }

  trackError(error: Error, context?: Record<string, any>): void {
    this.track({
      name: 'error',
      category: 'error',
      properties: {
        message: error.message,
        stack: error.stack,
        ...context,
      },
    });
  }

  trackSecurityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', details?: Record<string, any>): void {
    this.track({
      name: 'security_event',
      category: 'security',
      properties: { event, severity, ...details },
    });
  }

  getEngagement(sessionId: string): UserEngagement | undefined {
    return this.engagement.get(sessionId);
  }

  getPerformanceMetrics(): PerformanceMetric[] {
    return [...this.performanceMetrics];
  }

  private updateEngagement(event: TelemetryEvent): void {
    const sessionId = event.sessionId || 'anonymous';
    let engagement = this.engagement.get(sessionId);

    if (!engagement) {
      engagement = {
        sessionId,
        userId: event.userId,
        pageViews: 0,
        interactions: 0,
        timeOnSite: 0,
        events: [],
      };
      this.engagement.set(sessionId, engagement);
    }

    engagement.events.push(event);

    if (event.name === 'page_view') {
      engagement.pageViews++;
    }

    if (event.name === 'interaction') {
      engagement.interactions++;
    }

    if (event.category === 'business' && event.name === 'conversion') {
      const funnel = event.properties?.funnel as string;
      const step = event.properties?.step as string;
      if (funnel && step) {
        if (!engagement.conversionFunnel) {
          engagement.conversionFunnel = [];
        }
        engagement.conversionFunnel.push(`${funnel}:${step}`);
      }
    }
  }

  private async sendToBackend(event: TelemetryEvent): Promise<void> {
    try {
      await fetch('/api/telemetry/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    } catch (error) {
      // Silent fail for telemetry
    }
  }
}

export const telemetry = typeof window !== 'undefined' ? new EnhancedTelemetry() : {
  track: () => {},
  trackPerformance: () => {},
  trackPageView: () => {},
  trackInteraction: () => {},
  trackConversion: () => {},
  trackError: () => {},
  trackSecurityEvent: () => {},
  getEngagement: () => undefined,
  getPerformanceMetrics: () => [],
} as EnhancedTelemetry;

export function useTelemetry() {
  return {
    track: telemetry.track.bind(telemetry),
    trackPageView: telemetry.trackPageView.bind(telemetry),
    trackInteraction: telemetry.trackInteraction.bind(telemetry),
    trackConversion: telemetry.trackConversion.bind(telemetry),
    trackError: telemetry.trackError.bind(telemetry),
    trackPerformance: telemetry.trackPerformance.bind(telemetry),
    getEngagement: telemetry.getEngagement.bind(telemetry),
    getPerformanceMetrics: telemetry.getPerformanceMetrics.bind(telemetry),
  };
}
