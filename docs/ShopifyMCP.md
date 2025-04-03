
# Shopify MCP Development Server Integration

## Overview

The Merchant Commerce Platform (MCP) development server is a tool provided by Shopify to help developers build and test GraphQL operations locally. This document explains how to set up and use the MCP server with this application.

## Setup Instructions

### 1. Install the MCP Server

Follow the official installation instructions on GitHub:
https://github.com/Shopify/dev-mcp#setup

```bash
# Using npm
npm install -g @shopify/dev-mcp

# Using yarn
yarn global add @shopify/dev-mcp

# Using pnpm
pnpm add -g @shopify/dev-mcp
```

### 2. Configure the MCP Server

Create a `.mcp.config.yml` file in your project root:

```yaml
# .mcp.config.yml
metadata:
  title: "Supplier Price Watch MCP"
  description: "MCP setup for Supplier Price Watch"
  port: 8000

server:
  # Adjust these settings based on your needs
  # See full configuration options at https://github.com/Shopify/dev-mcp#configuration
  introspection: true
  graphiql: true
```

### 3. Start the MCP Server

Run the MCP server with your config file:

```bash
mcp --config .mcp.config.yml
```

The server will be available at http://localhost:8000 (or the port you specified).

## Using the MCP Utilities

Our application includes built-in utilities for working with the MCP server. These utilities can be found in `src/lib/shopify/mcp.ts`.

### Configuration

```typescript
import { configureMcp } from '@/lib/shopify/bulkOperations';

// Configure the MCP client
configureMcp({
  endpoint: 'http://localhost:8000/graphql',
  apiKey: 'your_shop_api_key', // Optional
  shopDomain: 'your-shop.myshopify.com' // Optional
});
```

### Testing GraphQL Queries

```typescript
import { executeMcpQuery } from '@/lib/shopify/bulkOperations';

// Example query
const query = `
  query {
    shop {
      name
      primaryDomain {
        url
        host
      }
    }
  }
`;

// Execute the query against MCP
const result = await executeMcpQuery(query);
console.log(result);
```

### Opening the MCP Explorer

```typescript
import { openInMcpExplorer } from '@/lib/shopify/bulkOperations';

// Open a query in the MCP explorer
openInMcpExplorer(`
  query {
    shop {
      name
    }
  }
`);
```

### Testing Bulk Operation Capabilities

```typescript
import { testBulkOperationCapabilities } from '@/lib/shopify/bulkOperations';

// Check if bulk operations are supported
const capabilities = await testBulkOperationCapabilities();
if (capabilities.supported) {
  console.log('Bulk operations are supported!', capabilities.details);
} else {
  console.log('Bulk operations are not supported in this API version.');
}
```

## Best Practices

1. **API Version Matching**: Ensure your MCP server is using the same API version as your application.

2. **Develop Locally First**: Write and test your GraphQL queries with MCP before implementing them in your application.

3. **Test Performance**: Use MCP to evaluate the performance of your queries before deploying.

4. **Version Control**: Consider saving successful queries in your application for reference.

## Troubleshooting

- **Connection Issues**: Ensure the MCP server is running and accessible at the configured endpoint.
- **Authentication Errors**: Check that your API key and shop domain are correctly configured.
- **GraphQL Errors**: Carefully review error messages, which often provide helpful details about what went wrong.

For more help, refer to the [official MCP documentation](https://github.com/Shopify/dev-mcp).
