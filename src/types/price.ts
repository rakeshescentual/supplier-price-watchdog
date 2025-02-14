
export interface PriceItem {
  sku: string;
  name: string;
  oldPrice: number;
  newPrice: number;
  status: 'increased' | 'decreased' | 'discontinued' | 'unchanged';
  difference: number;
  potentialImpact?: number;
}
