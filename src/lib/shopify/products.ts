
import { PriceItem, ShopifyContext } from '@/types/price';
import { shopifyCache } from '../api-cache';

// Fetch Shopify products with caching
export const getShopifyProducts = async (shopifyContext: ShopifyContext): Promise<PriceItem[]> => {
  try {
    const cacheKey = `shopify-products-${shopifyContext.shop}`;
    const cachedProducts = shopifyCache.get<PriceItem[]>(cacheKey);
    
    if (cachedProducts !== null) {
      console.log(`Using cached Shopify products for ${shopifyContext.shop}`);
      return cachedProducts;
    }
    
    // In a real implementation, this would query the Shopify Admin API
    console.log(`Fetching products for Shopify store: ${shopifyContext.shop}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock data
    const products = Array.from({ length: 50 }, (_, i) => ({
      sku: `SKU${i + 1000}`,
      name: `Test Product ${i + 1}`,
      oldPrice: 19.99 + i,
      newPrice: 19.99 + i,
      status: 'unchanged' as const,
      difference: 0,
      isMatched: true,
      productId: `gid://shopify/Product/${1000000 + i}`,
      variantId: `gid://shopify/ProductVariant/${2000000 + i}`,
      inventoryItemId: `gid://shopify/InventoryItem/${3000000 + i}`,
      inventoryLevel: Math.floor(Math.random() * 100),
      compareAtPrice: 24.99 + i,
      tags: ['test', 'sample'],
      historicalSales: Math.floor(Math.random() * 1000),
      lastOrderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      vendor: ['Supplier A', 'Supplier B', 'Supplier C'][Math.floor(Math.random() * 3)]
    }));
    
    // Cache the results (30 minutes TTL)
    shopifyCache.set(cacheKey, products, { ttl: 30 * 60 * 1000 });
    
    return products;
  } catch (error) {
    console.error("Error fetching Shopify products:", error);
    throw error;
  }
};
