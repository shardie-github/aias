/**
 * Automated Error Detection and Alerting
 * Monitors errors and sends alerts when thresholds are exceeded
 */

import { SystemError, formatError } from '@/src/lib/errors';

export interface ErrorAlert {
  id: string;
  timestamp: Date;
  error: Error;
  context: Record<string, unknown>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  count: number;
}

export interface ErrorDetectionConfig {
  errorThreshold?: number; // Errors per minute
  alertThreshold?: number; // Alerts per hour
  severityThresholds?: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

const DEFAULT_CONFIG: Required<ErrorDetectionConfig> = {
  errorThreshold: 10,
  alertThreshold: 5,
  severityThresholds: {
    low: 1,
    medium: 5,
    high: 10,
    critical: 50,
  },
};

class ErrorDetector {
  private errors: Array<{ timestamp: Date; error: Error; context: Record<string, unknown> }> = [];
  private alerts: ErrorAlert[] = [];
  private config: Required<ErrorDetectionConfig>;

  constructor(config: ErrorDetectionConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Record an error
   */
  recordError(error: Error, context: Record<string, unknown> = {}): void {
    const timestamp = new Date();
    this.errors.push({ timestamp, error, context });

    // Clean old errors (older than 1 hour)
    const oneHourAgo = new Date(timestamp.getTime() - 60 * 60 * 1000);
    this.errors = this.errors.filter(e => e.timestamp > oneHourAgo);

    // Check if alert should be triggered
    this.checkThresholds(error, context);
  }

  /**
   * Check if error thresholds are exceeded
   */
  private checkThresholds(error: Error, context: Record<string, unknown>): void {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

    // Count errors in last minute
    const recentErrors = this.errors.filter(e => e.timestamp > oneMinuteAgo);
    const errorCount = recentErrors.length;

    // Determine severity
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (errorCount >= this.config.severityThresholds.critical) {
      severity = 'critical';
    } else if (errorCount >= this.config.severityThresholds.high) {
      severity = 'high';
    } else if (errorCount >= this.config.severityThresholds.medium) {
      severity = 'medium';
    }

    // Check if threshold exceeded
    if (errorCount >= this.config.errorThreshold) {
      this.createAlert(error, context, severity, errorCount);
    }
  }

  /**
   * Create an alert
   */
  private createAlert(
    error: Error,
    context: Record<string, unknown>,
    severity: 'low' | 'medium' | 'high' | 'critical',
    count: number
  ): void {
    const alert: ErrorAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      error,
      context,
      severity,
      count,
    };

    this.alerts.push(alert);

    // Clean old alerts (older than 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.alerts = this.alerts.filter(a => a.timestamp > oneDayAgo);

    // Send alert (implement notification logic here)
    this.sendAlert(alert);
  }

  /**
   * Send alert notification
   */
  private sendAlert(alert: ErrorAlert): void {
    // Only send if alert threshold not exceeded
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentAlerts = this.alerts.filter(a => a.timestamp > oneHourAgo);

    if (recentAlerts.length > this.config.alertThreshold) {
      console.warn('Alert threshold exceeded, suppressing alerts');
      return;
    }

    // Log alert (in production, send to monitoring service)
    console.error('Error Alert:', {
      id: alert.id,
      severity: alert.severity,
      error: formatError(alert.error),
      context: alert.context,
      count: alert.count,
    });

    // Integrate with monitoring service (e.g., Sentry, Datadog)
    this.sendToMonitoringService(alert);
  }

  /**
   * Get recent errors
   */
  getRecentErrors(minutes: number = 5): Array<{ timestamp: Date; error: Error; context: Record<string, unknown> }> {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.errors.filter(e => e.timestamp > cutoff);
  }

  /**
   * Get recent alerts
   */
  getRecentAlerts(hours: number = 1): ErrorAlert[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.alerts.filter(a => a.timestamp > cutoff);
  }

  /**
   * Send alert to monitoring service
   */
  private sendToMonitoringService(alert: ErrorAlert): void {
    // Integration with monitoring services
    // Supports Sentry, Datadog, or custom webhook
    
    const monitoringConfig = {
      sentry: process.env.SENTRY_DSN,
      datadog: process.env.DATADOG_API_KEY,
      webhook: process.env.ERROR_WEBHOOK_URL,
    };

    const alertPayload = {
      id: alert.id,
      timestamp: alert.timestamp.toISOString(),
      severity: alert.severity,
      error: {
        message: alert.error.message,
        stack: alert.error.stack,
        name: alert.error.name,
      },
      context: alert.context,
      count: alert.count,
    };

    // Send to Sentry if configured
    if (monitoringConfig.sentry && typeof window !== 'undefined' && (window as any).Sentry) {
      try {
        (window as any).Sentry.captureException(alert.error, {
          level: alert.severity === 'critical' ? 'error' : 'warning',
          tags: alert.context,
          extra: { count: alert.count },
        });
      } catch (e) {
        console.warn('Failed to send to Sentry:', e);
      }
    }

    // Send to Datadog if configured
    if (monitoringConfig.datadog) {
      try {
        // Datadog integration would go here
        // Example: fetch('https://api.datadoghq.com/api/v1/events', { ... })
        console.log('Datadog integration: Would send alert', alertPayload);
      } catch (e) {
        console.warn('Failed to send to Datadog:', e);
      }
    }

    // Send to custom webhook if configured
    if (monitoringConfig.webhook) {
      try {
        fetch(monitoringConfig.webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alertPayload),
        }).catch(e => console.warn('Failed to send webhook:', e));
      } catch (e) {
        console.warn('Failed to send webhook:', e);
      }
    }

    // Also send to enhanced telemetry if available
    try {
      const { telemetry } = require('@/lib/monitoring/enhanced-telemetry');
      if (telemetry && telemetry.trackError) {
        telemetry.trackError(alert.error, {
          ...alert.context,
          severity: alert.severity,
          count: alert.count,
        });
      }
    } catch (e) {
      // Telemetry not available, skip
    }
  }

  /**
   * Reset error tracking
   */
  reset(): void {
    this.errors = [];
    this.alerts = [];
  }
}

// Singleton instance
export const errorDetector = new ErrorDetector();

/**
 * Record error with automatic detection
 */
export function recordError(error: Error, context: Record<string, unknown> = {}): void {
  errorDetector.recordError(error, context);
}
