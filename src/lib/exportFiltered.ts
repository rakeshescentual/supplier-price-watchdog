
import { utils, writeFile } from 'xlsx';
import type { PriceItem } from '@/types/price';

/**
 * Exports filtered price items to Excel file
 */
export const exportFilteredItems = (items: PriceItem[], filename = 'filtered-price-data.xlsx') => {
  // Prepare data for export
  const exportData = items.map(item => ({
    SKU: item.sku,
    Name: item.name,
    'Old Price': item.oldPrice.toFixed(2),
    'New Price': item.newPrice.toFixed(2),
    'Status': item.status,
    'Difference (%)': item.difference.toFixed(2),
    'Supplier Code': item.newSupplierCode || item.oldSupplierCode || '',
    'Pack Size': item.newPackSize || item.oldPackSize || '',
    'Margin (%)': item.newMargin?.toFixed(1) || '',
    'Potential Impact ($)': item.potentialImpact?.toLocaleString() || ''
  }));

  // Create workbook and worksheet
  const wb = utils.book_new();
  const ws = utils.json_to_sheet(exportData);
  
  // Add worksheet to workbook
  utils.book_append_sheet(wb, ws, 'Price Data');
  
  // Generate and download file
  writeFile(wb, filename);
};
