
// Re-export functionality from the Shopify module
export { 
  checkShopifyConnection,
  getShopifyProducts,
  syncWithShopify,
  saveFileToShopify,
  batchShopifyOperations,
  getShopifySyncHistory
} from './shopify';

// Export Gadget integration functions
export { 
  initGadgetClient, 
  syncToShopifyViaGadget 
} from './gadgetApi';
