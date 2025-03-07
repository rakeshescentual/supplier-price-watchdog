# Gadget.dev Migration Guide

This guide provides comprehensive instructions for migrating the Supplier Price Watch application from the current mock implementation to a full Gadget.dev integration.

## 1. Overview

The Supplier Price Watch application is designed with a modular architecture that makes it easy to migrate to Gadget.dev. The current implementation uses mock functions that simulate Gadget.dev functionality, which can be replaced with actual Gadget.dev API calls.

## 2. Prerequisites

Before migrating to Gadget.dev, ensure you have:

1. Created a Gadget.dev account
2. Created a new Gadget.dev application
3. Generated an API key with appropriate permissions
4. Configured CORS settings for your Gadget.dev application

## 3. Migration Steps

### Step 1: Install the Gadget.dev SDK

Install the Gadget.dev client SDK for your application:

```bash
npm install @gadget-client/your-app-id
```

### Step 2: Configure Client Initialization

Update the `initGadgetClient` function in `src/lib/gadget/client.ts`:

```typescript
import { createClient } from '@gadget-client/your-app-id';

export const initGadgetClient = () => {
  const config = getGadgetConfig();
  if (!config) {
    logInfo('Gadget client initialization skipped: No configuration found', {}, 'client');
    return null;
  }
  
  // Create a hash of the current config
  const configHash = createConfigHash(config);
  
  // Return cached client if configuration hasn't changed
  if (cachedClient && configHash === lastConfigHash) {
    return cachedClient;
  }
  
  logInfo(`Initializing Gadget client for ${config.appId} (${config.environment})`, {
    featureFlags: config.featureFlags || {}
  }, 'client');
  
  // Create the actual Gadget client
  cachedClient = createClient({ 
    apiKey: config.apiKey,
    environment: config.environment,
    enableNetworkLogs: config.environment === 'development'
  });
  
  // Update last config hash
  lastConfigHash = configHash;
  
  return cachedClient;
};
```

### Step 3: Create Gadget.dev Models

In your Gadget.dev application, create the following models:

1. **PriceItem**: For storing price data
   - Fields: sku, name, oldPrice, newPrice, status, difference, etc.

2. **ShopifyConnection**: For storing Shopify connection details
   - Fields: shop, accessToken, isActive, etc.

3. **Log**: For storing application logs
   - Fields: level, message, component, data, timestamp

4. **PerformanceMetric**: For tracking performance
   - Fields: event, durationMs, metadata, timestamp

### Step 4: Create Gadget.dev Actions

In your Gadget.dev application, create actions for each operation:

1. **Shopify Integration Actions**:
   - `authenticateShopify`: Authenticate with Shopify
   - `syncProductPrice`: Sync a product price to Shopify
   - `deployShopifyScript`: Deploy a Shopify Plus script
   - `createShopifyFlow`: Create a Shopify Flow
   - `syncB2BPrice`: Sync B2B prices
   - `scheduleShopifyPriceChange`: Schedule future price changes

2. **Processing Actions**:
   - `processPdfDocument`: Process a PDF document
   - `enrichMarketData`: Enrich price data with market information

3. **Logging and Telemetry Actions**:
   - `reportTelemetry`: Report telemetry data
   - `trackPerformance`: Track performance metrics
   - `reportHealth`: Report application health
   - `storeLogs`: Store application logs

### Step 5: Update Function Implementations

For each mock implementation, replace with actual Gadget.dev API calls:

#### Example: Updating `syncToShopifyViaGadget` function

```typescript
export const syncToShopifyViaGadget = async (
  context: ShopifyContext, 
  items: PriceItem[]
): Promise<{success: boolean; message?: string; syncedItems?: PriceItem[]}> => {
  const client = initGadgetClient();
  if (!client) {
    const error = new Error("Gadget configuration required");
    await reportError(error, { component: 'syncToShopifyViaGadget', severity: 'high' });
    throw error;
  }
  
  // Start tracking performance
  const finishTracking = startPerformanceTracking('syncToShopifyViaGadget', {
    itemCount: items.length,
    shop: context.shop
  });
  
  try {
    logInfo(`Syncing ${items.length} items with Shopify via Gadget...`, {
      shop: context.shop,
      itemCount: items.length
    }, 'sync');
    
    // Use Gadget SDK for efficient batching
    const results = await performBatchOperations(
      items,
      async (item) => {
        return await client.mutate.syncProductPrice({
          shop: context.shop,
          accessToken: context.accessToken,
          sku: item.sku,
          newPrice: item.newPrice
        });
      },
      { 
        batchSize: 50, 
        retryCount: 3,
        onProgress: (processed, total) => {
          console.log(`Progress: ${processed}/${total} (${Math.round(processed/total*100)}%)`);
        }
      }
    );
    
    const success = results.length === items.length;
    
    if (success) {
      logInfo("Sync completed successfully", {
        itemCount: items.length,
        shop: context.shop
      }, 'sync');
      
      toast.success("Sync complete", {
        description: `Successfully synced ${items.length} items to Shopify via Gadget.`
      });
    } else {
      logError("Sync completed with errors", {
        successCount: results.length,
        totalCount: items.length,
        shop: context.shop
      }, 'sync');
      
      toast.warning("Sync completed with issues", {
        description: `${results.length} of ${items.length} items were synced successfully.`
      });
    }
    
    // Finish performance tracking
    await finishTracking();
    
    return {
      success,
      message: success 
        ? `Successfully synced ${items.length} items` 
        : `${results.length} of ${items.length} items were synced successfully`,
      syncedItems: success ? items : undefined
    };
  } catch (error) {
    logError("Error syncing to Shopify via Gadget", { error }, 'sync');
    
    // Report error to telemetry system
    await reportError(error instanceof Error ? error : String(error), {
      component: 'syncToShopifyViaGadget',
      severity: 'high',
      action: 'sync_to_shopify',
      userId: context.shop // Use shop as user ID for analytics
    });
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    toast.error("Sync failed", {
      description: `Failed to sync items with Shopify via Gadget: ${errorMessage}`
    });
    
    // Finish performance tracking even on error
    await finishTracking();
    
    return { success: false, message: errorMessage };
  }
};
```

### Step 6: Test and Validate

1. Test each function to ensure it correctly communicates with Gadget.dev
2. Validate data format and structure in Gadget.dev
3. Check for any CORS or authentication issues
4. Verify rate limiting and error handling

## 4. Shopify Plus and Built for Shopify Support

To ensure compliance with Shopify Plus certification requirements and "Built for Shopify" guidelines:

### Authentication & Security

- Use proper OAuth flow for Shopify authentication
- Store access tokens securely
- Implement token refresh mechanisms
- Use HTTPS for all API calls

### API Usage Best Practices

- Implement proper rate limiting with exponential backoff
- Use batch operations for bulk updates
- Handle API version changes gracefully
- Follow Shopify's API versioning policy

### Shopify Plus Features

For Shopify Plus customers, implement the following features:

1. **Scripts**: Deploy and manage Shopify Scripts
   ```typescript
   // Example using Gadget.dev
   await client.mutate.deployShopifyScript({
     shop: context.shop,
     accessToken: context.accessToken,
     scriptConfig: {
       title: "Volume Discount Script",
       scope: "all",
       source: scriptSource
     }
   });
   ```

2. **Flows**: Create and manage Shopify Flows
   ```typescript
   // Example using Gadget.dev
   await client.mutate.createShopifyFlow({
     shop: context.shop,
     accessToken: context.accessToken,
     flowConfig: {
       title: "Price Change Notification Flow",
       triggerType: "product_update",
       conditions: [...],
       actions: [...]
     }
   });
   ```

3. **B2B Features**: Support for B2B-specific functionality
   ```typescript
   // Example using Gadget.dev
   await client.mutate.syncB2BPrice({
     shop: context.shop,
     accessToken: context.accessToken,
     productId: productId,
     variantId: variantId,
     price: b2bPrice,
     customerSegments: ['wholesale', 'distributor']
   });
   ```

4. **Multi-location Inventory**: Support for inventory management across locations
   ```typescript
   // Example using Gadget.dev
   await client.mutate.updateInventoryLevels({
     shop: context.shop,
     accessToken: context.accessToken,
     inventoryItemId: inventoryItemId,
     locationId: locationId,
     available: newQuantity
   });
   ```

## 5. Error Handling & Logging

Ensure comprehensive error handling and logging:

1. **Categorize Errors**: Distinguish between API errors, validation errors, and system errors
2. **Retry Strategy**: Implement exponential backoff for transient errors
3. **User Feedback**: Provide clear error messages to users
4. **Logging**: Log errors to Gadget.dev for monitoring and analysis

## 6. Performance Optimization

Optimize performance for both Gadget.dev and Shopify:

1. **Batch Operations**: Use batch operations for efficiency
2. **Parallel Processing**: Use parallel processing with concurrency limits
3. **Caching**: Implement cache mechanisms where appropriate
4. **Rate Limiting**: Respect and handle rate limits gracefully

## Conclusion

Migrating to Gadget.dev provides several benefits:

1. Scalable infrastructure for handling larger datasets
2. Improved performance and reliability
3. Enhanced Shopify Plus integration capabilities
4. Comprehensive monitoring and logging
5. Simplified maintenance and updates

By following this guide, you can successfully migrate the Supplier Price Watch application to Gadget.dev while ensuring compliance with Shopify Plus certification requirements and "Built for Shopify" guidelines.
