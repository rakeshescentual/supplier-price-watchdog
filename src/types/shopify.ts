/**
 * Shopify integration types
 */

// Core Shopify context
export interface ShopifyContext {
  shop: string; // Shopify store domain
  accessToken: string;
  apiVersion?: string;
  shopPlan?: string;
  shopDomain?: string; // Added this property to match the webhook interface
}

// Extended context with additional properties
export interface ShopifyContextType {
  isShopifyConnected: boolean;
  isShopifyHealthy: boolean;
  lastConnectionCheck: Date | null;
  connectionCheckInterval: NodeJS.Timeout | null;
  isGadgetInitialized: boolean;
  isSyncing: boolean;
  connectToShopify: (shop: string, accessToken: string) => Promise<boolean>;
  disconnectShopify: () => void;
  syncToShopify: (items: any[], options?: { silent?: boolean }) => Promise<boolean>;
  loadShopifyData: () => Promise<any[]>;
  batchProcessShopifyItems: <T, R>(
    items: T[],
    processFn: (item: T) => Promise<R>,
    options?: { batchSize?: number, concurrency?: number }
  ) => Promise<R[]>;
  bulkOperations: {
    updatePrices: (
      prices: PriceItem[],
      options?: {
        dryRun?: boolean;
        notifyCustomers?: boolean;
        onProgress?: (progress: number) => void;
      }
    ) => Promise<{
      success: boolean;
      message: string;
      operationId?: string;
      updatedCount: number;
      failedCount: number;
    }>;
    getBulkOperationHistory: () => any[];
    clearBulkOperationHistory: () => void;
  };
  testConnection: () => Promise<ShopifyConnectionResult>;
  shopifyContext: ShopifyContext | null;
}

// Webhook subscription
export interface WebhookSubscription {
  id: string;
  topic: string;
  address: string;
  format: 'json' | 'xml';
  active: boolean;
}

// API response types
export interface ShopifyConnectionResult {
  success: boolean;
  message?: string;
  shopDetails?: ShopifyShopDetails;
}

export interface ShopifyShopDetails {
  name: string;
  domain: string;
  plan: string;
  email?: string;
  primaryDomain?: string;
  country?: string;
  currency?: string;
  timezone?: string;
  weightUnit?: string;
  createdAt?: string;
}

export interface ShopifyHealthcheckResult extends ShopifyConnectionResult {
  apiVersion?: string;
  responseTimeMs?: number;
  rateLimitRemaining?: number;
  diagnostics?: {
    graphqlEndpoint: boolean;
    restEndpoint: boolean;
    webhooksEndpoint: boolean;
    authScopes: string[];
    missingScopes: string[];
  };
}

export interface ShopifySyncResult {
  success: boolean;
  message: string;
  syncedCount: number;
  failedCount: number;
  failedItems?: { id: string; error: string }[];
}

export interface ShopifyFileUploadResult {
  success: boolean;
  message: string;
  fileUrl?: string;
  fileId?: string;
}

// Shopify Plus specific types
export interface ShopifyScript {
  id: string;
  name: string;
  scriptType: 'discount' | 'shipping' | 'payment';
  source: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyFlow {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  triggerType: string;
  actions: ShopifyFlowAction[];
  conditions: ShopifyFlowCondition[];
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyFlowAction {
  id: string;
  type: string;
  config: Record<string, any>;
}

export interface ShopifyFlowCondition {
  id: string;
  field: string;
  operator: string;
  value: string | number | boolean;
}

// Combined Price item type with properties from both interfaces
export interface PriceItem {
  // Common required fields
  id: string;
  sku: string;
  name: string;
  oldPrice: number;
  newPrice: number;
  status: 'increased' | 'decreased' | 'discontinued' | 'unchanged' | 'new' | 'anomaly';
  
  // Fields from shopify.ts PriceItem
  percentChange: number;
  shopifyProductId?: string;
  shopifyVariantId?: string;
  category?: string;
  supplier?: string;
  lastUpdated?: Date;
  notes?: string;
  
  // Fields from price.ts PriceItem
  difference: number;
  isMatched: boolean;
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
  productId?: string;
  variantId?: string;
  inventoryItemId?: string;
  inventoryItemIds?: string[];
  inventoryLevel?: number;
  inventory?: number;
  compareAtPrice?: number;
  metafields?: Record<string, any>;
  tags?: string[];
  historicalSales?: number;
  lastOrderDate?: string;
  vendor?: string;
  marketData?: {
    pricePosition: 'low' | 'average' | 'high';
    competitorPrices?: number[];
    averagePrice?: number;
    minPrice?: number;
    maxPrice?: number;
  };
  suggestedPrice?: number;
  suggestionReason?: string;
  backupId?: string;
  backupDate?: string;
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

// Add ShopifyClient type for enhanced-shopify.ts
export interface ShopifyClient {
  graphql: <T>(query: string, variables?: Record<string, any>) => Promise<T>;
  rest: <T>(endpoint: string, method?: string, data?: any) => Promise<T>;
  initialize: (shop: string, accessToken: string, apiVersion?: string) => ShopifyClient;
}
