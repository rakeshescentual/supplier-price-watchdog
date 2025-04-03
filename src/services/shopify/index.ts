/**
 * Shopify Integration Service
 * 
 * This service provides a clean interface for interacting with Shopify
 * without requiring Gadget.dev as a dependency.
 */
import { ShopifyContext, PriceItem } from "@/types/price";
import { toast } from "sonner";
import { adaptPriceItems } from "@/adapters/priceItemAdapter";

// Import direct Shopify methods
import { syncWithShopify } from "@/lib/shopify/sync";

// Optionally import Gadget-enhanced methods if available
let gadgetSync: any = null;
try {
  import("@/lib/gadget/sync").then(module => {
    gadgetSync = module.syncToShopifyViaGadget;
  });
} catch (e) {
  console.log("Gadget.dev integration not available, using direct Shopify API");
}

/**
 * Sync price items to Shopify
 * Automatically uses Gadget.dev if available, otherwise falls back to direct API
 */
export const syncPriceItems = async (
  context: ShopifyContext,
  items: PriceItem[],
  options: {
    useGadget?: boolean;
    dryRun?: boolean;
    notifyCustomers?: boolean;
  } = {}
): Promise<{success: boolean; message?: string; syncedItems?: PriceItem[]}> => {
  try {
    // Adapt items for Shopify
    const adaptedItems = adaptPriceItems(items);
    
    // Show toast for dry run mode
    if (options.dryRun) {
      toast.info("Dry Run Mode", {
        description: `Simulating sync of ${items.length} items. No actual changes will be made.`
      });
      
      // Simulate a delay for dry run
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: `Dry run completed for ${items.length} items. No changes were made.`,
        syncedItems: items
      };
    }

    // Use Gadget.dev integration if available and requested
    if (options.useGadget && gadgetSync) {
      return await gadgetSync(context, items, options);
    }
    
    // Otherwise use direct API
    const result = await syncWithShopify(context, items);
    return {
      ...result,
      syncedItems: result.success ? items : undefined
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    toast.error("Sync failed", {
      description: `Failed to sync items with Shopify: ${message}`
    });
    
    return { success: false, message };
  }
};

/**
 * Check if Gadget.dev integration is available
 */
export const isGadgetAvailable = (): boolean => {
  return gadgetSync !== null;
};

// Re-export other Shopify functionality
export * from "@/lib/shopify";
