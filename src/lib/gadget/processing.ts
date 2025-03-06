
import { toast } from 'sonner';
import type { PriceItem } from '@/types/price';
import { initGadgetClient } from './client';

/**
 * Process PDF file through Gadget's document services with enhanced error handling
 * @param file PDF file to process
 * @returns Promise resolving to extracted price items
 */
export const processPdfWithGadget = async (file: File): Promise<PriceItem[]> => {
  const client = initGadgetClient();
  if (!client) {
    throw new Error("Gadget configuration required");
  }
  
  try {
    console.log("Processing PDF via Gadget...");
    // Mock implementation - in production would use Gadget SDK
    // const result = await client.mutate.processPDF({
    //   file: file,
    //   options: {
    //     extractTables: true,
    //     useOCR: true
    //   }
    // });
    
    // Mock data with correct PriceItem properties - Fixed to match PriceItem type
    return Promise.resolve([
      { 
        id: "mock1", 
        sku: "DEMO-001", 
        name: "Demo Product 1", 
        oldPrice: 19.99, 
        newPrice: 21.99, 
        status: 'increased', 
        difference: 2.00,
        isMatched: true
      },
      { 
        id: "mock2", 
        sku: "DEMO-002", 
        name: "Demo Product 2", 
        oldPrice: 24.99, 
        newPrice: 24.99, 
        status: 'unchanged', 
        difference: 0,
        isMatched: true
      }
    ]);
  } catch (error) {
    console.error("Error processing PDF with Gadget:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to process PDF file: ${errorMessage}`);
  }
};

/**
 * Enrich product data with market information using Gadget's capabilities
 * @param items Price items to enrich with market data
 * @returns Promise resolving to enriched price items
 */
export const enrichDataWithSearch = async (items: PriceItem[]): Promise<PriceItem[]> => {
  const client = initGadgetClient();
  if (!client) {
    throw new Error("Gadget configuration required");
  }
  
  try {
    console.log("Enriching data via Gadget...");
    // Mock implementation - in production would use Gadget SDK
    // const result = await client.mutate.batchEnrichItems({
    //   items: items,
    //   options: {
    //     searchCompetitors: true,
    //     includeMarketPositioning: true
    //   }
    // });
    
    // Mock enriched data - Fixed to use newPrice instead of price
    return items.map(item => ({
      ...item,
      marketData: {
        pricePosition: 'average' as 'low' | 'average' | 'high',
        averagePrice: item.newPrice * 1.2,
        minPrice: item.newPrice * 0.9,
        maxPrice: item.newPrice * 1.5,
        competitorPrices: [item.newPrice * 0.9, item.newPrice * 1.1, item.newPrice * 1.3]
      },
      potentialImpact: item.difference * 10
    }));
  } catch (error) {
    console.error("Error enriching data via Gadget:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to enrich product data: ${errorMessage}`);
  }
};
