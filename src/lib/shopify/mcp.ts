
/**
 * Shopify MCP (Merchant Commerce Platform) Integration
 * 
 * Utilities for working with Shopify's MCP development server
 * to help develop and test GraphQL operations locally.
 * 
 * Setup instructions: https://github.com/Shopify/dev-mcp
 */
import { getShopifyApiVersion } from './client';
import { toast } from 'sonner';

interface McpConfig {
  endpoint: string;
  apiKey?: string;
  shopDomain?: string;
}

/**
 * Default MCP configuration
 */
const DEFAULT_MCP_CONFIG: McpConfig = {
  endpoint: 'http://localhost:8000/graphql',
};

/**
 * Current MCP configuration
 */
let mcpConfig: McpConfig = { ...DEFAULT_MCP_CONFIG };

/**
 * Configure the MCP client
 */
export const configureMcp = (config: Partial<McpConfig>): void => {
  mcpConfig = { ...mcpConfig, ...config };
};

/**
 * Execute a GraphQL query against the MCP server
 */
export const executeMcpQuery = async <T = any>(
  query: string, 
  variables?: Record<string, any>
): Promise<T> => {
  try {
    // Use the current API version in the request
    const apiVersion = getShopifyApiVersion();
    
    const response = await fetch(mcpConfig.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-API-Version': apiVersion,
        ...(mcpConfig.apiKey && { 'X-Shopify-Access-Token': mcpConfig.apiKey }),
        ...(mcpConfig.shopDomain && { 'X-Shopify-Shop-Domain': mcpConfig.shopDomain }),
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
 * Generate MCP test URL for a GraphQL query
 * This creates a URL that can be opened in the browser to test a query
 */
export const generateMcpTestUrl = (
  query: string, 
  variables?: Record<string, any>
): string => {
  const encodedQuery = encodeURIComponent(query);
  const variablesParam = variables 
    ? `&variables=${encodeURIComponent(JSON.stringify(variables))}` 
    : '';
  
  // Extract base URL without /graphql path
  const baseUrl = mcpConfig.endpoint.replace('/graphql', '');
  
  return `${baseUrl}?query=${encodedQuery}${variablesParam}`;
};

/**
 * Open a GraphQL query in the MCP explorer
 */
export const openInMcpExplorer = (
  query: string, 
  variables?: Record<string, any>
): void => {
  const url = generateMcpTestUrl(query, variables);
  window.open(url, '_blank');
};

/**
 * Create a test query to validate bulk operations capabilities
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
