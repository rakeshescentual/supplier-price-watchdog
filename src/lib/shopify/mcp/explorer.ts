
/**
 * MCP GraphQL Explorer Utilities
 * 
 * Functions for interacting with the MCP Explorer interface
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
  const encodedQuery = encodeURIComponent(query);
  const variablesParam = variables 
    ? `&variables=${encodeURIComponent(JSON.stringify(variables))}` 
    : '';
  
  // Extract base URL without /graphql path
  const baseUrl = getMcpConfig().endpoint.replace('/graphql', '');
  
  return `${baseUrl}?query=${encodedQuery}${variablesParam}`;
};

/**
 * Open a GraphQL query in the MCP explorer
 */
export const openInMcpExplorer = (
  query?: string, 
  variables?: Record<string, any>
): void => {
  if (!query) {
    // If no query provided, just open the explorer
    const baseUrl = getMcpConfig().endpoint.replace('/graphql', '');
    window.open(baseUrl, '_blank');
    return;
  }
  
  const url = generateMcpTestUrl(query, variables);
  window.open(url, '_blank');
};

/**
 * Open documentation for a specific GraphQL operation or type
 */
export const openTypeDocs = (typeName: string): void => {
  const baseUrl = getMcpConfig().endpoint.replace('/graphql', '');
  window.open(`${baseUrl}/docs/reference/${typeName}`, '_blank');
};

/**
 * Generate links to common documentation sections
 */
export const getDocumentationLinks = (): Record<string, string> => {
  const baseUrl = "https://shopify.dev/docs/api/admin-graphql";
  
  return {
    adminApi: `${baseUrl}/reference`,
    products: `${baseUrl}/products`,
    customers: `${baseUrl}/customers-and-users`,
    orders: `${baseUrl}/orders`,
    inventory: `${baseUrl}/inventory`,
    bulkOperations: `${baseUrl}/bulk-operations`,
    webhooks: `${baseUrl}/webhooks`,
    introduction: `${baseUrl}/getting-started`
  };
};

/**
 * Open AI assistant in a separate tab
 */
export const openAiAssistant = (): void => {
  const baseUrl = getMcpConfig().endpoint.replace('/graphql', '');
  window.open(`${baseUrl}/ai-assistant`, '_blank');
};

/**
 * Sample queries that can be used as starting points
 */
export const getSampleQueries = (): Record<string, { query: string; variables?: Record<string, any> }> => {
  return {
    productList: {
      query: `
query GetProducts($first: Int!) {
  products(first: $first) {
    edges {
      node {
        id
        title
        handle
        vendor
        productType
        variants(first: 5) {
          edges {
            node {
              id
              title
              price
              sku
              inventoryQuantity
            }
          }
        }
      }
    }
  }
}`,
      variables: { first: 10 }
    },
    productByID: {
      query: `
query GetProductById($id: ID!) {
  product(id: $id) {
    id
    title
    description
    vendor
    productType
    tags
    variants(first: 10) {
      edges {
        node {
          id
          title
          price
          sku
          inventoryQuantity
        }
      }
    }
    images(first: 5) {
      edges {
        node {
          id
          url
          altText
        }
      }
    }
  }
}`,
      variables: { id: "gid://shopify/Product/1234567890" }
    },
    createProduct: {
      query: `
mutation CreateProduct($input: ProductInput!) {
  productCreate(input: $input) {
    product {
      id
      title
      handle
    }
    userErrors {
      field
      message
    }
  }
}`,
      variables: {
        input: {
          title: "New Product",
          vendor: "My Company",
          productType: "Example",
          variants: [
            {
              price: "19.99",
              sku: "EXAMPLE-001"
            }
          ]
        }
      }
    },
    updateProductPrice: {
      query: `
mutation UpdateProductPrice($input: ProductVariantInput!) {
  productVariantUpdate(input: $input) {
    productVariant {
      id
      price
    }
    userErrors {
      field
      message
    }
  }
}`,
      variables: {
        input: {
          id: "gid://shopify/ProductVariant/1234567890",
          price: "24.99"
        }
      }
    },
    bulkOperation: {
      query: `
mutation BulkUpdatePrices($mutation: String!) {
  bulkOperationRunMutation(
    mutation: $mutation
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
}`,
      variables: {
        mutation: `mutation {
  productVariantUpdate(input: {id: "gid://shopify/ProductVariant/1234567890", price: "29.99"}) {
    productVariant { id }
    userErrors { field message }
  }
}`
      }
    }
  };
};
