
/**
 * Logging utilities for Gadget integration
 */

/**
 * Log an informational message
 * @param message The message to log
 * @param data Additional data to log
 * @param component The component generating the log
 */
export const logInfo = (message: string, data: Record<string, any> = {}, component: string = 'general') => {
  console.info(`[Gadget:${component}] ${message}`, data);
  
  // In production, we might log to a central logging system
};

/**
 * Log an error message
 * @param message The error message to log
 * @param data Additional data to log
 * @param component The component generating the log
 */
export const logError = (message: string, data: Record<string, any> = {}, component: string = 'general') => {
  console.error(`[Gadget:${component}] ${message}`, data);
  
  // In production, we might log to a central logging system and alert on errors
};

/**
 * Log a warning message
 * @param message The warning message to log
 * @param data Additional data to log
 * @param component The component generating the log
 */
export const logWarning = (message: string, data: Record<string, any> = {}, component: string = 'general') => {
  console.warn(`[Gadget:${component}] ${message}`, data);
  
  // In production, we might log to a central logging system
};

/**
 * Log a debug message (only in development)
 * @param message The debug message to log
 * @param data Additional data to log
 * @param component The component generating the log
 */
export const logDebug = (message: string, data: Record<string, any> = {}, component: string = 'general') => {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[Gadget:${component}] ${message}`, data);
  }
  
  // Debug logs are not sent to central logging in production
};
