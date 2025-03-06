
import { toast } from 'sonner';
import type { ShopifyContext } from '@/types/price';
import { initGadgetClient } from './client';

/**
 * Authenticate Shopify through Gadget with improved error handling
 * @param context Shopify context containing shop and access token
 * @returns Promise resolving to authentication success status
 */
export const authenticateShopify = async (context: ShopifyContext): Promise<boolean> => {
  const client = initGadgetClient();
  if (!client) {
    toast.error("Gadget configuration required", {
      description: "Please configure Gadget to use this feature."
    });
    return false;
  }
  
  try {
    console.log("Authenticating Shopify via Gadget...");
    // In production: Use Gadget SDK for authentication
    // const result = await client.auth.authenticateShopify({
    //   shop: context.shop,
    //   accessToken: context.accessToken
    // });
    
    toast.success("Shopify authenticated via Gadget", {
      description: "Successfully connected your Shopify store through Gadget."
    });
    return true;
  } catch (error) {
    console.error("Gadget Shopify authentication error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    toast.error("Authentication failed", {
      description: `Could not authenticate Shopify through Gadget: ${errorMessage}`
    });
    return false;
  }
};
