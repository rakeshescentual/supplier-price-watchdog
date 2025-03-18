export interface ShopifyContext {
  shop: string;
  accessToken: string;
}

export interface ShopifyConnectionResult {
  success: boolean;
  message?: string;
  shopDetails?: {
    name: string;
    domain: string;
    plan: string;
  };
}

export interface ShopifyFileUploadResult {
  success: boolean;
  fileUrl?: string;
  message?: string;
}

export interface PriceItem {
  id: string;
  sku: string;
  name: string;
  oldPrice: number;
  newPrice: number;
  supplier: string;
  category: string;
  status: string;
  difference: number;
  isMatched: boolean;
}
