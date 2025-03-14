
// This file re-exports all Shopify API functions from the new structure
// for backwards compatibility
export {
  initializeShopifyApp,
  checkShopifyConnection,
  getShopifySyncHistory,
  getShopifyProducts,
  syncWithShopify,
  saveFileToShopify,
  batchShopifyOperations
} from './shopify';
