
/**
 * Telemetry utilities for monitoring and tracking Gadget operations
 */
import { toast } from 'sonner';
import { getGadgetConfig } from '@/utils/gadget-helpers';

interface ErrorReportOptions {
  component?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  action?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

interface PerformanceMetrics {
  startTime: number;
  operation: string;
  metadata?: Record<string, any>;
}

const metrics: PerformanceMetrics[] = [];

/**
 * Track usage of specific features
 * @param feature Feature name being used
 * @param metadata Additional metadata about the usage
 */
export const trackUsage = async (
  feature: string,
  metadata: Record<string, any> = {}
): Promise<void> => {
  const config = getGadgetConfig();
  if (!config) return;

  try {
    // In production: Send telemetry data to Gadget
    // const url = `${getGadgetApiUrl(config)}telemetry/usage`;
    // await fetch(url, {
    //   method: 'POST',
    //   headers: createGadgetHeaders(config),
    //   body: JSON.stringify({
    //     feature,
    //     timestamp: new Date().toISOString(),
    //     appId: config.appId,
    //     environment: config.environment,
    //     ...metadata
    //   })
    // });
    
    console.log(`Tracking usage: ${feature}`, metadata);
  } catch (error) {
    console.warn('Failed to track usage:', error);
  }
};

/**
 * Report errors to telemetry system
 * @param error Error object or error message
 * @param options Additional error reporting options
 */
export const reportError = async (
  error: Error | string,
  options: ErrorReportOptions = {}
): Promise<void> => {
  const config = getGadgetConfig();
  if (!config) return;

  const errorObj = typeof error === 'string' ? new Error(error) : error;
  const severity = options.severity || 'medium';
  
  try {
    // In production: Send error to Gadget
    // const url = `${getGadgetApiUrl(config)}telemetry/errors`;
    // await fetch(url, {
    //   method: 'POST',
    //   headers: createGadgetHeaders(config),
    //   body: JSON.stringify({
    //     message: errorObj.message,
    //     stack: errorObj.stack,
    //     component: options.component || 'unknown',
    //     severity,
    //     action: options.action,
    //     userId: options.userId,
    //     metadata: options.metadata,
    //     timestamp: new Date().toISOString(),
    //     appId: config.appId,
    //     environment: config.environment
    //   })
    // });
    
    console.error(`[${severity.toUpperCase()}] Error in ${options.component || 'unknown'}:`, errorObj);
    
    // Only show toast for high/critical severity
    if (severity === 'high' || severity === 'critical') {
      toast.error("An error occurred", {
        description: errorObj.message.substring(0, 100) + (errorObj.message.length > 100 ? '...' : '')
      });
    }
  } catch (err) {
    // Fallback to console if error reporting fails
    console.error('Error reporting failed:', err);
    console.error('Original error:', errorObj);
  }
};

/**
 * Track performance of operations
 * @param operation Name of operation being tracked
 * @param durationMs Duration in milliseconds
 * @param metadata Additional metadata about the operation
 */
export const trackPerformance = async (
  operation: string,
  durationMs: number,
  metadata: Record<string, any> = {}
): Promise<void> => {
  const config = getGadgetConfig();
  if (!config) return;

  try {
    // In production: Send performance data to Gadget
    // const url = `${getGadgetApiUrl(config)}telemetry/performance`;
    // await fetch(url, {
    //   method: 'POST',
    //   headers: createGadgetHeaders(config),
    //   body: JSON.stringify({
    //     operation,
    //     durationMs,
    //     timestamp: new Date().toISOString(),
    //     appId: config.appId,
    //     environment: config.environment,
    //     ...metadata
    //   })
    // });
    
    console.log(`Performance: ${operation} took ${durationMs}ms`, metadata);
  } catch (error) {
    console.warn('Failed to track performance:', error);
  }
};

/**
 * Start tracking performance for an operation
 * @param operation Name of operation to track
 * @param metadata Additional metadata about the operation
 * @returns Function to call when operation completes
 */
export const startPerformanceTracking = (
  operation: string,
  metadata: Record<string, any> = {}
): () => Promise<void> => {
  const startTime = performance.now();
  const metric: PerformanceMetrics = { startTime, operation, metadata };
  metrics.push(metric);
  
  return async () => {
    const endTime = performance.now();
    const durationMs = Math.round(endTime - startTime);
    
    // Remove metric from tracking array
    const index = metrics.indexOf(metric);
    if (index !== -1) {
      metrics.splice(index, 1);
    }
    
    await trackPerformance(operation, durationMs, metadata);
  };
};

/**
 * Get all active performance metrics
 * @returns Array of active performance metrics
 */
export const getActiveMetrics = (): PerformanceMetrics[] => {
  return [...metrics];
};

/**
 * Send health check data to telemetry system
 * @param status Health status
 * @param details Additional health check details
 */
export const reportHealthCheck = async (
  status: 'healthy' | 'degraded' | 'unhealthy',
  details: Record<string, any> = {}
): Promise<void> => {
  const config = getGadgetConfig();
  if (!config) return;

  try {
    // In production: Send health check to Gadget
    // const url = `${getGadgetApiUrl(config)}telemetry/health`;
    // await fetch(url, {
    //   method: 'POST',
    //   headers: createGadgetHeaders(config),
    //   body: JSON.stringify({
    //     status,
    //     timestamp: new Date().toISOString(),
    //     appId: config.appId,
    //     environment: config.environment,
    //     ...details
    //   })
    // });
    
    console.log(`Health check: ${status}`, details);
  } catch (error) {
    console.warn('Failed to report health check:', error);
  }
};
