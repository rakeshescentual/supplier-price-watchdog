/**
 * Logging utilities for Gadget integration
 */

// Log levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// In-memory log storage for development
const inMemoryLogs: Array<{
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  module?: string;
}> = [];

// Maximum number of logs to keep in memory
const MAX_IN_MEMORY_LOGS = 500;

/**
 * Log a message with debug level
 */
export const logDebug = (
  message: string, 
  context?: Record<string, any>,
  module?: string
): void => {
  logMessage('debug', message, context, module);
};

/**
 * Log a message with info level
 */
export const logInfo = (
  message: string, 
  context?: Record<string, any>,
  module?: string
): void => {
  logMessage('info', message, context, module);
};

/**
 * Log a message with warning level
 */
export const logWarning = (
  message: string, 
  context?: Record<string, any>,
  module?: string
): void => {
  logMessage('warn', message, context, module);
};

/**
 * Log a message with error level
 */
export const logError = (
  message: string, 
  context?: Record<string, any>,
  module?: string
): void => {
  logMessage('error', message, context, module);
};

/**
 * Internal function to log a message with the specified level
 */
const logMessage = (
  level: LogLevel, 
  message: string, 
  context?: Record<string, any>,
  module?: string
): void => {
  // Create log entry
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
    module
  };
  
  // Log to console with appropriate method
  switch (level) {
    case 'debug':
      console.debug(`[Gadget:${module || 'core'}]`, message, context || '');
      break;
    case 'info':
      console.info(`[Gadget:${module || 'core'}]`, message, context || '');
      break;
    case 'warn':
      console.warn(`[Gadget:${module || 'core'}]`, message, context || '');
      break;
    case 'error':
      console.error(`[Gadget:${module || 'core'}]`, message, context || '');
      break;
  }
  
  // Store in memory for development debugging
  inMemoryLogs.push(logEntry);
  
  // Trim if exceeding max size
  if (inMemoryLogs.length > MAX_IN_MEMORY_LOGS) {
    inMemoryLogs.splice(0, inMemoryLogs.length - MAX_IN_MEMORY_LOGS);
  }
  
  // In a production environment, this would also send logs to a remote logging service
};

/**
 * Get recent logs for debugging
 */
export const getRecentLogs = (
  level?: LogLevel,
  limit = 100
): Array<{
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  module?: string;
}> => {
  let filteredLogs = inMemoryLogs;
  
  // Filter by level if specified
  if (level) {
    filteredLogs = filteredLogs.filter(log => log.level === level);
  }
  
  // Get most recent logs up to the limit
  return filteredLogs.slice(-Math.min(filteredLogs.length, limit)).map(log => ({
    ...log,
    context: log.context ? { ...log.context } : undefined
  }));
};

/**
 * Clear in-memory logs
 */
export const clearLogs = (): void => {
  inMemoryLogs.length = 0;
};
