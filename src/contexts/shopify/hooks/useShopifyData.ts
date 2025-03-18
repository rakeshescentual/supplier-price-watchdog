
import { useState, useEffect } from 'react';
import { getShopifyProducts, getShopifySyncHistory } from '@/lib/shopifyApi';
import type { PriceItem } from '@/types/price';

export const useShopifyData = () => {
  const [products, setProducts] = useState<PriceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const shopifyProducts = await getShopifyProducts();
        
        // Convert Shopify products to PriceItems
        const convertedProducts: PriceItem[] = shopifyProducts.map(product => ({
          id: product.id,
          sku: product.id,
          name: product.title,
          oldPrice: product.price,
          newPrice: product.price,
          supplier: 'Shopify',
          category: 'Unknown',
          status: 'unchanged'
        }));
        
        setProducts(convertedProducts);
      } catch (err) {
        console.error('Error fetching Shopify products:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching products'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  return {
    products,
    isLoading,
    error
  };
};
