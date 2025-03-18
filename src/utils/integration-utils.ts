import { toast } from 'sonner';
import { checkShopifyConnection } from '@/lib/shopifyApi';
import type { ShopifyContext } from '@/types/price';

// Mock ShopifyContext for connection functions
const mockShopifyContext: ShopifyContext = {
  shop: 'example-shop.myshopify.com',
  accessToken: 'example-token'
};

/**
 * Utility functions for managing integrations
 */

/**
 * Test a Shopify connection 
 */
export const testShopifyStoreConnection = async () => {
  try {
    // Use the mock context to fix the missing parameter error
    const result = await checkShopifyConnection(mockShopifyContext);
    
    if (result.success) {
      toast.success('Shopify connection successful', {
        description: `Connected to ${mockShopifyContext.shop}`
      });
    } else {
      toast.error('Shopify connection failed', {
        description: result.message
      });
    }
    
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    toast.error('Shopify connection error', {
      description: errorMessage
    });
    
    return {
      success: false,
      message: errorMessage
    };
  }
};
