
/**
 * Data processing utilities for Gadget operations
 * Includes PDF processing and data enhancement
 */
import { toast } from 'sonner';
import type { PriceItem } from '@/types/price';
import { initGadgetClient } from './client';
import { logInfo, logError } from './logging';
import { startPerformanceTracking } from './telemetry';
import { mockProcessPdf } from './mocks';

/**
 * Process a PDF file using Gadget's document processing capabilities
 * @param file PDF file to process
 * @returns Promise resolving to extracted price items
 */
export const processPdfWithGadget = async (file: File): Promise<PriceItem[]> => {
  const client = initGadgetClient();
  
  // Start performance tracking
  const finishTracking = startPerformanceTracking('processPdfWithGadget', {
    fileName: file.name,
    fileSize: file.size
  });
  
  try {
    logInfo(`Processing PDF file: ${file.name} (${file.size} bytes)`, {}, 'processing');
    
    // Read file as ArrayBuffer
    const fileData = await file.arrayBuffer();
    
    if (client) {
      // In production: Use Gadget SDK for PDF processing
      // const formData = new FormData();
      // formData.append('file', new Blob([fileData]), file.name);
      // 
      // const result = await client.mutate.processPdfDocument({
      //   file: formData
      // });
      // 
      // return JSON.parse(result.items);
      
      // For development: Use mock implementation
      const items = await mockProcessPdf(fileData);
      
      logInfo(`PDF processing complete: extracted ${items.length} items`, {
        fileName: file.name
      }, 'processing');
      
      toast.success('PDF Processing Complete', {
        description: `Successfully extracted ${items.length} price items from PDF`
      });
      
      // Complete performance tracking
      await finishTracking();
      
      return items;
    } else {
      // No Gadget client, use mock implementation
      const items = await mockProcessPdf(fileData);
      
      // Complete performance tracking
      await finishTracking();
      
      return items;
    }
  } catch (error) {
    logError('Error processing PDF with Gadget', { error }, 'processing');
    
    toast.error('PDF Processing Failed', {
      description: error instanceof Error ? error.message : 'Unknown error processing PDF'
    });
    
    // Complete performance tracking even on error
    await finishTracking();
    
    throw error;
  }
};

/**
 * Enrich price data with market information via Gadget
 * @param items Price items to enrich
 * @returns Promise resolving to enriched items
 */
export const enrichPriceData = async (items: PriceItem[]): Promise<PriceItem[]> => {
  const client = initGadgetClient();
  if (!client) {
    return items;
  }
  
  // Start performance tracking
  const finishTracking = startPerformanceTracking('enrichPriceData', {
    itemCount: items.length
  });
  
  try {
    logInfo(`Enriching ${items.length} price items with market data`, {}, 'processing');
    
    // In production: Use Gadget SDK for data enrichment
    // const result = await client.mutate.enrichMarketData({
    //   items: JSON.stringify(items)
    // });
    // 
    // return JSON.parse(result.enrichedItems);
    
    // For development: Simple mock enrichment
    const enrichedItems = await mockEnrichItems(items);
    
    logInfo(`Data enrichment complete for ${items.length} items`, {}, 'processing');
    
    // Complete performance tracking
    await finishTracking();
    
    return enrichedItems;
  } catch (error) {
    logError('Error enriching data with Gadget', { error }, 'processing');
    
    // Complete performance tracking even on error
    await finishTracking();
    
    // Return original items on error
    return items;
  }
};

/**
 * Mock function to simulate data enrichment
 * @param items Items to enrich
 * @returns Enriched items
 */
const mockEnrichItems = async (items: PriceItem[]): Promise<PriceItem[]> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return items.map(item => {
    // Add mock market data for demonstration
    const competitorPrices = [
      item.newPrice * (0.9 + Math.random() * 0.2), // -10% to +10%
      item.newPrice * (0.85 + Math.random() * 0.3), // -15% to +15%
      item.newPrice * (0.95 + Math.random() * 0.1), // -5% to +5%
    ];
    
    const averagePrice = competitorPrices.reduce((sum, price) => sum + price, 0) / competitorPrices.length;
    const minPrice = Math.min(...competitorPrices);
    const maxPrice = Math.max(...competitorPrices);
    
    // Determine price position
    let pricePosition: 'low' | 'average' | 'high';
    if (item.newPrice < averagePrice * 0.95) {
      pricePosition = 'low';
    } else if (item.newPrice > averagePrice * 1.05) {
      pricePosition = 'high';
    } else {
      pricePosition = 'average';
    }
    
    return {
      ...item,
      marketData: {
        pricePosition,
        competitorPrices,
        averagePrice: parseFloat(averagePrice.toFixed(2)),
        minPrice: parseFloat(minPrice.toFixed(2)),
        maxPrice: parseFloat(maxPrice.toFixed(2))
      }
    };
  });
};
