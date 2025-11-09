/**
 * Structured Logging System
 * Provides consistent, searchable logging across the application
 */

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  userId?: string;
  requestId?: string;
  duration?: number;
}

class StructuredLogger {
  private formatEntry(entry: Omit<LogEntry, "timestamp">): LogEntry {
    return {
      ...entry,
      timestamp: new Date().toISOString(),
    };
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    const entry = this.formatEntry({
      level,
      message,
      context,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    });

    // Console output with structured format
    const logMethod = level === "error" || level === "fatal" ? console.error : console[level];
    logMethod(JSON.stringify(entry));

    // Send to backend in production
    if (process.env.NODE_ENV === "production") {
      fetch("/api/telemetry/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...entry, category: "logging" }),
      }).catch(() => {
        // Silent fail for logging
      });
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log("debug", message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log("info", message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log("warn", message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log("error", message, context, error);
  }

  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    this.log("fatal", message, context, error);
  }
}

export const logger = new StructuredLogger();
