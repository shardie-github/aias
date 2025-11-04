/**
 * Guardian Middleware
 * Hooks into app telemetry events and API calls
 */

import { guardianService, type GuardianEvent, type DataScope, type DataClass } from './core';
import { monitoringService } from '../src/lib/monitoring';

// Extend monitoring service to emit guardian events
const originalTrackEvent = monitoringService.trackEvent.bind(monitoringService);
const originalTrackPageView = monitoringService.trackPageView.bind(monitoringService);
const originalTrackError = monitoringService.trackError.bind(monitoringService);

/**
 * Wrap monitoring service to emit guardian events
 */
monitoringService.trackEvent = function(name: string, properties?: Record<string, unknown>) {
  // Emit guardian event
  guardianService.recordEvent(
    'telemetry',
    determineScope(properties),
    determineDataClass(name, properties),
    `Telemetry event: ${name}`,
    properties || {}
  );
  
  return originalTrackEvent(name, properties);
};

monitoringService.trackPageView = function(path: string) {
  guardianService.recordEvent(
    'navigation',
    'app',
    'telemetry',
    `Page view: ${path}`,
    { path }
  );
  
  return originalTrackPageView(path);
};

monitoringService.trackError = function(error: Error, errorInfo?: Record<string, unknown>) {
  guardianService.recordEvent(
    'error',
    'app',
    'telemetry',
    `Error tracked: ${error.message}`,
    {
      message: error.message,
      ...errorInfo,
    }
  );
  
  return originalTrackError(error, errorInfo);
};

/**
 * Determine data scope from event properties
 */
function determineScope(properties?: Record<string, unknown>): DataScope {
  if (!properties) return 'app';
  
  if (properties.user_id || properties.userId) return 'user';
  if (properties.api_endpoint || properties.endpoint) return 'api';
  if (properties.external === true) return 'external';
  
  return 'app';
}

/**
 * Determine data class from event name and properties
 */
function determineDataClass(name: string, properties?: Record<string, unknown>): DataClass {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('location') || nameLower.includes('geo')) return 'location';
  if (nameLower.includes('audio') || nameLower.includes('mic') || nameLower.includes('voice')) return 'audio';
  if (nameLower.includes('biometric') || nameLower.includes('fingerprint') || nameLower.includes('face')) return 'biometrics';
  if (nameLower.includes('password') || nameLower.includes('token') || nameLower.includes('credential')) return 'credentials';
  if (nameLower.includes('content') || nameLower.includes('message') || nameLower.includes('text')) return 'content';
  
  if (properties) {
    if (properties.hasAudio || properties.audio) return 'audio';
    if (properties.hasLocation || properties.location) return 'location';
    if (properties.hasBiometrics || properties.biometric) return 'biometrics';
  }
  
  return 'telemetry';
}

/**
 * API call interceptor
 */
export function interceptAPICall(
  url: string,
  method: string,
  body?: unknown,
  headers?: Record<string, string>
): GuardianEvent {
  const isExternal = !url.startsWith('/') && !url.startsWith(window.location.origin);
  
  return guardianService.recordEvent(
    'api_call',
    isExternal ? 'external' : 'api',
    'telemetry',
    `API ${method} ${url}`,
    {
      url,
      method,
      external: isExternal,
      hasBody: !!body,
      headers: headers ? Object.keys(headers) : [],
    }
  );
}

/**
 * Content processing interceptor
 */
export function interceptContentProcessing(
  content: string,
  purpose: string
): GuardianEvent {
  return guardianService.recordEvent(
    'content_processing',
    'app',
    'content',
    `Content processed for: ${purpose}`,
    {
      purpose,
      contentLength: content.length,
      hasPII: content.includes('@') || content.includes('http'),
    }
  );
}

/**
 * Initialize guardian middleware
 */
export function initializeGuardianMiddleware(): void {
  console.log('[GUARDIAN] Middleware initialized');
  
  // Intercept fetch calls
  if (typeof window !== 'undefined') {
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      const [url, options] = args;
      const urlString = typeof url === 'string' ? url : url.toString();
      
      interceptAPICall(
        urlString,
        options?.method || 'GET',
        options?.body,
        options?.headers as Record<string, string>
      );
      
      return originalFetch.apply(this, args);
    };
  }
}

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  initializeGuardianMiddleware();
}
