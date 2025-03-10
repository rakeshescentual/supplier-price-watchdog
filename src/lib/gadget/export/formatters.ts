
/**
 * Export format utilities
 */
import type { PriceItem } from '@/types/price';

/**
 * Generate a local export for development without Gadget
 * Note: For production, this would be handled by Gadget
 */
export const generateLocalExport = async (
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
