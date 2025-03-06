
# Supplier Price Watch - Gadget.dev Implementation Guide

## Introduction

This comprehensive guide provides developers with detailed instructions for implementing Gadget.dev integration with the Supplier Price Watch application. It covers both client-side (React) and Gadget-side implementations.

## Prerequisites

Before implementing Gadget.dev integration, ensure you have:

1. A Gadget.dev account and access to the Gadget dashboard
2. Appropriate permissions to create and manage applications in Gadget
3. Basic familiarity with the Gadget platform and its concepts
4. Understanding of React and TypeScript

## Implementation Steps

### 1. Gadget.dev Application Setup

Start by setting up your Gadget application:

1. **Create a New Application**:
   - Go to the [Gadget.dev dashboard](https://app.gadget.dev)
   - Click "New Application"
   - Name your application (e.g., "Supplier-Price-Watch")
   - Select the "Standard" template

2. **Set Up Data Models**:

   Create the following models in your Gadget application:

   a. **Product Model**:
   ```typescript
   // Product Model
   {
     id: 'string',
     sku: 'string',
     name: 'string',
     oldPrice: 'number',
     newPrice: 'number',
     status: 'enum', // Values: 'increased', 'decreased', 'unchanged'
     difference: 'number',
     isMatched: 'boolean',
     marketData: 'object' // For storing enriched market information
   }
   ```

   b. **SupplierFile Model**:
   ```typescript
   // SupplierFile Model
   {
     id: 'string',
     filename: 'string',
     uploadDate: 'datetime',
     processedDate: 'datetime',
     status: 'enum', // Values: 'pending', 'processing', 'complete', 'error'
     errorMessage: 'string',
     fileContent: 'file',
     products: 'relation' // One-to-many with Product
   }
   ```

   c. **ShopifyConnection Model**:
   ```typescript
   // ShopifyConnection Model
   {
     id: 'string',
     shop: 'string',
     accessToken: 'string',
     isActive: 'boolean',
     lastConnected: 'datetime'
   }
   ```

3. **Create Gadget Actions**:

   Create these custom actions in your Gadget application:

   a. **processPdfDocument**:
   - Input: `fileId` (ID of the uploaded PDF file)
   - Output: Array of extracted products
   - Implementation:
     - Use Gadget's document processing capabilities
     - Extract tables from PDF
     - Parse product information (SKU, name, prices)
     - Return structured data

   b. **enrichMarketData**:
   - Input: Array of product objects
   - Output: Products enriched with market data
   - Implementation:
     - Call external APIs for market data
     - Analyze competitive positioning
     - Add market information to products

   c. **syncToShopify**:
   - Input: ShopifyConnection details, array of products
   - Output: Success/failure status
   - Implementation:
     - Connect to Shopify API
     - Batch update product prices
     - Handle rate limiting and errors

4. **Configure Connections**:

   If using Shopify Plus integration:
   
   - Go to Connections in Gadget dashboard
   - Add Shopify connection
   - Configure scopes for products, inventory, etc.
   - Set up webhook receivers if needed

### 2. Frontend Integration

Next, configure the frontend application to connect with your Gadget implementation:

1. **Install Gadget SDK**:

```bash
npm install @gadget-client/[your-app-slug]
```

2. **Update Configuration Component**:

Ensure the `GadgetConfigForm.tsx` component can store:
- App ID
- API Key
- Environment (development/production)
- Feature flags

3. **Replace Mock Implementations**:

Update `gadgetApi.ts` to use the real Gadget SDK:

```typescript
// Real implementation example
import { createClient } from '@gadget-client/[your-app-slug]';

export const initGadgetClient = () => {
  const config = getGadgetConfig();
  if (!config) return null;

  return createClient({ 
    apiKey: config.apiKey,
    environment: config.environment,
    enableNetworkLogs: config.environment === 'development'
  });
};

export const processPdfWithGadget = async (file: File): Promise<PriceItem[]> => {
  const client = initGadgetClient();
  if (!client) {
    throw new Error("Gadget configuration required");
  }
  
  try {
    // First, upload the file to Gadget
    const formData = new FormData();
    formData.append('file', file);
    
    const uploadResponse = await fetch(
      `https://${client.config.appId}.gadget.app/api/files/upload`, 
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${client.config.apiKey}` },
        body: formData
      }
    );
    
    const { fileId } = await uploadResponse.json();
    
    // Then, process the PDF with a Gadget action
    const result = await client.mutate.processPdfDocument({
      fileId: fileId
    });
    
    return result.data.products;
  } catch (error) {
    console.error("Error processing PDF with Gadget:", error);
    throw new Error("Failed to process PDF file");
  }
};
```

### 3. Error Handling and Fallbacks

Implement proper error handling and fallbacks:

1. **Connection Status Checking**:
```typescript
export const checkGadgetConnection = async (): Promise<boolean> => {
  const client = initGadgetClient();
  if (!client) return false;
  
  try {
    const response = await fetch(
      `https://${client.config.appId}.gadget.app/api/status`,
      {
        headers: { 'Authorization': `Bearer ${client.config.apiKey}` }
      }
    );
    
    return response.status === 200;
  } catch {
    return false;
  }
};
```

2. **Graceful Fallbacks**:
```typescript
// Example of fallback mechanism
export const processFile = async (file: File): Promise<PriceItem[]> => {
  // Try Gadget first
  if (isGadgetInitialized()) {
    try {
      return await processPdfWithGadget(file);
    } catch (error) {
      console.warn("Gadget processing failed, falling back to local processing");
      // Continue to fallback
    }
  }
  
  // Fallback to local processing
  return processFileLocally(file);
};
```

### 4. Performance Optimization

Optimize your implementation for performance:

1. **Batch Processing**:

For large datasets, use Gadget's batch processing capabilities:

```typescript
export const batchProcess = async <T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  options = { batchSize: 50 }
): Promise<R[]> => {
  const client = initGadgetClient();
  if (!client) {
    throw new Error("Gadget configuration required");
  }
  
  // Split items into batches
  const batches = [];
  for (let i = 0; i < items.length; i += options.batchSize) {
    batches.push(items.slice(i, i + options.batchSize));
  }
  
  // Process batches sequentially to avoid rate limiting
  const results: R[] = [];
  for (const batch of batches) {
    const batchResult = await client.mutate.batchProcess({
      items: batch,
      processorFunction: processFn.toString()
    });
    
    results.push(...batchResult.data.results);
  }
  
  return results;
};
```

2. **Background Jobs**:

For time-consuming operations, use Gadget background jobs:

```typescript
export const startBackgroundProcess = async (
  fileId: string
): Promise<string> => {
  const client = initGadgetClient();
  if (!client) {
    throw new Error("Gadget configuration required");
  }
  
  const result = await client.mutate.startBackgroundJob({
    action: "processPdfDocument",
    params: { fileId },
    callbackUrl: window.location.origin + "/api/gadget-callback"
  });
  
  return result.data.jobId;
};
```

### 5. Security Considerations

Implement proper security measures:

1. **API Key Management**:
   - Store API keys securely
   - Use environment-specific keys
   - Set appropriate permissions

2. **Data Handling**:
   - Validate all inputs before sending to Gadget
   - Handle sensitive data appropriately
   - Implement proper error handling

3. **CORS Configuration**:
   - Configure CORS settings in Gadget to allow requests from your frontend

### 6. Testing and Deployment

Thoroughly test your implementation:

1. **Unit Testing**:
   - Mock Gadget client responses
   - Test error handling and fallbacks
   - Verify data transformations

2. **Integration Testing**:
   - Test actual API calls to Gadget
   - Verify end-to-end workflows
   - Test performance with realistic data volumes

3. **Deployment**:
   - Deploy frontend to production
   - Configure production Gadget environment
   - Verify all connections and permissions

## Common Pitfalls and Solutions

### 1. Authentication Issues

**Problem**: Authentication failures with Gadget API.

**Solution**:
- Verify API key is valid and has not expired
- Check that API key has proper permissions
- Ensure correct environment (development/production)

### 2. Rate Limiting

**Problem**: Hitting Gadget API rate limits.

**Solution**:
- Implement batch processing for large operations
- Add retry logic with exponential backoff
- Use background jobs for heavy processing

### 3. Data Inconsistencies

**Problem**: Data structure mismatches between frontend and Gadget.

**Solution**:
- Define consistent data models
- Validate data before sending to Gadget
- Transform data as needed in both directions

### 4. File Processing Errors

**Problem**: PDF processing failures.

**Solution**:
- Check file size and format
- Pre-process complex PDFs before uploading
- Implement fallback to manual data entry

## Migration from Existing Solution

If migrating from a non-Gadget implementation:

1. **Parallel Running**:
   - Implement Gadget integration alongside existing solution
   - Run both in parallel with feature flags
   - Gradually shift traffic to Gadget-powered features

2. **Data Migration**:
   - Export existing data
   - Transform to match Gadget models
   - Import into Gadget with validation

3. **Feature Parity**:
   - Ensure all existing features are implemented in Gadget
   - Test feature parity thoroughly
   - Document any differences or improvements

## Advanced Integration Techniques

### 1. Webhooks

Set up Gadget webhooks to trigger actions in your frontend:

```typescript
// In Gadget action
action("processComplete", async (request, { product }) => {
  // Process completed
  // Trigger webhook to notify frontend
  await fetch(request.body.callbackUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'complete', productId: product.id })
  });
});

// In frontend
const setupWebhookListener = () => {
  // Set up endpoint to receive webhook
  // Or use WebSockets for real-time updates
};
```

### 2. Custom Gadget Actions

Create specialized actions for your business logic:

```typescript
// In Gadget app
action("calculateOptimalPrice", async (request, { product, marketData }) => {
  // Implement pricing algorithm
  const demandCurve = await analyzeDemandCurve(product, marketData);
  const competitivePosition = await analyzeCompetitivePosition(product, marketData);
  
  const optimalPrice = calculateOptimumPricePoint(
    product.cost,
    demandCurve,
    competitivePosition
  );
  
  return { 
    optimalPrice,
    projectedRevenue: optimalPrice * demandCurve.projectedVolume,
    confidenceLevel: demandCurve.confidence
  };
});
```

### 3. Real-time Synchronization

Implement real-time data synchronization:

```typescript
// In frontend
const subscribeToProductUpdates = (productId: string) => {
  const client = initGadgetClient();
  if (!client) return null;
  
  return client.product.findOne(productId).subscribe(
    (updatedProduct) => {
      console.log("Product updated:", updatedProduct);
      // Update UI with new data
    },
    (error) => {
      console.error("Subscription error:", error);
    }
  );
};
```

## Shopify Plus-Specific Integration

For Shopify Plus merchants, Gadget can provide enhanced capabilities:

### 1. Scripts Deployment

Use Gadget to manage Shopify Scripts:

```typescript
export const deployPricingScript = async (
  scriptConfig: ScriptConfig
): Promise<boolean> => {
  const client = initGadgetClient();
  if (!client) return false;
  
  try {
    const result = await client.mutate.deployShopifyScript({
      scriptType: "line-item-discount",
      scriptContent: generateRubyScript(scriptConfig),
      description: `Price rules for ${scriptConfig.name}`
    });
    
    return result.data.success;
  } catch (error) {
    console.error("Error deploying script:", error);
    return false;
  }
};
```

### 2. Flow Automation

Create and manage Shopify Flows:

```typescript
export const createPriceChangeFlow = async (
  flowConfig: FlowConfig
): Promise<boolean> => {
  const client = initGadgetClient();
  if (!client) return false;
  
  try {
    const result = await client.mutate.createShopifyFlow({
      trigger: {
        event: "product_updated",
        filter: "price_changed"
      },
      conditions: [
        {
          field: "price_increase_percentage",
          operator: "greater_than",
          value: flowConfig.thresholdPercentage
        }
      ],
      actions: [
        {
          type: "email",
          recipient: flowConfig.notificationEmail,
          template: "price_increase_notification"
        }
      ]
    });
    
    return result.data.success;
  } catch (error) {
    console.error("Error creating flow:", error);
    return false;
  }
};
```

### 3. Metafield Management

Handle complex metafield data via Gadget:

```typescript
export const updatePriceMetafields = async (
  productId: string,
  priceHistory: PriceHistoryEntry[]
): Promise<boolean> => {
  const client = initGadgetClient();
  if (!client) return false;
  
  try {
    const result = await client.mutate.updateShopifyMetafields({
      productId,
      metafields: [
        {
          namespace: "price_watch",
          key: "price_history",
          value: JSON.stringify(priceHistory),
          type: "json"
        },
        {
          namespace: "price_watch",
          key: "last_price_change",
          value: new Date().toISOString(),
          type: "datetime"
        }
      ]
    });
    
    return result.data.success;
  } catch (error) {
    console.error("Error updating metafields:", error);
    return false;
  }
};
```

## Conclusion

This implementation guide provides a comprehensive roadmap for integrating Gadget.dev with the Supplier Price Watch application. By following these steps and best practices, you can create a robust, scalable, and maintainable integration that enhances the application's capabilities while providing resilience through fallback mechanisms.

For further assistance, refer to:
- [Gadget.dev Documentation](https://docs.gadget.dev)
- [Gadget API Reference](https://docs.gadget.dev/api)
- [Supplier Price Watch Technical Documentation](./TechnicalDocumentation.md)
