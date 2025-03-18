import { useState, useEffect, useCallback } from 'react';
import type { ShopifyContext } from '@/types/price';
import { toast } from 'sonner';
import { checkShopifyConnection } from '@/lib/shopify/connection';

// Mock implementation to fix the missing parameter error
// You may need to update this with the actual implementation
const mockShopifyContext: ShopifyContext = {
  shop: 'example-shop.myshopify.com',
  accessToken: 'example-token'
};

export const useShopifyConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'testing' | 'success' | 'error'>('none');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [shopDetails, setShopDetails] = useState<{
    name: string;
    domain: string;
    plan: string;
  } | null>(null);

  const testConnection = useCallback(async () => {
    // Update to use mockShopifyContext or get from context
    setIsLoading(true);
    setConnectionStatus('testing');
    setError(null);
    
    try {
      const result = await checkShopifyConnection(mockShopifyContext);
      setIsConnected(result.success);
      setConnectionStatus(result.success ? 'success' : 'error');
      setLastChecked(new Date());
      
      if (result.success && result.shopDetails) {
        setShopDetails({
          name: result.shopDetails.name || 'Unknown Shop',
          domain: result.shopDetails.domain || mockShopifyContext.shop,
          plan: result.shopDetails.plan || 'Unknown Plan'
        });
      }
      
      if (result.success) {
        toast.success('Connected to Shopify', {
          description: `Successfully connected to ${result.shopDetails?.name || mockShopifyContext.shop}`
        });
      } else {
        toast.error('Connection failed', {
          description: result.message || 'Could not connect to Shopify'
        });
      }
      
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown connection error');
      setError(errorObj);
      setIsConnected(false);
      setConnectionStatus('error');
      
      toast.error('Connection error', {
        description: errorObj.message
      });
      
      return { 
        success: false, 
        message: errorObj.message 
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check connection on mount if we have credentials
  useEffect(() => {
    if (mockShopifyContext.accessToken && mockShopifyContext.shop) {
      testConnection();
    }
  }, [testConnection]);

  return {
    connectionStatus,
    isConnected,
    isLoading,
    error,
    lastChecked,
    shopDetails,
    testConnection
  };
};
