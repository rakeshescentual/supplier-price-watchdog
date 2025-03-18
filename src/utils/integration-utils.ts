
import { toast } from 'sonner';
import { checkShopifyConnection } from '@/lib/shopifyApi';
import type { ShopifyContext, ShopifyConnectionResult } from '@/types/price';

// Mock ShopifyContext for connection functions
const mockShopifyContext: ShopifyContext = {
  shop: 'example-shop.myshopify.com',
  accessToken: 'example-token'
};

/**
 * Test a Shopify connection 
 */
export const testShopifyStoreConnection = async (): Promise<ShopifyConnectionResult> => {
  try {
    const result = await checkShopifyConnection(mockShopifyContext);
    
    // Handle both boolean and object results
    const success = typeof result === 'boolean' ? result : result.success;
    const message = typeof result === 'boolean' 
      ? (result ? 'Connected successfully' : 'Connection failed')
      : (result.message || '');
    
    if (success) {
      toast.success('Shopify connection successful', {
        description: `Connected to ${mockShopifyContext.shop}`
      });
    } else {
      toast.error('Shopify connection failed', {
        description: message
      });
    }
    
    return typeof result === 'boolean' ? { success } : result;
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
