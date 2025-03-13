
/**
 * PDF processing utilities for Gadget integration
 */
import { logInfo, logError } from './logging';
import { initGadgetClient } from './client';
import { PriceItem } from '@/types/price';

/**
 * Process a PDF file using Gadget.dev's document processing capabilities
 * @param file The PDF file to process
 * @returns Extracted price items from the PDF
 */
export const processPdfWithGadget = async (file: File): Promise<PriceItem[]> => {
  const client = initGadgetClient();
  
  if (!client) {
    logError('Cannot process PDF: Gadget client not initialized', {}, 'pdf');
    throw new Error('Gadget client not initialized');
  }
  
  try {
    logInfo(`Processing PDF file: ${file.name} (${Math.round(file.size / 1024)} KB)`, {}, 'pdf');
    
    // For development/testing, we return a mock response
    // In production, this would call the actual Gadget PDF processing action
    
    // Example:
    // const formData = new FormData();
    // formData.append('file', file);
    // const result = await client.mutate.processPdf({ file: formData });
    
    // Mock response for development
    const mockItems: PriceItem[] = [
      {
        sku: 'PDF-ITEM-001',
        name: 'Example Product 1',
        oldPrice: 19.99,
        newPrice: 24.99,
        status: 'increased',
        difference: 25,
        potentialImpact: -60,
        isMatched: true
      },
      {
        sku: 'PDF-ITEM-002',
        name: 'Example Product 2',
        oldPrice: 39.99,
        newPrice: 34.99,
        status: 'decreased',
        difference: -12.5,
        potentialImpact: 60,
        isMatched: true
      }
    ];
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    logInfo(`PDF processing complete. ${mockItems.length} items extracted.`, {}, 'pdf');
    return mockItems;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Error processing PDF: ${errorMessage}`, { error }, 'pdf');
    throw error;
  }
}
