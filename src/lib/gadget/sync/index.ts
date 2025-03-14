
/**
 * Sync functionality for Gadget
 */

// Re-export authentication functions
export * from './authentication';

// Import from other modules
import { PriceItem, ShopifyContext } from '@/types/price';
import { logInfo, logError } from '../logging';
import { mockSyncToShopify } from '../mocks';
import { trackEvent } from '../telemetry';
import { GadgetSyncResponse } from '../types';
import { toast } from 'sonner';

/**
 * Validate items before sync
 * @param items Price items to validate
 * @returns Array of valid items with validation messages
 */
export const validateSyncItems = (
  items: PriceItem[]
): { validItems: PriceItem[]; invalidItems: PriceItem[]; messages: string[] } => {
  const validItems: PriceItem[] = [];
  const invalidItems: PriceItem[] = [];
  const messages: string[] = [];
  
  items.forEach(item => {
    if (!item.sku) {
      invalidItems.push(item);
      messages.push(`Missing SKU for item "${item.name}"`);
      return;
    }
    
    if (isNaN(item.newPrice) || item.newPrice < 0) {
      invalidItems.push(item);
      messages.push(`Invalid price for item ${item.sku}: ${item.newPrice}`);
      return;
    }
    
    if (!item.productId || !item.variantId) {
      invalidItems.push(item);
      messages.push(`Missing product or variant ID for item ${item.sku}`);
      return;
    }
    
    validItems.push(item);
  });
  
  return { validItems, invalidItems, messages };
};

/**
 * Prepare items for sync by formatting and validating
 * @param items Price items to prepare
 * @returns Prepared items ready for sync
 */
export const prepareItemsForSync = (
  items: PriceItem[]
): PriceItem[] => {
  return items.map(item => ({
    ...item,
    newPrice: Number(item.newPrice)
  }));
};

/**
 * Sync items to Shopify via Gadget
 * @param context Shopify context
 * @param items Price items to sync
 * @returns Promise resolving to sync response
 */
export const syncToShopifyViaGadget = async (
  context: ShopifyContext,
  items: PriceItem[]
): Promise<GadgetSyncResponse> => {
  try {
    logInfo(`Syncing ${items.length} items with Shopify via Gadget`, {
      shop: context.shop,
      itemCount: items.length
    }, 'sync');
    
    // Track the sync event in analytics
    trackEvent('shopify_sync_started', {
      itemCount: items.length,
      shop: context.shop
    });
    
    // Show loading toast
    toast.loading(`Syncing ${items.length} items to Shopify...`);
    
    // In production, this would use the Gadget client
    // For now, use the mock implementation
    const result = await mockSyncToShopify(context, items);
    
    if (result.success) {
      toast.success('Sync complete', {
        description: `Successfully synced ${result.itemCount || items.length} items to Shopify.`
      });
      
      trackEvent('shopify_sync_completed', {
        itemCount: result.itemCount || items.length,
        success: true,
        shop: context.shop
      });
    } else {
      toast.warning('Sync completed with issues', {
        description: result.message || `Some items failed to sync. Please check the error messages.`
      });
      
      trackEvent('shopify_sync_partial', {
        itemCount: result.itemCount,
        errorCount: result.errors?.length || 0,
        success: false,
        shop: context.shop
      });
    }
    
    return result;
  } catch (error) {
    logError("Error syncing to Shopify via Gadget", { error }, 'sync');
    
    // Show error toast
    toast.error('Sync failed', {
      description: error instanceof Error ? error.message : 'An unknown error occurred'
    });
    
    // Track the error
    trackEvent('shopify_sync_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      shop: context.shop
    });
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};
