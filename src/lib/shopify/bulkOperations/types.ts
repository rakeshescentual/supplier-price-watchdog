
/**
 * Type definitions for Shopify Bulk Operations
 */
import { ShopifyContext, PriceItem } from '@/types/shopify';

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

export interface BulkPriceUpdateOptions {
  dryRun?: boolean;
  notifyCustomers?: boolean;
  onProgress?: (progress: number) => void;
}

export interface BulkOperationResult {
  success: boolean;
  message: string;
  operationId?: string;
  updatedCount: number;
  failedCount: number;
}
