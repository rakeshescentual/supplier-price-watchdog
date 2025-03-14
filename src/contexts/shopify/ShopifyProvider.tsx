
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { ShopifyContext as ShopifyContextType } from '@/types/price';
import { useShopifyConnection, ShopifyContextType as ShopifyProviderContextType } from './hooks/useShopifyConnection';
import { ensureCompatibility } from '@/lib/compatibility';

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
  const [isGadgetInitialized, setIsGadgetInitialized] = useState(false);
  
  // Call the compatibility function to ensure 'require' is defined
  useEffect(() => {
    ensureCompatibility();
  }, []);
  
  const { 
    isShopifyConnected, 
    isShopifyHealthy, 
    lastConnectionCheck, 
    connectionCheckInterval,
    connectToShopify, 
    disconnectShopify 
  } = useShopifyConnection(shopifyContext, setShopifyContext);
  
  // Import these modules using dynamic imports instead of require
  useEffect(() => {
    // Initialize Shopify and Gadget
    import('@/lib/shopifyApi').then(({ initializeShopifyApp }) => {
      initializeShopifyApp();
    });
    
    import('@/lib/gadgetApi').then(({ initGadgetClient }) => {
      const gadgetClient = initGadgetClient();
      setIsGadgetInitialized(!!gadgetClient?.ready);
    });
    
    return () => {
      if (connectionCheckInterval) {
        clearInterval(connectionCheckInterval);
      }
    };
  }, [connectionCheckInterval]);

  // Stub implementations for required methods
  const syncToShopify = async (items: any[]): Promise<boolean> => {
    if (!shopifyContext) {
      toast.error("Shopify connection required");
      return false;
    }
    
    try {
      // In a real implementation, this would call Shopify API
      console.log(`Syncing ${items.length} items to Shopify...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Items synced to Shopify");
      return true;
    } catch (error) {
      console.error("Error syncing to Shopify:", error);
      toast.error("Failed to sync to Shopify");
      return false;
    }
  };
  
  const loadShopifyData = async () => {
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
  };
  
  const batchProcessShopifyItems = async <T, R>(
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
  };
  
  const isSyncing = false; // Default value, would be state in real implementation

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
