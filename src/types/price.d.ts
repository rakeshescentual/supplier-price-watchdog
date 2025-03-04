// Add these definitions to the existing file, keeping all other types

// Extend the PriceItem interface with marketData and category
interface PriceItem {
  sku: string;
  name: string;
  oldPrice: number;
  newPrice: number;
  status: 'increased' | 'decreased' | 'unchanged' | 'discontinued' | 'new' | 'anomaly';
  difference?: number;
  potentialImpact?: number;
  oldSupplierCode?: string;
  newSupplierCode?: string;
  oldBarcode?: string;
  newBarcode?: string;
  oldPackSize?: string;
  newPackSize?: string;
  oldTitle?: string;
  newTitle?: string;
  oldMargin?: number;
  newMargin?: number;
  marginChange?: number;
  anomalyType?: string[];
  isMatched?: boolean;
  
  // Shopify-specific fields
  productId?: string;
  variantId?: string;
  inventoryItemId?: string;
  inventoryLevel?: number;
  compareAtPrice?: number;
  tags?: string[];
  historicalSales?: number;
  lastOrderDate?: string;
  vendor?: string;
  metafields?: Record<string, any>;
  
  // Market data fields
  marketData?: {
    pricePosition: 'low' | 'average' | 'high';
    competitorPrices: number[];
    averagePrice: number;
    minPrice: number;
    maxPrice: number;
  };
  category?: string;
}
