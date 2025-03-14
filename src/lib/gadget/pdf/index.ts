
/**
 * PDF processing functionality for Gadget
 */
import { logInfo, logError } from '../logging';
import { mockProcessPdf } from '../mocks';
import { PriceItem } from '@/types/price';

/**
 * Process a PDF document with Gadget to extract price data
 * @param file The PDF file to process
 * @returns Promise resolving to price items extracted from the PDF
 */
export const processPdfWithGadget = async (
  file: File
): Promise<PriceItem[]> => {
  try {
    logInfo(`Processing PDF with Gadget: ${file.name}`, {
      fileSize: file.size,
      fileType: file.type
    }, 'pdf');
    
    // Read file as ArrayBuffer
    const fileData = await file.arrayBuffer();
    
    // In production, this would upload the file to Gadget and process it
    // For now, use the mock implementation
    const items = await mockProcessPdf(fileData);
    
    logInfo(`PDF processing complete: ${items.length} items extracted`, {
      itemCount: items.length
    }, 'pdf');
    
    return items;
  } catch (error) {
    logError("Error processing PDF with Gadget", { error }, 'pdf');
    throw error;
  }
};
