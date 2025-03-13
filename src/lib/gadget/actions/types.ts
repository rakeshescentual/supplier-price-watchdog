
/**
 * Type definitions for Gadget.dev actions
 */

/**
 * Options for running Gadget actions
 */
export interface GadgetActionOptions {
  showToast?: boolean;
  toastMessages?: {
    loading?: string;
    success?: string;
    error?: string;
  };
  retries?: number;
}

/**
 * Gadget action response with performance metrics
 */
export interface GadgetActionResponse<T> {
  success: boolean;
  data: T;
  errors?: Array<{
    message: string;
    code: string;
    path?: string[];
  }>;
  performanceMetrics?: {
    durationMs: number;
    queryCount: number;
    cacheHitRate: number;
  };
}
