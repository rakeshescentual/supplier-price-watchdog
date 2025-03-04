
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

## Future Enhancements

1. **Custom Gadget Actions**: Create specialized Gadget actions for price analysis and recommendations.

2. **Enhanced PDF Processing**: Improve extraction from complex supplier price lists with custom Gadget actions.

3. **Background Processing**: Use Gadget's background job capabilities for processing large datasets.

4. **Webhooks**: Implement Gadget webhooks to trigger actions when supplier files are uploaded.

5. **Multi-tenant Support**: Extend to support multiple Shopify stores through Gadget's multi-tenant capabilities.

## Integration Sequence

1. User configures Gadget.dev in the application
2. Application initializes Gadget client
3. When user uploads a file:
   - If PDF, processes via Gadget's document capabilities
   - If connected to Shopify, authenticates via Gadget
4. For processing price changes:
   - Enriches data with market information via Gadget
   - Uses Gadget for batch operations when syncing to Shopify

## Technical Requirements

- Gadget.dev account
- Gadget application with appropriate models and actions
- Gadget API key with appropriate permissions
- Configuration of CORS for your Gadget application

## Limitations

- Currently uses mock implementations for demonstration
- Real Gadget integration requires creating appropriate models and actions
- PDF processing requires specific Gadget capabilities to be configured

## Conclusion

The integration with Gadget.dev significantly enhances the Supplier Price Watch application's capabilities, particularly for PDF processing, Shopify integration, and market data enrichment. The modular design allows for flexible use of Gadget features while maintaining core functionality even without Gadget.
