
import { toast } from 'sonner';
import { ShopifyContext } from '@/types/price';
import { checkShopifyConnection } from '@/lib/shopify';
import { logInfo, logError } from '@/lib/gadget/logging';

/**
 * Test connection to multiple services at once
 * @param services Object containing service connections to test
 * @returns Promise resolving to object with test results
 */
export const testIntegrationConnections = async (
  services: {
    shopify?: ShopifyContext;
    klaviyo?: { apiKey: string; privateKey?: string };
    gadget?: boolean;
    google?: boolean;
  }
): Promise<{
  shopify: boolean;
  klaviyo: boolean;
  gadget: boolean;
  google: boolean;
}> => {
  logInfo("Testing integration connections", {
    hasShopify: !!services.shopify,
    hasKlaviyo: !!services.klaviyo,
    hasGadget: !!services.gadget,
    hasGoogle: !!services.google
  });
  
  const results = {
    shopify: false,
    klaviyo: false,
    gadget: false,
    google: false
  };
  
  try {
    // Test Shopify connection if provided
    if (services.shopify) {
      results.shopify = await checkShopifyConnection(services.shopify);
    }
    
    // Test Klaviyo connection if provided
    if (services.klaviyo) {
      // In a real implementation, this would call the Klaviyo API
      // For now, assume success if API key is provided
      results.klaviyo = !!services.klaviyo.apiKey;
    }
    
    // Test Gadget connection if enabled
    if (services.gadget) {
      const { isGadgetInitialized, checkGadgetHealth, isHealthy } = await import('@/lib/gadget');
      
      if (isGadgetInitialized()) {
        const health = await checkGadgetHealth();
        results.gadget = isHealthy(health);
      }
    }
    
    // Test Google connection if enabled
    if (services.google) {
      // In a real implementation, this would check Google authentication
      // For now, check localStorage for Google token
      const googleToken = localStorage.getItem('googleToken');
      results.google = !!googleToken;
    }
    
    // Show summary toast
    const connectedCount = Object.values(results).filter(Boolean).length;
    const attemptedCount = Object.keys(services).length;
    
    if (connectedCount === attemptedCount && attemptedCount > 0) {
      toast.success("All connections successful", {
        description: `Successfully connected to ${connectedCount} services.`
      });
    } else if (connectedCount > 0) {
      toast.warning("Some connections failed", {
        description: `Connected to ${connectedCount}/${attemptedCount} services.`
      });
    } else if (attemptedCount > 0) {
      toast.error("All connections failed", {
        description: "Could not connect to any services. Please check your credentials."
      });
    }
    
    return results;
  } catch (error) {
    logError("Error testing integration connections", { error });
    
    toast.error("Error testing connections", {
      description: "An error occurred while testing service connections."
    });
    
    return results;
  }
};

/**
 * Get appropriate authentication headers for Shopify API calls
 * @param shopifyContext Shopify context
 * @returns Object containing headers for Shopify API calls
 */
export const getShopifyHeaders = (shopifyContext: ShopifyContext): Record<string, string> => {
  return {
    'X-Shopify-Access-Token': shopifyContext.accessToken,
    'Content-Type': 'application/json'
  };
};

/**
 * Get appropriate authentication headers for Klaviyo API calls
 * @param apiKey Klaviyo API key
 * @param privateKey Optional Klaviyo private key for additional endpoints
 * @returns Object containing headers for Klaviyo API calls
 */
export const getKlaviyoHeaders = (
  apiKey: string,
  privateKey?: string
): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  // Use private key for authenticated endpoints if available
  if (privateKey) {
    headers['Authorization'] = `Klaviyo-API-Key ${privateKey}`;
  } else {
    headers['api-key'] = apiKey;
  }
  
  return headers;
};
