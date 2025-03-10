
/**
 * PDF processing utilities for Gadget
 */
import { toast } from 'sonner';
import type { PriceItem } from '@/types/price';
import { initGadgetClient } from '../client';
import { logInfo, logError } from '../logging';
import { startPerformanceTracking } from '../telemetry';
import { mockProcessPdf } from '../mocks';

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
