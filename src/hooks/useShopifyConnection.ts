
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { ShopifyContext } from '@/types/price';
import { checkShopifyConnection, getShopifySyncHistory } from '@/lib/shopify';

export const useShopifyConnection = (shopifyContext?: ShopifyContext) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [syncHistory, setSyncHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Check connection status
  const checkConnection = useCallback(async (silent: boolean = false) => {
    if (!shopifyContext?.shop || !shopifyContext?.accessToken) {
      setIsConnected(false);
      setLastChecked(new Date());
      return false;
    }

    setIsChecking(true);
    setConnectionError(null);
    
    try {
      const connected = await checkShopifyConnection();
      setIsConnected(connected);
      setLastChecked(new Date());
      
      if (!silent) {
        if (connected) {
          toast.success('Connected to Shopify', {
            description: `Successfully connected to ${shopifyContext.shop}`,
          });
        } else {
          toast.error('Failed to connect to Shopify', {
            description: 'Please check your credentials and try again',
          });
        }
      }
      
      return connected;
    } catch (error) {
      console.error('Error checking Shopify connection:', error);
      setIsConnected(false);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setConnectionError(errorMessage);
      
      if (!silent) {
        toast.error('Connection error', {
          description: errorMessage,
        });
      }
      
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [shopifyContext]);

  // Load sync history
  const loadSyncHistory = useCallback(async () => {
    if (!shopifyContext || !isConnected) {
      setSyncHistory([]);
      return [];
    }

    setIsLoadingHistory(true);
    
    try {
      const history = await getShopifySyncHistory();
      setSyncHistory(history);
      return history;
    } catch (error) {
      console.error('Error loading sync history:', error);
      toast.error('Failed to load sync history', {
        description: 'Please try again later',
      });
      return [];
    } finally {
      setIsLoadingHistory(false);
    }
  }, [shopifyContext, isConnected]);

  // Check connection on mount and when shopifyContext changes
  useEffect(() => {
    if (shopifyContext) {
      checkConnection(true);
    }
  }, [shopifyContext, checkConnection]);

  return {
    isConnected,
    isChecking,
    syncHistory,
    isLoadingHistory,
    lastChecked,
    connectionError,
    checkConnection,
    loadSyncHistory,
  };
};
