
/**
 * Authentication utilities for Gadget sync
 */
import { logInfo, logError } from '../logging';
import { ShopifyContext } from '@/types/price';
import { mockAuthenticateShopify } from '../mocks';

/**
 * Authenticate with Shopify via Gadget
 * @param context Shopify context
 * @returns Promise resolving to authentication result
 */
export const authenticateShopify = async (
  context: ShopifyContext
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    logInfo(`Authenticating with Shopify via Gadget for shop ${context.shop}`, {}, 'sync');
    
    if (!context.shop || !context.accessToken) {
      return {
        success: false,
        message: "Shop and access token are required"
      };
    }
    
    // In production, this would use the Gadget client to authenticate
    // For now, use the mock implementation
    return await mockAuthenticateShopify(context.shop, context.accessToken);
    
  } catch (error) {
    logError("Error authenticating with Shopify via Gadget", { error }, 'sync');
    
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error during authentication"
    };
  }
};

/**
 * Validate Shopify credentials
 * @param shop Shopify shop domain
 * @param accessToken Shopify access token
 * @returns Promise resolving to validation result
 */
export const validateShopifyCredentials = async (
  shop: string,
  accessToken: string
): Promise<{
  valid: boolean;
  message?: string;
}> => {
  try {
    if (!shop) {
      return { valid: false, message: "Shop domain is required" };
    }
    
    if (!accessToken) {
      return { valid: false, message: "Access token is required" };
    }
    
    const result = await mockAuthenticateShopify(shop, accessToken);
    
    return {
      valid: result.success,
      message: result.message
    };
  } catch (error) {
    logError("Error validating Shopify credentials", { error }, 'sync');
    
    return {
      valid: false,
      message: error instanceof Error ? error.message : "Unknown error during validation"
    };
  }
};
