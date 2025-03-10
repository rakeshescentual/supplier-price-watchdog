
/**
 * Shopify sync validation utilities
 */
import type { PriceItem, ShopifyContext } from '@/types/price';

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
