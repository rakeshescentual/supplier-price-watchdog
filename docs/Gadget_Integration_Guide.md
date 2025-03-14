
# Supplier Price Watch - Gadget.dev Integration Guide

## Purpose & Overview

Supplier Price Watch is a specialized application that helps eCommerce businesses analyze supplier price changes, particularly for Shopify merchants. The application leverages Gadget.dev for critical functionality including enhanced Shopify integration, PDF processing, and market data enrichment.

This document highlights how Gadget.dev is integrated into the application architecture and workflow.

## Key Gadget.dev Integration Points

### 1. Configuration & Authentication

The application uses a configuration component (`GadgetConfigForm.tsx`) to set up the Gadget.dev connection:

```typescript
// Configuration parameters
{
  apiKey: string;      // Gadget.dev API key
  appId: string;       // Your Gadget application ID
  environment: 'development' | 'production';
}
```

This configuration is stored in `localStorage` and used by the `initGadgetClient()` function in `gadgetApi.ts`.

### 2. Shopify Authentication Bridge

Gadget.dev serves as an authentication bridge to Shopify:

```typescript
// Authentication flow
export const authenticateShopify = async (context: ShopifyContext) => {
  const client = initGadgetClient();
  if (!client) return false;
  
  // In production: use Gadget SDK to authenticate
  return true;
}
```

### 3. PDF Processing

The application can process PDF price lists using Gadget.dev's document processing capabilities:

```typescript
export const processPdfWithGadget = async (file: File): Promise<PriceItem[]> => {
  // Upload PDF to Gadget
  // Trigger PDF processing action
  // Return structured data
}
```

### 4. Data Enrichment with Market Information

Gadget.dev is used to enrich product data with market information:

```typescript
export const enrichDataWithSearch = async (items: PriceItem[]): Promise<PriceItem[]> => {
  // Send items to Gadget for web search
  // Extract competitive pricing information
  // Return enhanced items with market context
}
```

### 5. Efficient Batch Operations

When syncing with Shopify, Gadget.dev handles batch operations to prevent rate limiting:

```typescript
export const syncToShopifyViaGadget = async (
  context: ShopifyContext, 
  items: PriceItem[]
): Promise<{success: boolean}> => {
  // Use Gadget to efficiently batch update Shopify products
}
```

## Integration Architecture

```
User Interface
      │
      ▼
Context Providers
      │
      ├──────────────►  Shopify API  ◄─────┐
      │                                    │
      ▼                                    │
File Processing                            │
      │                                    │
      ▼                                    │
┌─────────────────┐                        │
│  Gadget.dev     │                        │
│  Integration    ├────────────────────────┘
│                 │
│  - Auth         │
│  - PDF          │
│  - Data         │
│  - Batching     │
└────────┬────────┘
         │
         ▼
   AI Analysis &
   User Actions
```

## Implementation Details

### 1. Client Initialization

```typescript
export const initGadgetClient = () => {
  const config = getGadgetConfig();
  if (!config) return null;

  // In production: use Gadget SDK
  // import { createClient } from '@gadget-client/your-app-id';
  // return createClient({ apiKey: config.apiKey });
  
  return { config, ready: true };
};
```

### 2. Fallback Mechanisms

The application is designed to work even without Gadget.dev, with graceful fallbacks:

```typescript
const syncToShopify = async (items: PriceItem[]): Promise<boolean> => {
  // First try via Gadget
  if (isGadgetInitialized) {
    const result = await syncToShopifyViaGadget(shopifyContext, items);
    if (result.success) return true;
  }
  
  // Fall back to direct Shopify API
  return await syncWithShopify(shopifyContext, items);
};
```

### 3. Batch Processing Helper

```typescript
export const performBatchOperations = async <T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  batchSize = 50
): Promise<R[]> => {
  // Split items into batches
  // Process batches sequentially to avoid rate limiting
  // Return combined results
};
```

## Technical Requirements

### Gadget.dev Setup Requirements

1. **Account & Application**
   - Create a Gadget.dev account at https://gadget.dev/signup
   - Create a new application in your dashboard
   - Configure required environment variables

2. **API Keys & Permissions**
   - Generate an API key with appropriate scopes
   - Ensure the key has access to all required models
   - Set appropriate CORS settings for your frontend domain

3. **Required Gadget Models**
   - `PriceList`: For tracking uploaded price lists
   - `PriceItem`: For storing individual product prices
   - `MarketData`: For storing competitive information
   - `ShopifyConnection`: For managing Shopify credentials

4. **Custom Actions**
   - `processPdf`: For extracting data from PDF files
   - `enrichWithMarketData`: For adding market insights
   - `syncToShopify`: For efficient Shopify updates
   - `analyzeCompetitivePricing`: For price recommendations

### Integration Configuration

**Environment Variables for Gadget.dev App:**
```
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
PDF_PROCESSING_API_KEY=your_pdf_processing_service_key
MARKET_DATA_API_KEY=your_market_data_service_key
```

**Connection Settings in Gadget.dev:**
1. Configure Shopify connection in Gadget dashboard
2. Set up PDF processing service connection
3. Configure any other external APIs needed

## Developer Implementation Guide

### 1. Setting Up Your Gadget Application

First, create the required models in your Gadget application:

```javascript
// PriceList model example
{
  fields: {
    name: { type: "string" },
    uploadedAt: { type: "datetime" },
    fileType: { type: "string", enum: ["excel", "csv", "pdf"] },
    status: { type: "string", enum: ["processing", "completed", "failed"] },
    items: { type: "relation", relation: "has-many", model: "PriceItem" }
  }
}

// PriceItem model example
{
  fields: {
    sku: { type: "string", unique: true },
    name: { type: "string" },
    oldPrice: { type: "number" },
    newPrice: { type: "number" },
    status: { type: "string", enum: ["increased", "decreased", "unchanged", "new", "discontinued"] },
    changePercentage: { type: "number" },
    priceList: { type: "relation", relation: "belongs-to", model: "PriceList" }
  }
}
```

### 2. Creating Custom Actions

Next, implement the required custom actions:

```javascript
// Example PDF processing action in Gadget
actions.processPdf = async (context, params) => {
  const { file } = params;
  
  // Use built-in document processing or external service
  const pdfContent = await processPdfContent(file);
  
  // Extract structured data
  const items = extractPriceItems(pdfContent);
  
  return { success: true, items };
};

// Example market data enrichment action
actions.enrichWithMarketData = async (context, params) => {
  const { items } = params;
  
  // Fetch competitive pricing data
  const enrichedItems = await Promise.all(items.map(async (item) => {
    const marketData = await getCompetitivePricing(item.sku);
    return { ...item, marketData };
  }));
  
  return { success: true, enrichedItems };
};
```

### 3. Connecting to the React Application

In your React application, use the Gadget client to connect to your Gadget app:

```typescript
// Install Gadget client
// npm install @gadget-client/your-app

// Import client
import { Client } from '@gadget-client/your-app';

// Initialize client
const gadgetClient = new Client({ 
  apiKey: config.apiKey,
  environment: config.environment
});

// Use client for operations
const processPdf = async (file: File) => {
  const result = await gadgetClient.actions.processPdf({ file });
  return result.data.items;
};
```

## Performance Considerations

- **Batch Processing**: Implement proper chunking for large datasets
- **Background Jobs**: Use Gadget's background jobs for time-consuming operations
- **Caching**: Implement appropriate caching strategies for frequently accessed data
- **Webhooks**: Use webhooks for asynchronous communication patterns

## Security Best Practices

1. **API Key Management**
   - Never expose API keys in client-side code
   - Use environment variables for sensitive values
   - Rotate keys regularly and after team member changes

2. **Authentication**
   - Implement proper OAuth flows
   - Use short-lived tokens with refresh capabilities
   - Apply principle of least privilege for all connections

3. **Data Handling**
   - Encrypt sensitive data at rest
   - Implement proper data validation before processing
   - Follow data minimization principles

4. **CORS Configuration**
   - Configure strict CORS policies
   - Only allow trusted domains
   - Use appropriate HTTP methods

## Troubleshooting Guide

### Common Issues and Solutions

#### Authentication Failures
- Verify API key is valid and has correct permissions
- Check if the key is active in Gadget dashboard
- Ensure correct environment is selected

#### PDF Processing Issues
- Verify PDF format is supported
- Check file size limitations
- Examine OCR quality for complex documents

#### Batch Operation Failures
- Check for rate limiting issues
- Verify correct error handling for failed items
- Ensure proper transaction handling

#### Integration Connection Issues
- Verify CORS configuration
- Check network connectivity
- Ensure proper credentials for connected services

### Debugging Tools

1. **Gadget Dashboard**
   - Review logs in your Gadget application
   - Check action execution history
   - Verify model data integrity

2. **Application Monitoring**
   - Use browser console for client-side errors
   - Implement request/response logging
   - Track performance metrics for operations

## Future Enhancements

1. **Custom Gadget Actions**: Create specialized Gadget actions for price analysis and recommendations.

2. **Enhanced PDF Processing**: Improve extraction from complex supplier price lists with custom Gadget actions.

3. **Background Processing**: Use Gadget's background job capabilities for processing large datasets.

4. **Webhooks**: Implement Gadget webhooks to trigger actions when supplier files are uploaded.

5. **Multi-tenant Support**: Extend to support multiple Shopify stores through Gadget's multi-tenant capabilities.

## Conclusion

The integration with Gadget.dev significantly enhances the Supplier Price Watch application's capabilities, particularly for PDF processing, Shopify integration, and market data enrichment. The modular design allows for flexible use of Gadget features while maintaining core functionality even without Gadget.

For implementation support or questions about Gadget.dev integration, contact our developer support team at dev-support@supplierpricewatcher.com
