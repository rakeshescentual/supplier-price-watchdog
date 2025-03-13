
/**
 * Telemetry functions for tracking Gadget operations
 */
import { logInfo } from './logging';

/**
 * Start tracking the performance of an operation
 * @param operation The name of the operation to track
 * @param metadata Additional metadata to log with the operation
 * @returns A function to call when the operation is complete
 */
export const startPerformanceTracking = (operation: string, metadata: Record<string, any> = {}) => {
  const startTime = performance.now();
  logInfo(`Starting operation: ${operation}`, metadata, 'telemetry');
  
  return async () => {
    const duration = performance.now() - startTime;
    logInfo(`Completed operation: ${operation}`, {
      ...metadata,
      durationMs: Math.round(duration),
      timestamp: new Date().toISOString()
    }, 'telemetry');
    
    // Return metrics
    return {
      operation,
      durationMs: Math.round(duration),
      timestamp: new Date().toISOString()
    };
  };
};

/**
 * Report an error to the telemetry system
 * @param error The error to report
 * @param metadata Additional metadata to log with the error
 */
export const reportError = async (error: Error | string, metadata: Record<string, any> = {}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  logInfo(`Error reported: ${errorMessage}`, {
    ...metadata,
    errorStack,
    timestamp: new Date().toISOString()
  }, 'error');
  
  // In production, we would send this to an error tracking service
  return {
    reported: true,
    timestamp: new Date().toISOString()
  };
};
