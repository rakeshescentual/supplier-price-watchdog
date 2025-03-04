
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { initializeShopifyApp, getShopifyProducts, syncWithShopify } from "@/lib/shopifyApi";
import { initializeGadget, authenticateWithShopify } from "@/lib/gadgetApi";
import { toast } from "sonner";
import type { PriceItem, ShopifyContext as ShopifyContextType } from "@/types/price";

interface ShopifyProviderProps {
  children: ReactNode;
}

interface ShopifyContextValue {
  shopifyContext: ShopifyContextType | null;
  isShopifyConnected: boolean;
  isGadgetInitialized: boolean;
  isLoadingShopifyData: boolean;
  isSyncing: boolean;
  gadgetClient: any | null;
  loadShopifyData: () => Promise<PriceItem[]>;
  syncToShopify: (items: PriceItem[]) => Promise<boolean>;
}

const ShopifyContext = createContext<ShopifyContextValue | undefined>(undefined);

export const ShopifyProvider = ({ children }: ShopifyProviderProps) => {
  const [shopifyContext, setShopifyContext] = useState<ShopifyContextType | null>(null);
  const [isShopifyConnected, setIsShopifyConnected] = useState(false);
  const [isGadgetInitialized, setIsGadgetInitialized] = useState(false);
  const [isLoadingShopifyData, setIsLoadingShopifyData] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [gadgetClient, setGadgetClient] = useState<any | null>(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize the Shopify app
        initializeShopifyApp();
        
        // Check for shop parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const shop = urlParams.get('shop');
        
        // Get Gadget config from localStorage if available
        const storedConfig = localStorage.getItem('gadgetConfig');
        const gadgetConfig = storedConfig ? JSON.parse(storedConfig) : {
          apiKey: '',
          appId: '',
          environment: 'development' as const
        };
        
        // Check if we have valid Gadget config
        if (gadgetConfig.apiKey && gadgetConfig.appId) {
          // Initialize Gadget connection
          const gadgetInit = initializeGadget(gadgetConfig);
          setIsGadgetInitialized(gadgetInit.isConnected);
          setGadgetClient(gadgetInit.client);
          
          toast.success("Connected to Gadget.dev", {
            description: `Environment: ${gadgetConfig.environment}`,
          });
          
          // If we have a shop parameter, attempt to authenticate with Shopify
          if (shop) {
            // Authenticate with Shopify
            const context = await authenticateWithShopify(shop);
            if (context) {
              setShopifyContext(context);
              setIsShopifyConnected(true);
              toast.success("Connected to Shopify via Gadget.dev", {
                description: `Shop: ${shop}`,
              });
            }
          }
        } else if (shop) {
          // If we have a shop but no Gadget config, we can still connect directly to Shopify
          toast.info("Gadget configuration not found", {
            description: "Using direct Shopify connection instead",
          });
          
          // Authenticate with Shopify directly
          const context = await authenticateWithShopify(shop);
          if (context) {
            setShopifyContext(context);
            setIsShopifyConnected(true);
            toast.success("Connected to Shopify", {
              description: `Shop: ${shop}`,
            });
          }
        }
      } catch (error) {
        console.error("Error initializing Shopify app:", error);
        toast.error("Connection error", {
          description: "Could not initialize connections",
        });
      }
    };
    
    initApp();
  }, []);

  const loadShopifyData = async (): Promise<PriceItem[]> => {
    if (!shopifyContext) return [];
    
    setIsLoadingShopifyData(true);
    try {
      // Try using Gadget first if available
      if (isGadgetInitialized && gadgetClient) {
        try {
          const shopifyProducts = await fetchShopifyProducts(shopifyContext, gadgetClient);
          toast.success("Shopify data loaded via Gadget", {
            description: `${shopifyProducts.length} products loaded`,
          });
          return shopifyProducts;
        } catch (gadgetError) {
          console.error("Error using Gadget, falling back to direct API:", gadgetError);
          // Fall back to direct API
        }
      }
      
      // Use direct Shopify API as fallback
      const shopifyProducts = await getShopifyProducts(shopifyContext);
      toast.success("Shopify data loaded", {
        description: `${shopifyProducts.length} products loaded`,
      });
      
      return shopifyProducts;
    } catch (error) {
      toast.error("Error loading Shopify data", {
        description: "Please check your connection and try again.",
      });
      return [];
    } finally {
      setIsLoadingShopifyData(false);
    }
  };

  const syncToShopify = async (items: PriceItem[]): Promise<boolean> => {
    if (!shopifyContext || items.length === 0) return false;
    
    setIsSyncing(true);
    try {
      let result;
      
      // Try using Gadget first if available
      if (isGadgetInitialized && gadgetClient) {
        try {
          result = await syncShopifyData(shopifyContext, gadgetClient, items);
          
          toast.success("Sync initiated via Gadget", {
            description: "Price changes are being processed in the background.",
          });
          return true;
        } catch (gadgetError) {
          console.error("Error using Gadget for sync, falling back to direct API:", gadgetError);
          // Fall back to direct API
        }
      }
      
      // Use direct Shopify API as fallback
      result = await syncWithShopify(shopifyContext, items);
      
      if (result) {
        toast.success("Sync complete", {
          description: "Price changes have been synchronized to Shopify.",
        });
        return true;
      } else {
        toast.error("Sync incomplete", {
          description: "Some items could not be synchronized.",
        });
        return false;
      }
    } catch (error) {
      toast.error("Error syncing with Shopify", {
        description: "Please try again later.",
      });
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const value = {
    shopifyContext,
    isShopifyConnected,
    isGadgetInitialized,
    isLoadingShopifyData,
    isSyncing,
    gadgetClient,
    loadShopifyData,
    syncToShopify
  };

  return (
    <ShopifyContext.Provider value={value}>
      {children}
    </ShopifyContext.Provider>
  );
};

export const useShopify = (): ShopifyContextValue => {
  const context = useContext(ShopifyContext);
  if (context === undefined) {
    throw new Error("useShopify must be used within a ShopifyProvider");
  }
  return context;
};

import { fetchShopifyProducts } from "@/lib/gadgetApi";
