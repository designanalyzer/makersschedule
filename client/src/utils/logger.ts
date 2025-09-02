// Centralized logging utility for better error handling and debugging

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private log(level: LogLevel, message: string, context?: string, data?: any) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      data
    };

    this.logs.push(entry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output for development
    if (process.env.NODE_ENV === 'development') {
      const prefix = context ? `[${context}]` : '';
      const logMessage = `${prefix} ${message}`;
      
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(logMessage, data);
          break;
        case LogLevel.INFO:
          console.info(logMessage, data);
          break;
        case LogLevel.WARN:
          console.warn(logMessage, data);
          break;
        case LogLevel.ERROR:
          console.error(logMessage, data);
          break;
      }
    }
  }

  debug(message: string, context?: string, data?: any) {
    this.log(LogLevel.DEBUG, message, context, data);
  }

  info(message: string, context?: string, data?: any) {
    this.log(LogLevel.INFO, message, context, data);
  }

  warn(message: string, context?: string, data?: any) {
    this.log(LogLevel.WARN, message, context, data);
  }

  error(message: string, context?: string, data?: any) {
    this.log(LogLevel.ERROR, message, context, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();

// Error handling utility
export function handleError(error: any, context?: string): string {
  const errorMessage = error instanceof Error ? error.message : String(error);
  logger.error(`Error in ${context || 'unknown context'}: ${errorMessage}`, context, error);
  return errorMessage;
}

// Async error wrapper
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => R | Promise<R>,
  context?: string
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      const result = await fn(...args);
      return result;
    } catch (error) {
      handleError(error, context);
      throw error;
    }
  };
} 