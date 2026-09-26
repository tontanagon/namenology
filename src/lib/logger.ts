// =============================================================================
// ENTERPRISE STRUCTURED LOGGER & SENSITIVE DATA REDACTOR
// Compliant with OWASP A09 (Security Logging and Monitoring Failures)
// Formats logs in structured JSON with recursive redaction of secrets, tokens & PII
// =============================================================================

export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "SECURITY";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  metadata?: Record<string, unknown>;
  error?: {
    name?: string;
    message?: string;
    stack?: string;
  };
}

/**
 * Sensitive field patterns targeted for automatic recursive redaction.
 */
const SENSITIVE_KEY_REGEX =
  /^(password|passwordhash|pass|secret|token|accesstoken|refreshtoken|authorization|cookie|sessionid|creditcard|cardnumber|cvv|cvc|apikey|stripesecretkey|privatekey)$/i;

/**
 * Regex to detect and mask JWT tokens embedded in strings.
 */
const JWT_REGEX = /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g;

/**
 * Recursively deep-clones and redacts sensitive keys and values from objects.
 */
export function redactSensitiveData(data: unknown, depth = 0): unknown {
  if (depth > 8) return "[MAX_DEPTH_EXCEEDED]";

  if (typeof data === "string") {
    // Redact JWT patterns inside arbitrary strings
    return data.replace(JWT_REGEX, "[REDACTED_JWT]");
  }

  if (Array.isArray(data)) {
    return data.map((item) => redactSensitiveData(item, depth + 1));
  }

  if (data !== null && typeof data === "object") {
    // Handle Error objects
    if (data instanceof Error) {
      return {
        name: data.name,
        message: data.message,
        stack: process.env.NODE_ENV === "production" ? undefined : data.stack,
      };
    }

    const sanitizedObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (SENSITIVE_KEY_REGEX.test(key)) {
        sanitizedObj[key] = "[REDACTED]";
      } else {
        sanitizedObj[key] = redactSensitiveData(value, depth + 1);
      }
    }
    return sanitizedObj;
  }

  return data;
}

/**
 * Formats and outputs structured JSON log entries.
 */
function outputLog(entry: LogEntry) {
  const serialized = JSON.stringify(entry);
  if (entry.level === "ERROR" || entry.level === "SECURITY") {
    console.error(serialized);
  } else if (entry.level === "WARN") {
    console.warn(serialized);
  } else {
    console.log(serialized);
  }
}

export const logger = {
  info(context: string, message: string, meta?: Record<string, unknown>) {
    outputLog({
      timestamp: new Date().toISOString(),
      level: "INFO",
      context: context.toUpperCase(),
      message,
      metadata: meta ? (redactSensitiveData(meta) as Record<string, unknown>) : undefined,
    });
  },

  warn(context: string, message: string, meta?: Record<string, unknown>) {
    outputLog({
      timestamp: new Date().toISOString(),
      level: "WARN",
      context: context.toUpperCase(),
      message,
      metadata: meta ? (redactSensitiveData(meta) as Record<string, unknown>) : undefined,
    });
  },

  error(context: string, message: string, error?: unknown, meta?: Record<string, unknown>) {
    let errorDetails: LogEntry["error"];
    if (error instanceof Error) {
      errorDetails = {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
      };
    } else if (typeof error === "string") {
      errorDetails = { message: error };
    }

    outputLog({
      timestamp: new Date().toISOString(),
      level: "ERROR",
      context: context.toUpperCase(),
      message,
      error: errorDetails,
      metadata: meta ? (redactSensitiveData(meta) as Record<string, unknown>) : undefined,
    });
  },

  security(context: string, message: string, meta?: Record<string, unknown>) {
    outputLog({
      timestamp: new Date().toISOString(),
      level: "SECURITY",
      context: context.toUpperCase(),
      message,
      metadata: meta ? (redactSensitiveData(meta) as Record<string, unknown>) : undefined,
    });
  },

  debug(context: string, message: string, meta?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== "production") {
      outputLog({
        timestamp: new Date().toISOString(),
        level: "DEBUG",
        context: context.toUpperCase(),
        message,
        metadata: meta ? (redactSensitiveData(meta) as Record<string, unknown>) : undefined,
      });
    }
  },
};
