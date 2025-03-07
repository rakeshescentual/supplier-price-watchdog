
/**
 * Mock implementations for Gadget functionality
 * Used for development and testing without a live Gadget connection
 */
import { toast } from 'sonner';
import type { PriceItem, ShopifyContext } from '@/types/price';
import { logInfo, logDebug } from './logging';

/**
 * Mock function for testing Gadget connection
 * @returns Promise resolving to a boolean indicating connection success
 */
export const mockTestConnection = async (): Promise<boolean> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 90% chance of successful connection for testing
  const isSuccessful = Math.random() < 0.9;
  
  logInfo(`Mock connection test ${isSuccessful ? 'succeeded' : 'failed'}`, {}, 'mocks');
  
  return isSuccessful;
};

/**
 * Mock authenticating with Shopify via Gadget
 * @param context Shopify context with shop and accessToken
 * @returns Promise resolving to a boolean indicating authentication success
 */
export const mockAuthenticateShopify = async (context: ShopifyContext): Promise<boolean> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  if (!context.shop || !context.accessToken) {
    return false;
  }
  
  logInfo(`Mock Shopify authentication for ${context.shop}`, {}, 'mocks');
  
  // 95% chance of successful authentication for testing
  return Math.random() < 0.95;
};

/**
 * Mock syncing price items to Shopify
 * @param context Shopify context
 * @param items Price items to sync
 * @returns Promise resolving to a sync result object
 */
export const mockSyncToShopify = async (
  context: ShopifyContext, 
  items: PriceItem[]
): Promise<{success: boolean; message?: string}> => {
  // Simulate network latency based on number of items
  const delay = Math.min(2000, 500 + (items.length * 10));
  await new Promise(resolve => setTimeout(resolve, delay));
  
  if (!context.shop || !context.accessToken) {
    return { success: false, message: "Invalid Shopify context" };
  }
  
  if (items.length === 0) {
    return { success: false, message: "No items to sync" };
  }
  
  logInfo(`Mock syncing ${items.length} items to ${context.shop}`, {}, 'mocks');
  
  // Simulate some item-specific processing
  const processedItems = items.map(item => {
    // Categorize the change type
    const changeType: "increased" | "decreased" | "unchanged" = 
      item.newPrice > item.oldPrice 
        ? "increased" 
        : item.newPrice < item.oldPrice 
          ? "decreased" 
          : "unchanged";
    
    // Log some details about each item
    logDebug(`Processing ${item.sku}: ${changeType} from ${item.oldPrice} to ${item.newPrice}`, {}, 'mocks');
    
    return {
      ...item,
      syncedAt: new Date().toISOString(),
      syncResult: changeType
    };
  });
  
  // 95% chance of success for the overall operation
  const isSuccessful = Math.random() < 0.95;
  
  return { 
    success: isSuccessful,
    message: isSuccessful 
      ? `Successfully synced ${items.length} items` 
      : "Some items failed to sync - please try again"
  };
};

/**
 * Mock PDF processing via Gadget
 * @param fileData File data as ArrayBuffer
 * @returns Promise resolving to extracted items
 */
export const mockProcessPdf = async (fileData: ArrayBuffer): Promise<PriceItem[]> => {
  // Simulate processing time based on file size
  const processingTime = Math.min(3000, 1000 + (fileData.byteLength / 1024));
  await new Promise(resolve => setTimeout(resolve, processingTime));
  
  logInfo(`Mock PDF processing: ${fileData.byteLength} bytes`, {}, 'mocks');
  
  // Generate 5-15 random items as if extracted from PDF
  const itemCount = 5 + Math.floor(Math.random() * 10);
  const mockItems: PriceItem[] = [];
  
  for (let i = 0; i < itemCount; i++) {
    const oldPrice = parseFloat((5 + Math.random() * 95).toFixed(2));
    const priceChange = (Math.random() - 0.3) * (oldPrice * 0.2); // Skew toward price increases
    const newPrice = parseFloat((oldPrice + priceChange).toFixed(2));
    
    const status: PriceItem['status'] = 
      newPrice > oldPrice 
        ? "increased" 
        : newPrice < oldPrice 
          ? "decreased" 
          : Math.random() < 0.1 
            ? "discontinued"
            : "unchanged";
    
    mockItems.push({
      sku: `SKU${10000 + i}`,
      name: `Mock Product ${i + 1}`,
      oldPrice,
      newPrice: status === "discontinued" ? 0 : newPrice,
      status,
      difference: status === "discontinued" ? -oldPrice : newPrice - oldPrice,
      isMatched: true
    });
  }
  
  return mockItems;
};
