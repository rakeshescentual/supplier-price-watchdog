
/**
 * Type definitions for Shopify bulk operations
 */

export interface BulkOperationOptions {
  /** Maximum number of operations to run in parallel */
  maxParallelOperations?: number;
  /** Callback function to report progress during the operation */
  onProgress?: (progress: number) => void;
  /** Whether to run in dry run mode (no actual changes) */
  dryRun?: boolean;
  /** Timeout in milliseconds for each operation */
  timeout?: number;
  /** Whether to continue on errors */
  continueOnError?: boolean;
}

export interface BulkOperationResult {
  /** Whether the operation was successful overall */
  success: boolean;
  /** Human-readable message about the operation */
  message: string;
  /** ID of the bulk operation for tracking purposes */
  operationId?: string;
  /** Number of items successfully updated */
  updatedCount: number;
  /** Number of items that failed to update */
  failedCount: number;
  /** Detailed error information if available */
  errors?: Array<{
    itemId: string;
    message: string;
  }>;
}

export interface BulkOperationHistoryItem {
  /** Unique ID of the operation */
  id: string;
  /** Type of the operation (e.g., 'priceUpdate', 'inventory') */
  type: string;
  /** Current status of the operation */
  status: 'CREATED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  /** ISO timestamp when the operation was created */
  createdAt: string;
  /** ISO timestamp when the operation was completed (if applicable) */
  completedAt?: string;
  /** Number of items processed in this operation */
  itemCount: number;
  /** Error message if the operation failed */
  errorMessage?: string;
}

/**
 * Price update specific options
 */
export interface BulkPriceUpdateOptions extends BulkOperationOptions {
  /** Whether to update inventory levels alongside prices */
  updateInventory?: boolean;
  /** Whether to update only products with specific tags */
  filterByTags?: string[];
}

/**
 * Configuration for a bulk operation query
 */
export interface BulkOperationQueryConfig {
  /** GraphQL query to execute */
  query: string;
  /** Variables to pass to the query */
  variables?: Record<string, any>;
  /** Maximum number of results to return */
  maxResultSize?: number;
}
