import { getGadgetConfig } from '@/utils/gadget-helpers';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  module?: string;
}

// Maximum number of logs to keep in memory
const MAX_MEMORY_LOGS = 1000;
// In-memory log storage for debugging
const memoryLogs: LogEntry[] = [];

/**
 * Configure log storage and remote logging
 */
export const logConfig = {
  // Default log level based on environment
  minLevel: (getGadgetConfig()?.environment === 'development' ? 'debug' : 'info') as LogLevel,
  // Whether to send logs to Gadget
  remoteLogging: getGadgetConfig()?.environment === 'production',
  // Whether to store logs in memory
  memoryLogging: true,
  // Numeric values for log level comparison
  levelValue: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  }
};

/**
 * Add a log entry
 * @param level Log level
 * @param message Log message
 * @param context Additional context data
 * @param module Source module name
 */
export const log = async (
  level: LogLevel,
  message: string,
  context: Record<string, any> = {},
  module?: string
): Promise<void> => {
  // Skip if log level is below minimum
  if (logConfig.levelValue[level] < logConfig.levelValue[logConfig.minLevel]) {
    return;
  }
  
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
    module
  };
  
  // Console logging
  const logMethod = level === 'debug' 
    ? console.debug 
    : level === 'info' 
    ? console.info 
    : level === 'warn' 
    ? console.warn 
    : console.error;
  
  const modulePrefix = module ? `[${module}] ` : '';
  logMethod(`${modulePrefix}${message}`, context);
  
  // Memory logging if enabled
  if (logConfig.memoryLogging) {
    memoryLogs.push(entry);
    // Keep memory logs under limit
    if (memoryLogs.length > MAX_MEMORY_LOGS) {
      memoryLogs.shift();
    }
  }
  
  // Remote logging if enabled
  if (logConfig.remoteLogging) {
    try {
      const config = getGadgetConfig();
      if (!config) return;
      
      // In production: Send logs to Gadget
      // const url = `${getGadgetApiUrl(config)}logs`;
      // await fetch(url, {
      //   method: 'POST',
      //   headers: createGadgetHeaders(config),
      //   body: JSON.stringify(entry)
      // });
    } catch (error) {
      // Silently fail to avoid infinite logging loops
      console.error('Failed to send log to remote:', error);
    }
  }
};

// Convenience methods for different log levels
export const logDebug = (message: string, context: Record<string, any> = {}, module?: string) => 
  log('debug', message, context, module);

export const logInfo = (message: string, context: Record<string, any> = {}, module?: string) => 
  log('info', message, context, module);

export const logWarn = (message: string, context: Record<string, any> = {}, module?: string) => 
  log('warn', message, context, module);

export const logError = (message: string, context: Record<string, any> = {}, module?: string) => 
  log('error', message, context, module);

/**
 * Get recent logs from memory
 * @param count Number of recent logs to retrieve
 * @param level Optional log level filter
 * @returns Array of log entries
 */
export const getRecentLogs = (count: number = 100, level?: LogLevel): LogEntry[] => {
  let filteredLogs = memoryLogs;
  
  if (level) {
    filteredLogs = memoryLogs.filter(entry => 
      logConfig.levelValue[entry.level] >= logConfig.levelValue[level]
    );
  }
  
  return filteredLogs.slice(-count);
};

/**
 * Set the minimum log level
 * @param level New minimum log level
 */
export const setLogLevel = (level: LogLevel): void => {
  logConfig.minLevel = level;
  console.log(`Log level set to: ${level}`);
};

/**
 * Enable or disable remote logging
 * @param enabled Whether remote logging should be enabled
 */
export const setRemoteLogging = (enabled: boolean): void => {
  logConfig.remoteLogging = enabled;
  console.log(`Remote logging ${enabled ? 'enabled' : 'disabled'}`);
};
