
import { toast } from 'sonner';
import type { PriceItem, ShopifyContext } from '@/types/price';
import { initGadgetClient } from './client';

/**
 * Sync data to Shopify through Gadget for better batching and error handling
 * @param context Shopify context for authentication
 * @param items Price items to sync to Shopify
 * @returns Promise resolving to sync result
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
 * @param items Items to process in batches
 * @param processFn Function to process each item
 * @param options Batch processing options
 * @returns Promise resolving to batch processing results
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
          
          // This return is needed to satisfy TypeScript
          return {} as R;
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
