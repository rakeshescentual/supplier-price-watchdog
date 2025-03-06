import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import type { PriceItem, ShopifyContext as ShopifyContextType, ShopifyContextType as ShopifyProviderContextType } from '@/types/price';
import { 
  initializeShopifyApp, 
  getShopifyProducts, 
  syncWithShopify, 
  checkShopifyConnection,
  batchShopifyOperations
} from '@/lib/shopifyApi';
import { initGadgetClient, authenticateShopify, syncToShopifyViaGadget } from '@/lib/gadgetApi';
import { getGadgetConfig } from '@/utils/gadget-helpers';

interface ShopifyProviderProps {
  children: React.ReactNode;
}

const ShopifyContext = createContext<ShopifyProviderContextType | undefined>(undefined);

export const useShopify = () => {
  const context = useContext(ShopifyContext);
  if (!context) {
    throw new Error("useShopify must be used within a ShopifyProvider");
  }
  return context;
};

export const ShopifyProvider: React.FC<ShopifyProviderProps> = ({ children }) => {
  const [shopifyContext, setShopifyContext] = useState<ShopifyContextType | null>(null);
  const [isShopifyConnected, setIsShopifyConnected] = useState(false);
  const [isShopifyHealthy, setIsShopifyHealthy] = useState(false);
  const [isGadgetInitialized, setIsGadgetInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionCheckInterval, setConnectionCheckInterval] = useState<number | null>(null);
  const [lastConnectionCheck, setLastConnectionCheck] = useState<Date | null>(null);
  
  useEffect(() => {
    return () => {
      if (connectionCheckInterval) {
        clearInterval(connectionCheckInterval);
      }
    };
  }, [connectionCheckInterval]);
  
  useEffect(() => {
    initializeShopifyApp();
    
    const gadgetClient = initGadgetClient();
    setIsGadgetInitialized(!!gadgetClient?.ready);
    
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
  }, []);
  
  const connectToShopify = useCallback(async (shop: string, accessToken: string) => {
    try {
      const newContext: ShopifyContextType = { shop, accessToken };
      
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
  }, [connectionCheckInterval]);
  
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
  }, [connectionCheckInterval]);
  
  const loadShopifyData = useCallback(async (): Promise<PriceItem[]> => {
    if (!shopifyContext) {
      throw new Error("Shopify connection required");
    }
    
    try {
      return await getShopifyProducts(shopifyContext);
    } catch (error) {
      console.error("Error loading Shopify data:", error);
      throw error;
    }
  }, [shopifyContext]);
  
  const syncToShopify = useCallback(async (items: PriceItem[]): Promise<boolean> => {
    if (!shopifyContext) {
      toast.error("Shopify connection required", { 
        description: "Please connect to Shopify to sync data." 
      });
      return false;
    }
    
    if (!isShopifyHealthy) {
      const isHealthy = await checkShopifyConnection(shopifyContext);
      setIsShopifyHealthy(isHealthy);
      
      if (!isHealthy) {
        toast.warning("Shopify connection issues", {
          description: "The connection to Shopify is experiencing issues. Sync may be slower than usual.",
        });
      }
    }
    
    setIsSyncing(true);
    
    try {
      if (isGadgetInitialized && initGadgetClient()?.ready) {
        console.log("Attempting to sync with Shopify via Gadget...");
        const result = await syncToShopifyViaGadget(shopifyContext, items);
        
        if (result.success) {
          toast.success("Sync complete", {
            description: `Successfully synced ${items.length} items to Shopify via Gadget.`,
          });
          return true;
        }
        
        console.warn("Gadget sync failed, falling back to direct API");
      }
      
      console.log("Syncing with Shopify via direct API...");
      const syncResult = await syncWithShopify(shopifyContext, items, {
        retryAttempts: 3,
        retryDelay: 1000
      });
      
      if (syncResult) {
        toast.success("Sync complete", {
          description: `Successfully synced ${items.length} items to Shopify.`,
        });
        return true;
      } else {
        toast.error("Sync failed", {
          description: "Failed to sync items with Shopify. Please try again.",
        });
        return false;
      }
    } catch (error) {
      console.error("Error during Shopify sync:", error);
      toast.error("Sync error", {
        description: "An error occurred while syncing with Shopify.",
      });
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [shopifyContext, isGadgetInitialized, isShopifyHealthy]);
  
  const batchProcessShopifyItems = useCallback(async <T, R>(
    items: T[],
    processFn: (item: T) => Promise<R>,
    options = { batchSize: 10, concurrency: 1 }
  ): Promise<R[]> => {
    if (!shopifyContext) {
      throw new Error("Shopify connection required");
    }
    
    try {
      return await batchShopifyOperations(shopifyContext, items, processFn, options);
    } catch (error) {
      console.error("Error during batch processing:", error);
      throw error;
    }
  }, [shopifyContext]);

  const value: ShopifyProviderContextType = {
    shopifyContext,
    isShopifyConnected,
    isShopifyHealthy,
    lastConnectionCheck,
    isGadgetInitialized,
    isSyncing,
    connectToShopify,
    disconnectShopify,
    syncToShopify,
    loadShopifyData,
    batchProcessShopifyItems
  };

  return (
    <ShopifyContext.Provider value={value}>
      {children}
    </ShopifyContext.Provider>
  );
};
