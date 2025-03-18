
import { logInfo, logError } from '../logging';
import { initGadgetClient } from '../client';

/**
 * Use Gadget to process PDF files with enhanced capabilities
 * @param file PDF file to process
 * @param options Processing options
 * @returns Extracted data from PDF
 */
export const processPdfWithGadget = async (
  file: File,
  options: {
    extractTables?: boolean;
    detectSupplier?: boolean;
    enhanceQuality?: boolean;
  } = {}
): Promise<any[]> => {
  const client = initGadgetClient();
  if (!client) {
    throw new Error('Gadget client not initialized');
  }

  try {
    logInfo('Processing PDF with Gadget', { 
      fileName: file.name,
      fileSize: file.size,
      options
    }, 'pdf');

    // In production with actual Gadget SDK:
    // const formData = new FormData();
    // formData.append('file', file);
    // 
    // const result = await client.actions.processPdf.run({
    //   file: formData,
    //   options: {
    //     extractTables: options.extractTables ?? true,
    //     detectSupplier: options.detectSupplier ?? true,
    //     enhanceQuality: options.enhanceQuality ?? true
    //   }
    // });
    // 
    // return result.data;

    // For now, return mock data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return [
      { sku: 'DEMO-001', name: 'Product 1', oldPrice: 10.99, newPrice: 12.99, status: 'increased' },
      { sku: 'DEMO-002', name: 'Product 2', oldPrice: 15.99, newPrice: 14.99, status: 'decreased' },
      { sku: 'DEMO-003', name: 'Product 3', oldPrice: 7.99, newPrice: 7.99, status: 'unchanged' }
    ];
  } catch (error) {
    logError('Error processing PDF with Gadget', { error }, 'pdf');
    throw error;
  }
};

/**
 * Check if Gadget PDF processing is available
 * @returns Whether Gadget PDF processing is available
 */
export const isGadgetPdfProcessingAvailable = (): boolean => {
  const client = initGadgetClient();
  return !!client && !!client.actions?.processPdf;
};

/**
 * Get available PDF processing options
 * @returns Available processing options
 */
export const getAvailablePdfOptions = (): string[] => {
  if (!isGadgetPdfProcessingAvailable()) {
    return [];
  }
  
  return [
    'Table extraction',
    'Supplier detection',
    'Quality enhancement',
    'Multi-column support',
    'Page selection'
  ];
};
