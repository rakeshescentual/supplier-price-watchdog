
/**
 * Telemetry and performance tracking for Gadget operations
 */
import { logInfo, logError } from './logging';
import { initGadgetClient } from './client';

// Type for performance tracking data
interface PerformanceData {
  [key: string]: string | number | boolean | Record<string, any>;
}

/**
 * Report an error to the telemetry system
 * @param error Error object or message
 * @param metadata Additional context for the error
 */
export const reportError = async (
  error: Error | string,
  metadata: {
    component: string;
    severity: 'low' | 'medium' | 'high';
    action?: string;
    userId?: string;
    metadata?: Record<string, any>;
  }
): Promise<void> => {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  // Log locally
  logError(`Telemetry error: ${errorMessage}`, {
    ...metadata,
    stack: errorStack
  }, 'telemetry');
  
  // Get Gadget client
  const client = initGadgetClient();
  if (!client) {
    // If no client, just log locally
    return;
  }
  
  try {
    // In production, with actual Gadget.dev SDK:
    // await client.mutate.reportTelemetry({
    //   type: 'error',
    //   message: errorMessage,
    //   metadata: {
    //     ...metadata,
    //     stack: errorStack
    //   }
    // });
    
    // For development, just mock the reporting
    console.log('[Telemetry] Error reported:', {
      message: errorMessage,
      ...metadata
    });
  } catch (reportError) {
    // Don't recursively report errors in the error reporter
    console.error('Failed to report error to telemetry system:', reportError);
  }
};

/**
 * Track performance metrics
 * @param event Performance event name
 * @param data Performance data to track
 */
export const trackPerformance = async (
  event: string,
  data: PerformanceData
): Promise<void> => {
  // Log locally
  logInfo(`Performance: ${event}`, data, 'telemetry');
  
  // Get Gadget client
  const client = initGadgetClient();
  if (!client) {
    // If no client, just log locally
    return;
  }
  
  try {
    // In production, with actual Gadget.dev SDK:
    // await client.mutate.trackPerformance({
    //   event,
    //   data: JSON.stringify(data)
    // });
    
    // For development, just log
    console.log(`[Performance] ${event}:`, data);
  } catch (error) {
    console.error('Failed to track performance:', error);
  }
};

/**
 * Start tracking performance for an operation
 * @param operation Operation name to track
 * @param initialData Initial data to include
 * @returns Function to call when the operation is complete
 */
export const startPerformanceTracking = (
  operation: string,
  initialData: Record<string, any> = {}
): (() => Promise<void>) => {
  const startTime = Date.now();
  
  // Return a function that can be called to finish tracking
  return async () => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    await trackPerformance(operation, {
      ...initialData,
      durationMs: duration,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString()
    });
  };
};

/**
 * Report a health check to the telemetry system
 * @param status Health status
 * @param metadata Additional context
 */
export const reportHealthCheck = async (
  status: 'healthy' | 'degraded' | 'down',
  metadata: Record<string, any> = {}
): Promise<void> => {
  // Get Gadget client
  const client = initGadgetClient();
  if (!client) {
    // If no client, just log locally
    logInfo(`Health check: ${status}`, metadata, 'telemetry');
    return;
  }
  
  try {
    // In production, with actual Gadget.dev SDK:
    // await client.mutate.reportHealth({
    //   status,
    //   timestamp: new Date().toISOString(),
    //   metadata: JSON.stringify(metadata)
    // });
    
    // For development, just log
    console.log(`[Health] Status: ${status}`, metadata);
  } catch (error) {
    console.error('Failed to report health check:', error);
  }
};
