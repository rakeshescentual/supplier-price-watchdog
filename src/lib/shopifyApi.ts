
// Re-export functionality from the Shopify module
export { 
  checkShopifyConnection,
  getShopifyProducts,
  syncWithShopify,
  saveFileToShopify,
  batchShopifyOperations,
  getShopifySyncHistory
} from './shopify';

// We don't export initializeShopifyApp, so let's add it
export const initializeShopifyApp = () => {
  console.log("Initializing Shopify app...");
  return true;
};

// Export Gadget integration functions
export { 
  initGadgetClient, 
  syncToShopifyViaGadget 
} from './gadgetApi';
