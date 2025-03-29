
/**
 * Shopify API client
 */

let initialized = false;

export const shopifyClient = {
  graphql: async <T>(query: string, variables?: Record<string, any>): Promise<T> => {
    // This is a mock implementation
    console.log("Shopify GraphQL query:", query);
    console.log("Variables:", variables);
    
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
    
    // Default mock response
    return {} as T;
  }
};

export const initializeShopifyClient = (shop: string, accessToken: string, apiVersion = "2025-04") => {
  console.log(`Initializing Shopify client for ${shop} with API version ${apiVersion}`);
  initialized = true;
  return shopifyClient;
};

export const resetShopifyClient = () => {
  initialized = false;
};

export const isShopifyClientInitialized = () => initialized;

export const getShopifyApiVersion = () => "2025-04";
