
/**
 * Mock implementations for Gadget operations in development
 */
import { toast } from 'sonner';
import type { PriceItem, ShopifyContext } from '@/types/price';
import { logInfo } from './logging';

/**
 * Mock implementation for syncing price data to Shopify
 * @param context Shopify context
 * @param items Price items to sync
 * @returns Promise with success status and message
 */
export const mockSyncToShopify = async (
  context: ShopifyContext,
  items: PriceItem[]
): Promise<{ success: boolean; message?: string }> => {
  // Simulate network delay for a realistic experience
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  logInfo("Using mock implementation for Shopify sync", {
    itemCount: items.length,
    shop: context.shop
  }, 'mock');
  
  // Simulate some random failures to test error handling
  const shouldFail = Math.random() < 0.1; // 10% chance of failure
  
  if (shouldFail) {
    return {
      success: false,
      message: "Simulated random failure in Shopify sync"
    };
  }
  
  // Simulate partial success with some items failing
  const partialSuccess = Math.random() < 0.2; // 20% chance of partial success
  
  if (partialSuccess) {
    const successCount = Math.floor(items.length * 0.7); // 70% items succeed
    return {
      success: true,
      message: `${successCount} items synced successfully, ${items.length - successCount} failed`
    };
  }
  
  // Full success case
  return {
    success: true,
    message: `All ${items.length} items synced successfully to ${context.shop}`
  };
};

/**
 * Mock implementation for processing PDF files
 * @param file PDF file to process
 * @returns Promise with extracted price items
 */
export const mockProcessPdf = async (file: File): Promise<PriceItem[]> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
  
  logInfo(`Processing PDF file: ${file.name}`, {
    fileSize: file.size,
    fileType: file.type
  }, 'mock');
  
  // Generate 10-20 random items
  const itemCount = 10 + Math.floor(Math.random() * 10);
  const mockItems: PriceItem[] = [];
  
  for (let i = 0; i < itemCount; i++) {
    const oldPrice = Math.round(10 + Math.random() * 90);
    const priceChange = Math.random() < 0.7 
      ? Math.round((Math.random() * 10) * 100) / 100 // 70% chance of price increase
      : Math.round((-Math.random() * 5) * 100) / 100; // 30% chance of price decrease
    
    const newPrice = Math.max(oldPrice + priceChange, 1);
    const difference = newPrice - oldPrice;
    const diffPercent = (difference / oldPrice) * 100;
    
    mockItems.push({
      sku: `ITEM-${1000 + i}`,
      name: `Mock Product ${i + 1}`,
      oldPrice,
      newPrice,
      difference,
      diffPercent: Math.round(diffPercent * 100) / 100,
      status: difference > 0 ? 'increase' : difference < 0 ? 'decrease' : 'unchanged'
    });
  }
  
  toast.success("PDF processed", {
    description: `Extracted ${mockItems.length} items from ${file.name}`
  });
  
  return mockItems;
};

/**
 * Mock implementation for enriching data with market information
 * @param items Price items to enrich
 * @returns Promise with enriched price items
 */
export const mockEnrichData = async (items: PriceItem[]): Promise<PriceItem[]> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));
  
  logInfo(`Enriching ${items.length} items with market data`, {}, 'mock');
  
  return items.map(item => ({
    ...item,
    marketData: {
      averagePrice: Math.round((item.newPrice * (0.9 + Math.random() * 0.2)) * 100) / 100,
      competitorPrices: [
        Math.round((item.newPrice * (0.85 + Math.random() * 0.1)) * 100) / 100,
        Math.round((item.newPrice * (0.95 + Math.random() * 0.1)) * 100) / 100,
        Math.round((item.newPrice * (1.05 + Math.random() * 0.1)) * 100) / 100
      ],
      pricePosition: Math.random() < 0.33 ? 'low' : Math.random() < 0.66 ? 'average' : 'high',
      lastUpdated: new Date().toISOString()
    }
  }));
};

/**
 * Mock implementation for fetching paginated data
 * @param page Page number
 * @param pageSize Number of items per page
 * @param totalItems Total number of items
 * @returns Promise with paginated data
 */
export const mockPaginatedData = async <T>(
  page: number,
  pageSize: number,
  totalItems: number,
  itemGenerator: (index: number) => T
): Promise<{
  items: T[];
  totalItems: number;
  hasMore: boolean;
}> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const items: T[] = [];
  
  for (let i = startIndex; i < endIndex; i++) {
    items.push(itemGenerator(i));
  }
  
  return {
    items,
    totalItems,
    hasMore: endIndex < totalItems
  };
};
