/**
 * Shopify Bulk Operations API
 * 
 * This module handles Shopify's Bulk Operations GraphQL API for large data operations.
 */
import { ShopifyContext, PriceItem } from '@/types/shopify';
import { shopifyClient } from './client';

export interface BulkOperationStatus {
  id: string;
  status: 'CREATED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELING' | 'CANCELED';
  errorCode?: string;
  createdAt: string;
  completedAt?: string;
  objectCount?: number;
  fileSize?: number;
  url?: string;
  partialDataUrl?: string;
}

export type BulkOperationType = 'priceUpdate' | 'inventoryUpdate' | 'metafieldUpdate';

export interface BulkOperationHistory {
  id: string;
  type: BulkOperationType;
  status: BulkOperationStatus['status'];
  createdAt: string;
  completedAt?: string;
  itemCount: number;
  errorMessage?: string;
}

/**
 * Start a bulk price update operation
 */
export async function bulkUpdatePrices(
  context: ShopifyContext,
  prices: PriceItem[],
  options: {
    dryRun?: boolean;
    notifyCustomers?: boolean;
    onProgress?: (progress: number) => void;
  } = {}
): Promise<{
  success: boolean;
  message: string;
  operationId?: string;
  updatedCount: number;
  failedCount: number;
}> {
  if (!context) {
    return {
      success: false,
      message: "No Shopify context provided",
      updatedCount: 0,
      failedCount: prices.length
    };
  }
  
  if (prices.length === 0) {
    return {
      success: false,
      message: "No prices to update",
      updatedCount: 0,
      failedCount: 0
    };
  }
  
  try {
    const { onProgress, dryRun = false, notifyCustomers = false } = options;
    
    // Report initial progress
    if (onProgress) onProgress(5);
    
    // Create a JSON string containing the price updates
    const priceUpdates = prices.map(item => {
      if (!item.shopifyVariantId) {
        throw new Error(`Missing Shopify variant ID for item: ${item.sku}`);
      }
      
      return {
        id: item.shopifyVariantId,
        price: String(item.newPrice),
        oldPrice: String(item.oldPrice),
        sku: item.sku,
        dryRun
      };
    });
    
    // Report preparation progress
    if (onProgress) onProgress(10);
    
    // Start the bulk operation
    const response = await shopifyClient.graphql<{
      bulkOperationRunMutation: {
        bulkOperation: {
          id: string;
          status: BulkOperationStatus['status'];
        };
        userErrors: Array<{
          field: string[];
          message: string;
        }>;
      }
    }>(`
      mutation bulkOperationRunMutation($mutation: String!) {
        bulkOperationRunMutation(
          mutation: $mutation,
          stagedUploadPath: "bulk_price_updates.jsonl"
        ) {
          bulkOperation {
            id
            status
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      mutation: `
        mutation {
          ${priceUpdates.map((update, index) => `
            _${index}: productVariantUpdate(
              input: {
                id: "${update.id}",
                price: "${update.price}"
                ${notifyCustomers ? ', inventoryNotifyCustomers: true' : ''}
              }
            ) {
              productVariant {
                id
                price
              }
              userErrors {
                field
                message
              }
            }
          `).join('\n')}
        }
      `
    });
    
    if (response.bulkOperationRunMutation.userErrors.length > 0) {
      const errorMessage = response.bulkOperationRunMutation.userErrors
        .map(error => error.message)
        .join(', ');
      
      return {
        success: false,
        message: `Bulk operation failed: ${errorMessage}`,
        updatedCount: 0,
        failedCount: prices.length
      };
    }
    
    // Get the bulk operation ID
    const operationId = response.bulkOperationRunMutation.bulkOperation.id;
    
    // Report operation started progress
    if (onProgress) onProgress(20);
    
    // Poll for operation status
    let status: BulkOperationStatus['status'] = response.bulkOperationRunMutation.bulkOperation.status;
    let pollCount = 0;
    const maxPolls = 30; // Maximum number of status checks (30 * 2s = 60s max)
    
    while (status === 'CREATED' || status === 'RUNNING') {
      // Wait 2 seconds before checking status again
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check operation status
      const statusResponse = await shopifyClient.graphql<{
        node: {
          id: string;
          status: BulkOperationStatus['status'];
          errorCode?: string;
          objectCount?: number;
          fileSize?: number;
          url?: string;
          partialDataUrl?: string;
        } | null;
      }>(`
        query {
          node(id: "${operationId}") {
            ... on BulkOperation {
              id
              status
              errorCode
              objectCount
              fileSize
              url
              partialDataUrl
            }
          }
        }
      `);
      
      if (!statusResponse.node) {
        break;
      }
      
      status = statusResponse.node.status;
      
      // Calculate progress percentage based on poll count
      // This is an approximation since we don't know exactly how long it will take
      if (onProgress) {
        const progressPercent = Math.min(20 + (pollCount / maxPolls) * 70, 90);
        onProgress(progressPercent);
      }
      
      pollCount++;
      
      // If we've polled too many times or the operation is no longer running, break
      if (pollCount >= maxPolls || (status !== 'CREATED' && status !== 'RUNNING')) {
        break;
      }
    }
    
    // Handle final status
    if (status === 'COMPLETED') {
      // Save to operation history in localStorage
      saveToOperationHistory({
        id: operationId,
        type: 'priceUpdate',
        status,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        itemCount: prices.length
      });
      
      if (onProgress) onProgress(100);
      
      return {
        success: true,
        message: dryRun 
          ? `Dry run completed successfully for ${prices.length} prices` 
          : `Successfully updated ${prices.length} prices`,
        operationId,
        updatedCount: prices.length,
        failedCount: 0
      };
    } else if (status === 'FAILED') {
      // Save failed operation to history
      saveToOperationHistory({
        id: operationId,
        type: 'priceUpdate',
        status,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        itemCount: prices.length,
        errorMessage: 'Bulk operation failed'
      });
      
      if (onProgress) onProgress(100);
      
      return {
        success: false,
        message: `Bulk operation failed`,
        operationId,
        updatedCount: 0,
        failedCount: prices.length
      };
    } else {
      // Operation timed out or was canceled
      saveToOperationHistory({
        id: operationId,
        type: 'priceUpdate',
        status,
        createdAt: new Date().toISOString(),
        itemCount: prices.length,
        errorMessage: `Operation ended with status: ${status}`
      });
      
      if (onProgress) onProgress(100);
      
      return {
        success: false,
        message: `Operation ended with status: ${status}`,
        operationId,
        updatedCount: 0,
        failedCount: prices.length
      };
    }
  } catch (error) {
    console.error("Error in bulk price update:", error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error during bulk update",
      updatedCount: 0,
      failedCount: prices.length
    };
  }
}

/**
 * Save operation to history in localStorage
 */
function saveToOperationHistory(operation: BulkOperationHistory): void {
  try {
    // Get existing history
    const historyJson = localStorage.getItem('shopify_bulk_operation_history');
    const history: BulkOperationHistory[] = historyJson ? JSON.parse(historyJson) : [];
    
    // Add new operation
    history.unshift(operation);
    
    // Keep only last 20 operations
    if (history.length > 20) {
      history.pop();
    }
    
    // Save back to localStorage
    localStorage.setItem('shopify_bulk_operation_history', JSON.stringify(history));
  } catch (error) {
    console.error("Error saving operation to history:", error);
  }
}

/**
 * Get operation history from localStorage
 */
export function getBulkOperationHistory(): BulkOperationHistory[] {
  try {
    const historyJson = localStorage.getItem('shopify_bulk_operation_history');
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error("Error loading operation history:", error);
    return [];
  }
}

/**
 * Clear operation history from localStorage
 */
export function clearBulkOperationHistory(): void {
  localStorage.removeItem('shopify_bulk_operation_history');
}

/**
 * Cancel a running bulk operation
 */
export async function cancelBulkOperation(
  context: ShopifyContext,
  operationId: string
): Promise<boolean> {
  try {
    const response = await shopifyClient.graphql<{
      bulkOperationCancel: {
        bulkOperation: {
          id: string;
          status: BulkOperationStatus['status'];
        };
        userErrors: Array<{
          field: string[];
          message: string;
        }>;
      }
    }>(`
      mutation {
        bulkOperationCancel(id: "${operationId}") {
          bulkOperation {
            id
            status
          }
          userErrors {
            field
            message
          }
        }
      }
    `);
    
    if (response.bulkOperationCancel.userErrors.length > 0) {
      console.error("Error canceling bulk operation:", 
        response.bulkOperationCancel.userErrors.map(e => e.message).join(', '));
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error canceling bulk operation:", error);
    return false;
  }
}
