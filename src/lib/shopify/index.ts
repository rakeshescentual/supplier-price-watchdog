
/**
 * Shopify Integration
 * 
 * Comprehensive utilities for Shopify API integration
 */

// Export Shopify API utilities
export { initializeShopifyApp } from './init';
export { checkShopifyConnection, getShopifySyncHistory } from './connection';
export { getShopifyProducts } from './products';
export { syncWithShopify } from './sync';
export { saveFileToShopify } from './files';
export { batchShopifyOperations } from './batch';

// Export consolidated utility for one-step Shopify initialization
export const initializeShopifyIntegration = async (shopDomain?: string, accessToken?: string) => {
  const { initializeShopifyApp } = await import('./init');
  const { checkShopifyConnection } = await import('./connection');
  
  // Initialize without parameters, as they'll be passed to checkShopifyConnection
  const initialized = await initializeShopifyApp();
  
  if (initialized === false) {
    console.warn('Failed to initialize Shopify integration');
    return { initialized: false };
  }
  
  if (shopDomain && accessToken) {
    const isConnected = await checkShopifyConnection({
      shop: shopDomain,
      accessToken: accessToken
    });
    
    return {
      initialized: true,
      connected: isConnected
    };
  }
  
  return {
    initialized: true,
    connected: false
  };
};
