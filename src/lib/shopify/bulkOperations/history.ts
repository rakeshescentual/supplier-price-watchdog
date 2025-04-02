/**
 * Bulk operation history management
 */
import { BulkOperationHistory } from './types';

/**
 * Save operation to history in localStorage
 */
export function saveToOperationHistory(operation: BulkOperationHistory): void {
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
