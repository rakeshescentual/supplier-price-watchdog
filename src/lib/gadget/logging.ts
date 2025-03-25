/**
 * Enhanced logging utilities for Gadget integration
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogCategory = 'api' | 'sync' | 'shopify' | 'shopify-plus' | 'webhook' | 'system' | 'auth' | 'user';

interface LoggerOptions {
  enableConsole: boolean;
  minLevel: LogLevel;
  captureErrors: boolean;
  maxLogsToKeep: number;
}

// Default options
const DEFAULT_OPTIONS: LoggerOptions = {
  enableConsole: true,
  minLevel: 'info',
  captureErrors: true,
  maxLogsToKeep: 1000
};

// Log levels with numeric values for comparison
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

class Logger {
  private options: LoggerOptions;
  private logs: any[] = [];
  private errorHandler?: (error: Error | string, metadata?: any) => void;

  constructor(options: Partial<LoggerOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }
  
  /**
   * Set an error handler function
   */
  public setErrorHandler(handler: (error: Error | string, metadata?: any) => void): void {
    this.errorHandler = handler;
  }
  
  /**
   * Update logger options
   */
  public setOptions(options: Partial<LoggerOptions>): void {
    this.options = { ...this.options, ...options };
  }
  
  /**
   * Log a message at a specific level
   */
  private log(level: LogLevel, message: string, metadata: any = {}, category: LogCategory = 'system'): void {
    // Check if we should log at this level
    if (LOG_LEVELS[level] < LOG_LEVELS[this.options.minLevel]) {
      return;
    }
    
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      category,
      message,
      metadata
    };
    
    // Store in memory if we're keeping logs
    if (this.options.maxLogsToKeep > 0) {
      this.logs.push(logEntry);
      
      // Trim logs if we have too many
      if (this.logs.length > this.options.maxLogsToKeep) {
        this.logs = this.logs.slice(-this.options.maxLogsToKeep);
      }
    }
    
    // Log to console if enabled
    if (this.options.enableConsole) {
      const consoleMethod = level === 'error' ? 'error' : 
                           level === 'warn' ? 'warn' : 
                           level === 'debug' ? 'debug' : 'log';
      
      console[consoleMethod](`[${timestamp}] [${level.toUpperCase()}] [${category}] ${message}`, 
        Object.keys(metadata).length > 0 ? metadata : '');
    }
    
    // Call error handler for errors if configured
    if (level === 'error' && this.options.captureErrors && this.errorHandler) {
      // Extract error object if present
      const errorObject = metadata.error instanceof Error ? 
        metadata.error : 
        new Error(typeof metadata.error === 'string' ? metadata.error : message);
      
      this.errorHandler(errorObject, { ...metadata, message, category });
    }
  }
  
  /**
   * Log a debug message
   */
  public debug(message: string, metadata: any = {}, category: LogCategory = 'system'): void {
    this.log('debug', message, metadata, category);
  }
  
  /**
   * Log an info message
   */
  public info(message: string, metadata: any = {}, category: LogCategory = 'system'): void {
    this.log('info', message, metadata, category);
  }
  
  /**
   * Log a warning message
   */
  public warn(message: string, metadata: any = {}, category: LogCategory = 'system'): void {
    this.log('warn', message, metadata, category);
  }
  
  /**
   * Log an error message
   */
  public error(message: string, metadata: any = {}, category: LogCategory = 'system'): void {
    this.log('error', message, metadata, category);
  }
  
  /**
   * Get all stored logs
   */
  public getLogs(filter?: { 
    level?: LogLevel; 
    category?: LogCategory; 
    since?: Date;
    limit?: number;
  }): any[] {
    let filteredLogs = [...this.logs];
    
    if (filter) {
      if (filter.level) {
        filteredLogs = filteredLogs.filter(log => 
          LOG_LEVELS[log.level] >= LOG_LEVELS[filter.level!]);
      }
      
      if (filter.category) {
        filteredLogs = filteredLogs.filter(log => log.category === filter.category);
      }
      
      if (filter.since) {
        const sinceTime = filter.since.getTime();
        filteredLogs = filteredLogs.filter(log => 
          new Date(log.timestamp).getTime() >= sinceTime);
      }
      
      if (filter.limit && filter.limit > 0) {
        filteredLogs = filteredLogs.slice(-filter.limit);
      }
    }
    
    return filteredLogs;
  }
  
  /**
   * Clear all logs
   */
  public clearLogs(): void {
    this.logs = [];
  }
}

// Create a singleton logger instance
const loggerInstance = new Logger();

// Connect to error tracking system
import { gadgetAnalytics } from './analytics';
loggerInstance.setErrorHandler((error, metadata) => {
  gadgetAnalytics.trackError(error, metadata);
});

// Export convenience methods that use the singleton
export const logDebug = (message: string, metadata: any = {}, category: LogCategory = 'system'): void => {
  loggerInstance.debug(message, metadata, category);
};

export const logInfo = (message: string, metadata: any = {}, category: LogCategory = 'system'): void => {
  loggerInstance.info(message, metadata, category);
};

export const logWarning = (message: string, metadata: any = {}, category: LogCategory = 'system'): void => {
  loggerInstance.warn(message, metadata, category);
};

export const logError = (message: string, metadata: any = {}, category: LogCategory = 'system'): void => {
  loggerInstance.error(message, metadata, category);
};

// Export the logger class and singleton
export const logger = loggerInstance;
export default Logger;
