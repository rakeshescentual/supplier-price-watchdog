import type { PriceItem, ShopifyContext, GadgetConfig } from '@/types/price';
import { shopifyCache } from './api-cache';
import { getGadgetConfig, prepareGadgetRequest, getGadgetApiUrl } from '@/utils/gadget-helpers';
import { calculateBackoff } from '@/utils/connection-helpers';

// Initialize Gadget client
export const initGadgetClient = () => {
  const config = getGadgetConfig();
  if (!config) {
    console.warn("No Gadget configuration found");
    return null;
  }

  try {
    // In real implementation, this would use the Gadget SDK
    // import { createClient } from '@gadget-client/your-app-id';
    // return createClient({ 
    //   apiKey: config.apiKey,
    //   environment: config.environment,
    //   logger: config.environment === 'development' ? console : undefined
    // });
    
    console.log(`Initializing Gadget client for app ${config.appId} in ${config.environment} environment`);
    return {
      config,
      ready: true
    };
  } catch (error) {
    console.error("Error initializing Gadget client:", error);
    return null;
  }
};

// Check if Gadget is initialized
export const isGadgetInitialized = () => {
  const client = initGadgetClient();
  return !!client?.ready;
};

/**
 * Normalize error responses from Gadget
 */
export function normalizeGadgetError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  
  if (typeof error === 'string') {
    return new Error(error);
  }
  
  if (typeof error === 'object' && error !== null) {
    const anyError = error as any;
    if (anyError.message) {
      return new Error(anyError.message);
    }
    if (anyError.error) {
      return new Error(anyError.error);
    }
  }
  
  return new Error('Unknown Gadget API error');
}

/**
 * Type-safe wrapper for Gadget API calls with retries
 */
export async function callGadgetApi<T>(
  endpoint: string,
  options: RequestInit = {},
  config?: GadgetConfig,
  retryConfig = { maxRetries: 3, initialDelay: 300 }
): Promise<T> {
  const gadgetConfig = config || getGadgetConfig();
  if (!gadgetConfig) {
    throw new Error("Gadget configuration is missing");
  }
  
  const baseUrl = getGadgetApiUrl(gadgetConfig);
  const url = `${baseUrl}${endpoint}`;
  
  let retryCount = 0;
  
  while (true) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          ...prepareGadgetRequest(gadgetConfig).headers
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || errorJson.error || `HTTP error ${response.status}`);
        } catch (e) {
          throw new Error(`HTTP error ${response.status}: ${errorText}`);
        }
      }
      
      return await response.json() as T;
    } catch (error) {
      retryCount++;
      
      // Don't retry if we've reached the maximum number of retries
      if (retryCount >= retryConfig.maxRetries) {
        throw normalizeGadgetError(error);
      }
      
      // Calculate backoff time with exponential increase and jitter
      const delay = calculateBackoff(retryCount, retryConfig.initialDelay);
      console.warn(`Gadget API call failed, retrying in ${delay}ms (attempt ${retryCount} of ${retryConfig.maxRetries})`, error);
      
      // Wait before trying again
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Authenticate with Shopify via Gadget
 */
export const authenticateShopify = async (context: ShopifyContext) => {
  try {
    const client = initGadgetClient();
    if (!client) {
      console.warn("Gadget client not initialized");
      return false;
    }

    console.log("Authenticating with Shopify via Gadget...");
    
    // In a real implementation, this would use the Gadget SDK
    // Example: await client.mutate.authenticateShopify({ shop: context.shop, accessToken: context.accessToken });
    
    return true;
  } catch (error) {
    console.error("Error authenticating with Shopify via Gadget:", error);
    return false;
  }
};

/**
 * Fetch Shopify products using Gadget integration
 */
export const fetchShopifyProducts = async (context: ShopifyContext): Promise<any[]> => {
  try {
    const client = initGadgetClient();
    if (!client) {
      throw new Error("Gadget client not initialized");
    }

    console.log("Fetching Shopify products via Gadget...");
    
    // In a real implementation, this would use the Gadget SDK
    // Example: const result = await client.query.shopifyProducts();
    // return result.data.shopifyProducts;
    
    // For now, return mock data
    return [];
  } catch (error) {
    console.error("Error fetching Shopify products via Gadget:", error);
    throw error;
  }
};

/**
 * Sync data with Shopify using Gadget
 */
export const syncToShopifyViaGadget = async (context: ShopifyContext, items: PriceItem[]): Promise<{success: boolean}> => {
  try {
    const client = initGadgetClient();
    if (!client) {
      throw new Error("Gadget client not initialized");
    }

    console.log(`Syncing ${items.length} items to Shopify via Gadget...`);
    
    // In a real implementation, this would use the Gadget SDK to:
    // 1. Create a batch operation for efficiency
    // 2. Update the products in Shopify via Gadget
    // 3. Return success/failure details
    
    // Example:
    // const updates = items.map(item => ({
    //   id: item.shopifyId,
    //   price: item.newPrice.toString()
    // }));
    // const result = await client.mutate.bulkUpdateShopifyProducts({ products: updates });
    
    // For now, simulate success after 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true };
  } catch (error) {
    console.error("Error syncing Shopify products via Gadget:", error);
    return { success: false };
  }
};

/**
 * Process PDF files using Gadget's PDF processing capabilities
 */
export const processPdfWithGadget = async (file: File): Promise<PriceItem[]> => {
  try {
    const client = initGadgetClient();
    if (!client) {
      throw new Error("Gadget client not initialized");
    }

    console.log("Processing PDF with Gadget...");
    
    // In a real implementation, this would:
    // 1. Upload the PDF to Gadget using the file upload API
    // 2. Trigger a PDF processing action in Gadget
    // 3. Wait for and return the processed results
    
    // Example:
    // const formData = new FormData();
    // formData.append('file', file);
    // 
    // const response = await fetch(`https://${client.config.appId}.gadget.app/api/files/upload`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${client.config.apiKey}`
    //   },
    //   body: formData
    // });
    // 
    // const { fileId } = await response.json();
    // const result = await client.mutate.processPriceListPdf({ fileId });
    // return result.data.items;
    
    // For development, return an empty array
    console.log("PDF processing via Gadget is not implemented in this preview");
    return [];
  } catch (error) {
    console.error("Error processing PDF with Gadget:", error);
    throw error;
  }
};

/**
 * Enterprise-specific features for Shopify Plus via Gadget
 */
export const getShopifyPlusFeatures = async (context: ShopifyContext): Promise<any> => {
  try {
    const client = initGadgetClient();
    if (!client) {
      throw new Error("Gadget client not initialized");
    }

    console.log("Fetching Shopify Plus features via Gadget...");
    
    // In a real implementation, this would query Gadget for Shopify Plus specific features
    // Such as multi-location inventory, B2B functionality, etc.
    
    // For now, return mock data
    return {
      multiLocationInventory: true,
      b2bFunctionality: true,
      automatedDiscounts: true,
      scriptsEnabled: true,
      flowsEnabled: true,
      enterpriseAppsConnected: ['ERP System', 'Warehouse Management', 'Advanced Analytics']
    };
  } catch (error) {
    console.error("Error fetching Shopify Plus features:", error);
    throw error;
  }
};

/**
 * Enrich data with market information using search
 */
export const enrichDataWithSearch = async (items: PriceItem[]): Promise<PriceItem[]> => {
  try {
    const client = initGadgetClient();
    if (!client) {
      throw new Error("Gadget client not initialized");
    }
    
    console.log("Enriching data with market information...");
    
    // In a real implementation, this would use callGadgetApi to handle all the retry
    // and error normalization logic
    
    // For now, return mock data
    return items.map(item => ({
      ...item,
      marketData: {
        pricePosition: ['low', 'average', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'average' | 'high',
        competitorPrices: [
          item.newPrice * 0.9,
          item.newPrice * 1.0,
          item.newPrice * 1.1,
        ],
        averagePrice: item.newPrice * 1.05,
        minPrice: item.newPrice * 0.9,
        maxPrice: item.newPrice * 1.2
      },
      category: ['Fragrance', 'Skincare', 'Makeup', 'Haircare'][Math.floor(Math.random() * 4)]
    }));
  } catch (error) {
    console.error("Error enriching data with market information:", error);
    throw normalizeGadgetError(error);
  }
};

/**
 * Get market trends for a specific category
 */
export const getMarketTrends = async (category: string): Promise<any> => {
  try {
    const client = initGadgetClient();
    if (!client) {
      throw new Error("Gadget client not initialized");
    }
    
    console.log(`Getting market trends for category: ${category}`);
    
    // For now, return mock data
    return {
      category,
      trendData: {
        monthlyTrend: [10, 12, 15, 14, 17, 19],
        yearOverYear: 12.5,
        seasonality: 'high',
        marketShare: {
          yourBrand: 15,
          competitor1: 25,
          competitor2: 30,
          others: 30
        },
        priceIndexes: {
          average: 100,
          yourPosition: 95,
          recommendation: 102
        }
      }
    };
  } catch (error) {
    console.error(`Error getting market trends for ${category}:`, error);
    throw error;
  }
};

/**
 * Perform batch operations on items
 */
export const performBatchOperations = async <T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  options: {
    batchSize?: number;
    concurrency?: number;
    retryCount?: number;
    retryDelay?: number;
    onProgress?: (processed: number, total: number) => void;
  } = {}
): Promise<R[]> => {
  const {
    batchSize = 50,
    concurrency = 1,
    retryCount = 3,
    retryDelay = 1000,
    onProgress
  } = options;
  
  const results: R[] = [];
  const batches = [];
  
  // Split items into batches
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  
  // Process batches with configurable concurrency
  let processedCount = 0;
  const totalItems = items.length;
  
  // For serial processing (concurrency = 1)
  if (concurrency === 1) {
    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map(async (item) => {
          let attempts = 0;
          let lastError;
          
          // Implement retry logic
          while (attempts < retryCount) {
            try {
              const result = await processFn(item);
              processedCount++;
              if (onProgress) onProgress(processedCount, totalItems);
              return result;
            } catch (error) {
              lastError = error;
              attempts++;
              if (attempts < retryCount) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
              }
            }
          }
          
          throw lastError; // All attempts failed
        })
      ).catch(error => {
        console.error("Batch processing error:", error);
        throw error;
      });
      
      results.push(...batchResults);
    }
  } else {
    // Parallel processing with controlled concurrency
    // Implementation would use a library like p-limit for production
    // This is just a simplified example
    console.log(`Processing with concurrency of ${concurrency} not implemented in this preview`);
    
    // For non-concurrent processing as fallback
    for (const batch of batches) {
      const batchResults = await Promise.all(batch.map(processFn));
      processedCount += batch.length;
      if (onProgress) onProgress(processedCount, totalItems);
      results.push(...batchResults);
    }
  }
  
  return results;
};
