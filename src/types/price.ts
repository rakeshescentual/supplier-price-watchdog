
// Core Price Item Interface
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
  inventoryItemIds?: string[]; // For multi-location inventory
  inventoryLevel?: number;
  inventory?: number; // Add inventory field for compatibility with existing code
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
  // Added for price suggestions functionality
  suggestedPrice?: number;
  suggestionReason?: string;
  // Added for Google Drive backups
  backupId?: string;
  backupDate?: string;
  // Added for Shopify Plus features
  scheduledPriceChange?: {
    price: number;
    effectiveDate: string;
  };
  b2bPrice?: number;
  locationInventory?: {
    locationId: string;
    locationName: string;
    available: number;
  }[];
}

// Analysis interfaces
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
  // AI-powered insights
  aiInsights?: string[];
  marketCompetitivePosition?: string;
  pricingSuggestions?: {
    categorySpecific?: Record<string, any>[];
    generalStrategy?: string;
  };
}

export interface AnomalyStats {
  totalAnomalies: number;
  nameChanges: number;
  supplierCodeChanges: number;
  barcodeChanges: number;
  packSizeChanges: number;
  unmatched: number;
}

// Shopify interfaces
export interface ShopifyAuthConfig {
  apiKey: string;
  scopes: string[];
  hostName: string;
  host: string;
}

export interface ShopifyContext {
  shop: string;
  accessToken: string;
}

export interface ShopifyContextType {
  shopifyContext: ShopifyContext | null;
  isShopifyConnected: boolean;
  isGadgetInitialized: boolean;
  isSyncing: boolean;
  connectToShopify: (shop: string, accessToken: string) => Promise<void>;
  disconnectShopify: () => void;
  syncToShopify: (items: PriceItem[]) => Promise<boolean>;
  loadShopifyData?: () => Promise<PriceItem[]>;
}

// Klaviyo integration interfaces
export interface KlaviyoEmailTemplate {
  subject: string;
  preheader: string;
  templateStyle: string;
  urgencyLevel?: 'low' | 'medium' | 'high';
  bannerColor?: string;
  logoUrl?: string;
}

export interface KlaviyoSegmentSettings {
  name: string;
  enabled: boolean;
  minInventoryThreshold?: number;
  minDaysBefore?: number;
  urgencyLevel: string;
  includeInventoryLevels?: boolean;
  customAttributes?: Record<string, any>;
  campaignParameters?: Record<string, any>;
}

// Google Workspace integration interfaces
export interface GoogleWorkspaceConfig {
  apiKey?: string;
  clientId?: string;
  scopes: string[];
  redirectUri?: string;
  includeGmail?: boolean;
  includeDrive?: boolean;
  includeCalendar?: boolean;
  includeAnalytics?: boolean;
  includeMerchant?: boolean;
  includeSearchConsole?: boolean;
}

export interface GoogleDriveBackup {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  size?: number;
  fileType?: string;
  lastModified?: string;
  thumbnailUrl?: string;
}

// Gadget.dev integration interfaces
export interface GadgetConfig {
  apiKey: string;
  appId: string;
  environment: 'development' | 'production';
  featureFlags?: {
    enableAdvancedAnalytics?: boolean;
    enablePdfProcessing?: boolean;
    enableBackgroundJobs?: boolean;
    enableShopifySync?: boolean;
  };
}

// Enhanced interfaces for Shopify Plus features
export interface ShopifyPlusFeatures {
  multiLocationInventory: boolean;
  b2bFunctionality: boolean;
  automatedDiscounts: boolean;
  scriptsEnabled: boolean;
  flowsEnabled: boolean;
  enterpriseAppsConnected: string[];
  metafieldNamespaces?: string[];
  customStorefrontEnabled?: boolean;
}

export interface ShopifyFlowConfig {
  title: string;
  triggerType: 'product_update' | 'inventory_update' | 'order_create';
  conditions: any[];
  actions: any[];
}

export interface ShopifyScriptConfig {
  id?: string;
  title: string;
  scriptCustomerScope: 'all' | 'specific_tags' | 'specific_customers';
  source: string;
}

// AI Analysis interfaces
export interface AIAnalysisRequest {
  items: PriceItem[];
  previousAnalysis?: PriceAnalysis;
  shopifyData?: any;
  marketData?: any;
  historicalPriceData?: any[];
  competitorPricing?: any[];
}

export interface AIAnalysisResponse {
  analysis: PriceAnalysis;
  suggestedPrices?: {
    sku: string;
    suggestedPrice: number;
    reason: string;
  }[];
  competitiveInsights?: {
    category: string;
    position: 'low' | 'average' | 'high';
    recommendation: string;
  }[];
  customerImpactAnalysis?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    recommendedCommunication?: string;
    segmentationSuggestions?: any[];
  };
}

// Extended Notebook LLM interfaces for price analysis
export interface NotebookLLMConfig {
  model: string;
  temperature?: number;
  historyEnabled?: boolean;
  saveAnalysis?: boolean;
  enhancedVisualization?: boolean;
  supportedDataFormats?: string[];
}

export interface NotebookLLMQuery {
  type: 'price_analysis' | 'market_comparison' | 'trend_prediction' | 'custom';
  prompt: string;
  data?: PriceItem[] | any[];
  parameters?: Record<string, any>;
  visualizationType?: 'chart' | 'table' | 'heatmap' | 'none';
}

export interface NotebookLLMResponse {
  id: string;
  analysis: string;
  timestamp: string;
  visualizationData?: any;
  suggestedNextQueries?: string[];
  savePath?: string;
}

// Google Analytics integration
export interface GoogleAnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
  customDimensions?: Record<string, string>;
  customMetrics?: Record<string, number>;
}
