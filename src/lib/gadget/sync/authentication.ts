
/**
 * Shopify authentication via Gadget
 */
import type { ShopifyContext } from '@/types/price';
import { initGadgetClient } from '../client';
import { logInfo, logError } from '../logging';

/**
 * Authenticate with Shopify via Gadget
 * @param context Shopify context with shop and accessToken
 * @returns Promise resolving to a boolean indicating authentication success
 */
export const authenticateShopify = async (context: ShopifyContext): Promise<boolean> => {
  const client = initGadgetClient();
  if (!client) {
    return false;
  }
  
  try {
    logInfo(`Authenticating Shopify for ${context.shop} via Gadget`, {
      shop: context.shop
    }, 'sync');
    
    // When using actual Gadget.dev SDK:
    // const result = await client.mutate.authenticateShopify({
    //   shop: context.shop,
    //   accessToken: context.accessToken
    // });
    // return !!result?.success;
    
    // For development, use mock implementation
    const { mockAuthenticateShopify } = await import('../mocks');
    const result = await mockAuthenticateShopify(context);
    
    if (result) {
      logInfo(`Successfully authenticated Shopify for ${context.shop}`, {}, 'sync');
    } else {
      logInfo(`Failed to authenticate Shopify for ${context.shop}`, {}, 'sync');
    }
    
    return result;
  } catch (error) {
    logError("Error authenticating with Shopify via Gadget", { error }, 'sync');
    
    return false;
  }
};
