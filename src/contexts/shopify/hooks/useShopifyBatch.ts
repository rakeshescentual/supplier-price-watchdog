
import { useCallback } from 'react';
import type { ShopifyContext } from '@/types/price';
import { batchShopifyOperations } from '@/lib/shopifyApi';

export const useShopifyBatch = (shopifyContext: ShopifyContext | null) => {
  const batchProcessShopifyItems = useCallback(async <T, R>(
    items: T[],
    processFn: (item: T) => Promise<R>,
    options = { batchSize: 10, concurrency: 1 }
  ): Promise<R[]> => {
    if (!shopifyContext) {
      throw new Error("Shopify connection required");
    }
    
    return batchShopifyOperations(items, processFn, options);
  }, [shopifyContext]);
  
  return { batchProcessShopifyItems };
};
