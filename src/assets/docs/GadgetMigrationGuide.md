
# Migrating to Gadget.dev - Implementation Guide

## Introduction

This guide outlines the process of migrating our application from its current architecture to a Gadget.dev-powered backend. Gadget.dev will provide enhanced capabilities for Shopify integration, PDF processing, and data analysis without requiring maintenance of custom server infrastructure.

## Migration Steps Overview

1. [Set up Gadget.dev account and application](#1-set-up-gadgetdev-account-and-application)
2. [Create data models in Gadget](#2-create-data-models-in-gadget)
3. [Implement authentication integration](#3-implement-authentication-integration)
4. [Implement PDF processing actions](#4-implement-pdf-processing-actions)
5. [Set up Shopify connections](#5-set-up-shopify-connections)
6. [Create batch operations functionality](#6-create-batch-operations-functionality)
7. [Data enrichment and market analysis](#7-data-enrichment-and-market-analysis)
8. [Testing and validation](#8-testing-and-validation)
9. [Production deployment](#9-production-deployment)

## 1. Set up Gadget.dev Account and Application

### Create Your Account

1. Go to [https://app.gadget.dev/signup](https://app.gadget.dev/signup)
2. Complete the registration process
3. Verify your email address

### Create a New Gadget Application

1. Click "New Application" from your Gadget dashboard
2. Name your application (e.g., "SupplierPriceWatch")
3. Choose a development environment
4. Select "Shopify Integration" from the available templates (if offered)

## 2. Create Data Models in Gadget

### Required Models

Create the following models in your Gadget application:

#### PriceItem Model

```javascript
// PriceItem model
{
  fields: {
    sku: { type: "string", required: true },
    name: { type: "string", required: true },
    oldPrice: { type: "number" },
    newPrice: { type: "number", required: true },
    difference: { type: "number" },
    diffPercent: { type: "number" },
    status: { type: "string", enum: ["increase", "decrease", "unchanged", "new"] },
    syncedToShopify: { type: "boolean", default: false },
    shopifyProductId: { type: "string" },
    shopifyVariantId: { type: "string" },
    marketData: { type: "object" }
  },
  connections: {
    priceList: { type: "belongs-to", model: "PriceList" }
  }
}
```

#### PriceList Model

```javascript
// PriceList model
{
  fields: {
    name: { type: "string", required: true },
    uploadedAt: { type: "datetime", required: true },
    supplierName: { type: "string" },
    effectiveDate: { type: "datetime" },
    shop: { type: "string" },
    fileName: { type: "string" },
    fileType: { type: "string" },
    fileUrl: { type: "string" },
    processed: { type: "boolean", default: false },
    itemCount: { type: "number", default: 0 }
  },
  connections: {
    items: { type: "has-many", model: "PriceItem" },
    user: { type: "belongs-to", model: "User" }
  }
}
```

#### ShopifyAuth Model

```javascript
// ShopifyAuth model
{
  fields: {
    shop: { type: "string", required: true, unique: true },
    accessToken: { type: "string", required: true, encrypted: true },
    scope: { type: "string" },
    isActive: { type: "boolean", default: true },
    installedAt: { type: "datetime", required: true }
  },
  connections: {
    user: { type: "belongs-to", model: "User" }
  }
}
```

## 3. Implement Authentication Integration

### Create Auth Actions in Gadget

1. Navigate to the "Actions" section in your Gadget app
2. Create a new action called "authenticateWithShopify"

```javascript
// authenticateWithShopify action
export default async function(context, params) {
  const { shop, redirectUri } = params;
  
  // Generate authentication URL
  const authUrl = ShopifyAuth.getAuthUrl(shop, redirectUri, [
    "read_products", 
    "write_products", 
    "read_orders"
  ]);
  
  return { authUrl };
}
```

3. Create a callback action to handle OAuth response

```javascript
// shopifyAuthCallback action
export default async function(context, params) {
  const { shop, code } = params;
  
  // Exchange code for access token
  const accessToken = await ShopifyAuth.exchangeCodeForToken(shop, code);
  
  // Store in database
  const auth = await context.models.ShopifyAuth.create({
    shop,
    accessToken,
    installedAt: new Date(),
    isActive: true,
    user: context.currentUser
  });
  
  return { success: true, shop };
}
```

## 4. Implement PDF Processing Actions

1. Create a file upload handler in Gadget
2. Implement PDF processing action

```javascript
// processPdfPriceList action
import { extractPdfText } from "@gadget/pdf-processing";
import { parsePriceData } from "../lib/priceParser";

export default async function(context, params) {
  const { fileId, supplierName, effectiveDate } = params;
  
  // Get file from storage
  const file = await context.storage.getFile(fileId);
  
  // Extract text from PDF using Gadget's PDF processing capabilities
  const textContent = await extractPdfText(file.content, {
    useOCR: true,
    extractTables: true,
    confidence: 0.85
  });
  
  // Parse price data from text
  const priceItems = parsePriceData(textContent, supplierName);
  
  // Create price list record
  const priceList = await context.models.PriceList.create({
    name: file.name,
    uploadedAt: new Date(),
    supplierName,
    effectiveDate,
    fileName: file.name,
    fileType: file.contentType,
    fileUrl: file.url,
    processed: true,
    itemCount: priceItems.length,
    user: context.currentUser
  });
  
  // Create price items linked to the list
  const createdItems = await Promise.all(
    priceItems.map(item => 
      context.models.PriceItem.create({
        ...item,
        priceList: priceList.id
      })
    )
  );
  
  return {
    success: true,
    priceListId: priceList.id,
    itemCount: createdItems.length,
    items: createdItems
  };
}
```

## 5. Set up Shopify Connections

### Configure Shopify Connection in Gadget

1. Go to "Connections" in your Gadget app dashboard
2. Enable the Shopify connection
3. Configure scopes and permissions:
   - `read_products`
   - `write_products`
   - `read_orders`

### Create Product Sync Action

```javascript
// syncProductPrice action
export default async function(context, params) {
  const { shop, sku, newPrice } = params;
  
  // Get auth record for shop
  const auth = await context.models.ShopifyAuth.findOne({
    where: { shop, isActive: true }
  });
  
  if (!auth) {
    throw new Error("Shop not authenticated");
  }
  
  try {
    // Find product in Shopify by SKU
    const shopify = context.connections.shopify.forShop(shop);
    
    // Search for products with this SKU
    const products = await shopify.product.search({
      query: `sku:${sku}`,
      first: 1
    });
    
    if (!products.edges.length) {
      throw new Error(`Product with SKU ${sku} not found`);
    }
    
    const product = products.edges[0].node;
    const variant = product.variants.edges[0].node;
    
    // Update product price
    await shopify.productVariant.update({
      id: variant.id,
      input: {
        price: String(newPrice)
      }
    });
    
    // Update price item record if it exists
    const priceItem = await context.models.PriceItem.findOne({
      where: { sku }
    });
    
    if (priceItem) {
      await priceItem.update({
        syncedToShopify: true,
        shopifyProductId: product.id,
        shopifyVariantId: variant.id
      });
    }
    
    return { 
      success: true, 
      product: {
        id: product.id,
        title: product.title,
        sku: sku,
        oldPrice: variant.price,
        newPrice: newPrice
      }
    };
  } catch (error) {
    console.error("Error syncing product price:", error);
    throw error;
  }
}
```

## 6. Create Batch Operations Functionality

### Implement Batch Processing Utility

Create a new file in your Gadget application under `lib/batchProcessing.js`:

```javascript
// batchProcessing.js in Gadget

/**
 * Process items in batches to avoid rate limits
 * @param {Array} items - Array of items to process
 * @param {Function} processFn - Async function to process each item
 * @param {Object} options - Configuration options
 * @returns {Object} Results and errors
 */
export async function batchProcess(items, processFn, options = {}) {
  const {
    batchSize = 50,
    maxConcurrency = 5,
    retryCount = 3,
    retryDelay = 1000,
    onProgress = null
  } = options;
  
  const results = [];
  const errors = [];
  let processedCount = 0;
  
  // Create batches
  const batches = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  
  console.log(`Processing ${items.length} items in ${batches.length} batches`);
  
  // Process a single item with retry logic
  const processWithRetry = async (item, attempt = 0) => {
    try {
      return await processFn(item);
    } catch (error) {
      if (attempt < retryCount) {
        // Exponential backoff
        const delay = retryDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        return processWithRetry(item, attempt + 1);
      }
      errors.push({ item, error: error.message });
      return null;
    }
  };
  
  // Process batches sequentially
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Processing batch ${i + 1}/${batches.length} (${batch.length} items)`);
    
    // Process items in the batch with limited concurrency
    const batchPromises = [];
    let running = 0;
    let index = 0;
    
    // Results for this batch
    const batchResults = [];
    
    while (index < batch.length || running > 0) {
      // Start new tasks if below concurrency limit and items remain
      while (running < maxConcurrency && index < batch.length) {
        const item = batch[index++];
        const promise = processWithRetry(item).then(result => {
          running--;
          if (result !== null) {
            batchResults.push(result);
          }
          
          // Update progress if callback provided
          processedCount++;
          if (onProgress) {
            onProgress(processedCount, items.length);
          }
          
          return result;
        });
        
        batchPromises.push(promise);
        running++;
      }
      
      // Wait for a task to finish if at concurrency limit
      if (running >= maxConcurrency || (index >= batch.length && running > 0)) {
        await Promise.race(batchPromises.filter(p => !p.isResolved));
      }
    }
    
    // Wait for all promises in this batch to complete
    await Promise.all(batchPromises);
    
    // Add successful results from this batch
    results.push(...batchResults.filter(r => r !== null));
    
    console.log(`Completed batch ${i + 1}: ${batchResults.length} successful, ${batch.length - batchResults.length} failed`);
  }
  
  return {
    results,
    errors,
    summary: {
      total: items.length,
      successful: results.length,
      failed: errors.length
    }
  };
}
```

### Create Batch Sync Action

```javascript
// batchSyncPrices action
import { batchProcess } from "../lib/batchProcessing";

export default async function(context, params) {
  const { shop, items } = params;
  
  // Validate input
  if (!shop) {
    throw new Error("Shop parameter is required");
  }
  
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Items array is required and cannot be empty");
  }
  
  try {
    // Process items in batches
    const { results, errors, summary } = await batchProcess(
      items,
      async (item) => {
        // Call the syncProductPrice action for each item
        return await context.actions.syncProductPrice.run({
          shop,
          sku: item.sku,
          newPrice: item.newPrice
        });
      },
      {
        batchSize: 20, // Process 20 items at a time
        maxConcurrency: 5, // 5 concurrent operations maximum
        retryCount: 3, // Retry failed operations up to 3 times
        onProgress: (processed, total) => {
          console.log(`Progress: ${processed}/${total} (${Math.round(processed/total*100)}%)`);
        }
      }
    );
    
    return {
      success: true,
      syncedCount: results.length,
      errorCount: errors.length,
      errors: errors.length > 0 ? errors : undefined,
      summary
    };
  } catch (error) {
    console.error("Error in batch sync operation:", error);
    throw error;
  }
}
```

## 7. Data Enrichment and Market Analysis

### Create Market Data Enrichment Action

```javascript
// enrichWithMarketData action
export default async function(context, params) {
  const { itemIds } = params;
  
  if (!Array.isArray(itemIds) || itemIds.length === 0) {
    throw new Error("Item IDs array is required and cannot be empty");
  }
  
  const items = await context.models.PriceItem.findMany({
    where: { id: { in: itemIds } }
  });
  
  const enrichedItems = await Promise.all(
    items.map(async (item) => {
      try {
        // Get market data from external API or service
        // Here you would integrate with a data provider API
        // For example, using a market data integration or web scraping service
        const marketData = await fetchMarketData(item.sku, item.name);
        
        // Update item with market data
        await item.update({
          marketData: {
            averagePrice: marketData.averagePrice,
            competitorPrices: marketData.competitorPrices,
            pricePosition: marketData.pricePosition,
            lastUpdated: new Date()
          }
        });
        
        return item;
      } catch (error) {
        console.error(`Error enriching item ${item.id}:`, error);
        throw error;
      }
    })
  );
  
  return { 
    success: true, 
    count: enrichedItems.length,
    items: enrichedItems
  };
}

// Helper function to fetch market data (implementation would vary based on your data source)
async function fetchMarketData(sku, name) {
  // Implementation would connect to market data provider APIs
  // For demonstration, return sample data
  return {
    averagePrice: Math.random() * 100 + 50,
    competitorPrices: [
      Math.random() * 90 + 40,
      Math.random() * 110 + 45,
      Math.random() * 100 + 50
    ],
    pricePosition: Math.random() < 0.33 ? 'low' : Math.random() < 0.66 ? 'average' : 'high'
  };
}
```

### Create Price Trend Analysis Action

```javascript
// analyzePriceTrends action
export default async function(context, params) {
  const { itemIds, timeframe = 'quarter' } = params;
  
  if (!Array.isArray(itemIds) || itemIds.length === 0) {
    throw new Error("Item IDs array is required and cannot be empty");
  }
  
  const items = await context.models.PriceItem.findMany({
    where: { id: { in: itemIds } }
  });
  
  // Get historical price data
  // This would typically come from a historical price database
  // For demonstration, we'll generate sample data
  const analyzedItems = await Promise.all(
    items.map(async (item) => {
      try {
        // Generate or fetch historical data
        const historicalData = await generateHistoricalData(item, timeframe);
        
        // Update item with trend analysis
        await item.update({
          historicalData
        });
        
        return {
          ...item,
          historicalData
        };
      } catch (error) {
        console.error(`Error analyzing trends for item ${item.id}:`, error);
        throw error;
      }
    })
  );
  
  return { 
    success: true, 
    count: analyzedItems.length,
    items: analyzedItems,
    timeframe
  };
}

// Helper function to generate historical data (in production, this would fetch real data)
async function generateHistoricalData(item, timeframe) {
  // Determine how many months of data to include
  const months = timeframe === 'month' ? 1 : timeframe === 'quarter' ? 3 : 12;
  
  // Generate realistic trend percentages based on current price movement
  const trendDirection = item.status === 'increase' ? 1 : 
                        item.status === 'decrease' ? -1 : 0;
  
  const industryTrend = (Math.random() * 5 + 1) * (Math.random() > 0.5 ? 1 : -1);
  const categoryTrend = industryTrend + (Math.random() * 3 - 1.5);
  const itemTrend = trendDirection * (Math.random() * 8 + 2);
  
  // Generate historical price points
  const historyPoints = [];
  let currentPrice = item.newPrice;
  
  for (let i = 0; i < months; i++) {
    // Work backwards from current price
    const monthlyChange = (Math.random() * 3 - 1) * (i + 1);
    const historicalPrice = currentPrice - (monthlyChange * (i + 1));
    
    historyPoints.push({
      date: new Date(Date.now() - (i * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      price: Math.max(1, historicalPrice)
    });
  }
  
  return {
    itemTrendPercent: itemTrend,
    categoryTrendPercent: categoryTrend,
    industryTrendPercent: industryTrend,
    volatility: Math.random() * 10,
    timeframe: timeframe,
    dataPoints: 12 * (timeframe === 'month' ? 1 : timeframe === 'quarter' ? 3 : 12),
    history: historyPoints.reverse() // Order from oldest to newest
  };
}
```

## 8. Testing and Validation

### Create Test Connection Action

```javascript
// testConnection action
export default async function(context, params) {
  // Verify API key is valid
  if (!context.api.isAuthenticated) {
    throw new Error("Invalid API key");
  }
  
  // Return system status and information
  return {
    ready: true,
    timestamp: new Date().toISOString(),
    environment: process.env.GADGET_ENV || 'development',
    app: {
      id: process.env.GADGET_APP_ID,
      name: process.env.GADGET_APP_NAME
    },
    user: context.currentUser ? {
      id: context.currentUser.id,
      email: context.currentUser.email
    } : null,
    connections: {
      shopify: !!context.connections.shopify
    }
  };
}
```

### Create Health Check Endpoint

```javascript
// healthCheck action
export default async function(context, params) {
  // Test database connection
  let dbStatus = "healthy";
  try {
    // Try a simple query to verify database connection
    await context.models.PriceItem.findFirst();
  } catch (error) {
    dbStatus = "degraded";
    console.error("Database health check failed:", error);
  }
  
  // Test Shopify connection if applicable
  let shopifyStatus = "not_configured";
  if (context.connections.shopify) {
    try {
      // Try a simple Shopify API call
      await context.connections.shopify.shop.get();
      shopifyStatus = "healthy";
    } catch (error) {
      shopifyStatus = "degraded";
      console.error("Shopify health check failed:", error);
    }
  }
  
  // Determine overall health
  const overallHealth = 
    dbStatus === "healthy" && 
    (shopifyStatus === "healthy" || shopifyStatus === "not_configured")
      ? "healthy"
      : "degraded";
  
  return {
    status: overallHealth,
    services: {
      database: dbStatus,
      shopify: shopifyStatus
    },
    timestamp: new Date().toISOString()
  };
}
```

## 9. Production Deployment

### Preparing for Production

1. Configure environment variables in Gadget:
   - Set up production API keys
   - Configure security settings
   - Set feature flags

2. Set up authentication and security:
   - Configure proper authentication for your API
   - Set up roles and permissions
   - Implement API key restrictions

3. Update client code:
   - Replace mock implementations with real Gadget API calls
   - Update configuration settings
   - Set up proper error handling

### Client Integration Updates

1. Update the client initialization code:

```javascript
import { Client } from '@gadget-client/supplier-price-watch';

// Initialize the client with your API key
const gadgetClient = new Client({
  apiKey: config.apiKey,
  environment: config.environment,
  logLevel: config.environment === 'development' ? 'debug' : 'warn'
});

// Example of calling an action
async function processPdf(file) {
  try {
    // Create a file upload
    const uploadResult = await gadgetClient.files.upload(file);
    
    // Process the uploaded file
    const result = await gadgetClient.actions.processPdfPriceList.run({
      fileId: uploadResult.file.id,
      supplierName: 'Example Supplier',
      effectiveDate: new Date().toISOString()
    });
    
    return result.data.priceItems;
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw error;
  }
}
```

2. Implement proper error handling:

```javascript
// Error handling wrapper
function withErrorHandling(asyncFn) {
  return async function(...args) {
    try {
      return await asyncFn(...args);
    } catch (error) {
      // Check for specific error types
      if (error.statusCode === 401) {
        // Handle authentication errors
        console.error('Authentication error:', error);
        // Redirect to login or refresh token
      } else if (error.statusCode === 429) {
        // Handle rate limiting
        console.error('Rate limit exceeded:', error);
        // Implement backoff strategy
      } else {
        // Handle other errors
        console.error('Operation failed:', error);
      }
      
      throw error;
    }
  };
}

// Use the wrapper
const safeSyncToShopify = withErrorHandling(syncToShopify);
```

## Finalization Checklist

- [ ] All models created and validated
- [ ] Authentication flow tested
- [ ] PDF processing implemented and tested
- [ ] Shopify integration verified with test store
- [ ] Batch operations performance tested
- [ ] Market data enrichment functionally complete
- [ ] Error handling and logging properly implemented
- [ ] Client code updated to use production endpoints
- [ ] Documentation updated with final integration details

## Troubleshooting

If you encounter issues during migration:

1. Check Gadget logs for specific error messages
2. Verify API credentials and permissions
3. Test individual actions before implementing batch operations
4. Ensure proper CORS configuration for client access
5. Contact Gadget.dev support for assistance with platform-specific issues

## Continuous Integration/Deployment

For a professional setup, consider implementing:

1. CI/CD pipeline for Gadget actions using GitHub Actions
2. Automated testing of your Gadget actions
3. Staging environment for testing before production
4. Monitoring and alerts for Gadget API usage and errors

## Conclusion

By following this guide, you should be able to successfully migrate your application to use Gadget.dev as a backend. This will provide enhanced capabilities, better scalability, and reduced maintenance overhead compared to custom server implementations.

Gadget.dev's platform specifically excels at:
- Managing Shopify integrations without rate limiting concerns
- Processing complex documents like PDFs with built-in OCR
- Handling batch operations efficiently
- Providing a serverless environment for your business logic

For additional assistance, reference the [Gadget.dev documentation](https://docs.gadget.dev) or contact support.
