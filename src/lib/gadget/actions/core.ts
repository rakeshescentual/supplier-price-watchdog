
/**
 * Core functionality for Gadget actions
 */
import { logInfo, logError } from '../logging';
import { initGadgetClient } from '../client';
import { startPerformanceTracking } from '../telemetry';
import { toast } from 'sonner';
import { GadgetActionOptions, GadgetActionResponse } from './types';

/**
 * Run a custom Gadget action with performance tracking and error handling
 */
export async function runGadgetAction<T, P = Record<string, any>>(
  actionName: string,
  params: P,
  options: GadgetActionOptions = {}
): Promise<GadgetActionResponse<T>> {
  const client = initGadgetClient();
  if (!client) {
    const error = new Error("Gadget client not initialized");
    if (options.showToast) {
      toast.error(options.toastMessages?.error || "Action failed", {
        description: error.message
      });
    }
    throw error;
  }
  
  const finishTracking = startPerformanceTracking(`action:${actionName}`, { params });
  
  try {
    logInfo(`Running Gadget action: ${actionName}`, { params }, 'actions');
    
    if (options.showToast && options.toastMessages?.loading) {
      toast.loading(options.toastMessages.loading);
    }
    
    // In production with actual Gadget client:
    // const result = await client.mutate[actionName](params);
    
    // For development, simulate a successful response
    const mockResult: GadgetActionResponse<T> = {
      success: true,
      data: {} as T,
      performanceMetrics: {
        durationMs: 250,
        queryCount: 3,
        cacheHitRate: 0.65
      }
    };
    
    finishTracking();
    
    if (options.showToast && options.toastMessages?.success) {
      toast.success(options.toastMessages.success);
    }
    
    return mockResult;
  } catch (error) {
    logError(`Error running Gadget action: ${actionName}`, { error, params }, 'actions');
    finishTracking();
    
    if (options.showToast) {
      toast.error(options.toastMessages?.error || "Action failed", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
    
    return {
      success: false,
      data: {} as T,
      errors: [{
        message: error instanceof Error ? error.message : "Unknown error",
        code: "ACTION_EXECUTION_ERROR"
      }]
    };
  }
}
