
/**
 * Shopify Integration Types
 * Structured according to Shopify API standards
 */
import { PriceItem } from './price';

export interface ShopifyContext {
  shop: string;
  accessToken: string;
  apiVersion?: string;
}

export interface ShopifyConnectionResult {
  success: boolean;
  message?: string;
  shopDetails?: {
    name: string;
    domain: string;
    plan: string;
    email?: string;
    primaryDomain?: string;
    country?: string;
    currency?: string;
    billingAddress?: string;
    myshopifyDomain?: string;
    primaryLocale?: string;
    timezone?: string;
    createdAt?: string;
  };
}

export interface ShopifyFileUploadResult {
  success: boolean;
  fileUrl?: string;
  message?: string;
}

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

export interface ShopifyAuthConfig {
  apiKey: string;
  scopes: string[];
  hostName: string;
  host: string;
}

export interface ShopifyContextType {
  shopifyContext: ShopifyContext | null;
  isShopifyConnected: boolean;
  isShopifyHealthy: boolean;
  lastConnectionCheck: Date | null;
  connectionCheckInterval: NodeJS.Timeout | null;
  isGadgetInitialized: boolean;
  isSyncing: boolean;
  connectToShopify: (shop: string, accessToken: string) => Promise<boolean>;
  disconnectShopify: () => void;
  syncToShopify: (items: PriceItem[]) => Promise<boolean>;
  loadShopifyData: () => Promise<PriceItem[]>;
  batchProcessShopifyItems: <T, R>(
    items: T[],
    processFn: (item: T) => Promise<R>,
    options?: { batchSize: number; concurrency: number }
  ) => Promise<R[]>;
}

// Export ShopifyProviderContextType as an alias of ShopifyContextType for backward compatibility
export type ShopifyProviderContextType = ShopifyContextType;

export interface ShopifySyncResult {
  success: boolean;
  message: string;
  syncedCount?: number;
  failedCount?: number;
  items?: PriceItem[];
}

export interface ShopifyProductBulkMutation {
  bulkOperationRunQuery: {
    bulkOperation: {
      id: string;
      status: string;
    };
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
}

export interface ShopifyProductMetafieldConnection {
  edges: {
    node: {
      id: string;
      namespace: string;
      key: string;
      value: string;
      type: string;
    };
  }[];
}

// Enhanced healthcheck result with diagnostics
export interface ShopifyHealthcheckResult extends ShopifyConnectionResult {
  apiVersion?: string;
  rateLimitRemaining?: number;
  responseTimeMs?: number;
  diagnostics?: {
    graphqlEndpoint: boolean;
    restEndpoint: boolean;
    webhooksEndpoint: boolean;
    authScopes: string[];
    missingScopes?: string[];
  };
}
