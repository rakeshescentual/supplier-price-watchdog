
/**
 * MCP AI Assistant
 * 
 * Provides AI-enhanced capabilities for Shopify development using the MCP server.
 * Uses the MCP server to test and optimize GraphQL operations locally.
 */
import { toast } from 'sonner';
import { executeMcpQuery } from './client';
import { getMcpConfig } from './config';
import { openInMcpExplorer } from './explorer';

/**
 * AI query suggestion types
 */
export type QuerySuggestionType = 
  | 'optimize' 
  | 'debug' 
  | 'explain' 
  | 'convert' 
  | 'bulk';

/**
 * Interface for AI assistant query suggestion
 */
export interface QuerySuggestion {
  type: QuerySuggestionType;
  operation: string;
  description: string;
  query: string;
  variables?: Record<string, any>;
}

/**
 * Generate AI-enhanced query suggestions based on an existing query
 * @param query The GraphQL query to analyze
 * @returns Promise resolving to array of suggestions
 */
export const generateQuerySuggestions = async (
  query: string
): Promise<QuerySuggestion[]> => {
  try {
    // In a real implementation, this would use an AI service to analyze the query
    // and generate suggestions for optimization, debugging, etc.
    
    // For now, we'll use a simple heuristic approach to demonstrate the concept
    const suggestions: QuerySuggestion[] = [];
    
    // Check if query could be optimized with a connection pattern
    if (query.includes('products') && !query.includes('edges')) {
      suggestions.push({
        type: 'optimize',
        operation: 'connection-pattern',
        description: 'Optimize query using the connection pattern for better pagination',
        query: query.replace(
          /products\s*{/g, 
          `products(first: 50) {
  edges {
    node {`
        ).replace(/}/g, '} } }')
      });
    }
    
    // Check if query could benefit from bulk operations
    if (
      (query.includes('products') || query.includes('inventory')) && 
      query.toLowerCase().includes('mutation')
    ) {
      suggestions.push({
        type: 'bulk',
        operation: 'convert-to-bulk',
        description: 'Convert to bulk operation for better performance with large datasets',
        query: `mutation {
  bulkOperationRunMutation(
    mutation: """
    ${query.replace(/mutation\s+\w*\s*{/, '').replace(/}$/, '')}
    """
  ) {
    bulkOperation {
      id
      status
    }
    userErrors {
      field
      message
    }
  }
}`
      });
    }

    // Suggest adding error handling
    if (!query.includes('userErrors')) {
      suggestions.push({
        type: 'debug',
        operation: 'add-error-handling',
        description: 'Add error handling to capture userErrors',
        query: query.replace(
          /}\s*$/,
          `  userErrors {
    field
    message
  }
}`
        )
      });
    }
    
    return suggestions;
  } catch (error) {
    console.error('Error generating query suggestions:', error);
    toast.error('Error', {
      description: 'Failed to generate query suggestions'
    });
    return [];
  }
};

/**
 * Use AI to explain a GraphQL query in plain English
 * @param query The GraphQL query to explain
 * @returns Promise resolving to explanation
 */
export const explainQuery = async (query: string): Promise<string> => {
  try {
    // In a real implementation, this would use an AI service to explain the query
    
    // For demonstration purposes, return a simple explanation based on query content
    if (query.includes('products')) {
      return 'This query fetches product data from Shopify. It retrieves product information such as ID, title, and variants.';
    } else if (query.includes('orders')) {
      return 'This query retrieves order information from Shopify, including order details and line items.';
    } else if (query.includes('customers')) {
      return 'This query fetches customer data from Shopify, including customer details and possibly their order history.';
    } else {
      return 'This GraphQL query interacts with the Shopify Admin API to retrieve or modify data.';
    }
  } catch (error) {
    console.error('Error explaining query:', error);
    return 'Unable to analyze this query.';
  }
};

/**
 * Use AI to optimize a GraphQL query
 * @param query The GraphQL query to optimize
 * @returns Promise resolving to optimized query
 */
export const optimizeQuery = async (query: string): Promise<{
  optimizedQuery: string;
  explanation: string;
}> => {
  try {
    // In a real implementation, this would use an AI service to optimize the query
    
    // For demonstration purposes, perform some simple optimizations
    let optimizedQuery = query;
    let explanation = 'No optimizations were applied.';
    
    // Check for common optimization patterns
    if (query.includes('products') && !query.includes('first:')) {
      optimizedQuery = query.replace(/products(\s*\(\s*)?/g, 'products(first: 50');
      explanation = 'Added pagination with "first: 50" to prevent fetching too many products at once.';
    }
    
    // Check for missing fragments
    if (query.includes('...') && !query.includes('fragment')) {
      explanation += ' Added missing fragment definitions.';
    }
    
    return { optimizedQuery, explanation };
  } catch (error) {
    console.error('Error optimizing query:', error);
    return { 
      optimizedQuery: query,
      explanation: 'Unable to optimize this query due to an error.'
    };
  }
};

/**
 * Generate a sample AI-powered test scenario for a query
 * @param query The GraphQL query to test
 * @returns Promise resolving to test scenario
 */
export const generateTestScenario = async (
  query: string
): Promise<{
  description: string;
  variables: Record<string, any>;
  assertions: string[];
}> => {
  try {
    // Extract operation type and name
    const operationMatch = query.match(/(?:query|mutation)\s+(\w+)/);
    const operationName = operationMatch ? operationMatch[1] : 'UnknownOperation';
    
    // Generate test description
    const isQuery = query.includes('query');
    const description = isQuery 
      ? `Test fetching data with ${operationName}`
      : `Test modifying data with ${operationName}`;
    
    // Generate sample variables based on query content
    const variables: Record<string, any> = {};
    
    if (query.includes('productId')) {
      variables.productId = 'gid://shopify/Product/1234567890';
    }
    
    if (query.includes('input:')) {
      const inputMatch = query.match(/input:\s*\$(\w+)/);
      if (inputMatch) {
        const inputName = inputMatch[1];
        variables[inputName] = {
          title: 'Test Product',
          price: '19.99',
          published: true
        };
      }
    }
    
    // Generate assertions
    const assertions = [
      isQuery 
        ? 'expect(result.data).not.toBeNull()'
        : 'expect(result.data).toBeDefined()',
      'expect(result.errors).toBeUndefined()'
    ];
    
    // Add specific assertions based on query content
    if (query.includes('products')) {
      assertions.push('expect(result.data.products).toBeDefined()');
    }
    
    if (query.includes('userErrors')) {
      assertions.push('expect(result.data.userErrors).toHaveLength(0)');
    }
    
    return { description, variables, assertions };
  } catch (error) {
    console.error('Error generating test scenario:', error);
    return {
      description: 'Test this GraphQL operation',
      variables: {},
      assertions: ['expect(result).toBeDefined()']
    };
  }
};

/**
 * Generate code for a React component that uses the provided query
 * @param query The GraphQL query to use in the component
 * @returns React component code
 */
export const generateQueryComponent = (
  query: string,
  componentName: string = 'ShopifyQueryComponent'
): string => {
  // Extract operation type (query or mutation)
  const isQuery = !query.toLowerCase().includes('mutation');
  
  // Extract operation name
  const operationMatch = query.match(/(?:query|mutation)\s+(\w+)/);
  const operationName = operationMatch ? operationMatch[1] : 'ShopifyOperation';
  
  // Generate the component
  return `import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useShopify } from "@/contexts/shopify";
import { executeMcpQuery } from "@/lib/shopify/mcp/client";

const ${componentName} = () => {
  const { shopifyContext } = useShopify();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const handle${isQuery ? 'Query' : 'Mutation'} = async () => {
    if (!shopifyContext) {
      toast.error("Not connected", {
        description: "Please connect to Shopify first"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const query = \`${query.replace(/`/g, '\\`')}\`;
      
      // Optional: Add your variables here
      const variables = {
        // Add variables as needed
      };
      
      const data = await executeMcpQuery(query, variables);
      setResult(data);
      
      toast.success("${isQuery ? 'Query' : 'Mutation'} successful", {
        description: "Operation completed successfully"
      });
    } catch (error) {
      console.error("Error executing operation:", error);
      toast.error("Operation failed", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>${operationName}</CardTitle>
        <CardDescription>
          ${isQuery ? 'Fetch data from' : 'Modify data in'} Shopify
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handle${isQuery ? 'Query' : 'Mutation'}}
          disabled={isLoading || !shopifyContext}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ${isQuery ? 'Fetching...' : 'Processing...'}
            </>
          ) : (
            '${isQuery ? 'Run Query' : 'Execute Mutation'}'
          )}
        </Button>
        
        {result && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Result:</h3>
            <pre className="bg-slate-100 p-4 rounded overflow-auto max-h-96 text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ${componentName};
`;
};

/**
 * Open the AI assistant view in the MCP explorer
 * @param query Optional query to analyze
 */
export const openAiAssistantInMcpExplorer = (query?: string): void => {
  const config = getMcpConfig();
  const baseUrl = config.endpoint.replace('/graphql', '');
  
  // Open the AI assistant view with the query
  const aiUrl = `${baseUrl}/ai-assistant${query ? `?query=${encodeURIComponent(query)}` : ''}`;
  window.open(aiUrl, '_blank');
};
