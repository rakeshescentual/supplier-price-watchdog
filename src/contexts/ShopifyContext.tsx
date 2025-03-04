
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

  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize the Shopify app
        initializeShopifyApp();
        
        // Check for shop parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const shop = urlParams.get('shop');
        
        if (shop) {
          // Initialize Gadget connection
          const gadgetConfig = {
            apiKey: 'demo-gadget-key',
            appId: 'supplier-price-watch',
            environment: 'development' as const
          };
          
          const gadgetClient = initializeGadget(gadgetConfig);
          setIsGadgetInitialized(gadgetClient.isConnected);
          
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
      } catch (error) {
        console.error("Error initializing Shopify app:", error);
      }
    };
    
    initApp();
  }, []);

  const loadShopifyData = async (): Promise<PriceItem[]> => {
    if (!shopifyContext) return [];
    
    setIsLoadingShopifyData(true);
    try {
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
      const result = await syncWithShopify(shopifyContext, items);
      
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
