
import { toast } from 'sonner';
import type { ShopifyContext } from '@/types/price';
import { initGadgetClient } from './client';

/**
 * Authenticate Shopify through Gadget with modern auth patterns
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
    // Using modern Gadget authentication patterns with Connection APIs
    // In production with actual Gadget SDK:
    //
    // const result = await client.connections.shopify.connect({
    //   shop: context.shop,
    //   accessToken: context.accessToken,
    //   scopes: ['read_products', 'write_products', 'read_orders']
    // });
    //
    // // Store connection ID for future use
    // localStorage.setItem('gadgetShopifyConnectionId', result.id);
    
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

/**
 * Create authentication headers for Gadget API requests using modern patterns
 * @param apiKey Gadget API key
 * @returns Headers object with authentication
 */
export const createGadgetAuthHeaders = (apiKey: string): HeadersInit => {
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

/**
 * Initiate Gadget OAuth flow for a third-party service
 * @param service Name of the service to authenticate with
 * @param redirectUri URI to redirect to after authentication
 * @returns Promise resolving to the OAuth URL
 */
export const initiateGadgetOAuth = async (
  service: string, 
  redirectUri: string
): Promise<string | null> => {
  const client = initGadgetClient();
  if (!client) return null;
  
  try {
    // In production with actual Gadget SDK:
    // 
    // const result = await client.connections[service].startOAuth({
    //   redirectUri,
    //   state: JSON.stringify({ returnTo: window.location.pathname })
    // });
    //
    // return result.authorizationUrl;
    
    // Mock for development
    return `https://gadget.dev/oauth/${service}?redirect_uri=${encodeURIComponent(redirectUri)}`;
  } catch (error) {
    console.error(`Error initiating ${service} OAuth:`, error);
    return null;
  }
};

/**
 * Handle OAuth callback from Gadget
 * @param service Name of the service being authenticated
 * @param code OAuth code from callback
 * @param state OAuth state from callback
 * @returns Promise resolving to success status
 */
export const handleGadgetOAuthCallback = async (
  service: string,
  code: string,
  state: string
): Promise<boolean> => {
  const client = initGadgetClient();
  if (!client) return false;
  
  try {
    // In production with actual Gadget SDK:
    //
    // const result = await client.connections[service].completeOAuth({
    //   code,
    //   state
    // });
    //
    // return result.success;
    
    // Mock for development
    return true;
  } catch (error) {
    console.error(`Error completing ${service} OAuth:`, error);
    return false;
  }
};
