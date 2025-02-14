
import * as XLSX from 'xlsx';
import type { PriceItem } from '@/types/price';

export const processExcelFile = async (file: File): Promise<PriceItem[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Process the data and calculate differences
        const items: PriceItem[] = jsonData.map((row: any) => {
          const oldPrice = parseFloat(row.OldPrice || row.Current_Price || 0);
          const newPrice = parseFloat(row.NewPrice || row.Updated_Price || 0);
          const difference = ((newPrice - oldPrice) / oldPrice) * 100;

          let status: PriceItem['status'] = 'unchanged';
          if (newPrice === 0) status = 'discontinued';
          else if (newPrice > oldPrice) status = 'increased';
          else if (newPrice < oldPrice) status = 'decreased';

          return {
            sku: row.SKU || row.Item_Code || '',
            name: row.Name || row.Product_Name || '',
            oldPrice,
            newPrice,
            status,
            difference,
            potentialImpact: status === 'discontinued' ? -(oldPrice * 12) : (oldPrice - newPrice) * 12,
          };
        });

        resolve(items);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
};
