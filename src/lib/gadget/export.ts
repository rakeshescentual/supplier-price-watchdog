
import { toast } from 'sonner';
import type { PriceItem } from '@/types/price';
import { initGadgetClient } from './client';

/**
 * Export data from Gadget to CSV or JSON format
 * @param items Items to export
 * @param format Export format (csv or json)
 * @returns Promise resolving to blob of exported data
 */
export const exportDataFromGadget = async (
  items: PriceItem[],
  format: 'csv' | 'json' = 'csv'
): Promise<Blob> => {
  const client = initGadgetClient();
  if (!client) {
    throw new Error("Gadget configuration required");
  }
  
  try {
    console.log(`Exporting ${items.length} items in ${format} format...`);
    
    // In production: Use Gadget SDK for export functionality
    // const result = await client.query.exportData({
    //   items: items,
    //   format: format
    // });
    
    // For demonstration, create CSV or JSON locally
    let content: string;
    
    if (format === 'csv') {
      const headers = ['SKU', 'Name', 'Old Price', 'New Price', 'Difference', 'Status'];
      const rows = items.map(item => [
        item.sku,
        item.name,
        item.oldPrice?.toString() || '',
        item.newPrice.toString(),
        item.difference?.toString() || '',
        item.status || ''
      ]);
      
      content = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
    } else {
      content = JSON.stringify(items, null, 2);
    }
    
    const blob = new Blob(
      [content], 
      { type: format === 'csv' ? 'text/csv' : 'application/json' }
    );
    
    toast.success("Export successful", {
      description: `${items.length} items exported to ${format.toUpperCase()} format`
    });
    
    return blob;
  } catch (error) {
    console.error(`Error exporting data from Gadget in ${format} format:`, error);
    
    toast.error("Export failed", {
      description: `Failed to export data: ${error instanceof Error ? error.message : "Unknown error"}`
    });
    
    throw error;
  }
};
