
import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { ShopifyContext } from '@/types/price';
import { checkShopifyConnection, getShopifySyncHistory } from '@/lib/shopify';
import { performBatchOperations } from '@/utils/marketDataUtils';

export const useShopifyConnection = (
  shopifyContext: ShopifyContext | null,
  setShopifyContext: React.Dispatch<React.SetStateAction<ShopifyContext | null>>
) => {
  const [isShopifyConnected, setIsShopifyConnected] = useState<boolean>(false);
  const [isShopifyHealthy, setIsShopifyHealthy] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [syncHistory, setSyncHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [lastConnectionCheck, setLastConnectionCheck] = useState<Date | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Reference to the interval ID for cleanup
  const connectionCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Check Shopify connection status
  const checkConnection = useCallback(async (silent: boolean = false) => {
    if (!shopifyContext?.shop || !shopifyContext?.accessToken) {
      setIsShopifyConnected(false);
      setIsShopifyHealthy(false);
      setLastConnectionCheck(new Date());
      return false;
    }

    setIsChecking(true);
    setConnectionError(null);
    
    try {
      const connected = await checkShopifyConnection(shopifyContext);
      setIsShopifyConnected(connected);
      setIsShopifyHealthy(connected);
      setLastConnectionCheck(new Date());
      
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
      setIsShopifyConnected(false);
      setIsShopifyHealthy(false);
      
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

  // Connect to Shopify
  const connectToShopify = useCallback(async (shop: string, accessToken: string) => {
    setIsChecking(true);
    
    try {
      // Validate inputs
      if (!shop || !accessToken) {
        toast.error('Invalid credentials', {
          description: 'Both shop URL and access token are required',
        });
        return false;
      }
      
      // Create a new Shopify context
      const newContext: ShopifyContext = { shop, accessToken };
      
      // Test the connection
      const connected = await checkShopifyConnection(newContext);
      
      if (connected) {
        // Save the context
        setShopifyContext(newContext);
        
        // Save to localStorage if needed
        try {
          localStorage.setItem('shopifyContext', JSON.stringify(newContext));
        } catch (storageError) {
          console.warn('Could not save Shopify credentials to localStorage:', storageError);
        }
        
        setIsShopifyConnected(true);
        setIsShopifyHealthy(true);
        setLastConnectionCheck(new Date());
        
        toast.success('Connected to Shopify', {
          description: `Successfully connected to ${shop}`,
        });
        
        return true;
      } else {
        toast.error('Connection failed', {
          description: 'Could not connect to Shopify with the provided credentials',
        });
        return false;
      }
    } catch (error) {
      console.error('Error connecting to Shopify:', error);
      
      toast.error('Connection error', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [setShopifyContext]);

  // Disconnect from Shopify
  const disconnectShopify = useCallback(() => {
    setShopifyContext(null);
    setIsShopifyConnected(false);
    setIsShopifyHealthy(false);
    setSyncHistory([]);
    
    // Clear from localStorage if needed
    try {
      localStorage.removeItem('shopifyContext');
    } catch (storageError) {
      console.warn('Could not remove Shopify credentials from localStorage:', storageError);
    }
    
    toast.success('Disconnected from Shopify', {
      description: 'Shopify integration has been disabled',
    });
  }, [setShopifyContext]);

  // Load sync history
  const loadSyncHistory = useCallback(async () => {
    if (!shopifyContext || !isShopifyConnected) {
      setSyncHistory([]);
      return [];
    }

    setIsLoadingHistory(true);
    
    try {
      const history = await getShopifySyncHistory(shopifyContext);
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
  }, [shopifyContext, isShopifyConnected]);

  // Load Shopify data
  const loadShopifyData = useCallback(async () => {
    if (!shopifyContext || !isShopifyConnected) {
      return [];
    }
    
    try {
      // In a real implementation, this would fetch data from Shopify
      // This is a placeholder for the actual implementation
      return [];
    } catch (error) {
      console.error('Error loading Shopify data:', error);
      toast.error('Failed to load Shopify data', {
        description: 'Please try again later',
      });
      return [];
    }
  }, [shopifyContext, isShopifyConnected]);

  // Batch process Shopify items
  const batchProcessShopifyItems = useCallback(async <T, R>(
    items: T[],
    processFn: (item: T) => Promise<R>,
    options = { batchSize: 50, concurrency: 2 }
  ): Promise<R[]> => {
    if (!shopifyContext || !isShopifyConnected) {
      toast.error('Shopify not connected', {
        description: 'Please connect to Shopify before processing items',
      });
      return [];
    }
    
    try {
      return await performBatchOperations(items, processFn, options.batchSize);
    } catch (error) {
      console.error('Error in batch processing Shopify items:', error);
      toast.error('Batch processing failed', {
        description: 'An error occurred while processing items',
      });
      return [];
    }
  }, [shopifyContext, isShopifyConnected]);

  // Check connection on mount and when shopifyContext changes
  useEffect(() => {
    if (shopifyContext) {
      checkConnection(true);
      
      // Set up periodic checks every 5 minutes
      if (connectionCheckInterval.current) {
        clearInterval(connectionCheckInterval.current);
      }
      
      connectionCheckInterval.current = setInterval(() => {
        checkConnection(true);
      }, 5 * 60 * 1000);
    }
    
    // Cleanup on unmount
    return () => {
      if (connectionCheckInterval.current) {
        clearInterval(connectionCheckInterval.current);
        connectionCheckInterval.current = null;
      }
    };
  }, [shopifyContext, checkConnection]);

  // Try to load Shopify context from localStorage on mount
  useEffect(() => {
    if (!shopifyContext) {
      try {
        const savedContext = localStorage.getItem('shopifyContext');
        if (savedContext) {
          const parsedContext = JSON.parse(savedContext) as ShopifyContext;
          setShopifyContext(parsedContext);
        }
      } catch (error) {
        console.warn('Could not load Shopify context from localStorage:', error);
      }
    }
  }, [shopifyContext, setShopifyContext]);

  return {
    isShopifyConnected,
    isShopifyHealthy,
    isChecking,
    syncHistory,
    isLoadingHistory,
    lastConnectionCheck,
    connectionError,
    connectionCheckInterval: connectionCheckInterval.current,
    checkConnection,
    connectToShopify,
    disconnectShopify,
    loadSyncHistory,
    loadShopifyData,
    batchProcessShopifyItems,
  };
};
