
import { ShopifyContext } from '@/types/price';
import { shopifyCache } from '../api-cache';

/**
 * Check Shopify connection health status
 * @param shopifyContext The Shopify context containing shop and accessToken
 * @returns Promise resolving to a boolean indicating if the connection is healthy
 */
export const checkShopifyConnection = async (shopifyContext: ShopifyContext): Promise<boolean> => {
  try {
    console.log(`Checking Shopify connection for store: ${shopifyContext.shop}`);
    
    // Check if we have a cached health status
    const cacheKey = `shopify-health-${shopifyContext.shop}`;
    const cachedHealth = shopifyCache.get<{ healthy: boolean; timestamp: number }>(cacheKey);
    
    // Use cached result if less than 5 minutes old
    if (cachedHealth && (Date.now() - cachedHealth.timestamp < 5 * 60 * 1000)) {
      console.log(`Using cached Shopify health status for ${shopifyContext.shop}`);
      return cachedHealth.healthy;
    }
    
    // In a real implementation, this would ping the Shopify API to check connection status
    // Example:
    // const response = await fetch(`https://${shopifyContext.shop}/admin/api/2023-10/shop.json`, {
    //   headers: {
    //     'X-Shopify-Access-Token': shopifyContext.accessToken,
    //     'Content-Type': 'application/json'
    //   }
    // });
    // const isHealthy = response.ok;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For now, assume the connection is healthy if we have both shop and accessToken
    const isHealthy = !!shopifyContext.shop && !!shopifyContext.accessToken;
    
    // Cache the health status
    shopifyCache.set(cacheKey, { healthy: isHealthy, timestamp: Date.now() }, { ttl: 5 * 60 * 1000 });
    
    return isHealthy;
  } catch (error) {
    console.error("Error checking Shopify connection:", error);
    return false;
  }
};

/**
 * Get Shopify synchronization history
 * @param shopifyContext The Shopify context containing shop and accessToken
 * @returns Promise resolving to an array of sync history objects
 */
export const getShopifySyncHistory = async (shopifyContext: ShopifyContext): Promise<any[]> => {
  try {
    const cacheKey = `shopify-sync-history-${shopifyContext.shop}`;
    const cachedHistory = shopifyCache.get<any[]>(cacheKey);
    
    if (cachedHistory) {
      console.log(`Using cached Shopify sync history for ${shopifyContext.shop}`);
      return cachedHistory;
    }
    
    console.log(`Fetching sync history for Shopify store: ${shopifyContext.shop}`);
    
    // In a real implementation, this would query the Shopify Admin API for sync logs
    // For now, generate mock data
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const history = Array.from({ length: 5 }, (_, i) => ({
      id: `sync-${i + 1}`,
      timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      status: Math.random() > 0.2 ? 'success' : 'partial',
      itemCount: Math.floor(Math.random() * 100) + 10,
      errors: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
      duration: Math.floor(Math.random() * 120) + 30,
      initiatedBy: 'user@example.com'
    }));
    
    // Cache the history
    shopifyCache.set(cacheKey, history, { ttl: 30 * 60 * 1000 });
    
    return history;
  } catch (error) {
    console.error("Error fetching Shopify sync history:", error);
    return [];
  }
};
