import type { PriceItem, GadgetConfig, ShopifyContext } from '@/types/price';

/**
 * Mock implementations for Gadget API calls
 * This centralizes all mock data for testing and development
 */

/**
 * Generate mock price items
 * @param count Number of items to generate
 * @returns Array of mock price items
 */
export const generateMockPriceItems = (count: number = 10): PriceItem[] => {
  return Array.from({ length: count }, (_, i) => {
    const oldPrice = Math.round(Math.random() * 100 + 10);
    const changeType = Math.random();
    let newPrice, status;
    
    if (changeType < 0.4) {
      // Increased price
      newPrice = oldPrice + Math.round(Math.random() * 10);
      status = 'increased';
    } else if (changeType < 0.7) {
      // Decreased price
      newPrice = Math.max(1, oldPrice - Math.round(Math.random() * 10));
      status = 'decreased';
    } else {
      // Unchanged price
      newPrice = oldPrice;
      status = 'unchanged';
    }
    
    return {
      id: `mock-${i}`,
      sku: `DEMO-${i.toString().padStart(3, '0')}`,
      name: `Demo Product ${i + 1}`,
      oldPrice,
      newPrice,
      status,
      difference: newPrice - oldPrice,
      isMatched: true
    };
  });
};

/**
 * Mock PDF processing response
 * @param file PDF file to process
 * @returns Mock PriceItem data that would come from PDF processing
 */
export const mockProcessPdf = async (file: File): Promise<PriceItem[]> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  console.log(`[MOCK] Processing PDF file: ${file.name} (${file.size} bytes)`);
  
  return generateMockPriceItems(Math.floor(Math.random() * 20) + 5);
};

/**
 * Mock market data enrichment
 * @param items Price items to enrich
 * @returns Enriched items with mock market data
 */
export const mockEnrichData = async (items: PriceItem[]): Promise<PriceItem[]> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  console.log(`[MOCK] Enriching ${items.length} items with market data`);
  
  return items.map(item => {
    // Calculate realistic market values based on the product price
    const basePrice = item.newPrice;
    const marketVariance = 0.25; // 25% variance in market
    const avgMultiplier = 1 + (Math.random() * 0.4 - 0.2); // ±20% from base
    const minMultiplier = 0.8 + (Math.random() * 0.1); // 80-90% of base
    const maxMultiplier = 1.2 + (Math.random() * 0.3); // 120-150% of base
    
    // Determine realistic price position
    let pricePosition: 'low' | 'average' | 'high';
    const priceRatio = basePrice / (basePrice * avgMultiplier);
    
    if (priceRatio < 0.9) {
      pricePosition = 'low';
    } else if (priceRatio > 1.1) {
      pricePosition = 'high';
    } else {
      pricePosition = 'average';
    }
    
    // Generate 3-5 competitive prices
    const compCount = 3 + Math.floor(Math.random() * 3);
    const competitorPrices = Array.from({length: compCount}, () => {
      return basePrice * (1 + (Math.random() * marketVariance * 2 - marketVariance));
    });
    
    return {
      ...item,
      marketData: {
        pricePosition,
        averagePrice: basePrice * avgMultiplier,
        minPrice: basePrice * minMultiplier,
        maxPrice: basePrice * maxMultiplier,
        competitorPrices,
        lastUpdated: new Date().toISOString()
      }
    };
  });
};

/**
 * Mock Shopify sync operation
 * @param context Shopify context
 * @param items Items to sync
 * @returns Mock success result
 */
export const mockSyncToShopify = async (
  context: ShopifyContext,
  items: PriceItem[]
): Promise<{success: boolean; message?: string}> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`[MOCK] Syncing ${items.length} items to Shopify shop: ${context.shop}`);
  
  // Simulate random failures for testing
  const randomFailure = Math.random() < 0.1;
  if (randomFailure) {
    return {
      success: false,
      message: "Mock sync failed - random failure for testing"
    };
  }
  
  return {
    success: true,
    message: `Successfully synced ${items.length} items to Shopify`
  };
};

/**
 * Mock Gadget connection test
 * @param config Gadget config
 * @returns Always returns true in mock mode
 */
export const mockTestConnection = async (config?: GadgetConfig): Promise<boolean> => {
  // Simulate connection delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log(`[MOCK] Testing Gadget connection to ${config?.appId || 'unknown'}`);
  
  return true;
};

/**
 * Get mock Gadget diagnostic info
 * @returns Mock diagnostics information
 */
export const mockGetDiagnostics = async (): Promise<any> => {
  const config = {
    appId: 'mock-app',
    environment: 'development' as const,
    featureFlags: {
      advancedAnalytics: true,
      batchProcessing: true,
      pdfExtraction: false
    }
  };
  
  return {
    isConfigured: true,
    isConnected: true,
    appId: config.appId,
    environment: config.environment,
    featureFlags: config.featureFlags,
    connectionLatency: 123,
    lastTestedAt: new Date(),
    errors: []
  };
};
