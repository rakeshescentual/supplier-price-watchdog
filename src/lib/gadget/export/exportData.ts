
/**
 * Data export utilities for Gadget
 */
import { toast } from 'sonner';
import type { PriceItem } from '@/types/price';
import { initGadgetClient } from '../client';
import { logInfo, logError } from '../logging';
import { startPerformanceTracking } from '../telemetry';
import { generateLocalExport } from './formatters';

/**
 * Export data to various formats via Gadget
 * @param items Items to export
 * @param format Export format
 * @param options Export options
 * @returns Promise resolving to an export URL or Blob
 */
export const exportData = async (
  items: PriceItem[],
  format: 'csv' | 'xlsx' | 'json' | 'pdf',
  options: {
    fileName?: string;
    includeMetadata?: boolean;
    groupBy?: 'status' | 'category' | 'vendor';
    filterFn?: (item: PriceItem) => boolean;
  } = {}
): Promise<string | Blob> => {
  const client = initGadgetClient();
  
  // Start performance tracking
  const finishTracking = startPerformanceTracking('exportData', {
    format,
    itemCount: items.length,
    ...options
  });
  
  try {
    logInfo(`Exporting ${items.length} items to ${format}`, {
      format,
      ...options
    }, 'export');
    
    // Apply filtering if provided
    const filteredItems = options.filterFn 
      ? items.filter(options.filterFn)
      : items;
    
    // Determine filename
    const fileName = options.fileName || 
      `price-data-export-${new Date().toISOString().split('T')[0]}.${format}`;
    
    if (client) {
      // In production: Use Gadget for export processing
      // const result = await client.mutate.generateExport({
      //   data: JSON.stringify(filteredItems),
      //   format,
      //   options: JSON.stringify(options)
      // });
      // 
      // return result.downloadUrl;
      
      // For development: Simple in-browser export
      const blob = await generateLocalExport(filteredItems, format, options);
      
      logInfo(`Export completed: ${fileName}`, {
        format,
        size: blob.size,
        itemCount: filteredItems.length
      }, 'export');
      
      // Complete performance tracking
      await finishTracking();
      
      return blob;
    } else {
      // No Gadget client available, fallback to local export
      const blob = await generateLocalExport(filteredItems, format, options);
      
      logInfo(`Local export completed: ${fileName}`, {
        format,
        size: blob.size,
        itemCount: filteredItems.length
      }, 'export');
      
      // Complete performance tracking
      await finishTracking();
      
      return blob;
    }
  } catch (error) {
    logError('Error during export operation', { error }, 'export');
    toast.error('Export failed', {
      description: error instanceof Error ? error.message : 'Unknown error during export'
    });
    
    // Complete performance tracking even on error
    await finishTracking();
    
    throw error;
  }
};
