
export interface PriceItem {
  sku: string;
  name: string;
  oldPrice: number;
  newPrice: number;
  status: 'increased' | 'decreased' | 'discontinued' | 'unchanged' | 'new' | 'anomaly';
  difference: number;
  potentialImpact?: number;
  // New fields
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
}

export interface AnomalyStats {
  totalAnomalies: number;
  nameChanges: number;
  supplierCodeChanges: number;
  barcodeChanges: number;
  packSizeChanges: number;
  unmatched: number;
}
