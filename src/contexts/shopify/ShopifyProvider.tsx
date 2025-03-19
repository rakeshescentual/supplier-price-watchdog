
import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import type { 
  ShopifyContextType, 
  ShopifyProviderContextType,
  ShopifyConnectionResult,
  PriceItem as ShopifyPriceItem
} from '@/types/shopify';
import { useShopifyConnection } from './hooks/useShopifyConnection';
import { useShopifySync } from './hooks/useShopifySync';
import { ensureCompatibility } from '@/lib/compatibility';
import { initializeShopifyApp } from '@/lib/shopifyApi';
import { bulkUpdatePrices, getBulkOperationHistory, clearBulkOperationHistory } from '@/lib/shopify/bulkOperations';
import { checkShopifyConnection } from '@/lib/shopify/connection';
import { getShopifyProducts } from '@/lib/shopify/products';
import { batchShopifyOperations } from '@/lib/shopify/batch';
import { shopifyClient, initializeShopifyClient, resetShopifyClient } from '@/lib/shopify/client';
import { getBestVersion } from '@/lib/shopify/api-version';

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
  const [apiVersion, setApiVersion] = useState(getBestVersion());
  const healthCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Call the compatibility function to ensure 'require' is defined
  useEffect(() => {
    ensureCompatibility();
  }, []);
  
  // Load saved shopify context from localStorage on initialization
  useEffect(() => {
    try {
      const savedContext = localStorage.getItem('shopify_context');
      if (savedContext) {
        const parsedContext = JSON.parse(savedContext) as ShopifyContextType;
        // Validate that the saved context has the required fields
        if (parsedContext.shop && parsedContext.accessToken) {
          // Initialize the Shopify client
          initializeShopifyClient(parsedContext);
          setShopifyContext(parsedContext);
          
          // Verify the connection is still valid
          checkShopifyConnection(parsedContext).then((result) => {
            if (!result.success) {
              toast.error("Saved Shopify connection is invalid", {
                description: "Please reconnect to your Shopify store."
              });
              disconnectShopify();
            } else {
              toast.success("Reconnected to Shopify", {
                description: `Connected to ${parsedContext.shop}`
              });
            }
          }).catch(err => {
            console.error("Error checking saved connection:", err);
            disconnectShopify();
            toast.error("Error checking saved connection", {
              description: "Please reconnect to your Shopify store."
            });
          });
        }
      }
    } catch (error) {
      console.error("Error loading saved Shopify context:", error);
    }
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

    // Set up regular health check
    if (!healthCheckIntervalRef.current && shopifyContext) {
      healthCheckIntervalRef.current = setInterval(() => {
        checkShopifyConnection(shopifyContext)
          .then(result => {
            if (!result.success) {
              toast.error("Shopify connection lost", {
                description: "Please reconnect to continue syncing data."
              });
            }
          })
          .catch(err => {
            console.error("Health check error:", err);
          });
      }, 30 * 60 * 1000); // Check every 30 minutes
    }

    return () => {
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
        healthCheckIntervalRef.current = null;
      }
    };
  }, [shopifyContext]);

  const connectToShopify = async (shop: string, accessToken: string): Promise<boolean> => {
    try {
      // Validate shop and token format first
      if (!shop.includes('.myshopify.com')) {
        shop = `${shop}.myshopify.com`;
      }
      
      // Validate the token format
      if (!accessToken.startsWith('shpat_') && !accessToken.startsWith('shpca_')) {
        toast.warning("Token format warning", {
          description: "Access token should typically start with 'shpat_' or 'shpca_'"
        });
      }
      
      // Use the best API version
      const version = getBestVersion();
      
      const newContext: ShopifyContextType = {
        shop,
        accessToken,
        apiVersion: version
      };
      
      // Test connection before saving
      const connectionResult = await checkShopifyConnection(newContext);
      
      if (connectionResult.success) {
        // Initialize the Shopify client
        initializeShopifyClient(newContext);
        
        // Update the context with additional details
        const updatedContext: ShopifyContextType = {
          ...newContext,
          isActive: true,
          shopPlan: connectionResult.shopDetails?.plan || 'Basic',
          scopes: ['read_products', 'write_products', 'read_inventory', 'write_inventory']
        };
        
        // Save to state and localStorage
        setShopifyContext(updatedContext);
        localStorage.setItem('shopify_context', JSON.stringify(updatedContext));
        
        toast.success("Connected to Shopify", {
          description: `Successfully connected to ${shop}`
        });
        
        return true;
      } else {
        toast.error("Shopify connection failed", {
          description: connectionResult.message || "Invalid credentials"
        });
        return false;
      }
    } catch (error) {
      console.error("Error connecting to Shopify:", error);
      toast.error("Connection error", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
      return false;
    }
  };

  const disconnectShopify = () => {
    // Reset the Shopify client
    resetShopifyClient();
    
    // Clear context and localStorage
    setShopifyContext(null);
    localStorage.removeItem('shopify_context');
    
    toast.info("Disconnected from Shopify");
    
    // Clear health check interval
    if (healthCheckIntervalRef.current) {
      clearInterval(healthCheckIntervalRef.current);
      healthCheckIntervalRef.current = null;
    }
  };

  const testConnection = useCallback(async (): Promise<ShopifyConnectionResult> => {
    if (!shopifyContext) {
      return {
        success: false,
        message: "Not connected to Shopify"
      };
    }
    
    try {
      return await checkShopifyConnection(shopifyContext);
    } catch (error) {
      console.error("Error testing connection:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error testing connection"
      };
    }
  }, [shopifyContext]);

  const loadShopifyData = async () => {
    if (!shopifyContext) {
      toast.error("Not connected to Shopify");
      return [];
    }
    
    try {
      const products = await getShopifyProducts();
      return products;
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
      toast.error("Not connected to Shopify");
      return [];
    }
    
    return batchShopifyOperations(items, processFn, options);
  };

  const convertToShopifyPriceItems = (items: any[]): ShopifyPriceItem[] => {
    return items.map(item => ({
      id: item.id || item.sku, // Use sku as id if id is not present
      sku: item.sku,
      name: item.name,
      oldPrice: item.oldPrice,
      newPrice: item.newPrice,
      status: item.status,
      percentChange: item.percentChange || ((item.newPrice - item.oldPrice) / item.oldPrice * 100),
      difference: item.difference || (item.newPrice - item.oldPrice),
      isMatched: item.isMatched !== undefined ? item.isMatched : true,
      shopifyProductId: item.shopifyProductId || item.productId,
      shopifyVariantId: item.shopifyVariantId || item.variantId,
      category: item.category,
      supplier: item.supplier || item.vendor,
      ...item // Include any other properties
    }));
  };

  const value: ShopifyProviderContextType = {
    shopifyContext,
    isShopifyConnected: !!shopifyContext,
    isShopifyHealthy: shopifyConnection.isConnected && !shopifyConnection.error,
    lastConnectionCheck: shopifyConnection.lastChecked || null,
    connectionCheckInterval: shopifyConnection.connectionCheckInterval || null,
    isGadgetInitialized,
    isSyncing: shopifySync.isSyncing,
    connectToShopify,
    disconnectShopify,
    syncToShopify: shopifySync.syncToShopify,
    loadShopifyData,
    batchProcessShopifyItems,
    testConnection,
    bulkOperations: {
      updatePrices: (items, options) => {
        if (!shopifyContext) {
          return Promise.resolve({ 
            success: false, 
            message: "Not connected to Shopify", 
            updatedCount: 0, 
            failedCount: items.length 
          });
        }
        // Convert items to ensure they match the expected type
        const shopifyItems = convertToShopifyPriceItems(items);
        return bulkUpdatePrices(shopifyContext, shopifyItems, options);
      },
      getBulkOperationHistory,
      clearBulkOperationHistory
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
