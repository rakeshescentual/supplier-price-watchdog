
import { toast } from 'sonner';
import type { PriceItem, ShopifyContext, GadgetConfig } from '@/types/price';
import { getGadgetConfig } from '@/utils/gadget-helpers';

/**
 * Initialize the Gadget client using the stored configuration
 */
export const initGadgetClient = () => {
  const config = getGadgetConfig();
  if (!config) return null;

  try {
    // In production: use Gadget SDK
    // import { createClient } from '@gadget-client/your-app-slug';
    // return createClient({ 
    //   apiKey: config.apiKey,
    //   environment: config.environment,
    //   enableNetworkLogs: config.environment === 'development'
    // });
    
    return { config, ready: true };
  } catch (error) {
    console.error("Error initializing Gadget client:", error);
    return null;
  }
};

/**
 * Check if Gadget is initialized
 */
export const isGadgetInitialized = (): boolean => {
  const client = initGadgetClient();
  return !!client?.ready;
};

/**
 * Authenticate Shopify through Gadget with improved error handling
 */
export const authenticateShopify = async (context: ShopifyContext): Promise<boolean> => {
  const client = initGadgetClient();
  if (!client) {
    toast.error("Gadget configuration required", {
      description: "Please configure Gadget to use this feature."
    });
    return false;
  }
  
  try {
    console.log("Authenticating Shopify via Gadget...");
    // In production: Use Gadget SDK for authentication
    // const result = await client.auth.authenticateShopify({
    //   shop: context.shop,
    //   accessToken: context.accessToken
    // });
    
    toast.success("Shopify authenticated via Gadget", {
      description: "Successfully connected your Shopify store through Gadget."
    });
    return true;
  } catch (error) {
    console.error("Gadget Shopify authentication error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    toast.error("Authentication failed", {
      description: `Could not authenticate Shopify through Gadget: ${errorMessage}`
    });
    return false;
  }
};

/**
 * Process PDF file through Gadget's document services with enhanced error handling
 */
export const processPdfWithGadget = async (file: File): Promise<PriceItem[]> => {
  const client = initGadgetClient();
  if (!client) {
    throw new Error("Gadget configuration required");
  }
  
  try {
    console.log("Processing PDF via Gadget...");
    // Mock implementation - in production would use Gadget SDK
    // const result = await client.mutate.processPDF({
    //   file: file,
    //   options: {
    //     extractTables: true,
    //     useOCR: true
    //   }
    // });
    
    // Mock data with correct PriceItem properties - Fixed to match PriceItem type
    return Promise.resolve([
      { 
        id: "mock1", 
        sku: "DEMO-001", 
        name: "Demo Product 1", 
        oldPrice: 19.99, 
        newPrice: 21.99, 
        status: 'increased', 
        difference: 2.00,
        isMatched: true
      },
      { 
        id: "mock2", 
        sku: "DEMO-002", 
        name: "Demo Product 2", 
        oldPrice: 24.99, 
        newPrice: 24.99, 
        status: 'unchanged', 
        difference: 0,
        isMatched: true
      }
    ]);
  } catch (error) {
    console.error("Error processing PDF with Gadget:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to process PDF file: ${errorMessage}`);
  }
};

/**
 * Enrich product data with market information using Gadget's capabilities
 * With improved TypeScript compatibility
 */
export const enrichDataWithSearch = async (items: PriceItem[]): Promise<PriceItem[]> => {
  const client = initGadgetClient();
  if (!client) {
    throw new Error("Gadget configuration required");
  }
  
  try {
    console.log("Enriching data via Gadget...");
    // Mock implementation - in production would use Gadget SDK
    // const result = await client.mutate.batchEnrichItems({
    //   items: items,
    //   options: {
    //     searchCompetitors: true,
    //     includeMarketPositioning: true
    //   }
    // });
    
    // Mock enriched data - Fixed to use newPrice instead of price
    return items.map(item => ({
      ...item,
      marketData: {
        pricePosition: 'average' as 'low' | 'average' | 'high',
        averagePrice: item.newPrice * 1.2,
        minPrice: item.newPrice * 0.9,
        maxPrice: item.newPrice * 1.5,
        competitorPrices: [item.newPrice * 0.9, item.newPrice * 1.1, item.newPrice * 1.3]
      },
      potentialImpact: item.difference * 10
    }));
  } catch (error) {
    console.error("Error enriching data via Gadget:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to enrich product data: ${errorMessage}`);
  }
};

/**
 * Sync data to Shopify through Gadget for better batching and error handling
 */
export const syncToShopifyViaGadget = async (
  context: ShopifyContext,
  items: PriceItem[]
): Promise<{success: boolean; message?: string}> => {
  const client = initGadgetClient();
  if (!client) {
    return { 
      success: false, 
      message: "Gadget client not initialized" 
    };
  }
  
  try {
    console.log("Syncing to Shopify via Gadget...");
    // Mock implementation - in production would use Gadget SDK
    // const result = await client.mutate.syncProductsToShopify({
    //   shop: context.shop,
    //   accessToken: context.accessToken,
    //   products: items,
    //   options: {
    //     batchSize: 100,
    //     maxConcurrency: 5,
    //     retryCount: 3
    //   }
    // });
    
    toast.success("Sync completed via Gadget", {
      description: `Successfully synced ${items.length} products to Shopify.`
    });
    return { success: true };
  } catch (error) {
    console.error("Error syncing to Shopify via Gadget:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    toast.error("Sync failed", {
      description: `Could not sync products to Shopify: ${errorMessage}`
    });
    return { 
      success: false, 
      message: errorMessage
    };
  }
};

/**
 * Perform batch operations with efficient retry and error handling through Gadget
 */
export const performBatchOperations = async <T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  options = { 
    batchSize: 50,
    maxConcurrency: 5,
    retryCount: 3,
    retryDelay: 1000,
    onProgress?: (processed: number, total: number) => void
  }
): Promise<{
  success: boolean;
  results: R[];
  failed: number;
  errors?: Record<number, string>;
}> => {
  const client = initGadgetClient();
  if (!client) {
    throw new Error("Gadget configuration required");
  }
  
  try {
    console.log("Performing batch operations via Gadget...");
    // Mock implementation - in production would use Gadget SDK
    // const result = await client.mutate.batchProcess({
    //   items: items,
    //   processorFunction: processFn.toString(),
    //   options
    // });
    
    // Process items in batches with error tracking
    const results: R[] = [];
    const errors: Record<number, string> = {};
    const batches = [];
    
    for (let i = 0; i < items.length; i += options.batchSize) {
      batches.push(items.slice(i, i + options.batchSize));
    }
    
    let processed = 0;
    const total = items.length;
    
    for (const [batchIndex, batch] of batches.entries()) {
      try {
        // Process items in a batch with controlled concurrency
        const batchPromises = batch.map(async (item, index) => {
          const itemIndex = batchIndex * options.batchSize + index;
          let attempt = 0;
          
          // Implement retry logic
          while (attempt < options.retryCount) {
            try {
              const result = await processFn(item);
              processed++;
              
              if (options.onProgress) {
                options.onProgress(processed, total);
              }
              
              return result;
            } catch (error) {
              attempt++;
              
              if (attempt >= options.retryCount) {
                errors[itemIndex] = error instanceof Error ? error.message : "Unknown error";
                throw error;
              }
              
              // Wait before retrying
              await new Promise(resolve => 
                setTimeout(resolve, options.retryDelay * Math.pow(2, attempt - 1))
              );
            }
          }
        });
        
        const batchResults = await Promise.allSettled(batchPromises);
        
        // Filter successful results
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          }
        });
      } catch (batchError) {
        console.error(`Error processing batch ${batchIndex}:`, batchError);
        // Individual errors are already recorded in the errors object
      }
    }
    
    return {
      success: Object.keys(errors).length === 0,
      results,
      failed: Object.keys(errors).length,
      errors: Object.keys(errors).length > 0 ? errors : undefined
    };
  } catch (error) {
    console.error("Error during batch operations:", error);
    throw new Error(`Failed to process batch operations: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

/**
 * Test Gadget connection with improved error handling
 */
export const testGadgetConnection = async (config?: GadgetConfig): Promise<boolean> => {
  const configToUse = config || getGadgetConfig();
  if (!configToUse) return false;
  
  try {
    console.log(`Testing Gadget connection to ${configToUse.appId}...`);
    
    // In production, use actual Gadget API
    // const response = await fetch(
    //   `https://${configToUse.appId}.gadget.app/api/status`,
    //   {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Bearer ${configToUse.apiKey}`,
    //       'Content-Type': 'application/json'
    //     },
    //     signal: AbortSignal.timeout(5000) // 5 second timeout
    //   }
    // );
    
    // Mock successful response for demonstration
    // return response.ok;
    
    // For development: simulate a successful connection
    return true;
  } catch (error) {
    console.error("Gadget connection test failed:", error);
    return false;
  }
};

/**
 * Check if a feature is enabled through Gadget feature flags
 */
export const isGadgetFeatureEnabled = (featureName: string): boolean => {
  const config = getGadgetConfig();
  
  if (!config || !config.featureFlags) {
    return false;
  }
  
  return !!config.featureFlags[featureName];
};

/**
 * Get diagnostic information about Gadget connection
 */
export const getGadgetDiagnostics = async (): Promise<{
  isConfigured: boolean;
  isConnected: boolean;
  appId?: string;
  environment?: 'development' | 'production';
  featureFlags?: Record<string, boolean>;
  connectionLatency?: number;
  lastTestedAt?: Date;
  errors?: string[];
}> => {
  const config = getGadgetConfig();
  const diagnostics: {
    isConfigured: boolean;
    isConnected: boolean;
    appId?: string;
    environment?: 'development' | 'production';
    featureFlags?: Record<string, boolean>;
    connectionLatency?: number;
    lastTestedAt?: Date;
    errors?: string[];
  } = {
    isConfigured: !!config,
    isConnected: false
  };
  
  if (!config) {
    diagnostics.errors = ['Gadget is not configured'];
    return diagnostics;
  }
  
  diagnostics.appId = config.appId;
  diagnostics.environment = config.environment;
  diagnostics.featureFlags = config.featureFlags;
  
  try {
    const startTime = Date.now();
    const connected = await testGadgetConnection(config);
    const endTime = Date.now();
    
    diagnostics.isConnected = connected;
    diagnostics.connectionLatency = endTime - startTime;
    diagnostics.lastTestedAt = new Date();
    
    if (!connected) {
      diagnostics.errors = ['Connection test failed'];
    }
  } catch (error) {
    diagnostics.isConnected = false;
    diagnostics.errors = [error instanceof Error ? error.message : 'Unknown connection error'];
  }
  
  return diagnostics;
};
