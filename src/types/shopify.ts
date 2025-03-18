
/**
 * Shopify integration types
 */

// Core Shopify context
export interface ShopifyContext {
  shop: string;
  accessToken: string;
  apiVersion?: string;
}

// Extended context with additional properties
export interface ShopifyContextType extends ShopifyContext {
  isActive?: boolean;
  shopPlan?: string;
  scopes?: string[];
  webhookSubscriptions?: WebhookSubscription[];
  themeId?: string;
}

// Context provider type for the ShopifyProvider
export interface ShopifyProviderContextType {
  shopifyContext: ShopifyContextType | null;
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
  };
  testConnection?: () => Promise<ShopifyConnectionResult>;
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

// Price item type
export interface PriceItem {
  id: string;
  sku: string;
  name: string;
  oldPrice: number;
  newPrice: number;
  status: 'increased' | 'decreased' | 'unchanged' | 'new';
  percentChange: number;
  shopifyProductId?: string;
  shopifyVariantId?: string;
  category?: string;
  supplier?: string;
  lastUpdated?: Date;
  notes?: string;
}
