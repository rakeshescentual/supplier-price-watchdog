
import { useCallback } from 'react';
import type { ShopifyContext as ShopifyContextType } from '@/types/price';
import { batchShopifyOperations } from '@/lib/shopifyApi';

export const useShopifyBatch = (shopifyContext: ShopifyContextType | null) => {
  const batchProcessShopifyItems = useCallback(async <T, R>(
    items: T[],
    processFn: (item: T) => Promise<R>,
    options = { batchSize: 10, concurrency: 1 }
  ): Promise<R[]> => {
    if (!shopifyContext) {
      throw new Error("Shopify connection required");
    }
    
    try {
      return await batchShopifyOperations(shopifyContext, items, processFn, options);
    } catch (error) {
      console.error("Error during batch processing:", error);
      throw error;
    }
  }, [shopifyContext]);
  
  return { batchProcessShopifyItems };
};
