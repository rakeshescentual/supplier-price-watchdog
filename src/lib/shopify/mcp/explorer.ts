
/**
 * MCP GraphQL Explorer integration
 */
import { getMcpConfig } from './config';

/**
 * Generate MCP test URL for a GraphQL query
 * This creates a URL that can be opened in the browser to test a query
 */
export const generateMcpTestUrl = (
  query: string, 
  variables?: Record<string, any>
): string => {
  const config = getMcpConfig();
  const encodedQuery = encodeURIComponent(query);
  const variablesParam = variables 
    ? `&variables=${encodeURIComponent(JSON.stringify(variables))}` 
    : '';
  
  // Extract base URL without /graphql path
  const baseUrl = config.endpoint.replace('/graphql', '');
  
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
 * Generate sample queries for testing
 */
export const getSampleQueries = (): Record<string, { query: string, variables?: Record<string, any> }> => {
  return {
    shopInfo: {
      query: `
        query {
          shop {
            name
            primaryDomain {
              url
              host
            }
            plan {
              displayName
              partnerDevelopment
              shopifyPlus
            }
          }
        }
      `
    },
    productList: {
      query: `
        query ($first: Int!) {
          products(first: $first) {
            edges {
              node {
                id
                title
                handle
                variants(first: 10) {
                  edges {
                    node {
                      id
                      price
                      sku
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        first: 5
      }
    },
    bulkOperationTest: {
      query: `
        mutation {
          bulkOperationRunQuery(
            query: """
              {
                products(first: 10) {
                  edges {
                    node {
                      id
                      variants {
                        edges {
                          node {
                            id
                            price
                          }
                        }
                      }
                    }
                  }
                }
              }
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
        }
      `
    }
  };
};
