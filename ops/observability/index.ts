/**
 * Observability Suite - OpenTelemetry + Metrics
 */

import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { metrics, MeterProvider } from '@opentelemetry/api';

// Initialize OpenTelemetry
export function initObservability() {
  if (process.env.ENABLE_OTEL === 'false') {
    return;
  }

  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'aias-platform',
      [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version || '1.0.0',
    }),
    traceExporter: process.env.OTEL_EXPORTER_OTLP_ENDPOINT
      ? new OTLPTraceExporter({
          url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
        })
      : undefined,
    metricReader: process.env.OTEL_EXPORTER_OTLP_ENDPOINT
      ? new PeriodicExportingMetricReader({
          exporter: new OTLPMetricExporter({
            url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/metrics`,
          }),
          exportIntervalMillis: 60000, // 1 minute
        })
      : undefined,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();
  console.log('✅ OpenTelemetry initialized');

  return sdk;
}

// Custom metrics
export const meter = metrics.getMeter('aias-platform');

export const requestCounter = meter.createCounter('http_requests_total', {
  description: 'Total HTTP requests',
});

export const requestDuration = meter.createHistogram('http_request_duration_ms', {
  description: 'HTTP request duration in milliseconds',
});

export const errorCounter = meter.createCounter('http_errors_total', {
  description: 'Total HTTP errors',
});

export const costCounter = meter.createCounter('ai_cost_usd', {
  description: 'AI API costs in USD',
});

// Middleware for Express/Next.js
export function observabilityMiddleware(req: any, res: any, next: any) {
  const start = Date.now();

  requestCounter.add(1, {
    method: req.method,
    route: req.route?.path || req.path,
  });

  res.on('finish', () => {
    const duration = Date.now() - start;
    requestDuration.record(duration, {
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });

    if (res.statusCode >= 400) {
      errorCounter.add(1, {
        method: req.method,
        route: req.route?.path || req.path,
        status: res.statusCode,
      });
    }
  });

  next();
}
