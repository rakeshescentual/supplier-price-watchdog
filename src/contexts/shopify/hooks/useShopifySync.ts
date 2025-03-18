
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
  
  const syncPrices = useCallback(async (prices: PriceItem[]): Promise<boolean> => {
    setIsSyncing(true);
    
    try {
      const result = await syncWithShopify(mockShopifyContext, prices);
      
      // Handle both boolean and object returns
      const success = typeof result === 'boolean' ? result : 
                      typeof result === 'object' && 'success' in result ? result.success : false;
      const message = typeof result === 'boolean' ? (result ? 'Success' : 'Failed') : 
                      typeof result === 'object' && 'message' in result ? result.message : 'Unknown result';
      
      setLastSyncResult({
        success,
        message,
        timestamp: new Date()
      });
      
      return success;
    } catch (error) {
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
  
  const batchSync = useCallback(async (items: PriceItem[], processFn: (item: PriceItem) => Promise<any>, options: any) => {
    return batchShopifyOperations(items, processFn, options);
  }, []);
  
  return {
    isSyncing,
    lastSyncResult,
    syncPrices, 
    syncToShopify: syncPrices, // Add this alias to match expected property name
    batchSync
  };
};
