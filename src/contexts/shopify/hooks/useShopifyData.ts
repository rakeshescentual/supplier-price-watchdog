
import { useCallback } from 'react';
import type { ShopifyContext as ShopifyContextType, PriceItem } from '@/types/price';

export const useShopifyData = (shopifyContext: ShopifyContextType | null) => {
  const loadShopifyData = useCallback(async (): Promise<PriceItem[]> => {
    if (!shopifyContext) {
      throw new Error("Shopify connection required");
    }
    
    try {
      // Import the function directly to avoid circular dependencies
      const { getShopifyProducts } = await import('@/lib/shopifyApi');
      return await getShopifyProducts();
    } catch (error) {
      console.error("Error loading Shopify data:", error);
      throw error;
    }
  }, [shopifyContext]);
  
  return { loadShopifyData };
};
