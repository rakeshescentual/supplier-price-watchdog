
import { useCallback } from 'react';
import type { ShopifyContext as ShopifyContextType, PriceItem } from '@/types/price';
import { getShopifyProducts } from '@/lib/shopifyApi';

export const useShopifyData = (shopifyContext: ShopifyContextType | null) => {
  const loadShopifyData = useCallback(async (): Promise<PriceItem[]> => {
    if (!shopifyContext) {
      throw new Error("Shopify connection required");
    }
    
    try {
      return await getShopifyProducts(shopifyContext);
    } catch (error) {
      console.error("Error loading Shopify data:", error);
      throw error;
    }
  }, [shopifyContext]);
  
  return { loadShopifyData };
};
