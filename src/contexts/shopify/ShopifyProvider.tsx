
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { ShopifyContext as ShopifyContextType } from '@/types/price';
import { useShopifyConnection } from './hooks/useShopifyConnection';
import { useShopifySync } from './hooks/useShopifySync';
import { ensureCompatibility } from '@/lib/compatibility';
import { initializeShopifyApp } from '@/lib/shopifyApi';

interface ShopifyProviderProps {
  children: React.ReactNode;
}

// Define the context type
export interface ShopifyProviderContextType {
  shopifyContext: ShopifyContextType | null;
  isShopifyConnected: boolean;
  isShopifyHealthy: boolean;
  lastConnectionCheck: Date | null;
  isGadgetInitialized: boolean;
  isSyncing: boolean;
  connectToShopify: (shop: string, accessToken: string) => Promise<boolean>;
  disconnectShopify: () => void;
  syncToShopify: (items: any[]) => Promise<boolean>;
  loadShopifyData: () => Promise<any[]>;
  batchProcessShopifyItems: <T, R>(
    items: T[],
    processFn: (item: T) => Promise<R>,
    options?: { batchSize: number, concurrency: number }
  ) => Promise<R[]>;
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
  
  const shopifyConnection = useShopifyConnection();
  const { isSyncing, syncToShopify } = useShopifySync();
  
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
    
    return () => {
      if (shopifyConnection.connectionCheckInterval) {
        clearInterval(shopifyConnection.connectionCheckInterval);
      }
    };
  }, [shopifyConnection.connectionCheckInterval]);

  const value: ShopifyProviderContextType = {
    shopifyContext,
    isShopifyConnected: shopifyConnection.isShopifyConnected,
    isShopifyHealthy: shopifyConnection.isShopifyHealthy,
    lastConnectionCheck: shopifyConnection.lastConnectionCheck,
    isGadgetInitialized,
    isSyncing,
    connectToShopify: async () => false, // Not implemented yet
    disconnectShopify: shopifyConnection.disconnectShopify,
    syncToShopify,
    loadShopifyData: shopifyConnection.loadShopifyData,
    batchProcessShopifyItems: shopifyConnection.batchProcessShopifyItems
  };

  return (
    <ShopifyContext.Provider value={value}>
      {children}
    </ShopifyContext.Provider>
  );
};
