
import { useState, useCallback } from 'react';
import type { ShopifyContext, PriceItem } from '@/types/price';
import { syncWithShopify } from '@/lib/shopify/sync';
import { batchShopifyOperations } from '@/lib/shopify/batch';
import { toast } from 'sonner';

// Mock ShopifyContext for connection functions
const mockShopifyContext: ShopifyContext = {
  shop: 'example-shop.myshopify.com',
  accessToken: 'example-token'
};

export const useShopifySync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<{
    success: boolean;
    message?: string;
    timestamp: Date;
  } | null>(null);
  
  /**
   * Sync price items with Shopify
   * @param items Price items to sync
   * @param options Sync options
   * @returns Promise resolving to success status
   */
  const syncToShopify = useCallback(async (
    items: PriceItem[],
    options?: { silent?: boolean }
  ): Promise<boolean> => {
    if (!items.length) {
      toast.warning("No items to sync", {
        description: "Please upload and analyze a price list first"
      });
      return false;
    }
    
    if (!options?.silent) {
      toast.loading(`Syncing ${items.length} prices to Shopify`, {
        id: "shopify-sync"
      });
    }
    
    setIsSyncing(true);
    
    try {
      const result = await syncWithShopify(mockShopifyContext, items);
      
      setLastSyncResult({
        success: result.success,
        message: result.message,
        timestamp: new Date()
      });
      
      if (!options?.silent) {
        if (result.success) {
          toast.success("Sync complete", {
            id: "shopify-sync",
            description: result.message
          });
        } else {
          toast.error("Sync failed", {
            id: "shopify-sync",
            description: result.message
          });
        }
      }
      
      return result.success;
    } catch (error) {
      console.error("Error syncing with Shopify:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error during sync";
      
      setLastSyncResult({
        success: false,
        message: errorMessage,
        timestamp: new Date()
      });
      
      if (!options?.silent) {
        toast.error("Sync failed", {
          id: "shopify-sync",
          description: errorMessage
        });
      }
      
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, []);
  
  return {
    isSyncing,
    lastSyncResult,
    syncToShopify
  };
};
