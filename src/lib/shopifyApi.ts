
// Re-export functionality from the Shopify module
export { 
  checkShopifyConnection,
  syncWithShopify,
  saveFileToShopify
} from './shopify';

// Re-export from specific shopify modules for better organization
export { batchShopifyOperations } from './shopify/batch';
export { getShopifyProducts, getShopifySyncHistory } from './shopify/products';

// Export shopify app initialization function
export const initializeShopifyApp = () => {
  console.log("Initializing Shopify app...");
  return true;
};

// Export Gadget integration functions
export { 
  initGadgetClient, 
  syncToShopifyViaGadget 
} from './gadgetApi';
