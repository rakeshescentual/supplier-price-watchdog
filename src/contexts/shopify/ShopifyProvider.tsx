
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { ShopifyContext as ShopifyContextType, ShopifyContextType as ShopifyProviderContextType } from '@/types/price';
import { useShopifyConnection } from './hooks/useShopifyConnection';
import { useShopifySync } from './hooks/useShopifySync';
import { useShopifyData } from './hooks/useShopifyData';
import { useShopifyBatch } from './hooks/useShopifyBatch';

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
  
  const { 
    isShopifyConnected, 
    isShopifyHealthy, 
    lastConnectionCheck, 
    connectionCheckInterval,
    connectToShopify, 
    disconnectShopify 
  } = useShopifyConnection(shopifyContext, setShopifyContext);
  
  const { isSyncing, syncToShopify } = useShopifySync(shopifyContext, isShopifyHealthy);
  const { loadShopifyData } = useShopifyData(shopifyContext);
  const { batchProcessShopifyItems } = useShopifyBatch(shopifyContext);
  
  useEffect(() => {
    // Initialize Shopify and Gadget
    const { initializeShopifyApp } = require('@/lib/shopifyApi');
    const { initGadgetClient } = require('@/lib/gadgetApi');
    
    initializeShopifyApp();
    
    const gadgetClient = initGadgetClient();
    setIsGadgetInitialized(!!gadgetClient?.ready);
    
    return () => {
      if (connectionCheckInterval) {
        clearInterval(connectionCheckInterval);
      }
    };
  }, [connectionCheckInterval]);

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
