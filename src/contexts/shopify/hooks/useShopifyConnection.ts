
import { useState, useCallback, useEffect, useRef } from 'react';
import { shopifyService } from '@/services/shopify';
import type { ShopifyContext, ShopifyConnectionResult } from '@/types/shopify';
import { toast } from 'sonner';

// Mock ShopifyContext for connection function (replace with actual credentials in production)
const mockShopifyContext: ShopifyContext = {
  shop: 'example-shop.myshopify.com',
  accessToken: 'example-token',
  apiVersion: '2023-10'
};

export const useShopifyConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [shopDetails, setShopDetails] = useState<ShopifyConnectionResult['shopDetails'] | null>(null);
  const connectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (connectionIntervalRef.current) {
        clearInterval(connectionIntervalRef.current);
      }
    };
  }, []);
  
  // Test Shopify connection
  const testConnection = useCallback(async (): Promise<ShopifyConnectionResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the service for consistency
      const result = await shopifyService.healthCheck();
      
      setIsConnected(result.success);
      if (result.shopDetails) {
        setShopDetails(result.shopDetails);
      }
      
      if (!result.success) {
        const errorMessage = result.message || 'Failed to connect to Shopify';
        console.error(errorMessage);
        setError(new Error(errorMessage));
        
        toast.error('Shopify connection failed', {
          description: errorMessage
        });
      } else {
        toast.success('Connected to Shopify', {
          description: `Successfully connected to ${result.shopDetails?.name || 'your store'}`
        });
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown connection error');
      setError(error);
      setIsConnected(false);
      
      toast.error('Shopify connection error', {
        description: error.message
      });
      
      return { 
        success: false, 
        message: error.message 
      };
    } finally {
      setIsLoading(false);
      setLastChecked(new Date());
    }
  }, []);
  
  // Start periodic connection checks
  const startConnectionCheck = useCallback((intervalMs: number = 5 * 60 * 1000) => {
    // Clear any existing interval
    if (connectionIntervalRef.current) {
      clearInterval(connectionIntervalRef.current);
    }
    
    // Create new interval
    connectionIntervalRef.current = setInterval(() => {
      console.log('Running scheduled Shopify connection check');
      testConnection().catch(err => {
        console.error('Scheduled connection check failed:', err);
      });
    }, intervalMs);
    
    console.log(`Shopify connection check scheduled every ${intervalMs / 1000} seconds`);
    
    // Run an initial check
    testConnection().catch(err => {
      console.error('Initial connection check failed:', err);
    });
    
    return () => {
      if (connectionIntervalRef.current) {
        clearInterval(connectionIntervalRef.current);
        connectionIntervalRef.current = null;
      }
    };
  }, [testConnection]);
  
  // Stop periodic connection checks
  const stopConnectionCheck = useCallback(() => {
    if (connectionIntervalRef.current) {
      clearInterval(connectionIntervalRef.current);
      connectionIntervalRef.current = null;
      console.log('Shopify connection checks stopped');
    }
  }, []);
  
  return {
    isConnected,
    isLoading,
    error,
    lastChecked,
    shopDetails,
    testConnection,
    startConnectionCheck,
    stopConnectionCheck,
    connectionCheckInterval: connectionIntervalRef.current, // Expose the interval as connectionCheckInterval
    // For compatibility with ShopifyProvider expectations
    isShopifyConnected: isConnected,
    isShopifyHealthy: isConnected && !error,
    lastConnectionCheck: lastChecked,
    loadShopifyData: async () => [], 
    batchProcessShopifyItems: async () => [], 
    connectToShopify: async () => false, 
    disconnectShopify: () => {}, 
  };
};
