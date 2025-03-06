
import { toast } from 'sonner';
import type { GadgetConfig } from '@/types/price';
import { getGadgetConfig } from '@/utils/gadget-helpers';

export interface TelemetryEvent {
  category: 'error' | 'performance' | 'usage' | 'business';
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
  timestamp?: string;
}

export interface ErrorTelemetry extends TelemetryEvent {
  category: 'error';
  error: Error | string;
  component?: string;
  stackTrace?: string;
  userId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Send telemetry data to Gadget for monitoring and analytics
 * @param event Telemetry event data
 * @returns Promise resolving to boolean indicating success
 */
export const sendTelemetry = async (event: TelemetryEvent): Promise<boolean> => {
  const config = getGadgetConfig();
  if (!config) return false;
  
  try {
    const telemetryData = {
      ...event,
      timestamp: event.timestamp || new Date().toISOString(),
      appId: config.appId,
      environment: config.environment
    };
    
    console.log('Sending telemetry:', telemetryData);
    
    // In production: Use Gadget SDK to send telemetry
    // const response = await fetch(`${getGadgetApiUrl(config)}telemetry`, {
    //   method: 'POST',
    //   headers: createGadgetHeaders(config),
    //   body: JSON.stringify(telemetryData)
    // });
    // return response.ok;
    
    // For demonstration purposes, just log and return success
    return true;
  } catch (error) {
    console.error('Failed to send telemetry:', error);
    return false;
  }
};

/**
 * Report an error to the telemetry system
 * @param error Error object or message
 * @param metadata Additional information about the error
 * @returns Promise resolving to boolean indicating success
 */
export const reportError = async (
  error: Error | string,
  metadata: {
    component?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    action?: string;
    userId?: string;
  } = {}
): Promise<boolean> => {
  try {
    const errorMessage = error instanceof Error ? error.message : error;
    const stackTrace = error instanceof Error ? error.stack : undefined;
    
    // Determine severity based on error type or provided severity
    const severity = metadata.severity || 'medium';
    
    // Send error telemetry
    const result = await sendTelemetry({
      category: 'error',
      action: metadata.action || 'unknown_action',
      label: errorMessage.substring(0, 100), // Truncate long error messages
      metadata: metadata,
      error: error,
      component: metadata.component,
      stackTrace: stackTrace,
      userId: metadata.userId,
      severity: severity
    } as ErrorTelemetry);
    
    // For critical errors, notify the user
    if (severity === 'critical' || severity === 'high') {
      toast.error("An error occurred", {
        description: `${errorMessage.substring(0, 150)}${errorMessage.length > 150 ? '...' : ''}`,
      });
    }
    
    return result;
  } catch (e) {
    // Fail silently to prevent error reporting loops
    console.error('Error in error reporting:', e);
    return false;
  }
};

/**
 * Track performance metrics
 * @param action Name of the action being measured
 * @param durationMs Duration in milliseconds
 * @param metadata Additional information
 */
export const trackPerformance = async (
  action: string,
  durationMs: number,
  metadata: Record<string, any> = {}
): Promise<void> => {
  try {
    await sendTelemetry({
      category: 'performance',
      action,
      value: durationMs,
      metadata
    });
    
    // Log performance metrics to console in development
    if (getGadgetConfig()?.environment === 'development') {
      console.log(`[Performance] ${action}: ${durationMs}ms`, metadata);
    }
  } catch (error) {
    console.error('Failed to track performance:', error);
  }
};

/**
 * Create a performance tracker that automatically measures elapsed time
 * @param action Name of the action being measured
 * @param metadata Additional information
 * @returns Function to call when the action is complete
 */
export const startPerformanceTracking = (
  action: string,
  metadata: Record<string, any> = {}
): () => Promise<void> => {
  const startTime = performance.now();
  
  return async () => {
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    await trackPerformance(action, duration, metadata);
  };
};

/**
 * Track feature usage
 * @param feature Feature being used
 * @param metadata Additional information
 */
export const trackUsage = async (
  feature: string,
  metadata: Record<string, any> = {}
): Promise<void> => {
  try {
    await sendTelemetry({
      category: 'usage',
      action: 'feature_used',
      label: feature,
      metadata
    });
  } catch (error) {
    console.error('Failed to track usage:', error);
  }
};
