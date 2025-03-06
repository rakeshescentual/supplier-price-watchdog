
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
  const auth = await ShopifyAuth.create({
    shop,
    accessToken,
    installedAt: new Date(),
    isActive: true
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
  
  // Extract text from PDF
  const textContent = await extractPdfText(file.content);
  
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
    itemCount: createdItems.length
  };
}
```

## 5. Set up Shopify Connections

### Enable Shopify Connection in Gadget

1. Go to "Connections" in your Gadget app dashboard
2. Enable the Shopify connection
3. Configure scopes and permissions

### Create Product Sync Action

```javascript
// syncProductPrice action
export default async function(context, params) {
  const { shop, accessToken, sku, newPrice } = params;
  
  // Get auth record for shop
  const auth = await context.models.ShopifyAuth.findOne({
    where: { shop, isActive: true }
  });
  
  if (!auth) {
    throw new Error("Shop not authenticated");
  }
  
  // Find product in Shopify by SKU
  const shopify = new Shopify(shop, auth.accessToken);
  const product = await shopify.findProductBySku(sku);
  
  if (!product) {
    throw new Error(`Product with SKU ${sku} not found`);
  }
  
  // Update product price
  await shopify.updateProductPrice(product.variantId, newPrice);
  
  // Update price item record
  const priceItem = await context.models.PriceItem.findOne({
    where: { sku }
  });
  
  if (priceItem) {
    await priceItem.update({
      syncedToShopify: true,
      shopifyProductId: product.id,
      shopifyVariantId: product.variantId
    });
  }
  
  return { success: true, product };
}
```

## 6. Create Batch Operations Functionality

### Implement Batch Processing

1. Create a batch processing utility in Gadget

```javascript
// batchProcess.js in Gadget
export async function batchProcess(items, processFn, batchSize = 50) {
  const results = [];
  const errors = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    try {
      const batchResults = await Promise.all(
        batch.map(async (item) => {
          try {
            return await processFn(item);
          } catch (error) {
            errors.push({ item, error: error.message });
            return null;
          }
        })
      );
      
      results.push(...batchResults.filter(r => r !== null));
    } catch (error) {
      console.error(`Error processing batch ${i / batchSize}:`, error);
    }
  }
  
  return { results, errors };
}
```

2. Create a batch sync action

```javascript
// batchSyncPrices action
import { batchProcess } from "../lib/batchProcess";

export default async function(context, params) {
  const { shop, items } = params;
  
  const { results, errors } = await batchProcess(
    items,
    async (item) => {
      return await context.actions.syncProductPrice({
        shop,
        sku: item.sku,
        newPrice: item.newPrice
      });
    },
    20 // Process 20 items at a time
  );
  
  return {
    success: errors.length === 0,
    syncedCount: results.length,
    errorCount: errors.length,
    errors: errors.length > 0 ? errors : undefined
  };
}
```

## 7. Data Enrichment and Market Analysis

### Implement Market Data Enrichment

1. Create a data enrichment action

```javascript
// enrichWithMarketData action
export default async function(context, params) {
  const { itemIds } = params;
  
  const items = await context.models.PriceItem.findMany({
    where: { id: { in: itemIds } }
  });
  
  const enrichedItems = await Promise.all(
    items.map(async (item) => {
      // Get market data from external API
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
    })
  );
  
  return { 
    success: true, 
    count: enrichedItems.length 
  };
}

// Helper function to fetch market data
async function fetchMarketData(sku, name) {
  // Implement API call to market data provider
  // For now, return mock data
  return {
    averagePrice: Math.random() * 100,
    competitorPrices: [
      Math.random() * 90,
      Math.random() * 110,
      Math.random() * 100
    ],
    pricePosition: Math.random() < 0.33 ? 'low' : Math.random() < 0.66 ? 'average' : 'high'
  };
}
```

## 8. Testing and Validation

### Create Testing Actions

1. Implement a test connection action

```javascript
// testConnection action
export default async function(context, params) {
  // Verify API key is valid
  if (!context.api.isAuthenticated) {
    throw new Error("Invalid API key");
  }
  
  // Return system status
  return {
    ready: true,
    timestamp: new Date(),
    environment: process.env.GADGET_ENVIRONMENT,
    user: context.currentUser ? {
      id: context.currentUser.id,
      email: context.currentUser.email
    } : null
  };
}
```

## 9. Production Deployment

### Preparing for Production

1. Configure environment variables in Gadget
2. Set up proper authentication and security
3. Update client code to use production endpoints

### Client Integration Updates

1. Replace mock implementations with real Gadget API calls
2. Update environment configuration
3. Implement proper error handling for production

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

## Conclusion

By following this guide, you should be able to successfully migrate your application to use Gadget.dev as a backend. This will provide enhanced capabilities, better scalability, and reduced maintenance overhead compared to custom server implementations.

For additional assistance, reference the [Gadget.dev documentation](https://docs.gadget.dev) or contact support.
