
import { PriceItem, ShopifyContext } from '@/types/price';
import { GadgetSyncResponse } from './types';
import { logInfo } from './logging';

/**
 * Mock implementation of syncing to Shopify via Gadget
 * @param context Shopify context
 * @param items Price items to sync
 * @returns Promise resolving to sync response
 */
export const mockSyncToShopify = async (
  context: ShopifyContext,
  items: PriceItem[]
): Promise<GadgetSyncResponse> => {
  logInfo(`Mock: Syncing ${items.length} items with Shopify via Gadget`, {
    shop: context.shop,
    itemCount: items.length
  }, 'mock');
  
  // Simulate processing delay (longer for more items)
  const processingTime = Math.min(300 + items.length * 10, 3000);
  await new Promise(resolve => setTimeout(resolve, processingTime));
  
  // Simulate occasional errors for realistic testing
  const hasErrors = Math.random() < 0.1;
  
  if (hasErrors) {
    const errorCount = Math.floor(Math.random() * Math.min(items.length, 3)) + 1;
    const errors = Array.from({ length: errorCount }, (_, i) => {
      const randomItemIndex = Math.floor(Math.random() * items.length);
      return {
        item: items[randomItemIndex].sku,
        message: "Failed to update price"
      };
    });
    
    return {
      success: false,
      message: `Sync completed with ${errorCount} errors`,
      itemCount: items.length - errorCount,
      errors
    };
  }
  
  return {
    success: true,
    message: "Successfully synced all items",
    itemCount: items.length
  };
};

/**
 * Mock implementation of authenticating with Shopify via Gadget
 * @param shop Shopify shop domain
 * @param accessToken Shopify access token
 * @returns Promise resolving to authentication success
 */
export const mockAuthenticateShopify = async (
  shop: string,
  accessToken: string
): Promise<{ success: boolean; message?: string }> => {
  logInfo(`Mock: Authenticating with Shopify via Gadget for shop ${shop}`, {}, 'mock');
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simple validation
  if (!shop.includes('.myshopify.com') && !shop.endsWith('.com')) {
    return {
      success: false,
      message: "Invalid shop domain format"
    };
  }
  
  if (!accessToken || accessToken.length < 10) {
    return {
      success: false,
      message: "Invalid access token format"
    };
  }
  
  return {
    success: true,
    message: "Authentication successful"
  };
};

/**
 * Mock implementation of processing PDF with Gadget
 * @param fileData The file data to process
 * @returns Promise resolving to processed items
 */
export const mockProcessPdf = async (
  fileData: ArrayBuffer
): Promise<PriceItem[]> => {
  logInfo("Mock: Processing PDF with Gadget", {
    fileSize: fileData.byteLength
  }, 'mock');
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate random number of items
  const itemCount = Math.floor(Math.random() * 30) + 5;
  
  // Generate mock items
  const items: PriceItem[] = Array.from({ length: itemCount }, (_, i) => ({
    sku: `SKU${i + 1000}`,
    name: `PDF Product ${i + 1}`,
    oldPrice: 19.99 + i,
    newPrice: 19.99 + i + (Math.random() > 0.7 ? 2 : 0),
    status: 'unchanged' as const,
    difference: 0,
    isMatched: true,
    productId: `gid://shopify/Product/${1000000 + i}`,
    variantId: `gid://shopify/ProductVariant/${2000000 + i}`,
    inventoryItemId: `gid://shopify/InventoryItem/${3000000 + i}`,
    inventoryLevel: Math.floor(Math.random() * 100),
    compareAtPrice: 24.99 + i,
    tags: ['pdf', 'imported'],
    historicalSales: Math.floor(Math.random() * 1000),
    lastOrderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    vendor: ['Supplier A', 'Supplier B', 'Supplier C'][Math.floor(Math.random() * 3)]
  }));
  
  // Calculate status and difference
  items.forEach(item => {
    if (item.newPrice > item.oldPrice) {
      item.status = 'increased';
      item.difference = item.newPrice - item.oldPrice;
    } else if (item.newPrice < item.oldPrice) {
      item.status = 'decreased';
      item.difference = item.oldPrice - item.newPrice;
    }
  });
  
  return items;
};

/**
 * Mock implementation of getting market data with Gadget
 * @param items Price items to get market data for
 * @returns Promise resolving to enhanced items
 */
export const mockGetMarketData = async (
  items: PriceItem[]
): Promise<PriceItem[]> => {
  logInfo(`Mock: Getting market data for ${items.length} items`, {
    itemCount: items.length
  }, 'mock');
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return items with added market data
  return items.map(item => {
    const enhancedItem = { ...item };
    
    // Add market data that matches the expected type
    enhancedItem.marketData = {
      pricePosition: ['low', 'average', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'average' | 'high',
      averagePrice: item.newPrice * (0.9 + Math.random() * 0.2),
      minPrice: item.newPrice * 0.8,
      maxPrice: item.newPrice * 1.2,
      competitorPrices: [
        item.newPrice * 0.9,
        item.newPrice * 0.95,
        item.newPrice * 1.05,
        item.newPrice * 1.1
      ]
    };
    
    return enhancedItem;
  });
};
