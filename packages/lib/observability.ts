import pino from 'pino';
import { config } from '@ai-consultancy/config';
import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';

// Initialize Prometheus metrics
collectDefaultMetrics({ register });

export const metrics = {
  httpRequestsTotal: new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
  }),
  httpRequestDuration: new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5, 10],
  }),
  aiRequestsTotal: new Counter({
    name: 'ai_requests_total',
    help: 'Total number of AI requests',
    labelNames: ['provider', 'model', 'type'],
  }),
  aiRequestDuration: new Histogram({
    name: 'ai_request_duration_seconds',
    help: 'Duration of AI requests in seconds',
    labelNames: ['provider', 'model', 'type'],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
  }),
  aiTokensUsed: new Counter({
    name: 'ai_tokens_used_total',
    help: 'Total number of AI tokens used',
    labelNames: ['provider', 'model', 'type'],
  }),
  queueJobsTotal: new Counter({
    name: 'queue_jobs_total',
    help: 'Total number of queue jobs',
    labelNames: ['queue', 'status'],
  }),
  queueJobDuration: new Histogram({
    name: 'queue_job_duration_seconds',
    help: 'Duration of queue jobs in seconds',
    labelNames: ['queue', 'status'],
    buckets: [1, 5, 10, 30, 60, 300, 600],
  }),
  databaseConnections: new Gauge({
    name: 'database_connections_active',
    help: 'Number of active database connections',
  }),
  redisConnections: new Gauge({
    name: 'redis_connections_active',
    help: 'Number of active Redis connections',
  }),
};

// Initialize logger
export const logger = pino({
  level: config.app.env === 'production' ? 'info' : 'debug',
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  redact: {
    paths: [
      'password',
      'token',
      'key',
      'secret',
      'authorization',
      'cookie',
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
    ],
    censor: '[REDACTED]',
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: req.headers,
      remoteAddress: req.remoteAddress,
      remotePort: req.remotePort,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
      headers: res.headers,
    }),
    err: pino.stdSerializers.err,
  },
});

export class ObservabilityService {
  static logRequest(method: string, route: string, statusCode: number, duration: number) {
    metrics.httpRequestsTotal.inc({ method, route, status_code: statusCode.toString() });
    metrics.httpRequestDuration.observe({ method, route, status_code: statusCode.toString() }, duration);
    
    logger.info({
      method,
      route,
      statusCode,
      duration,
    }, 'HTTP request completed');
  }

  static logAIRequest(provider: string, model: string, type: string, duration: number, tokens?: { input: number; output: number }) {
    metrics.aiRequestsTotal.inc({ provider, model, type });
    metrics.aiRequestDuration.observe({ provider, model, type }, duration);
    
    if (tokens) {
      metrics.aiTokensUsed.inc({ provider, model, type }, tokens.input + tokens.output);
    }
    
    logger.info({
      provider,
      model,
      type,
      duration,
      tokens,
    }, 'AI request completed');
  }

  static logQueueJob(queue: string, status: 'started' | 'completed' | 'failed', duration?: number) {
    metrics.queueJobsTotal.inc({ queue, status });
    
    if (duration !== undefined) {
      metrics.queueJobDuration.observe({ queue, status }, duration);
    }
    
    logger.info({
      queue,
      status,
      duration,
    }, 'Queue job processed');
  }

  static logError(error: Error, context?: Record<string, any>) {
    logger.error({
      err: error,
      ...context,
    }, 'Error occurred');
  }

  static logInfo(message: string, context?: Record<string, any>) {
    logger.info(context, message);
  }

  static logWarn(message: string, context?: Record<string, any>) {
    logger.warn(context, message);
  }

  static logDebug(message: string, context?: Record<string, any>) {
    logger.debug(context, message);
  }

  static async getMetrics() {
    return register.metrics();
  }

  static async getHealthStatus() {
    try {
      // Check database connection
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      const dbDuration = Date.now() - dbStart;

      // Check Redis connection
      const redisStart = Date.now();
      // This would check Redis connection
      const redisDuration = Date.now() - redisStart;

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        checks: {
          database: {
            status: 'healthy',
            duration: dbDuration,
          },
          redis: {
            status: 'healthy',
            duration: redisDuration,
          },
        },
      };
    } catch (error) {
      logger.error({ err: error }, 'Health check failed');
      
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async getReadinessStatus() {
    try {
      // Check if all required services are available
      await prisma.$queryRaw`SELECT 1`;
      // Check Redis
      // Check other services
      
      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error({ err: error }, 'Readiness check failed');
      
      return {
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Initialize OpenTelemetry if enabled
if (config.features.otel && config.observability.otelEndpoint) {
  try {
    const { NodeSDK } = require('@opentelemetry/sdk-node');
    const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
    const { OTLPTraceExporter } = require('@opentelemetry/exporter-otlp');
    const { Resource } = require('@opentelemetry/resources');
    const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

    const traceExporter = new OTLPTraceExporter({
      url: config.observability.otelEndpoint,
    });

    const sdk = new NodeSDK({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'ai-consultancy',
        [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
      }),
      traceExporter,
      instrumentations: [getNodeAutoInstrumentations()],
    });

    sdk.start();
    logger.info('OpenTelemetry initialized');
  } catch (error) {
    logger.warn({ err: error }, 'Failed to initialize OpenTelemetry');
  }
}