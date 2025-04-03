/**
 * Functions for tracking bulk operation history
 */
import { BulkOperationHistoryItem } from './types';

// In-memory storage for operation history
// In a real implementation, this would be persisted to a database
const operationHistory: BulkOperationHistoryItem[] = [];

/**
 * Save an operation to the history
 * @param operation The operation to save
 * @returns The saved operation
 */
export function saveToOperationHistory(operation: BulkOperationHistoryItem): BulkOperationHistoryItem {
  operationHistory.unshift(operation);
  
  // Only keep the last 50 operations
  if (operationHistory.length > 50) {
    operationHistory.length = 50;
  }
  
  return operation;
}

/**
 * Get the operation history
 * @param limit Maximum number of operations to return
 * @returns The operation history
 */
export function getOperationHistory(limit: number = 10): BulkOperationHistoryItem[] {
  return operationHistory.slice(0, limit);
}

/**
 * Get an operation from the history by ID
 * @param id ID of the operation to get
 * @returns The operation, or undefined if not found
 */
export function getOperationById(id: string): BulkOperationHistoryItem | undefined {
  return operationHistory.find(op => op.id === id);
}

/**
 * Update the status of an operation
 * @param id ID of the operation to update
 * @param status New status
 * @param completedAt Completion timestamp (if applicable)
 * @param errorMessage Error message (if applicable)
 * @returns The updated operation, or undefined if not found
 */
export function updateOperationStatus(
  id: string,
  status: BulkOperationHistoryItem['status'],
  completedAt?: string,
  errorMessage?: string
): BulkOperationHistoryItem | undefined {
  const operation = operationHistory.find(op => op.id === id);
  
  if (operation) {
    operation.status = status;
    if (completedAt) {
      operation.completedAt = completedAt;
    }
    if (errorMessage) {
      operation.errorMessage = errorMessage;
    }
  }
  
  return operation;
}

/**
 * Clear the operation history
 */
export function clearOperationHistory(): void {
  operationHistory.length = 0;
}

/**
 * Get bulk operation history
 * @returns The operation history
 */
export function getBulkOperationHistory(): BulkOperationHistoryItem[] {
  return getOperationHistory();
}

/**
 * Clear bulk operation history
 */
export function clearBulkOperationHistory(): void {
  clearOperationHistory();
}
