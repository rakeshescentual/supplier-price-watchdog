
/**
 * Shopify Plus specific types
 */

// Script configuration for Shopify Plus
export interface ShopifyScriptConfig {
  title: string;
  scriptCustomerScope?: string;
  source?: string;
}

// Flow configuration for Shopify Plus
export interface ShopifyFlowConfig {
  name: string;
  title: string;
  triggerType: string;
  description?: string;
  conditions?: any[];
  actions?: any[];
}

// B2B pricing configuration
export interface B2BPriceConfig {
  productId: string;
  variantId: string;
  price: number;
  compareAtPrice?: number;
  customerTags?: string[];
}

// Price change schedule configuration
export interface ScheduledPriceChange {
  id: string;
  scheduledPrice: number;
  scheduledDate: string;
  compareAtPrice?: number;
  locationId?: string;
}

// Multipass token customer data
export interface MultipassCustomerData {
  email: string;
  first_name?: string;
  last_name?: string;
  tag_string?: string;
  remote_ip?: string;
  return_to?: string;
  created_at?: string;
}

// B2B company data
export interface B2BCompanyData {
  name: string;
  external_id?: string;
  company_location?: {
    address1: string;
    city: string;
    province: string;
    country: string;
    postal_code: string;
  };
}

// Gift card data
export interface GiftCardData {
  initialValue: number;
  currency?: string;
  note?: string;
  expiresOn?: string;
  recipient?: {
    firstName: string;
    lastName: string;
    email: string;
    message?: string;
  };
}
