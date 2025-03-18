
import { useState, useCallback } from 'react';
import type { ShopifyContext, PriceItem } from '@/types/price';
import { syncWithShopify } from '@/lib/shopify/sync';
import { batchShopifyOperations } from '@/lib/shopify/batch';

// Mock ShopifyContext for connection functions
const mockShopifyContext: ShopifyContext = {
  shop: 'example-shop.myshopify.com',
  accessToken: 'example-token'
};

export const useShopifySync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<{
    success: boolean;
    message: string;
    timestamp: Date;
  } | null>(null);
  
  const syncPrices = useCallback(async (prices: PriceItem[]) => {
    // Implementation using mockShopifyContext
    setIsSyncing(true);
    
    try {
      const result = await syncWithShopify(mockShopifyContext);
      setLastSyncResult({
        success: result.success,
        message: result.message,
        timestamp: new Date()
      });
      return result;
    } catch (error) {
      // Error handling
      setLastSyncResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error during sync',
        timestamp: new Date()
      });
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, []);
  
  const batchSync = useCallback(async (items, processFn, options) => {
    // Implementation using batchShopifyOperations with correct arguments
    return batchShopifyOperations(items, processFn, options);
  }, []);
  
  return {
    isSyncing,
    lastSyncResult,
    syncPrices,
    batchSync
  };
};
