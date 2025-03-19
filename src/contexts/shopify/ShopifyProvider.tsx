
import React, { createContext, useState, useContext, useEffect } from "react";
import { ShopifyContext, ShopifyContextType } from "@/types/shopify";
import { PriceItem } from "@/types/shopify";
import { bulkUpdatePrices, getBulkOperationHistory, clearBulkOperationHistory } from "@/lib/shopify/bulkOperations";

// Create the context with a default value
const ShopifyContext = createContext<ShopifyContextType | undefined>(undefined);

// Provider component that wraps the app and provides the Shopify context
export function ShopifyProvider({ children }: { children: React.ReactNode }) {
  const [shopifyContext, setShopifyContext] = useState<ShopifyContext | null>(null);
  const [isShopifyConnected, setIsShopifyConnected] = useState(false);
  const [isShopifyHealthy, setIsShopifyHealthy] = useState(false);
  const [lastConnectionCheck, setLastConnectionCheck] = useState<Date | null>(null);
  const [connectionCheckInterval, setConnectionCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const [isGadgetInitialized, setIsGadgetInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Connect to Shopify
  const connectToShopify = async (shop: string, accessToken: string): Promise<boolean> => {
    // In a real implementation, this would verify the connection
    setShopifyContext({ shop, accessToken });
    setIsShopifyConnected(true);
    setIsShopifyHealthy(true);
    setLastConnectionCheck(new Date());
    return true;
  };

  // Disconnect from Shopify
  const disconnectShopify = () => {
    setShopifyContext(null);
    setIsShopifyConnected(false);
    setIsShopifyHealthy(false);
  };

  // Sync to Shopify
  const syncToShopify = async (items: any[], options?: { silent?: boolean }): Promise<boolean> => {
    if (!shopifyContext) return false;
    setIsSyncing(true);
    
    // Simulate a sync operation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSyncing(false);
    return true;
  };

  // Load data from Shopify
  const loadShopifyData = async () => {
    // In a real implementation, this would fetch data from Shopify
    return [];
  };

  // Batch process Shopify items
  const batchProcessShopifyItems = async <T, R>(
    items: T[],
    processFn: (item: T) => Promise<R>,
    options?: { batchSize?: number, concurrency?: number }
  ): Promise<R[]> => {
    const results: R[] = [];
    const batchSize = options?.batchSize || 50;
    const concurrency = options?.concurrency || 2;
    
    // Process in batches
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(processFn));
      results.push(...batchResults);
    }
    
    return results;
  };

  // Test the connection to Shopify
  const testConnection = async () => {
    setLastConnectionCheck(new Date());
    return {
      success: isShopifyConnected,
      message: isShopifyConnected ? "Connection successful" : "Not connected",
      shopDetails: isShopifyConnected ? {
        name: "Example Shop",
        domain: shopifyContext?.shop || "",
        plan: "Shopify Plus"
      } : undefined
    };
  };

  // Bulk operations
  const bulkOperations = {
    updatePrices: async (
      prices: PriceItem[],
      options?: {
        dryRun?: boolean;
        notifyCustomers?: boolean;
        onProgress?: (progress: number) => void;
      }
    ) => {
      if (!shopifyContext) {
        return {
          success: false,
          message: "Not connected to Shopify",
          updatedCount: 0,
          failedCount: prices.length
        };
      }
      
      return await bulkUpdatePrices(shopifyContext, prices, options);
    },
    getBulkOperationHistory: getBulkOperationHistory,
    clearBulkOperationHistory: clearBulkOperationHistory
  };

  // Initialize on mount
  useEffect(() => {
    // Auto-connect for development (would be removed in production)
    connectToShopify("example-shop.myshopify.com", "example-token");
    
    // Set up a health check interval
    const interval = setInterval(() => {
      if (isShopifyConnected) {
        testConnection();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    setConnectionCheckInterval(interval);
    
    return () => {
      if (connectionCheckInterval) {
        clearInterval(connectionCheckInterval);
      }
    };
  }, []);

  return (
    <ShopifyContext.Provider
      value={{
        shopifyContext,
        isShopifyConnected,
        isShopifyHealthy,
        lastConnectionCheck,
        connectionCheckInterval,
        isGadgetInitialized,
        isSyncing,
        connectToShopify,
        disconnectShopify,
        syncToShopify,
        loadShopifyData,
        batchProcessShopifyItems,
        bulkOperations,
        testConnection
      }}
    >
      {children}
    </ShopifyContext.Provider>
  );
}

// Custom hook to use the Shopify context
export function useShopify() {
  const context = useContext(ShopifyContext);
  
  if (context === undefined) {
    throw new Error("useShopify must be used within a ShopifyProvider");
  }
  
  return context;
}
