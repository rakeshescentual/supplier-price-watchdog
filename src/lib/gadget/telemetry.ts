
import { logInfo, logError } from './logging';
import { GadgetErrorReporter, GadgetTelemetryTracker } from './types';

// Map to store performance tracking start times
const performanceTimers = new Map<string, {
  startTime: number;
  operationId: string;
  properties?: Record<string, any>;
}>();

/**
 * Start tracking performance for an operation
 * @param operation The name of the operation to track
 * @param properties Additional properties to include with the tracking
 * @returns Function to call when the operation is complete
 */
export const startPerformanceTracking = (
  operation: string,
  properties?: Record<string, any>
): (() => Promise<void>) => {
  const operationId = `${operation}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  const startTime = Date.now();
  
  performanceTimers.set(operationId, {
    startTime,
    operationId,
    properties
  });
  
  logInfo(`Starting operation: ${operation}`, {
    operationId,
    ...properties
  }, 'telemetry');
  
  // Return function to finish tracking
  return async () => {
    const timerInfo = performanceTimers.get(operationId);
    if (!timerInfo) return;
    
    const duration = Date.now() - timerInfo.startTime;
    
    logInfo(`Completed operation: ${operation}`, {
      operationId,
      duration,
      ...timerInfo.properties
    }, 'telemetry');
    
    performanceTimers.delete(operationId);
    
    // In a production environment, this would send telemetry data to an analytics service
  };
};

/**
 * Track performance of an operation
 * @param operation The name of the operation to track
 * @param properties Additional properties to include with the tracking
 * @returns Function to call when the operation is complete
 */
export const trackPerformance = (
  operation: string,
  properties?: Record<string, any>
): (() => Promise<void>) => {
  return startPerformanceTracking(operation, properties);
};

/**
 * Report health check results to telemetry system
 * @param status The health status
 * @param details Additional details about the health check
 */
export const reportHealthCheck = async (
  status: 'healthy' | 'degraded' | 'unhealthy', 
  details?: Record<string, any>
): Promise<void> => {
  logInfo(`Health check reported: ${status}`, { ...details }, 'telemetry');
  
  // In a production environment, this would send health check data to a monitoring service
  // For now, just log the health check
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 50));
  
  return;
};

/**
 * Report an error to the telemetry system
 * @param error The error to report
 * @param context Additional context for the error
 */
export const reportError: GadgetErrorReporter = async (
  error,
  context = {}
) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  logError("Error reported to telemetry", {
    error: errorMessage,
    stack: errorStack,
    ...context
  }, 'telemetry');
  
  // In a production environment, this would send error data to an error tracking service
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return;
};

/**
 * Track an event in the telemetry system
 * @param event The name of the event to track
 * @param properties Additional properties for the event
 */
export const trackEvent: GadgetTelemetryTracker = (
  event,
  properties = {}
) => {
  logInfo(`Event tracked: ${event}`, properties, 'telemetry');
  
  // In a production environment, this would send event data to an analytics service
};

/**
 * Set user properties in the telemetry system
 * @param userId The ID of the user
 * @param properties The properties to set for the user
 */
export const setUserProperties = (
  userId: string,
  properties: Record<string, any>
) => {
  logInfo(`Setting user properties for ${userId}`, properties, 'telemetry');
  
  // In a production environment, this would set user properties in an analytics service
};

/**
 * Start a user session in the telemetry system
 * @param userId The ID of the user
 * @param sessionProperties Additional properties for the session
 */
export const startUserSession = (
  userId: string,
  sessionProperties?: Record<string, any>
) => {
  logInfo(`Starting session for user ${userId}`, sessionProperties, 'telemetry');
  
  // In a production environment, this would start a user session in an analytics service
};

/**
 * End a user session in the telemetry system
 * @param userId The ID of the user
 */
export const endUserSession = (userId: string) => {
  logInfo(`Ending session for user ${userId}`, {}, 'telemetry');
  
  // In a production environment, this would end a user session in an analytics service
};
