import * as XLSX from 'xlsx';
import type { PriceItem, AnomalyStats } from '@/types/price';
import { processPdfWithGadget } from './gadgetApi';
import { excelWorker } from './excel-worker';

export const processExcelFile = async (file: File): Promise<PriceItem[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Validate workbook has at least one sheet
        if (workbook.SheetNames.length === 0) {
          reject(new Error('The Excel file does not contain any sheets'));
          return;
        }
        
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Check if we have valid data
        if (!Array.isArray(jsonData) || jsonData.length === 0) {
          reject(new Error('No valid data found in the Excel file'));
          return;
        }

        // Detect column headers to determine format
        const firstRow = jsonData[0] as Record<string, any>;
        const hasOldNewFormat = 'OldPrice' in firstRow || 'NewPrice' in firstRow;
        const hasCurrentUpdatedFormat = 'Current_Price' in firstRow || 'Updated_Price' in firstRow;
        
        // Process data based on detected format
        const items: PriceItem[] = jsonData.map((row: any) => {
          // Try to find relevant columns with flexible mapping
          const sku = row.SKU || row.Item_Code || row.ProductCode || row.sku || row.product_id || '';
          const oldName = row.OldName || row.Current_Name || row.Name || row.Product_Name || row.title || '';
          const newName = row.NewName || row.Updated_Name || row.Name || row.Product_Name || row.title || '';
          
          // Price handling with different formats
          let oldPrice = 0;
          let newPrice = 0;
          
          if (hasOldNewFormat) {
            oldPrice = parseFloat(row.OldPrice || 0);
            newPrice = parseFloat(row.NewPrice || 0);
          } else if (hasCurrentUpdatedFormat) {
            oldPrice = parseFloat(row.Current_Price || 0);
            newPrice = parseFloat(row.Updated_Price || 0);
          } else {
            // Default case - single price column
            oldPrice = parseFloat(row.Price || row.price || 0);
            newPrice = parseFloat(row.Price || row.price || 0);
          }
          
          const oldSupplierCode = row.OldSupplierCode || row.Current_SupplierCode || row.SupplierCode || row.vendor || '';
          const newSupplierCode = row.NewSupplierCode || row.Updated_SupplierCode || row.SupplierCode || row.vendor || '';
          const oldBarcode = row.OldBarcode || row.Current_Barcode || row.Barcode || row.barcode || '';
          const newBarcode = row.NewBarcode || row.Updated_Barcode || row.Barcode || row.barcode || '';
          const oldPackSize = row.OldPackSize || row.Current_PackSize || row.PackSize || '';
          const newPackSize = row.NewPackSize || row.Updated_PackSize || row.PackSize || '';
          const oldCost = parseFloat(row.OldCost || row.Current_Cost || row.Cost || row.cost_price || 0);
          const newCost = parseFloat(row.NewCost || row.Updated_Cost || row.Cost || row.cost_price || 0);
          const retailPrice = parseFloat(row.RetailPrice || row.Retail_Price || row.compare_at_price || 0);

          const difference = newPrice > 0 && oldPrice > 0 ? ((newPrice - oldPrice) / oldPrice) * 100 : 0;
          
          const oldMargin = retailPrice > 0 ? ((retailPrice - oldPrice) / retailPrice) * 100 : undefined;
          const newMargin = retailPrice > 0 ? ((retailPrice - newPrice) / retailPrice) * 100 : undefined;
          const marginChange = oldMargin && newMargin ? newMargin - oldMargin : undefined;

          let status: PriceItem['status'] = 'unchanged';
          if (newPrice === 0 && oldPrice > 0) status = 'discontinued';
          else if (oldPrice === 0 && newPrice > 0) status = 'new';
          else if (newPrice > oldPrice) status = 'increased';
          else if (newPrice < oldPrice) status = 'decreased';
          
          const anomalyType: string[] = [];
          if (oldName !== newName && oldName && newName) {
            anomalyType.push('name_change');
          }
          if (oldSupplierCode !== newSupplierCode && oldSupplierCode && newSupplierCode) {
            anomalyType.push('supplier_code_change');
          }
          if (oldBarcode !== newBarcode && oldBarcode && newBarcode) {
            anomalyType.push('barcode_change');
          }
          if (oldPackSize !== newPackSize && oldPackSize && newPackSize) {
            anomalyType.push('pack_size_change');
          }
          
          if (anomalyType.length > 0 && status !== 'new') {
            status = 'anomaly';
          }

          const isMatched = sku.trim() !== '';

          return {
            sku,
            name: newName || oldName,
            oldPrice,
            newPrice,
            status,
            difference,
            potentialImpact: status === 'discontinued' ? -(oldPrice * 12) : (newPrice - oldPrice) * -12,
            oldSupplierCode,
            newSupplierCode,
            oldBarcode,
            newBarcode,
            oldPackSize,
            newPackSize,
            oldTitle: oldName,
            newTitle: newName,
            oldMargin,
            newMargin,
            marginChange,
            anomalyType: anomalyType.length > 0 ? anomalyType : undefined,
            isMatched
          };
        });

        resolve(items);
      } catch (error) {
        console.error("Error processing Excel file:", error);
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

export const processPdfFile = async (file: File): Promise<PriceItem[]> => {
  try {
    console.log("Processing PDF file with Gadget...");
    const result = await processPdfWithGadget(file);
    
    if (!result) {
      throw new Error("PDF processing did not return valid data");
    }
    
    console.log(`PDF processing complete. ${result.length} items extracted.`);
    return result || [];
  } catch (error) {
    console.error("Error processing PDF file:", error);
    throw error;
  }
};

export const processFile = async (file: File): Promise<PriceItem[]> => {
  console.log(`Processing file: ${file.name}, type: ${file.type}`);
  
  if (file.type === 'application/pdf') {
    return processPdfFile(file);
  } else {
    // Use worker to process Excel files
    try {
      return await excelWorker.processFile(file);
    } catch (error) {
      console.error("Excel worker error, falling back to direct processing:", error);
      return processExcelFile(file);
    }
  }
};

export const getAnomalyStats = (items: PriceItem[]): AnomalyStats => {
  const anomalies = items.filter(item => item.status === 'anomaly');
  
  return {
    totalAnomalies: anomalies.length,
    nameChanges: anomalies.filter(item => item.anomalyType?.includes('name_change')).length,
    supplierCodeChanges: anomalies.filter(item => item.anomalyType?.includes('supplier_code_change')).length,
    barcodeChanges: anomalies.filter(item => item.anomalyType?.includes('barcode_change')).length,
    packSizeChanges: anomalies.filter(item => item.anomalyType?.includes('pack_size_change')).length,
    unmatched: items.filter(item => !item.isMatched).length
  };
};

export const exportToShopifyFormat = (items: PriceItem[]): Blob => {
  const shopifyData = items.map(item => ({
    'Handle': item.sku.toLowerCase().replace(/\s+/g, '-'),
    'Title': item.name,
    'Variant Price': item.newPrice.toFixed(2),
    'Variant Compare At Price': item.oldPrice > item.newPrice ? item.oldPrice.toFixed(2) : '',
    'Variant SKU': item.sku,
    'Variant Barcode': item.newBarcode || item.oldBarcode || '',
    'Vendor': item.newSupplierCode || item.oldSupplierCode || '',
    'Tags': item.status === 'new' ? 'new,price_updated' : 'price_updated',
    'Published': 'TRUE',
    'Variant Inventory Qty': '0', // Placeholder, would need actual inventory data
  }));

  const worksheet = XLSX.utils.json_to_sheet(shopifyData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }) as unknown as Blob;
};

export const mergeWithShopifyData = (excelItems: PriceItem[], shopifyItems: PriceItem[]): PriceItem[] => {
  return excelItems.map(excelItem => {
    const shopifyMatch = shopifyItems.find(shopifyItem => 
      shopifyItem.sku === excelItem.sku || 
      (shopifyItem.oldBarcode && excelItem.oldBarcode && shopifyItem.oldBarcode === excelItem.oldBarcode)
    );
    
    if (shopifyMatch) {
      return {
        ...excelItem,
        productId: shopifyMatch.productId,
        variantId: shopifyMatch.variantId,
        inventoryItemId: shopifyMatch.inventoryItemId,
        inventoryLevel: shopifyMatch.inventoryLevel,
        compareAtPrice: shopifyMatch.compareAtPrice,
        tags: shopifyMatch.tags,
        historicalSales: shopifyMatch.historicalSales,
        lastOrderDate: shopifyMatch.lastOrderDate,
        vendor: shopifyMatch.vendor,
        metafields: shopifyMatch.metafields,
        isMatched: true
      };
    }
    
    return excelItem;
  });
};
