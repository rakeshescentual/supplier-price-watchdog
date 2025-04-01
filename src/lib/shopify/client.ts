
/**
 * Shopify API client utilities
 */
import { LATEST_API_VERSION } from './api-version';

// Current API version in memory storage
let currentApiVersion = LATEST_API_VERSION;

// Shopify client instance
let shopifyClient: any = null;

/**
 * Initialize the Shopify client
 * @param shop Shopify shop domain
 * @param accessToken Shopify access token
 * @param apiVersion Shopify API version
 * @returns Shopify client instance
 */
export const initializeShopifyClient = (
  shop: string,
  accessToken: string,
  apiVersion: string = LATEST_API_VERSION
) => {
  // In a real implementation, this would initialize the Shopify API client
  // For example, using the @shopify/shopify-api library
  
  // Set the current API version
  currentApiVersion = apiVersion;
  
  // Mock client for demonstration
  shopifyClient = {
    shop,
    accessToken,
    apiVersion,
    graphql: async (query: string, variables?: any) => {
      console.log("GraphQL query:", query, variables);
      return { data: { shop: { name: shop } } };
    },
    rest: async (endpoint: string, method: string, data?: any) => {
      console.log("REST API call:", endpoint, method, data);
      return { data: {} };
    }
  };
  
  return shopifyClient;
};

/**
 * Get the current Shopify client instance
 * @returns Shopify client instance
 */
export const getShopifyClient = () => {
  return shopifyClient;
};

/**
 * Reset the Shopify client
 */
export const resetShopifyClient = () => {
  shopifyClient = null;
  currentApiVersion = LATEST_API_VERSION;
};

/**
 * Check if the Shopify client is initialized
 * @returns True if initialized, false otherwise
 */
export const isShopifyClientInitialized = () => {
  return shopifyClient !== null;
};

/**
 * Get the current Shopify API version
 * @returns Current API version
 */
export const getShopifyApiVersion = () => {
  return currentApiVersion;
};

/**
 * Set the Shopify API version
 * @param version Shopify API version
 * @returns True if successful, false otherwise
 */
export const setShopifyApiVersion = (version: string) => {
  // In a real implementation, this would validate the version
  // and update the client configuration
  currentApiVersion = version;
  
  if (shopifyClient) {
    shopifyClient.apiVersion = version;
  }
  
  return true;
};

/**
 * Execute a GraphQL query against the Shopify API
 * @param query GraphQL query
 * @param variables Query variables
 * @returns Query result
 */
export const executeGraphQL = async (query: string, variables?: any) => {
  if (!shopifyClient) {
    throw new Error("Shopify client not initialized");
  }
  
  return await shopifyClient.graphql(query, variables);
};

// Export the Shopify client for convenience
export { shopifyClient };
