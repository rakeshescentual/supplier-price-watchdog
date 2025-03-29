
/**
 * Shopify API client
 */

let initialized = false;
let currentApiVersion = "2025-04"; // Default to the GraphQL-compatible version

export const shopifyClient = {
  graphql: async <T>(query: string, variables?: Record<string, any>): Promise<T> => {
    // This is a mock implementation
    console.log("Shopify GraphQL query:", query);
    console.log("Variables:", variables);
    console.log("Using API version:", currentApiVersion);
    
    // Return a mock response based on the query
    if (query.includes("bulkOperationRunMutation")) {
      return {
        bulkOperationRunMutation: {
          bulkOperation: {
            id: "gid://shopify/BulkOperation/1",
            status: "CREATED"
          },
          userErrors: []
        }
      } as unknown as T;
    }
    
    // Mock shop query response
    if (query.includes("shop")) {
      return {
        data: {
          shop: {
            name: "Example Shop",
            email: "example@shop.com",
            primaryDomain: {
              url: "https://example.myshopify.com",
              host: "example.myshopify.com"
            }
          }
        }
      } as unknown as T;
    }
    
    // Default mock response
    return {} as T;
  }
};

export const initializeShopifyClient = (shop: string, accessToken: string, apiVersion = "2025-04") => {
  console.log(`Initializing Shopify client for ${shop} with API version ${apiVersion}`);
  currentApiVersion = apiVersion;
  initialized = true;
  return shopifyClient;
};

export const resetShopifyClient = () => {
  initialized = false;
  currentApiVersion = "2025-04"; // Reset to default version
};

export const isShopifyClientInitialized = () => initialized;

export const getShopifyApiVersion = () => currentApiVersion;

/**
 * Set the Shopify API version for all future requests
 * This allows dynamically changing the API version at runtime
 */
export const setShopifyApiVersion = (version: string) => {
  console.log(`Changing Shopify API version from ${currentApiVersion} to ${version}`);
  currentApiVersion = version;
  return true;
};
