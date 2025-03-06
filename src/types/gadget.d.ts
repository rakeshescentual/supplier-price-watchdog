
/**
 * Gadget environment type
 */
export type GadgetEnvironment = 'development' | 'production';

/**
 * Gadget connection status
 */
export type GadgetConnectionStatus = 'none' | 'testing' | 'success' | 'error';

/**
 * Gadget API response with pagination
 */
export interface GadgetPaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Gadget error response shape
 */
export interface GadgetErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, any>;
  path?: string;
}

/**
 * Gadget batch operation input
 */
export interface GadgetBatchOperationInput<T> {
  items: T[];
  options?: {
    continueOnError?: boolean;
    runInTransaction?: boolean;
  };
}

/**
 * Gadget batch operation result
 */
export interface GadgetBatchOperationResult<T> {
  results: (T | { error: GadgetErrorResponse })[];
  success: boolean;
  successCount: number;
  failureCount: number;
}

/**
 * Gadget file upload response
 */
export interface GadgetFileUploadResponse {
  fileId: string;
  url: string;
  contentType: string;
  filename: string;
  key: string;
  byteSize: number;
}
