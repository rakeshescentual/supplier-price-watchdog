
import { useState, useCallback } from 'react';
import { checkShopifyConnection } from '@/lib/shopify/connection';
import type { ShopifyContext, ShopifyConnectionResult } from '@/types/price';

// Mock ShopifyContext for connection function
const mockShopifyContext: ShopifyContext = {
  shop: 'example-shop.myshopify.com',
  accessToken: 'example-token'
};

export const useShopifyConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const testConnection = useCallback(async (): Promise<ShopifyConnectionResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await checkShopifyConnection(mockShopifyContext);
      
      // Handle both boolean and object results
      if (typeof result === 'boolean') {
        setIsConnected(result);
        return { success: result };
      } else if (typeof result === 'object' && 'success' in result) {
        setIsConnected(result.success);
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
    }
  }, []);
  
  return {
    isConnected,
    isLoading,
    error,
    testConnection
  };
};
