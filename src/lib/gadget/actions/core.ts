
/**
 * Core action functionality for Gadget
 */
import { logInfo, logError } from '../logging';
import { GadgetActionOptions, GadgetActionResponse } from './types';
import { toast } from 'sonner';

/**
 * Run a Gadget action
 * @param actionName Name of the action to run
 * @param params Parameters for the action
 * @param options Options for the action
 * @returns Promise resolving to action response
 */
export const runGadgetAction = async <T = any>(
  actionName: string,
  params: Record<string, any>,
  options: GadgetActionOptions = {}
): Promise<GadgetActionResponse<T>> => {
  // Show loading toast if enabled
  const loadingToastId = options.showToast
    ? toast.loading(options.toastMessages?.loading || `Running ${actionName}...`)
    : undefined;
  
  try {
    logInfo(`Running Gadget action: ${actionName}`, { params }, 'actions');
    
    // In production, this would call the Gadget API
    // For now, simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate success response
    const response: GadgetActionResponse<T> = {
      success: true,
      data: { result: 'success' } as unknown as T,
      performanceMetrics: {
        durationMs: 756,
        queryCount: 3,
        cacheHitRate: 0.33
      }
    };
    
    if (options.showToast) {
      toast.success(
        options.toastMessages?.success || `${actionName} completed successfully`,
        { id: loadingToastId }
      );
    }
    
    return response;
  } catch (error) {
    logError(`Error running Gadget action: ${actionName}`, { error, params }, 'actions');
    
    // Create error response
    const errorResponse: GadgetActionResponse<T> = {
      success: false,
      data: {} as T,
      errors: [{
        message: error instanceof Error ? error.message : String(error),
        code: 'ACTION_EXECUTION_ERROR',
      }]
    };
    
    if (options.showToast) {
      toast.error(
        options.toastMessages?.error || `Error running ${actionName}`,
        { id: loadingToastId }
      );
    }
    
    return errorResponse;
  }
};
