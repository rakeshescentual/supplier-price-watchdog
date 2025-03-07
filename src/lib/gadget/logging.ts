
/**
 * Logging utilities for Gadget operations
 */

// Define log levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Create a structured logger
const logger = {
  debug: (message: string, data: any = {}, component: string = 'gadget') => {
    console.debug(`[${component}] ${message}`, data);
  },
  
  info: (message: string, data: any = {}, component: string = 'gadget') => {
    console.info(`[${component}] ${message}`, data);
  },
  
  warn: (message: string, data: any = {}, component: string = 'gadget') => {
    console.warn(`[${component}] ${message}`, data);
  },
  
  error: (message: string, data: any = {}, component: string = 'gadget') => {
    console.error(`[${component}] ${message}`, data);
  }
};

// Export individual logging methods
export const logDebug = logger.debug;
export const logInfo = logger.info;
export const logWarn = logger.warn;
export const logError = logger.error;

// For more complex applications, add functionality to send logs to Gadget
export const sendLogsToGadget = async (
  logs: Array<{
    level: LogLevel;
    message: string;
    data?: any;
    timestamp: string;
    component: string;
  }>
): Promise<boolean> => {
  // In production: Use Gadget SDK to send logs
  // const client = initGadgetClient();
  // if (!client) return false;
  // 
  // await client.mutate.storeLogs({
  //   logs: JSON.stringify(logs)
  // });
  // 
  // return true;
  
  // For development: Just log to console
  logs.forEach(log => {
    logger[log.level](
      `[${log.component}] (${log.timestamp}) ${log.message}`, 
      log.data || {}
    );
  });
  
  return true;
};

// Create a log buffer for batching logs to send to Gadget
let logBuffer: Array<{
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  component: string;
}> = [];

// Add a log to the buffer
export const bufferLog = (
  level: LogLevel,
  message: string,
  data: any = {},
  component: string = 'gadget'
): void => {
  // Also log to console immediately
  logger[level](`[${component}] ${message}`, data);
  
  // Add to buffer for later sending to Gadget
  logBuffer.push({
    level,
    message,
    data,
    timestamp: new Date().toISOString(),
    component
  });
  
  // If buffer gets too large, flush it
  if (logBuffer.length >= 100) {
    flushLogBuffer();
  }
};

// Flush the log buffer to Gadget
export const flushLogBuffer = async (): Promise<boolean> => {
  if (logBuffer.length === 0) {
    return true;
  }
  
  const logsToSend = [...logBuffer];
  logBuffer = [];
  
  return await sendLogsToGadget(logsToSend);
};
