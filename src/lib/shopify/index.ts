
/**
 * Shopify integration utilities
 */

// Export connection functionality
export { checkShopifyConnection } from './connection';

// Export file-related functionality
export { saveFileToShopify } from './files';

// Export sync functionality
export { syncWithShopify } from './sync';

// Export Shopify client
export { 
  shopifyClient, 
  initializeShopifyClient, 
  resetShopifyClient,
  isShopifyClientInitialized,
  getShopifyApiVersion
} from './client';

// Re-export everything from specific modules
export * from './connection';
export * from './files';
export * from './products';
export * from './sync';
export * from './init';
export * from './batch';
export * from './bulkOperations';

// Explicitly export getShopifySyncHistory to resolve ambiguity
export { getShopifySyncHistory } from './products';
