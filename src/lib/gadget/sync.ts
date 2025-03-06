
import { toast } from 'sonner';
import type { PriceItem, ShopifyContext } from '@/types/price';
import { initGadgetClient } from './client';
import { performBatchOperations } from './batch';
import { reportError, trackPerformance, startPerformanceTracking } from './telemetry';
import { logInfo, logError } from './logging';
import { mockSyncToShopify } from './mocks';

/**
 * Synchronize price items to Shopify through Gadget with batch processing
 * @param context Shopify context for authentication
 * @param items Price items to synchronize
 * @returns Promise resolving to a success indicator
 */
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
    
    // In production: Use Gadget SDK for efficient batching
    // const results = await performBatchOperations(
    //   items,
    //   async (item) => {
    //     return await client.mutate.syncProductPrice({
    //       shop: context.shop,
    //       accessToken: context.accessToken,
    //       sku: item.sku,
    //       newPrice: item.newPrice
    //     });
    //   },
    //   { 
    //     batchSize: 50, 
    //     retryCount: 3,
    //     onProgress: (processed, total) => {
    //       // Could update UI with progress here
    //       console.log(`Progress: ${processed}/${total} (${Math.round(processed/total*100)}%)`);
    //     }
    //   }
    // );
    
    // For demonstration purposes, use mock implementation
    const result = await mockSyncToShopify(context, items);
    
    if (result.success) {
      logInfo("Sync completed successfully", {
        itemCount: items.length,
        shop: context.shop
      }, 'sync');
      
      toast.success("Sync complete", {
        description: `Successfully synced ${items.length} items to Shopify via Gadget.`
      });
    } else {
      logError("Sync completed with errors", {
        message: result.message,
        shop: context.shop
      }, 'sync');
      
      toast.warning("Sync completed with issues", {
        description: result.message || "Some items failed to sync."
      });
    }
    
    // Finish performance tracking
    await finishTracking();
    
    return {
      ...result,
      syncedItems: result.success ? items : undefined
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

/**
 * Check sync eligibility and validate items
 * @param context Shopify context
 * @param items Items to validate
 * @returns Validation result with error message if any
 */
export const validateSyncItems = (
  context: ShopifyContext,
  items: PriceItem[]
): { valid: boolean; message?: string } => {
  if (!context.shop || !context.accessToken) {
    return { valid: false, message: "Shopify authentication required" };
  }
  
  if (items.length === 0) {
    return { valid: false, message: "No items to sync" };
  }
  
  // Check for items with invalid prices
  const invalidItems = items.filter(item => 
    item.newPrice <= 0 || isNaN(Number(item.newPrice))
  );
  
  if (invalidItems.length > 0) {
    return { 
      valid: false, 
      message: `${invalidItems.length} items have invalid prices` 
    };
  }
  
  return { valid: true };
};

/**
 * Prepare items for sync by transforming them into the format expected by Gadget
 * @param items Items to prepare
 * @returns Prepared items
 */
export const prepareItemsForSync = (items: PriceItem[]): PriceItem[] => {
  return items.map(item => ({
    ...item,
    // Add any additional fields required by Gadget
    readyForSync: true,
    syncTimestamp: new Date().toISOString()
  }));
};
