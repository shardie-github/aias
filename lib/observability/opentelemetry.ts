/**
 * OpenTelemetry Observability Setup
 * 
 * Provides distributed tracing, metrics, and logging integration
 * Supports multiple exporters (OTLP, Console, etc.)
 */

import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { env } from "@/lib/env";

const SERVICE_NAME = process.env.OTEL_SERVICE_NAME || "aias-platform";
const OTEL_ENDPOINT = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
const ENABLE_OTEL = process.env.ENABLE_OTEL === "true";

/**
 * Initialize OpenTelemetry SDK
 * Call this at application startup
 */
export function initializeOpenTelemetry(): NodeSDK | null {
  if (!ENABLE_OTEL || !OTEL_ENDPOINT) {
    console.log("[OpenTelemetry] Disabled - set ENABLE_OTEL=true and OTEL_EXPORTER_OTLP_ENDPOINT to enable");
    return null;
  }

  try {
    const sdk = new NodeSDK({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: SERVICE_NAME,
        [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version || "1.0.0",
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || "development",
      }),
      traceExporter: new OTLPTraceExporter({
        url: `${OTEL_ENDPOINT}/v1/traces`,
      }),
      metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: `${OTEL_ENDPOINT}/v1/metrics`,
        }),
        exportIntervalMillis: 60000, // Export every minute
      }),
      instrumentations: [
        getNodeAutoInstrumentations({
          // Disable fs instrumentation in serverless environments
          "@opentelemetry/instrumentation-fs": {
            enabled: false,
          },
        }),
      ],
    });

    sdk.start();
    console.log(`[OpenTelemetry] Initialized for service: ${SERVICE_NAME}`);

    // Graceful shutdown
    process.on("SIGTERM", () => {
      sdk.shutdown()
        .then(() => console.log("[OpenTelemetry] Shutdown complete"))
        .catch((error) => console.error("[OpenTelemetry] Error during shutdown", error));
    });

    return sdk;
  } catch (error) {
    console.error("[OpenTelemetry] Failed to initialize", error);
    return null;
  }
}

/**
 * Get OpenTelemetry API (for manual instrumentation)
 */
export function getOpenTelemetry() {
  if (!ENABLE_OTEL) {
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("@opentelemetry/api");
  } catch {
    return null;
  }
}

/**
 * Create a span for manual instrumentation
 */
export function createSpan(name: string, callback: (span: any) => Promise<any>) {
  const otel = getOpenTelemetry();
  if (!otel) {
    return callback(null);
  }

  const tracer = otel.trace.getTracer(SERVICE_NAME);
  return tracer.startActiveSpan(name, async (span) => {
    try {
      const result = await callback(span);
      span.setStatus({ code: otel.SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({
        code: otel.SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * Record a metric
 */
export function recordMetric(name: string, value: number, tags?: Record<string, string>) {
  const otel = getOpenTelemetry();
  if (!otel) {
    return;
  }

  try {
    const meter = otel.metrics.getMeter(SERVICE_NAME);
    const counter = meter.createCounter(name);
    counter.add(value, tags);
  } catch (error) {
    console.error("[OpenTelemetry] Failed to record metric", error);
  }
}
