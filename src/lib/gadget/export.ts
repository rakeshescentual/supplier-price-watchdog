
/**
 * Data export utilities for Gadget
 */
import { toast } from 'sonner';
import type { PriceItem } from '@/types/price';
import { initGadgetClient } from './client';
import { logInfo, logError } from './logging';
import { startPerformanceTracking } from './telemetry';

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

/**
 * Generate a local export for development without Gadget
 * Note: For production, this would be handled by Gadget
 */
const generateLocalExport = async (
  items: PriceItem[],
  format: 'csv' | 'xlsx' | 'json' | 'pdf',
  options: Record<string, any>
): Promise<Blob> => {
  // Convert items to the appropriate format
  switch (format) {
    case 'json':
      return new Blob([JSON.stringify(items, null, 2)], { 
        type: 'application/json' 
      });
      
    case 'csv': {
      if (items.length === 0) return new Blob([''], { type: 'text/csv' });
      
      // Get all possible headers from all items
      const headers = Array.from(
        new Set(
          items.flatMap(item => Object.keys(item))
            .filter(key => {
              // Filter out complex objects that don't serialize well to CSV
              const sample = items.find(item => item[key as keyof PriceItem]);
              const value = sample?.[key as keyof PriceItem];
              return typeof value !== 'object' || value === null;
            })
        )
      );
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...items.map(item => 
          headers.map(header => {
            const value = item[header as keyof PriceItem];
            if (value === null || value === undefined) return '';
            if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
            return String(value);
          }).join(',')
        )
      ].join('\n');
      
      return new Blob([csvContent], { type: 'text/csv' });
    }
      
    case 'xlsx':
      // For XLSX, we would use a library like xlsx
      // In a real implementation, this would be handled by Gadget
      // For demo, just return JSON in an XLSX-mimetype blob
      return new Blob([JSON.stringify(items)], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
    case 'pdf':
      // For PDF, we would use a library like jsPDF or PDFKit
      // In a real implementation, this would be handled by Gadget
      // For demo, just return JSON in a PDF-mimetype blob
      return new Blob([JSON.stringify(items)], { 
        type: 'application/pdf' 
      });
      
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};
