
import { toast } from 'sonner';
import type { PriceItem } from '@/types/price';
import { initGadgetClient } from './client';
import { reportError, trackUsage, startPerformanceTracking } from './telemetry';
import { logInfo, logError } from './logging';

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
    const error = new Error("Gadget configuration required");
    await reportError(error, { component: 'exportDataFromGadget', severity: 'medium' });
    throw error;
  }
  
  // Start performance tracking
  const finishTracking = startPerformanceTracking('exportDataFromGadget', {
    itemCount: items.length,
    format
  });
  
  try {
    logInfo(`Exporting ${items.length} items in ${format} format...`, {
      itemCount: items.length,
      format
    }, 'export');
    
    // Track feature usage
    await trackUsage('data_export', { itemCount: items.length, format });
    
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
    
    logInfo("Export completed successfully", { 
      itemCount: items.length,
      format,
      contentSize: content.length
    }, 'export');
    
    toast.success("Export successful", {
      description: `${items.length} items exported to ${format.toUpperCase()} format`
    });
    
    // Finish performance tracking
    await finishTracking();
    
    return blob;
  } catch (error) {
    logError(`Error exporting data from Gadget in ${format} format`, { error }, 'export');
    
    // Report error to telemetry system
    await reportError(error instanceof Error ? error : String(error), {
      component: 'exportDataFromGadget',
      severity: 'medium',
      action: 'export_data',
      metadata: { format }
    });
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    toast.error("Export failed", {
      description: `Failed to export data: ${errorMessage}`
    });
    
    // Finish performance tracking even on error
    await finishTracking();
    
    throw error;
  }
};
