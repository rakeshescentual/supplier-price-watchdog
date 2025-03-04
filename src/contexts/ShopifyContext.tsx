
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import type { PriceItem, ShopifyContextType, ShopifyContext } from '@/types/price';
import { initializeShopifyApp, getShopifyProducts, syncWithShopify } from '@/lib/shopifyApi';
import { getGadgetConfig, initGadgetClient, syncToShopifyViaGadget } from '@/lib/gadgetApi';

interface ShopifyProviderProps {
  children: React.ReactNode;
}

const ShopifyContext = createContext<ShopifyContextType | undefined>(undefined);

export const useShopify = () => {
  const context = useContext(ShopifyContext);
  if (!context) {
    throw new Error("useShopify must be used within a ShopifyProvider");
  }
  return context;
};

export const ShopifyProvider: React.FC<ShopifyProviderProps> = ({ children }) => {
  const [shopifyContext, setShopifyContext] = useState<ShopifyContext | null>(null);
  const [isShopifyConnected, setIsShopifyConnected] = useState(false);
  const [isGadgetInitialized, setIsGadgetInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  useEffect(() => {
    // Initialize Shopify App Bridge
    initializeShopifyApp();
    
    // Check if Gadget is initialized
    const gadgetClient = initGadgetClient();
    setIsGadgetInitialized(!!gadgetClient?.ready);
    
    // Load Shopify context from localStorage
    const storedContext = localStorage.getItem('shopifyContext');
    if (storedContext) {
      try {
        const parsedContext = JSON.parse(storedContext);
        setShopifyContext(parsedContext);
        setIsShopifyConnected(true);
        toast.success("Shopify connected", {
          description: `Connected to Shopify store: ${parsedContext.shop}`,
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
      const newContext: ShopifyContext = { shop, accessToken };
      setShopifyContext(newContext);
      setIsShopifyConnected(true);
      
      // Save to localStorage
      localStorage.setItem('shopifyContext', JSON.stringify(newContext));
      
      toast.success("Shopify connected", {
        description: `Connected to Shopify store: ${shop}`,
      });
    } catch (error) {
      console.error("Error connecting to Shopify:", error);
      toast.error("Could not connect to Shopify", {
        description: "Please check your Shopify store URL and try again.",
      });
    }
  }, []);
  
  const disconnectShopify = useCallback(() => {
    setShopifyContext(null);
    setIsShopifyConnected(false);
    localStorage.removeItem('shopifyContext');
    
    toast.success("Shopify disconnected", {
      description: "You have disconnected from your Shopify store.",
    });
  }, []);
  
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
    
    setIsSyncing(true);
    
    try {
      // Try with Gadget first if gadget is initialized
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
      
      // Fall back to direct Shopify API
      console.log("Syncing with Shopify via direct API...");
      const syncResult = await syncWithShopify(shopifyContext, items);
      
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
  }, [shopifyContext, isGadgetInitialized]);

  const value: ShopifyContextType = {
    shopifyContext,
    isShopifyConnected,
    isGadgetInitialized,
    isSyncing,
    connectToShopify,
    disconnectShopify,
    syncToShopify,
    loadShopifyData
  };

  return (
    <ShopifyContext.Provider value={value}>
      {children}
    </ShopifyContext.Provider>
  );
};
