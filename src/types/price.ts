export interface PriceItem {
  sku: string;
  name: string;
  oldPrice: number;
  newPrice: number;
  status: 'increased' | 'decreased' | 'discontinued' | 'unchanged' | 'new' | 'anomaly';
  difference: number;
  potentialImpact?: number;
  // Supplier information
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
  isMatched: boolean;
  // Shopify-specific fields
  productId?: string;
  variantId?: string;
  inventoryItemId?: string;
  inventoryLevel?: number;
  compareAtPrice?: number;
  metafields?: Record<string, any>;
  tags?: string[];
  historicalSales?: number;
  lastOrderDate?: string;
  vendor?: string;
  // Market data fields
  marketData?: {
    pricePosition: 'low' | 'average' | 'high';
    competitorPrices?: number[];
    averagePrice?: number;
    minPrice?: number;
    maxPrice?: number;
  };
  category?: string;
}

export interface PriceAnalysis {
  summary: string;
  recommendations: string[];
  riskAssessment: string;
  opportunityInsights: string;
  anomalies: {
    count: number;
    types: string[];
    description: string;
  };
  marginImpact: string;
  // Shopify-specific analysis
  inventoryImpact?: string;
  salesTrendImpact?: string;
  vendorAnalysis?: string;
}

export interface AnomalyStats {
  totalAnomalies: number;
  nameChanges: number;
  supplierCodeChanges: number;
  barcodeChanges: number;
  packSizeChanges: number;
  unmatched: number;
}

// Shopify-specific interfaces
export interface ShopifyAuthConfig {
  apiKey: string;
  scopes: string[];
  hostName: string;
  host: string;
}

export interface ShopifyContext {
  shop: string;
  token: string;
  isOnline: boolean;
}
