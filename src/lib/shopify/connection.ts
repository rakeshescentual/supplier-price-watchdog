
/**
 * Shopify connection utilities
 */
import { toast } from 'sonner';
import { executeGraphQL, isShopifyClientInitialized, initializeShopifyClient } from './client';
import { LATEST_API_VERSION } from './api-version';
import type { ShopifyContext, ShopifyConnectionResult, ShopifyHealthcheckResult } from '@/types/shopify';

/**
 * Check if the Shopify connection is valid
 * @param context Shopify context
 * @returns Connection result
 */
export const checkShopifyConnection = async (
  context: ShopifyContext
): Promise<ShopifyConnectionResult> => {
  if (!context || !context.shop || !context.accessToken) {
    return {
      success: false,
      message: 'Missing Shopify credentials'
    };
  }
  
  try {
    // Initialize the client if not already initialized
    if (!isShopifyClientInitialized()) {
      initializeShopifyClient(
        context.shop,
        context.accessToken,
        context.apiVersion || LATEST_API_VERSION
      );
    }
    
    // Test the connection with a simple GraphQL query
    const startTime = Date.now();
    const result = await executeGraphQL<any>(`
      query {
        shop {
          name
          plan {
            displayName
          }
          primaryDomain {
            url
          }
        }
      }
    `);
    const responseTime = Date.now() - startTime;
    
    if (!result || !result.shop) {
      return {
        success: false,
        message: 'Invalid Shopify response'
      };
    }
    
    return {
      success: true,
      message: 'Connected to Shopify successfully',
      shopDetails: {
        name: result.shop.name,
        domain: result.shop.primaryDomain?.url || context.shop,
        plan: result.shop.plan?.displayName || 'Unknown',
      }
    };
  } catch (error) {
    console.error('Shopify connection error:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown connection error'
    };
  }
};

/**
 * Perform a health check on the Shopify API connection
 * @param context Shopify context
 * @returns Health check result
 */
export const checkShopifyHealth = async (
  context: ShopifyContext
): Promise<ShopifyHealthcheckResult> => {
  if (!context || !context.shop || !context.accessToken) {
    return {
      success: false,
      message: 'Missing Shopify credentials'
    };
  }
  
  try {
    // Initialize the client if not already initialized
    if (!isShopifyClientInitialized()) {
      initializeShopifyClient(
        context.shop,
        context.accessToken,
        context.apiVersion || LATEST_API_VERSION
      );
    }
    
    // Test the GraphQL endpoint
    const startTime = Date.now();
    const result = await executeGraphQL<any>(`
      query {
        shop {
          name
          features {
            storefront_api_call_rate_limit_bypass
          }
        }
      }
    `);
    const responseTime = Date.now() - startTime;
    
    if (!result || !result.shop) {
      return {
        success: false,
        message: 'Invalid Shopify response'
      };
    }
    
    // Get rate limit info from headers (in a real app)
    const rateLimitRemaining = 1000; // Mocked value
    
    // Check REST endpoint (simplified for demo)
    const restEndpointHealthy = true;
    
    // Check webhooks endpoint (simplified for demo)
    const webhooksEndpointHealthy = true;
    
    return {
      success: true,
      message: 'Shopify API is healthy',
      apiVersion: context.apiVersion || LATEST_API_VERSION,
      responseTimeMs: responseTime,
      rateLimitRemaining,
      diagnostics: {
        graphqlEndpoint: true,
        restEndpoint: restEndpointHealthy,
        webhooksEndpoint: webhooksEndpointHealthy,
        authScopes: ['read_products', 'write_products', 'read_inventory', 'write_inventory'],
        missingScopes: []
      }
    };
  } catch (error) {
    console.error('Shopify health check error:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown health check error'
    };
  }
};

/**
 * Test API version compatibility
 * @param context Shopify context
 * @param apiVersion API version to test
 * @returns Test result
 */
export const testApiVersion = async (
  context: ShopifyContext,
  apiVersion: string
): Promise<{ success: boolean; message: string }> => {
  if (!context || !context.shop || !context.accessToken) {
    return {
      success: false,
      message: 'Missing Shopify credentials'
    };
  }
  
  try {
    // Initialize a temporary client with the test version
    const tempClient = initializeShopifyClient(
      context.shop,
      context.accessToken,
      apiVersion
    );
    
    // Test with a simple query
    const result = await tempClient.graphql<any>(`
      query {
        shop {
          name
        }
      }
    `);
    
    if (!result || !result.shop) {
      return {
        success: false,
        message: `API version ${apiVersion} is not compatible with your store`
      };
    }
    
    return {
      success: true,
      message: `API version ${apiVersion} is compatible with your store`
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    return {
      success: false,
      message: `API version ${apiVersion} test failed: ${message}`
    };
  }
};

