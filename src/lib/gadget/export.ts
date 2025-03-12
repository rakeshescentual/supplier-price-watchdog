
/**
 * Export utilities for Gadget data
 */
import { logInfo, logError } from './logging';
import { initGadgetClient } from './client';
import { startPerformanceTracking } from './telemetry';
import { toast } from 'sonner';
import type { PriceItem } from '@/types/price';

/**
 * Available export formats
 */
export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf';

/**
 * Options for export operation
 */
export interface ExportOptions {
  format: ExportFormat;
  includeMetadata?: boolean;
  filename?: string;
  filterBy?: Record<string, any>;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Export data to a file
 * @param data Data to export
 * @param options Export options
 * @returns Promise resolving to success status
 */
export const exportData = async <T extends Record<string, any>>(
  data: T[],
  options: ExportOptions
): Promise<{ success: boolean; fileUrl?: string }> => {
  const finishTracking = startPerformanceTracking('exportData', { 
    format: options.format,
    itemCount: data.length
  });
  
  try {
    logInfo(`Exporting ${data.length} items to ${options.format}`, options, 'export');
    
    // Get Gadget client
    const client = initGadgetClient();
    if (!client) {
      throw new Error('Gadget client not initialized');
    }
    
    // For development, create a mock export
    let fileUrl = '';
    
    // In production with actual Gadget.dev SDK:
    // const result = await client.mutate.exportData({
    //   data: JSON.stringify(data),
    //   options: JSON.stringify(options)
    // });
    // fileUrl = result.fileUrl;
    
    // For development, simulate file generation
    const filename = options.filename || `export-${Date.now()}.${options.format}`;
    
    // Generate file content based on format
    let content: string | Blob;
    
    switch (options.format) {
      case 'json':
        content = JSON.stringify(data, null, 2);
        break;
      case 'csv':
        // Simple CSV conversion - in production use a proper CSV library
        if (data.length === 0) return { success: false };
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(item => Object.values(item).join(','));
        content = [headers, ...rows].join('\n');
        break;
      case 'xlsx':
      case 'pdf':
        // These formats require specialized libraries
        // For development, we'll just use JSON as a fallback
        content = JSON.stringify(data, null, 2);
        break;
    }
    
    // Create a download link
    const blob = new Blob([content], { type: getMimeType(options.format) });
    fileUrl = URL.createObjectURL(blob);
    
    // Simulate downloading the file
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(fileUrl), 100);
    
    logInfo(`Export completed successfully: ${filename}`, { fileUrl }, 'export');
    finishTracking();
    
    return { success: true, fileUrl };
  } catch (error) {
    logError('Error exporting data', { error, options }, 'export');
    finishTracking();
    
    // Show error toast
    toast.error("Export failed", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    
    return { success: false };
  }
};

/**
 * Export price items to Shopify-compatible format
 * @param items Price items to export
 * @returns Promise resolving to success status
 */
export const exportPriceItemsToShopify = async (
  items: PriceItem[]
): Promise<{ success: boolean; fileUrl?: string }> => {
  // Filter only the relevant fields for Shopify
  const shopifyData = items.map(item => ({
    handle: item.sku.toLowerCase().replace(/\s+/g, '-'), // Create handle from SKU
    sku: item.sku,
    title: item.name,
    price: item.newPrice || item.oldPrice, // Use newPrice, fallback to oldPrice
    compare_at_price: item.oldPrice, // Use oldPrice as the original price
    status: item.status === 'discontinued' ? 'draft' : 'active'
  }));
  
  return exportData(shopifyData, {
    format: 'csv',
    filename: 'shopify-price-update.csv',
    includeMetadata: false
  });
};

/**
 * Get MIME type for export format
 * @param format Export format
 * @returns MIME type string
 */
const getMimeType = (format: ExportFormat): string => {
  switch (format) {
    case 'csv': return 'text/csv';
    case 'json': return 'application/json';
    case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'pdf': return 'application/pdf';
    default: return 'text/plain';
  }
};
