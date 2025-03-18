
import { useState, useCallback } from 'react';
import { checkShopifyConnection } from '@/lib/shopify/connection';
import type { ShopifyContext, ShopifyConnectionResult } from '@/types/price';

const mockShopifyContext: ShopifyContext = {
  shop: 'example-shop.myshopify.com',
  accessToken: 'example-token'
};

export const useShopifyConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [shopDetails, setShopDetails] = useState<ShopifyConnectionResult['shopDetails'] | null>(null);
  
  const testConnection = useCallback(async (): Promise<ShopifyConnectionResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await checkShopifyConnection(mockShopifyContext);
      
      // Handle different return types
      if (typeof result === 'boolean') {
        // Handle legacy boolean return type
        setIsConnected(result);
        return { success: result };
      } else if (typeof result === 'object') {
        // Handle ShopifyConnectionResult return type
        setIsConnected(result.success);
        if (result.shopDetails) {
          setShopDetails(result.shopDetails);
        }
        return result;
      } else {
        // Default fallback
        setIsConnected(false);
        return { success: false, message: 'Invalid result type' };
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown connection error');
      setError(error);
      setIsConnected(false);
      return { 
        success: false, 
        message: error.message 
      };
    } finally {
      setIsLoading(false);
      setLastChecked(new Date());
    }
  }, []);
  
  return {
    isConnected,
    isLoading,
    error,
    lastChecked,
    shopDetails,
    testConnection,
    // For compatibility with ShopifyProvider expectations
    isShopifyConnected: isConnected,
    isShopifyHealthy: isConnected && !error,
    lastConnectionCheck: lastChecked,
    connectionCheckInterval: null,
    loadShopifyData: async () => [], 
    batchProcessShopifyItems: async () => [], 
    connectToShopify: async () => false, 
    disconnectShopify: () => {}, 
  };
};
