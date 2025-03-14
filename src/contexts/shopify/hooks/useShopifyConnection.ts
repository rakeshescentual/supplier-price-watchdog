
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import type { ShopifyContext } from '@/types/price';
import { checkShopifyConnection } from '@/lib/shopifyApi';

export interface ShopifyContextType {
  shopifyContext: ShopifyContext | null;
  isShopifyConnected: boolean;
  isShopifyHealthy: boolean;
  lastConnectionCheck: Date | null;
  isGadgetInitialized: boolean;
  isSyncing: boolean;
  connectToShopify: (shop: string, accessToken: string) => Promise<boolean>;
  disconnectShopify: () => void;
  syncToShopify: (items: any[]) => Promise<boolean>;
  loadShopifyData: () => Promise<any[]>;
  batchProcessShopifyItems: <T, R>(items: T[], processFn: (item: T) => Promise<R>, options?: { batchSize: number, concurrency: number }) => Promise<R[]>;
}

export const useShopifyConnection = (
  shopifyContext: ShopifyContext | null,
  setShopifyContext: React.Dispatch<React.SetStateAction<ShopifyContext | null>>
) => {
  const [isShopifyConnected, setIsShopifyConnected] = useState(false);
  const [isShopifyHealthy, setIsShopifyHealthy] = useState(false);
  const [lastConnectionCheck, setLastConnectionCheck] = useState<Date | null>(null);
  const [connectionCheckInterval, setConnectionCheckInterval] = useState<number | null>(null);
  
  useEffect(() => {
    const storedContext = localStorage.getItem('shopifyContext');
    if (storedContext) {
      try {
        const parsedContext = JSON.parse(storedContext);
        setShopifyContext(parsedContext);
        
        checkShopifyConnection(parsedContext)
          .then(isHealthy => {
            setIsShopifyConnected(true);
            setIsShopifyHealthy(isHealthy);
            setLastConnectionCheck(new Date());
            
            if (isHealthy) {
              toast.success("Shopify connected", {
                description: `Connected to Shopify store: ${parsedContext.shop}`,
              });
            } else {
              toast.warning("Shopify connection issues", {
                description: "Connected, but the API may be experiencing slowdowns.",
              });
            }
            
            const intervalId = window.setInterval(() => {
              if (parsedContext) {
                checkShopifyConnection(parsedContext)
                  .then(isHealthy => {
                    setIsShopifyHealthy(isHealthy);
                    setLastConnectionCheck(new Date());
                    
                    if (!isHealthy) {
                      toast.warning("Shopify connection degraded", {
                        description: "The connection to Shopify is experiencing issues.",
                      });
                    }
                  })
                  .catch(error => {
                    console.error("Error checking Shopify connection:", error);
                    setIsShopifyHealthy(false);
                  });
              }
            }, 5 * 60 * 1000);
            
            setConnectionCheckInterval(intervalId);
          })
          .catch(error => {
            console.error("Error checking initial Shopify connection:", error);
            setIsShopifyConnected(true);
            setIsShopifyHealthy(false);
          });
      } catch (error) {
        console.error("Error parsing Shopify context from localStorage:", error);
        toast.error("Could not connect to Shopify", {
          description: "There was an error loading your Shopify connection.",
        });
      }
    }
  }, [setShopifyContext]);
  
  const connectToShopify = useCallback(async (shop: string, accessToken: string) => {
    try {
      const newContext: ShopifyContext = { shop, accessToken };
      
      const isHealthy = await checkShopifyConnection(newContext);
      
      setShopifyContext(newContext);
      setIsShopifyConnected(true);
      setIsShopifyHealthy(isHealthy);
      setLastConnectionCheck(new Date());
      
      localStorage.setItem('shopifyContext', JSON.stringify(newContext));
      
      const intervalId = window.setInterval(() => {
        if (newContext) {
          checkShopifyConnection(newContext)
            .then(isHealthy => {
              setIsShopifyHealthy(isHealthy);
              setLastConnectionCheck(new Date());
            })
            .catch(() => setIsShopifyHealthy(false));
        }
      }, 5 * 60 * 1000);
      
      setConnectionCheckInterval(intervalId);
      
      toast.success("Shopify connected", {
        description: `Connected to Shopify store: ${shop}`,
      });
      
      return true;
    } catch (error) {
      console.error("Error connecting to Shopify:", error);
      toast.error("Could not connect to Shopify", {
        description: "Please check your Shopify store URL and access token.",
      });
      return false;
    }
  }, [setShopifyContext]);
  
  const disconnectShopify = useCallback(() => {
    setShopifyContext(null);
    setIsShopifyConnected(false);
    setIsShopifyHealthy(false);
    localStorage.removeItem('shopifyContext');
    
    if (connectionCheckInterval) {
      clearInterval(connectionCheckInterval);
      setConnectionCheckInterval(null);
    }
    
    toast.success("Shopify disconnected", {
      description: "You have disconnected from your Shopify store.",
    });
  }, [connectionCheckInterval, setShopifyContext]);
  
  // Implementation for loadShopifyData
  const loadShopifyData = useCallback(async (): Promise<any[]> => {
    if (!shopifyContext) {
      toast.error("Shopify connection required");
      return [];
    }
    
    try {
      // In a real implementation, this would call Shopify API
      console.log("Loading Shopify data...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [];
    } catch (error) {
      console.error("Error loading Shopify data:", error);
      toast.error("Failed to load Shopify data");
      return [];
    }
  }, [shopifyContext]);
  
  // Implementation for batchProcessShopifyItems
  const batchProcessShopifyItems = useCallback(async <T, R>(
    items: T[],
    processFn: (item: T) => Promise<R>,
    options = { batchSize: 10, concurrency: 1 }
  ): Promise<R[]> => {
    if (!shopifyContext) {
      toast.error("Shopify connection required");
      return [];
    }
    
    try {
      // In a real implementation, this would batch process items
      console.log(`Batch processing ${items.length} items...`);
      return [];
    } catch (error) {
      console.error("Error batch processing items:", error);
      toast.error("Failed to batch process items");
      return [];
    }
  }, [shopifyContext]);
  
  return {
    isShopifyConnected,
    isShopifyHealthy,
    lastConnectionCheck,
    connectionCheckInterval,
    shopifyContext,
    connectToShopify,
    disconnectShopify,
    loadShopifyData,
    batchProcessShopifyItems
  };
};
