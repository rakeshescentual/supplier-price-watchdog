
import { ShopifyContext } from '@/types/price';
import { shopifyCache } from '../api-cache';

// Check Shopify connectivity with quick health check
export const checkShopifyConnection = async (shopifyContext: ShopifyContext): Promise<boolean> => {
  try {
    const cacheKey = `shopify-connection-${shopifyContext.shop}`;
    const cachedStatus = shopifyCache.get<boolean>(cacheKey);
    
    if (cachedStatus !== null) {
      return cachedStatus;
    }
    
    // In a real implementation, this would make a lightweight call to the Shopify API
    console.log(`Checking connection to Shopify store: ${shopifyContext.shop}`);
    
    // Simulate a fast API call
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Cache the result for 5 minutes
    shopifyCache.set(cacheKey, true, { ttl: 5 * 60 * 1000 });
    
    return true;
  } catch (error) {
    console.error("Error checking Shopify connection:", error);
    return false;
  }
};

// Get recent sync history
export const getShopifySyncHistory = (shopifyContext: ShopifyContext): { timestamp: number, itemCount: number, status: string }[] => {
  // In a real implementation, this would query the Shopify API for recent sync operations
  // For now, we'll retrieve from our cache
  
  const syncHistory: { timestamp: number, itemCount: number, status: string }[] = [];
  
  // Search cache for sync status entries
  const allCacheKeys = shopifyCache.getAllKeys();
  
  for (const key of allCacheKeys) {
    if (key.startsWith('shopify-sync-status-')) {
      const syncStatus = shopifyCache.get(key);
      if (syncStatus && 
          typeof syncStatus === 'object' && 
          'timestamp' in syncStatus && 
          'itemCount' in syncStatus && 
          'status' in syncStatus) {
        syncHistory.push(syncStatus as { timestamp: number, itemCount: number, status: string });
      }
    }
  }
  
  // Sort by timestamp descending (most recent first)
  return syncHistory.sort((a, b) => b.timestamp - a.timestamp);
};
