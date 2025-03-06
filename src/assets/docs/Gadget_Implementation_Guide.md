
# Supplier Price Watch - Gadget.dev Implementation Guide

## Table of Contents
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Implementation Steps](#implementation-steps)
  - [Gadget.dev Application Setup](#1-gadgetdev-application-setup)
  - [Frontend Integration](#2-frontend-integration)
  - [Error Handling and Fallbacks](#3-error-handling-and-fallbacks)
  - [Performance Optimization](#4-performance-optimization)
  - [Security Considerations](#5-security-considerations)
  - [Testing and Deployment](#6-testing-and-deployment)
- [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)
- [Migration from Existing Solution](#migration-from-existing-solution)
- [Advanced Integration Techniques](#advanced-integration-techniques)
- [Shopify Plus-Specific Integration](#shopify-plus-specific-integration)
- [Conclusion](#conclusion)

## Introduction

This guide provides developers with detailed instructions for implementing Gadget.dev integration with the Supplier Price Watch application. It covers both client-side (React) and Gadget-side implementations, with a focus on practical, production-ready code.

## Prerequisites

Before implementing Gadget.dev integration, ensure you have:

1. A Gadget.dev account and access to the Gadget dashboard
2. Appropriate permissions to create and manage applications in Gadget
3. Basic familiarity with the Gadget platform and its concepts
4. Understanding of React and TypeScript

## Implementation Steps

### 1. Gadget.dev Application Setup

Start by setting up your Gadget application:

#### Create a New Application
1. Go to the [Gadget.dev dashboard](https://app.gadget.dev)
2. Click "New Application"
3. Name your application (e.g., "Supplier-Price-Watch")
4. Select the "Standard" template

#### Set Up Data Models

Create the following models in your Gadget application:

**Product Model**:
```typescript
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

**SupplierFile Model**:
```typescript
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

**ShopifyConnection Model**:
```typescript
{
  id: 'string',
  shop: 'string',
  accessToken: 'string',
  isActive: 'boolean',
  lastConnected: 'datetime'
}
```

#### Create Gadget Actions

Create these custom actions in your Gadget application:

**processPdfDocument**:
- Input: `fileId` (ID of the uploaded PDF file)
- Output: Array of extracted products
- Implementation:
  ```javascript
  action("processPdfDocument", async ({ params, record, logger }) => {
    const { fileId } = params;
    
    // Get file from storage
    const file = await gadget.storage.get(fileId);
    if (!file) {
      throw new Error("File not found");
    }
    
    // Process PDF content using document processing API
    const extractedData = await gadget.services.documentProcessing.extractTables({
      file: file.content,
      options: {
        useOCR: true,
        detectHeaders: true
      }
    });
    
    // Transform extracted data into product objects
    const products = extractedData.tables.flatMap(table => {
      return table.rows.map(row => {
        // Map columns to product fields based on detected headers
        return {
          sku: row.sku || row.SKU || row["Item Code"] || "",
          name: row.name || row.Name || row.Description || "",
          oldPrice: parseFloat(row.oldPrice || row["Old Price"] || row["Current Price"] || "0"),
          newPrice: parseFloat(row.newPrice || row["New Price"] || row.Price || "0"),
          // Calculate other fields
          status: calculatePriceStatus(row),
          difference: calculatePriceDifference(row),
          isMatched: false // Will be determined later
        };
      });
    });
    
    return { products };
  });
  ```

**enrichMarketData**:
- Input: Array of product objects
- Output: Products enriched with market data
- Implementation:
  ```javascript
  action("enrichMarketData", async ({ params, logger }) => {
    const { products } = params;
    
    // Process in batches to avoid timeouts
    const batchSize = 10;
    const enrichedProducts = [];
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      // Process batch in parallel
      const batchResults = await Promise.all(batch.map(async (product) => {
        try {
          // Get market data from external API
          const marketData = await gadget.services.fetch(`https://market-api.example.com/products?sku=${product.sku}`);
          
          // Enrich product with market data
          return {
            ...product,
            marketData: {
              pricePosition: calculatePricePosition(product.newPrice, marketData.prices),
              averagePrice: calculateAverage(marketData.prices),
              minPrice: Math.min(...marketData.prices),
              maxPrice: Math.max(...marketData.prices),
              competitorPrices: marketData.prices
            }
          };
        } catch (error) {
          logger.error(`Error enriching product ${product.sku}:`, error);
          // Return product without enrichment if there's an error
          return product;
        }
      }));
      
      enrichedProducts.push(...batchResults);
    }
    
    return { products: enrichedProducts };
  });
  ```

**syncToShopify**:
- Input: ShopifyConnection details, array of products
- Output: Success/failure status
- Implementation:
  ```javascript
  action("syncToShopify", async ({ params, connections, logger }) => {
    const { shop, products } = params;
    
    // Get Shopify connection
    const shopifyConnection = await connections.shopify.get(shop);
    if (!shopifyConnection) {
      throw new Error("Shopify connection not found");
    }
    
    // Initialize Shopify client
    const shopify = await connections.shopify.client(shopifyConnection);
    
    // Process in batches
    const batchSize = 50;
    let successCount = 0;
    let failureCount = 0;
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      // Use bulk operations API for large datasets
      const bulkOperation = await shopify.graphql(`
        mutation {
          bulkOperationRunMutation(
            mutation: """
              ${batch.map((product, index) => `
                _${index}: productUpdate(input: {
                  id: "gid://shopify/Product/${product.shopifyId}",
                  variants: [
                    { id: "gid://shopify/ProductVariant/${product.variantId}", price: "${product.newPrice}" }
                  ]
                }) {
                  product { id }
                  userErrors { field, message }
                }
              `).join('\n')}
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
      `);
      
      // Track results
      if (bulkOperation.userErrors && bulkOperation.userErrors.length > 0) {
        failureCount += bulkOperation.userErrors.length;
        logger.error("Bulk operation errors:", bulkOperation.userErrors);
      } else {
        successCount += batch.length;
      }
    }
    
    return { 
      success: failureCount === 0,
      stats: {
        total: products.length,
        success: successCount,
        failure: failureCount
      }
    };
  });
  ```

#### Configure Connections

If using Shopify Plus integration:

1. Go to Connections in Gadget dashboard
2. Add Shopify connection
3. Configure scopes for products, inventory, etc.
4. Set up webhook receivers if needed

### 2. Frontend Integration

Next, configure the frontend application to connect with your Gadget implementation:

#### Install Gadget SDK

```bash
npm install @gadget-client/[your-app-slug]
```

#### Update Configuration Component

Ensure the `GadgetConfigForm.tsx` component can store:
- App ID
- API Key
- Environment (development/production)
- Feature flags

#### Replace Mock Implementations

Update `gadgetApi.ts` to use the real Gadget SDK:

```typescript
import { createClient } from '@gadget-client/[your-app-slug]';
import type { PriceItem, ShopifyContext, GadgetConfig } from '@/types/price';
import { getGadgetConfig } from '@/utils/gadget-helpers';
import { toast } from 'sonner';

/**
 * Initialize the Gadget client using the stored configuration
 */
export const initGadgetClient = () => {
  const config = getGadgetConfig();
  if (!config) return null;

  try {
    return createClient({ 
      apiKey: config.apiKey,
      environment: config.environment,
      enableNetworkLogs: config.environment === 'development'
    });
  } catch (error) {
    console.error("Error initializing Gadget client:", error);
    return null;
  }
};

/**
 * Process PDF file through Gadget
 */
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
    
    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(`File upload failed: ${errorData.message || uploadResponse.statusText}`);
    }
    
    const { fileId } = await uploadResponse.json();
    
    // Process the PDF with Gadget action
    const result = await client.mutate.processPdfDocument({
      fileId: fileId
    });
    
    if (result.error) {
      throw new Error(`PDF processing failed: ${result.error.message}`);
    }
    
    return result.data.products;
  } catch (error) {
    console.error("Error processing PDF with Gadget:", error);
    throw new Error(`Failed to process PDF file: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};
```

### 3. Error Handling and Fallbacks

Implement proper error handling and fallbacks:

#### Connection Status Checking

```typescript
export const checkGadgetConnection = async (): Promise<boolean> => {
  const client = initGadgetClient();
  if (!client) return false;
  
  try {
    const response = await fetch(
      `https://${client.config.appId}.gadget.app/api/status`,
      {
        headers: { 'Authorization': `Bearer ${client.config.apiKey}` },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      }
    );
    
    if (!response.ok) {
      console.warn(`Gadget status check failed: ${response.status} ${response.statusText}`);
      return false;
    }
    
    const data = await response.json();
    return data.ready === true;
  } catch (error) {
    console.error("Gadget connection check error:", error);
    return false;
  }
};
```

#### Graceful Fallbacks with Retry Logic

```typescript
export const processFile = async (file: File): Promise<PriceItem[]> => {
  const maxRetries = 3;
  let retryCount = 0;
  
  // Try Gadget first with retries
  if (isGadgetInitialized()) {
    while (retryCount < maxRetries) {
      try {
        return await processPdfWithGadget(file);
      } catch (error) {
        retryCount++;
        console.warn(`Gadget processing attempt ${retryCount} failed:`, error);
        
        if (retryCount >= maxRetries) {
          console.warn("All Gadget processing attempts failed, falling back to local processing");
          break;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
      }
    }
  }
  
  // Fallback to local processing
  return processFileLocally(file);
};
```

### 4. Performance Optimization

Optimize your implementation for performance:

#### Batch Processing

For large datasets, use Gadget's batch processing capabilities:

```typescript
export const batchProcess = async <T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  options = { 
    batchSize: 50,
    concurrency: 5,
    retryCount: 3,
    retryDelay: 1000,
    onProgress: (processed: number, total: number) => void
  }
): Promise<R[]> => {
  const client = initGadgetClient();
  if (!client) {
    throw new Error("Gadget configuration required");
  }
  
  const { batchSize, concurrency, retryCount, retryDelay, onProgress } = options;
  
  // Split items into batches
  const batches = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  
  const results: R[] = [];
  let processed = 0;
  const total = items.length;
  
  // Process batches with limited concurrency
  await Promise.all(
    batches.map(async (batch, batchIndex) => {
      // Wait for your turn based on concurrency limit
      await new Promise(resolve => 
        setTimeout(resolve, Math.floor(batchIndex / concurrency) * 1000)
      );
      
      try {
        const batchResult = await client.mutate.batchProcess({
          items: batch,
          processorFunction: processFn.toString(),
          options: { retryCount, retryDelay }
        });
        
        if (batchResult.error) {
          throw new Error(`Batch processing failed: ${batchResult.error.message}`);
        }
        
        processed += batch.length;
        if (onProgress) onProgress(processed, total);
        
        results.push(...batchResult.data.results);
      } catch (error) {
        console.error(`Error processing batch ${batchIndex}:`, error);
        throw error;
      }
    })
  );
  
  return results;
};
```

#### Background Jobs

For time-consuming operations, use Gadget background jobs:

```typescript
export const startBackgroundProcess = async (
  fileId: string,
  options = { pollInterval: 2000, maxPolls: 30 }
): Promise<PriceItem[]> => {
  const client = initGadgetClient();
  if (!client) {
    throw new Error("Gadget configuration required");
  }
  
  try {
    // Start background job
    const jobResult = await client.mutate.startBackgroundJob({
      action: "processPdfDocument",
      params: { fileId },
      callbackUrl: window.location.origin + "/api/gadget-callback"
    });
    
    if (jobResult.error) {
      throw new Error(`Failed to start background job: ${jobResult.error.message}`);
    }
    
    const jobId = jobResult.data.jobId;
    
    // Poll for completion
    const { pollInterval, maxPolls } = options;
    let pollCount = 0;
    
    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          const statusResult = await client.query.getBackgroundJobStatus({
            jobId
          });
          
          if (statusResult.error) {
            throw new Error(`Job status check failed: ${statusResult.error.message}`);
          }
          
          const status = statusResult.data.status;
          
          if (status === 'completed') {
            // Job completed, fetch results
            const resultData = await client.query.getBackgroundJobResult({
              jobId
            });
            
            resolve(resultData.data.products);
          } else if (status === 'failed') {
            reject(new Error(`Background job failed: ${statusResult.data.error || "Unknown error"}`));
          } else if (pollCount < maxPolls) {
            // Continue polling
            pollCount++;
            setTimeout(checkStatus, pollInterval);
          } else {
            // Exceeded max polls
            reject(new Error("Background job timed out"));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      // Start polling
      checkStatus();
    });
  } catch (error) {
    console.error("Error with background process:", error);
    throw error;
  }
};
```

### 5. Security Considerations

Implement proper security measures:

#### API Key Management

- Store API keys securely
- Use environment-specific keys
- Set appropriate permissions

```typescript
// Safe API key handling
export const secureGadgetConfig = (config: GadgetConfig): GadgetConfig => {
  // Validate key format
  if (!config.apiKey.match(/^gsk_[a-zA-Z0-9]{32}$/)) {
    throw new Error("Invalid API key format");
  }
  
  // Mask API key in logs
  const maskedKey = config.apiKey.substring(0, 6) + '...' + 
    config.apiKey.substring(config.apiKey.length - 4);
  console.log(`Configuring Gadget with app ID ${config.appId} and key ${maskedKey}`);
  
  // Return validated config
  return config;
};
```

#### Data Handling

- Validate all inputs before sending to Gadget
- Handle sensitive data appropriately
- Implement proper error handling

```typescript
// Secure data handling example
export const validateAndPreparePriceData = (items: PriceItem[]): PriceItem[] => {
  return items.map(item => {
    // Validate required fields
    if (!item.sku) throw new Error("SKU is required");
    if (typeof item.newPrice !== 'number') throw new Error("New price must be a number");
    if (item.newPrice < 0) throw new Error("Price cannot be negative");
    
    // Sanitize data
    return {
      ...item,
      sku: item.sku.trim(),
      name: item.name ? item.name.trim() : '',
      // Ensure values are properly typed
      newPrice: Number(item.newPrice),
      oldPrice: typeof item.oldPrice === 'number' ? item.oldPrice : 0,
      difference: typeof item.difference === 'number' ? item.difference : 0,
    };
  });
};
```

#### CORS Configuration

- Configure CORS settings in Gadget to allow requests from your frontend
- Example Gadget CORS configuration:

```javascript
// In Gadget environment settings
{
  cors: {
    allowedOrigins: [
      "https://your-app-domain.com",
      "https://staging.your-app-domain.com",
      "http://localhost:5173"  // For development
    ],
    allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length", "X-Gadget-Request-Id"],
    credentials: true,
    maxAge: 86400  // 24 hours
  }
}
```

### 6. Testing and Deployment

Thoroughly test your implementation:

#### Unit Testing

```typescript
// Example unit test for Gadget client initialization
describe('Gadget Client', () => {
  beforeEach(() => {
    // Mock localStorage
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'gadgetConfig') {
        return JSON.stringify({
          apiKey: 'gsk_testkey12345',
          appId: 'test-app',
          environment: 'development'
        });
      }
      return null;
    });
  });
  
  it('should initialize client with valid config', () => {
    const client = initGadgetClient();
    expect(client).not.toBeNull();
    expect(client.config.apiKey).toBe('gsk_testkey12345');
  });
  
  it('should return null with invalid config', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    const client = initGadgetClient();
    expect(client).toBeNull();
  });
});
```

#### Integration Testing

```typescript
// Example integration test for PDF processing
describe('PDF Processing', () => {
  it('should process PDF file successfully', async () => {
    // Mock file
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    
    // Mock fetch responses
    global.fetch = jest.fn()
      .mockImplementationOnce(async () => ({
        ok: true,
        json: async () => ({ fileId: 'test-file-id' })
      }))
      .mockImplementationOnce(async () => ({
        ok: true,
        json: async () => ({ products: [{ sku: 'TEST-001', name: 'Test Product' }] })
      }));
    
    const result = await processPdfWithGadget(file);
    
    expect(result).toBeDefined();
    expect(result[0].sku).toBe('TEST-001');
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  
  it('should handle file upload errors', async () => {
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    
    global.fetch = jest.fn().mockImplementationOnce(async () => ({
      ok: false,
      statusText: 'Bad Request',
      json: async () => ({ message: 'Invalid file format' })
    }));
    
    await expect(processPdfWithGadget(file)).rejects.toThrow('File upload failed');
  });
});
```

#### End-to-End Testing

```typescript
// Example E2E test with Cypress
describe('Gadget Integration', () => {
  beforeEach(() => {
    // Set up mock data
    cy.intercept('POST', '**/api/files/upload', { fileId: 'mock-file-id' }).as('uploadFile');
    cy.intercept('POST', '**/api/processPdfDocument', { products: [] }).as('processFile');
    
    // Visit app with Gadget configured
    cy.window().then(win => {
      win.localStorage.setItem('gadgetConfig', JSON.stringify({
        apiKey: 'test-key',
        appId: 'test-app',
        environment: 'development'
      }));
    });
    cy.visit('/upload');
  });
  
  it('should upload and process PDF file', () => {
    // Upload file
    cy.get('input[type=file]').attachFile('test.pdf');
    cy.get('[data-test=upload-button]').click();
    
    // Check requests were made
    cy.wait('@uploadFile');
    cy.wait('@processFile');
    
    // Verify UI updated
    cy.get('[data-test=processing-success-message]').should('be.visible');
    cy.get('[data-test=price-table]').should('exist');
  });
});
```

#### Deployment Checklist

1. **Verify Environment Configuration**
   - Ensure production vs. development settings are correct
   - Check API key permissions for production environment

2. **Performance Testing**
   - Test with realistic data volumes
   - Verify batch processing works efficiently
   - Check background jobs complete properly

3. **Security Audit**
   - Verify API keys are stored securely
   - Check data validation is thorough
   - Ensure sensitive data is handled appropriately

4. **Error Handling**
   - Test all fallback mechanisms
   - Verify graceful degradation when Gadget is unavailable
   - Check retry mechanisms work properly

5. **Documentation**
   - Update implementation documentation with any changes
   - Document deployment-specific configuration
   - Create user guides for the integration features

## Common Pitfalls and Solutions

### 1. Authentication Issues

**Problem**: Authentication failures with Gadget API.

**Solution**:
- Verify API key is valid and has not expired
- Check that API key has proper permissions
- Ensure correct environment (development/production)
- Look for CORS issues if running in a browser

**Detailed Fix**:
```typescript
export const troubleshootAuthentication = async (): Promise<{
  status: 'success' | 'error';
  details: string;
  resolution?: string;
}> => {
  const config = getGadgetConfig();
  if (!config) {
    return {
      status: 'error',
      details: 'Missing Gadget configuration',
      resolution: 'Configure Gadget in the application settings'
    };
  }
  
  try {
    const response = await fetch(
      `https://${config.appId}.gadget.app/api/status`,
      {
        headers: { 'Authorization': `Bearer ${config.apiKey}` }
      }
    );
    
    if (response.status === 401) {
      return {
        status: 'error',
        details: 'API key is invalid or expired',
        resolution: 'Generate a new API key in the Gadget dashboard'
      };
    } else if (response.status === 403) {
      return {
        status: 'error',
        details: 'API key has insufficient permissions',
        resolution: 'Check API key permissions in the Gadget dashboard'
      };
    } else if (!response.ok) {
      return {
        status: 'error',
        details: `HTTP error ${response.status}: ${response.statusText}`,
        resolution: 'Check Gadget application status and configuration'
      };
    }
    
    return {
      status: 'success',
      details: 'Authentication successful'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      status: 'error',
      details: `Connection error: ${errorMessage}`,
      resolution: 'Check network connection and Gadget application status'
    };
  }
};
```

### 2. Rate Limiting

**Problem**: Hitting Gadget API rate limits.

**Solution**:
- Implement batch processing for large operations
- Add retry logic with exponential backoff
- Use background jobs for heavy processing
- Monitor API usage and adjust request patterns

**Detailed Implementation**:
```typescript
// Rate limit detection and handling
export const handleRateLimiting = async <T>(
  operation: () => Promise<T>,
  options = { maxRetries: 5, initialDelay: 1000 }
): Promise<T> => {
  const { maxRetries, initialDelay } = options;
  let retries = 0;
  
  while (true) {
    try {
      return await operation();
    } catch (error) {
      const isRateLimit = 
        error instanceof Error && 
        (error.message.includes('rate limit') || 
         (error instanceof Response && error.status === 429));
      
      if (!isRateLimit || retries >= maxRetries) {
        throw error;
      }
      
      // Exponential backoff with jitter
      const delay = initialDelay * Math.pow(2, retries) * (0.5 + Math.random());
      console.warn(`Rate limited, retrying in ${Math.round(delay)}ms (${retries + 1}/${maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
    }
  }
};
```

### 3. Data Inconsistencies

**Problem**: Data structure mismatches between frontend and Gadget.

**Solution**:
- Define consistent data models
- Validate data before sending to Gadget
- Transform data as needed in both directions
- Use TypeScript interfaces to enforce consistency

**Type-Safe Implementation**:
```typescript
// Define shared interfaces
interface GadgetProduct {
  id?: string;
  sku: string;
  name: string;
  oldPrice: number;
  newPrice: number;
  status: 'increased' | 'decreased' | 'unchanged' | 'new' | 'discontinued' | 'anomaly';
  difference: number;
  isMatched: boolean;
  marketData?: {
    pricePosition: 'low' | 'average' | 'high';
    averagePrice: number;
    minPrice: number;
    maxPrice: number;
    competitorPrices: number[];
  };
}

// Transform functions for data consistency
export const toGadgetProduct = (item: PriceItem): GadgetProduct => {
  return {
    sku: item.sku,
    name: item.name || '',
    oldPrice: item.oldPrice || 0,
    newPrice: item.newPrice || 0,
    status: item.status || 'unchanged',
    difference: typeof item.difference === 'number' ? item.difference : 0,
    isMatched: Boolean(item.isMatched)
  };
};

export const fromGadgetProduct = (gadgetProduct: GadgetProduct): PriceItem => {
  return {
    id: gadgetProduct.id || gadgetProduct.sku,
    sku: gadgetProduct.sku,
    name: gadgetProduct.name,
    oldPrice: gadgetProduct.oldPrice,
    newPrice: gadgetProduct.newPrice,
    status: gadgetProduct.status,
    difference: gadgetProduct.difference,
    isMatched: gadgetProduct.isMatched,
    marketData: gadgetProduct.marketData
  };
};
```

### 4. File Processing Errors

**Problem**: PDF processing failures.

**Solution**:
- Check file size and format
- Pre-process complex PDFs before uploading
- Implement fallback to manual data entry
- Provide detailed error messages

**Improved Error Handling**:
```typescript
export const processFileWithFallbacks = async (file: File): Promise<{
  success: boolean;
  items?: PriceItem[];
  errorType?: 'file_size' | 'file_format' | 'processing' | 'timeout' | 'unknown';
  errorMessage?: string;
  usedFallback?: boolean;
}> => {
  // Validate file
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    return {
      success: false,
      errorType: 'file_size',
      errorMessage: 'File size exceeds 10MB limit'
    };
  }
  
  if (file.type !== 'application/pdf' && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    return {
      success: false,
      errorType: 'file_format',
      errorMessage: 'Only PDF and Excel files are supported'
    };
  }
  
  try {
    // Try Gadget processing first
    if (isGadgetInitialized()) {
      try {
        const items = await processPdfWithGadget(file);
        return {
          success: true,
          items
        };
      } catch (gadgetError) {
        console.warn("Gadget processing failed, falling back to local processing:", gadgetError);
      }
    }
    
    // Fallback to local processing
    const items = await processFileLocally(file);
    return {
      success: true,
      items,
      usedFallback: true
    };
  } catch (error) {
    // Determine error type
    let errorType: 'processing' | 'timeout' | 'unknown' = 'unknown';
    let errorMessage = 'An unknown error occurred';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes('timeout')) {
        errorType = 'timeout';
      } else {
        errorType = 'processing';
      }
    }
    
    return {
      success: false,
      errorType,
      errorMessage
    };
  }
};
```

## Migration from Existing Solution

If migrating from a non-Gadget implementation:

### 1. Parallel Running

- Implement Gadget integration alongside existing solution
- Run both in parallel with feature flags
- Gradually shift traffic to Gadget-powered features

```typescript
// Feature flag implementation
export const shouldUseGadget = (feature: 'pdfProcessing' | 'dataEnrichment' | 'shopifySync'): boolean => {
  const config = getGadgetConfig();
  if (!config || !config.featureFlags) return false;
  
  const { rolloutPercentage = {} } = config.featureFlags;
  const percentage = rolloutPercentage[feature] || 0;
  
  // Deterministic decision based on user ID
  const userId = getUserId();
  if (!userId) return false;
  
  // Generate a consistent hash from userId and feature
  const hash = hashString(`${userId}-${feature}`);
  const normalizedHash = (hash % 100) / 100; // Between 0 and 1
  
  return normalizedHash < (percentage / 100);
};
```

### 2. Data Migration

- Export existing data
- Transform to match Gadget models
- Import into Gadget with validation

```typescript
// Data migration utility
export const migrateDataToGadget = async (
  existingData: ExistingDataFormat[],
  options = { batchSize: 100, validateOnly: false }
): Promise<{ 
  success: boolean; 
  migrated: number; 
  failed: number; 
  validationErrors: Record<string, string[]>;
}> => {
  const client = initGadgetClient();
  if (!client) {
    throw new Error("Gadget client not initialized");
  }
  
  const validationErrors: Record<string, string[]> = {};
  const migratedIds: string[] = [];
  const failedIds: string[] = [];
  
  // Transform data to Gadget format
  const transformedData = existingData.map(item => {
    try {
      return {
        sku: item.productCode,
        name: item.description,
        oldPrice: parseFloat(item.originalPrice),
        newPrice: parseFloat(item.currentPrice),
        status: mapStatus(item.statusCode),
        difference: parseFloat(item.priceDelta),
        isMatched: Boolean(item.matchedToStore)
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      validationErrors[item.productCode] = [errorMessage];
      return null;
    }
  }).filter(Boolean);
  
  if (options.validateOnly) {
    return { 
      success: Object.keys(validationErrors).length === 0,
      migrated: 0,
      failed: Object.keys(validationErrors).length,
      validationErrors
    };
  }
  
  // Process in batches
  const batches = [];
  for (let i = 0; i < transformedData.length; i += options.batchSize) {
    batches.push(transformedData.slice(i, i + options.batchSize));
  }
  
  for (const batch of batches) {
    try {
      const result = await client.mutate.batchCreateProducts({
        products: batch
      });
      
      if (result.error) {
        batch.forEach(item => {
          failedIds.push(item.sku);
          validationErrors[item.sku] = [result.error.message];
        });
      } else {
        // Check for individual errors
        result.data.products.forEach((product, index) => {
          if (product.errors && product.errors.length > 0) {
            failedIds.push(batch[index].sku);
            validationErrors[batch[index].sku] = product.errors.map(e => e.message);
          } else {
            migratedIds.push(batch[index].sku);
          }
        });
      }
    } catch (error) {
      console.error("Batch migration error:", error);
      batch.forEach(item => {
        failedIds.push(item.sku);
        validationErrors[item.sku] = [error instanceof Error ? error.message : 'Unknown error'];
      });
    }
  }
  
  return {
    success: failedIds.length === 0,
    migrated: migratedIds.length,
    failed: failedIds.length,
    validationErrors
  };
};
```

### 3. Feature Parity

- Ensure all existing features are implemented in Gadget
- Test feature parity thoroughly
- Document any differences or improvements

```typescript
// Feature parity testing utility
export const testFeatureParity = async (
  featureTests: Array<{
    name: string;
    legacyFn: (...args: any[]) => Promise<any>;
    gadgetFn: (...args: any[]) => Promise<any>;
    testArgs: any[];
    compareResults: (legacy: any, gadget: any) => boolean;
  }>
): Promise<Array<{
  feature: string;
  passed: boolean;
  details?: string;
}>> => {
  return Promise.all(featureTests.map(async test => {
    try {
      const [legacyResult, gadgetResult] = await Promise.all([
        test.legacyFn(...test.testArgs),
        test.gadgetFn(...test.testArgs)
      ]);
      
      const passed = test.compareResults(legacyResult, gadgetResult);
      
      return {
        feature: test.name,
        passed,
        details: passed ? undefined : 'Results do not match between legacy and Gadget implementation'
      };
    } catch (error) {
      return {
        feature: test.name,
        passed: false,
        details: `Error testing feature: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }));
};
```

## Advanced Integration Techniques

### 1. Webhooks

Set up Gadget webhooks to trigger actions in your frontend:

```typescript
// Webhook handler setup in Gadget
action("processComplete", async (request, { product }) => {
  try {
    // Process completed
    // Trigger webhook to notify frontend
    if (request.body.callbackUrl) {
      await fetch(request.body.callbackUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Gadget-Webhook-Secret': env.webhookSecret
        },
        body: JSON.stringify({ 
          event: 'process_complete', 
          data: { productId: product.id },
          timestamp: new Date().toISOString()
        })
      });
      
      return { success: true };
    }
  } catch (error) {
    request.logger.error("Webhook delivery failed:", error);
    return { success: false, error: error.message };
  }
});

// Frontend webhook listener setup
export const setupWebhookListener = (
  onEvent: (event: string, data: any) => void
): { cleanup: () => void } => {
  // For server-sent events (SSE)
  const eventSource = new EventSource('/api/gadget-webhook-events');
  
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onEvent(data.event, data.data);
    } catch (error) {
      console.error("Error parsing webhook event:", error);
    }
  };
  
  eventSource.onerror = (error) => {
    console.error("SSE connection error:", error);
    // Reconnect logic
    setTimeout(() => {
      eventSource.close();
      setupWebhookListener(onEvent);
    }, 5000);
  };
  
  return {
    cleanup: () => eventSource.close()
  };
};
```

### 2. Custom Gadget Actions

Create specialized actions for your business logic:

```typescript
// In Gadget app
action("calculateOptimalPrice", async (request, { product, marketData }) => {
  request.logger.info(`Calculating optimal price for product ${product.id}`);
  
  try {
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
      confidenceLevel: demandCurve.confidence,
      factors: {
        demandElasticity: demandCurve.elasticity,
        competitivePressure: competitivePosition.pressure,
        marketPosition: competitivePosition.position
      }
    };
  } catch (error) {
    request.logger.error("Optimal price calculation failed:", error);
    throw error;
  }
});

// Frontend integration
export const getOptimalPrice = async (product: PriceItem): Promise<{
  optimalPrice: number;
  projectedRevenue: number;
  confidenceLevel: number;
  factors: {
    demandElasticity: number;
    competitivePressure: number;
    marketPosition: string;
  };
}> => {
  const client = initGadgetClient();
  if (!client) {
    throw new Error("Gadget client not initialized");
  }
  
  try {
    const result = await client.mutate.calculateOptimalPrice({
      product: {
        id: product.id,
        sku: product.sku,
        name: product.name,
        currentPrice: product.newPrice,
        cost: product.cost || (product.newPrice * 0.6) // Estimate if not available
      },
      marketData: product.marketData || null
    });
    
    if (result.error) {
      throw new Error(`Optimal price calculation failed: ${result.error.message}`);
    }
    
    return result.data;
  } catch (error) {
    console.error("Error calculating optimal price:", error);
    throw error;
  }
};
```

### 3. Real-time Synchronization

Implement real-time data synchronization:

```typescript
// In frontend
export const subscribeToProductUpdates = (
  productId: string,
  onUpdate: (product: PriceItem) => void,
  onError: (error: Error) => void
): () => void => {
  const client = initGadgetClient();
  if (!client) {
    onError(new Error("Gadget client not initialized"));
    return () => {};
  }
  
  try {
    const subscription = client.subscribe.product({ id: productId }, (product) => {
      if (product) {
        onUpdate(fromGadgetProduct(product));
      }
    });
    
    return () => subscription.unsubscribe();
  } catch (error) {
    onError(error instanceof Error ? error : new Error("Unknown subscription error"));
    return () => {};
  }
};

// Usage example
const ProductDetail = ({ productId }) => {
  const [product, setProduct] = useState<PriceItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const unsubscribe = subscribeToProductUpdates(
      productId,
      (updatedProduct) => {
        setProduct(updatedProduct);
        toast.info("Product updated", {
          description: "Product information has been updated."
        });
      },
      (subscriptionError) => {
        setError(subscriptionError.message);
        toast.error("Subscription error", {
          description: "Could not subscribe to product updates."
        });
      }
    );
    
    return unsubscribe;
  }, [productId]);
  
  // Render component...
};
```

## Shopify Plus-Specific Integration

For Shopify Plus merchants, Gadget can provide enhanced capabilities:

### 1. Scripts Deployment

Use Gadget to manage Shopify Scripts:

```typescript
// Generate Ruby script for Shopify Scripts
export const generateRubyScript = (config: ScriptConfig): string => {
  return `
    # Generated by Supplier Price Watch
    
    # Configuration
    CAMPAIGN_NAME = "${config.name}"
    START_DATE = Time.parse("${config.startDate}")
    END_DATE = Time.parse("${config.endDate}")
    
    # Eligible products
    ELIGIBLE_PRODUCTS = [${config.productIds.map(id => `"${id}"`).join(', ')}]
    
    # Discount calculation
    if Input.cart.line_items.any?
      # Only run if date is valid
      if Time.now.between?(START_DATE, END_DATE)
        # Apply discount to eligible products
        Input.cart.line_items.each do |line_item|
          if ELIGIBLE_PRODUCTS.include?(line_item.variant.product.id)
            line_item.change_line_price(line_item.line_price * ${1 - config.discountPercentage / 100}, 
              message: "${config.discountMessage}")
          end
        end
      end
    end
    
    Output.cart = Input.cart
  `.trim();
};

// Deploy script to Shopify via Gadget
export const deployPricingScript = async (
  scriptConfig: ScriptConfig
): Promise<{
  success: boolean;
  scriptId?: string;
  error?: string;
}> => {
  const client = initGadgetClient();
  if (!client) {
    return { success: false, error: "Gadget client not initialized" };
  }
  
  try {
    const result = await client.mutate.deployShopifyScript({
      scriptType: "line-item-discount",
      scriptContent: generateRubyScript(scriptConfig),
      description: `Price rules for ${scriptConfig.name}`,
      shop: scriptConfig.shop
    });
    
    if (result.error) {
      return { success: false, error: result.error.message };
    }
    
    return { 
      success: true,
      scriptId: result.data.scriptId
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error deploying script:", error);
    return { success: false, error: errorMessage };
  }
};
```

### 2. Flow Automation

Create and manage Shopify Flows:

```typescript
// Create a Shopify Flow for price change automation
export const createPriceChangeFlow = async (
  flowConfig: FlowConfig
): Promise<{
  success: boolean;
  flowId?: string;
  error?: string;
}> => {
  const client = initGadgetClient();
  if (!client) {
    return { success: false, error: "Gadget client not initialized" };
  }
  
  try {
    const result = await client.mutate.createShopifyFlow({
      shop: flowConfig.shop,
      flow: {
        name: flowConfig.name,
        trigger: {
          type: "product_updated",
          filter: {
            field: "price",
            operator: "changed"
          }
        },
        conditions: [
          {
            field: "price_increase_percentage",
            operator: "greater_than",
            value: flowConfig.thresholdPercentage.toString()
          },
          {
            field: "product_type",
            operator: "equals",
            value: flowConfig.productType
          }
        ],
        actions: [
          {
            type: "email",
            settings: {
              recipient: flowConfig.notificationEmail,
              subject: `Price Increase Alert: {{product.title}}`,
              body: `
                <p>A product price has been significantly increased:</p>
                <ul>
                  <li><strong>Product:</strong> {{product.title}}</li>
                  <li><strong>SKU:</strong> {{product.sku}}</li>
                  <li><strong>Old Price:</strong> {{product.price_before_update}}</li>
                  <li><strong>New Price:</strong> {{product.price}}</li>
                  <li><strong>Increase:</strong> {{product.price_increase_percentage}}%</li>
                </ul>
                <p>Please review this change as soon as possible.</p>
              `
            }
          }
        ]
      }
    });
    
    if (result.error) {
      return { success: false, error: result.error.message };
    }
    
    return { 
      success: true,
      flowId: result.data.flowId
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating flow:", error);
    return { success: false, error: errorMessage };
  }
};
```

### 3. Metafield Management

Handle complex metafield data via Gadget:

```typescript
// Store price history in Shopify metafields via Gadget
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
        },
        {
          namespace: "price_watch",
          key: "price_change_percentage",
          value: calculatePriceChangePercentage(priceHistory).toString(),
          type: "number_decimal"
        }
      ]
    });
    
    return !result.error;
  } catch (error) {
    console.error("Error updating metafields:", error);
    return false;
  }
};

// Helper function to retrieve price history
export const getPriceHistory = async (productId: string): Promise<PriceHistoryEntry[]> => {
  const client = initGadgetClient();
  if (!client) return [];
  
  try {
    const result = await client.query.getShopifyMetafield({
      productId,
      namespace: "price_watch",
      key: "price_history"
    });
    
    if (result.error || !result.data || !result.data.value) {
      return [];
    }
    
    try {
      return JSON.parse(result.data.value);
    } catch (parseError) {
      console.error("Error parsing price history:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Error retrieving price history:", error);
    return [];
  }
};
```

## Conclusion

This implementation guide provides a comprehensive roadmap for integrating Gadget.dev with the Supplier Price Watch application. By following these steps and best practices, you can create a robust, scalable, and maintainable integration that enhances the application's capabilities while providing resilience through fallback mechanisms.

The Gadget.dev integration particularly shines in three key areas:
1. **PDF processing and data extraction** - making supplier price list analysis more efficient
2. **Data enrichment with market information** - providing valuable competitive context
3. **Shopify integration** - streamlining the update of product prices in your store

For further assistance, refer to:
- [Gadget.dev Documentation](https://docs.gadget.dev)
- [Gadget API Reference](https://docs.gadget.dev/api)
- [Supplier Price Watch Technical Documentation](./TechnicalDocumentation.md)
