
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { ShopifyContextType, ShopifyProviderContextType } from '@/types/shopify';
import { useShopifyConnection } from './hooks/useShopifyConnection';
import { useShopifySync } from './hooks/useShopifySync';
import { ensureCompatibility } from '@/lib/compatibility';
import { initializeShopifyApp } from '@/lib/shopifyApi';

interface ShopifyProviderProps {
  children: React.ReactNode;
}

// Define the context type - using the type from types/shopify.ts
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
  
  const shopifyConnection = useShopifyConnection();
  const shopifySync = useShopifySync();
  
  // Import these modules using dynamic imports instead of require
  useEffect(() => {
    // Initialize Shopify
    initializeShopifyApp();
    
    // Initialize Gadget
    import('@/lib/gadgetApi').then(({ initGadgetClient }) => {
      const gadgetClient = initGadgetClient();
      setIsGadgetInitialized(!!gadgetClient?.ready);
    }).catch(err => {
      console.error('Error importing gadgetApi:', err);
    });
  }, []);

  const value: ShopifyProviderContextType = {
    shopifyContext,
    isShopifyConnected: shopifyConnection.isConnected,
    isShopifyHealthy: shopifyConnection.isConnected && !shopifyConnection.error,
    lastConnectionCheck: shopifyConnection.lastChecked || null,
    connectionCheckInterval: shopifyConnection.connectionCheckInterval || null,
    isGadgetInitialized,
    isSyncing: shopifySync.isSyncing,
    connectToShopify: async (shop: string, accessToken: string) => {
      // Not fully implemented yet
      return false;
    },
    disconnectShopify: () => {
      // Not implemented yet
    },
    syncToShopify: shopifySync.syncToShopify,
    loadShopifyData: async () => [], // Not implemented yet
    batchProcessShopifyItems: async (items, processFn, options) => {
      // Not implemented yet
      return [];
    }
  };

  return (
    <ShopifyContext.Provider value={value}>
      {children}
    </ShopifyContext.Provider>
  );
};

// Export the ShopifyProviderContextType to ensure it's available for imports
export type { ShopifyProviderContextType };
