
/**
 * Shopify API client utilities
 */
import { LATEST_API_VERSION } from './api-version';
import { toast } from 'sonner';

// Current API version in memory storage
let currentApiVersion = LATEST_API_VERSION;

// Error types
export class ShopifyApiError extends Error {
  status?: number;
  body?: any;
  
  constructor(message: string, status?: number, body?: any) {
    super(message);
    this.name = 'ShopifyApiError';
    this.status = status;
    this.body = body;
  }
}

// Shopify client instance with proper typing
export interface ShopifyClientInterface {
  shop: string;
  accessToken: string;
  apiVersion: string;
  graphql: <T = any>(query: string, variables?: any) => Promise<T>;
  rest: <T = any>(endpoint: string, method: string, data?: any) => Promise<T>;
  isInitialized: () => boolean;
}

let shopifyClient: ShopifyClientInterface | null = null;

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
): ShopifyClientInterface => {
  // In a real implementation, this would initialize the Shopify API client
  // For example, using the @shopify/shopify-api library
  
  // Set the current API version
  currentApiVersion = apiVersion;
  
  // Mock client for demonstration
  shopifyClient = {
    shop,
    accessToken,
    apiVersion,
    graphql: async <T = any>(query: string, variables?: any): Promise<T> => {
      try {
        console.log("GraphQL query:", query, variables);
        return { shop: { name: shop } } as unknown as T;
      } catch (error) {
        console.error("GraphQL query error:", error);
        throw new ShopifyApiError(
          error instanceof Error ? error.message : "Unknown GraphQL error",
          error?.status,
          error?.body
        );
      }
    },
    rest: async <T = any>(endpoint: string, method: string, data?: any): Promise<T> => {
      try {
        console.log("REST API call:", endpoint, method, data);
        return { data: {} } as unknown as T;
      } catch (error) {
        console.error("REST API error:", error);
        throw new ShopifyApiError(
          error instanceof Error ? error.message : "Unknown REST API error",
          error?.status,
          error?.body
        );
      }
    },
    isInitialized: () => true
  };
  
  return shopifyClient;
};

/**
 * Get the current Shopify client instance
 * @returns Shopify client instance
 */
export const getShopifyClient = (): ShopifyClientInterface | null => {
  return shopifyClient;
};

/**
 * Reset the Shopify client
 */
export const resetShopifyClient = (): void => {
  shopifyClient = null;
  currentApiVersion = LATEST_API_VERSION;
};

/**
 * Check if the Shopify client is initialized
 * @returns True if initialized, false otherwise
 */
export const isShopifyClientInitialized = (): boolean => {
  return shopifyClient !== null;
};

/**
 * Get the current Shopify API version
 * @returns Current API version
 */
export const getShopifyApiVersion = (): string => {
  return currentApiVersion;
};

/**
 * Set the Shopify API version
 * @param version Shopify API version
 * @returns True if successful, false otherwise
 */
export const setShopifyApiVersion = (version: string): boolean => {
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
export const executeGraphQL = async <T = any>(query: string, variables?: any): Promise<T> => {
  if (!shopifyClient) {
    throw new ShopifyApiError("Shopify client not initialized");
  }
  
  try {
    return await shopifyClient.graphql<T>(query, variables);
  } catch (error) {
    const shopifyError = error instanceof ShopifyApiError 
      ? error 
      : new ShopifyApiError(
          error instanceof Error ? error.message : "GraphQL query failed",
          error?.status,
          error?.body
        );

    // Show toast for API errors
    toast.error("Shopify API Error", {
      description: shopifyError.message
    });
    
    throw shopifyError;
  }
};

/**
 * Execute a REST API call against the Shopify API
 * @param endpoint REST API endpoint
 * @param method HTTP method
 * @param data Request data
 * @returns Response data
 */
export const executeREST = async <T = any>(
  endpoint: string,
  method: string = "GET",
  data?: any
): Promise<T> => {
  if (!shopifyClient) {
    throw new ShopifyApiError("Shopify client not initialized");
  }
  
  try {
    return await shopifyClient.rest<T>(endpoint, method, data);
  } catch (error) {
    const shopifyError = error instanceof ShopifyApiError 
      ? error 
      : new ShopifyApiError(
          error instanceof Error ? error.message : "REST API call failed",
          error?.status,
          error?.body
        );

    // Show toast for API errors
    toast.error("Shopify API Error", {
      description: shopifyError.message
    });
    
    throw shopifyError;
  }
};

// Export the Shopify client for convenience
export { shopifyClient };

