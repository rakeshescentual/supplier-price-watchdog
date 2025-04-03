
/**
 * MCP GraphQL client
 */
import { toast } from 'sonner';
import { getShopifyApiVersion } from '../client';
import { getMcpConfig } from './config';

/**
 * Execute a GraphQL query against the MCP server
 */
export const executeMcpQuery = async <T = any>(
  query: string, 
  variables?: Record<string, any>
): Promise<T> => {
  const config = getMcpConfig();
  
  try {
    // Use the current API version in the request
    const apiVersion = getShopifyApiVersion();
    
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-API-Version': apiVersion,
        ...(config.apiKey && { 'X-Shopify-Access-Token': config.apiKey }),
        ...(config.shopDomain && { 'X-Shopify-Shop-Domain': config.shopDomain }),
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`MCP server responded with ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(
        `GraphQL errors: ${result.errors.map((e: any) => e.message).join(', ')}`
      );
    }

    return result.data as T;
  } catch (error) {
    console.error('MCP query error:', error);
    toast.error('MCP Query Error', {
      description: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

/**
 * Check if the MCP server is running
 */
export const checkMcpServer = async (): Promise<boolean> => {
  try {
    // Simple introspection query to check if server is responsive
    const query = `{
      __schema {
        queryType {
          name
        }
      }
    }`;
    
    await executeMcpQuery(query);
    return true;
  } catch (error) {
    console.error('MCP server check failed:', error);
    return false;
  }
};

/**
 * Test bulk operation capabilities of the MCP server
 */
export const testBulkOperationCapabilities = async (): Promise<{
  supported: boolean;
  details?: {
    maxRequests: number;
    parallelProcessing: boolean;
  };
}> => {
  try {
    // Query the capabilities of bulk operations
    const query = `{
      shopifyGqlFeatures: __type(name: "BulkOperationRunQueryInput") {
        name
        kind
        fields {
          name
          type {
            name
            kind
          }
        }
      }
    }`;
    
    const result = await executeMcpQuery(query);
    
    // Check if bulk operations are supported in this API version
    if (!result.shopifyGqlFeatures) {
      return { supported: false };
    }
    
    return {
      supported: true,
      details: {
        maxRequests: 50, // This is typically the Shopify limit
        parallelProcessing: true
      }
    };
  } catch (error) {
    console.error('Failed to test bulk operation capabilities:', error);
    return { supported: false };
  }
};
