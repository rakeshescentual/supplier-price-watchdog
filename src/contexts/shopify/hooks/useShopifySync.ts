
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { ShopifyContext } from '@/types/price';
import { syncWithShopify, checkShopifyConnection } from '@/lib/shopifyApi';
import { initGadgetClient, syncToShopifyViaGadget } from '@/lib/gadgetApi';

export const useShopifySync = (
  shopifyContext: ShopifyContext | null,
  isShopifyHealthy: boolean
) => {
  const [isSyncing, setIsSyncing] = useState(false);
  
  const syncToShopify = useCallback(async (items: any[]): Promise<boolean> => {
    if (!shopifyContext) {
      toast.error("Shopify connection required", { 
        description: "Please connect to Shopify to sync data." 
      });
      return false;
    }
    
    if (!isShopifyHealthy) {
      const isHealthy = await checkShopifyConnection(shopifyContext);
      
      if (!isHealthy) {
        toast.warning("Shopify connection issues", {
          description: "The connection to Shopify is experiencing issues. Sync may be slower than usual.",
        });
      }
    }
    
    setIsSyncing(true);
    
    try {
      const gadgetClient = initGadgetClient();
      if (gadgetClient?.ready) {
        console.log("Attempting to sync with Shopify via Gadget...");
        const result = await syncToShopifyViaGadget(shopifyContext, items);
        
        if (result.success) {
          toast.success("Sync complete", {
            description: `Successfully synced ${items.length} items to Shopify via Gadget.`,
          });
          return true;
        }
        
        console.warn("Gadget sync failed, falling back to direct API");
      }
      
      console.log("Syncing with Shopify via direct API...");
      const syncResult = await syncWithShopify(shopifyContext, items, {
        retryAttempts: 3,
        retryDelay: 1000
      });
      
      if (syncResult) {
        toast.success("Sync complete", {
          description: `Successfully synced ${items.length} items to Shopify.`,
        });
        return true;
      } else {
        toast.error("Sync failed", {
          description: "Failed to sync items with Shopify. Please try again.",
        });
        return false;
      }
    } catch (error) {
      console.error("Error during Shopify sync:", error);
      toast.error("Sync error", {
        description: "An error occurred while syncing with Shopify.",
      });
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [shopifyContext, isShopifyHealthy]);
  
  return { isSyncing, syncToShopify };
};
