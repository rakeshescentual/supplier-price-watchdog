
import { PriceItem } from "@/types/price";

/**
 * Validates a Shopify API request to ensure it meets Shopify's requirements
 * and best practices for app submissions
 */
export const validateShopifyRequest = (
  request: {
    method: string;
    endpoint: string;
    params?: Record<string, any>;
    data?: any;
  }
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check for valid endpoint format
  if (!request.endpoint.match(/^(\/admin\/api\/\d{4}-\d{2}\/|graphql\.json$)/)) {
    errors.push("Invalid API endpoint format. Use versioned endpoints.");
  }
  
  // Check for rate limit considerations
  if (request.method === "GET" && !request.params?.limit) {
    errors.push("Missing pagination limit. Always include limits for GET requests.");
  }
  
  // Check for bulk operations best practices
  if (request.endpoint.includes("graphql") && 
      request.data?.query?.includes("bulkOperationRunQuery")) {
    if (!request.data.query.includes("bulkOperationStatus")) {
      errors.push("Bulk operations should include status polling.");
    }
  }
  
  // Check for proper data structures
  if (request.method === "POST" || request.method === "PUT") {
    if (!request.data) {
      errors.push("Missing request body for POST/PUT request.");
    }
  }
  
  return { 
    valid: errors.length === 0,
    errors 
  };
};

/**
 * Validates a batch of price items before syncing to Shopify
 */
export const validatePriceItemsForShopify = (
  items: PriceItem[]
): { valid: boolean; invalidItems: { item: PriceItem; errors: string[] }[] } => {
  const invalidItems: { item: PriceItem; errors: string[] }[] = [];
  
  items.forEach(item => {
    const errors: string[] = [];
    
    // Check required fields
    if (!item.sku) errors.push("Missing SKU");
    if (!item.name) errors.push("Missing product name");
    
    // Validate price format
    if (isNaN(item.newPrice) || item.newPrice < 0) {
      errors.push("Invalid price format");
    }
    
    // Check for Shopify IDs if updating existing products
    if (item.isMatched && (!item.productId && !item.shopifyProductId || !item.variantId && !item.shopifyVariantId)) {
      errors.push("Missing Shopify product or variant ID for matched product");
    }
    
    if (errors.length > 0) {
      invalidItems.push({ item, errors });
    }
  });
  
  return {
    valid: invalidItems.length === 0,
    invalidItems
  };
};

/**
 * Validates a Shopify connection to ensure it meets requirements for Shopify Plus
 */
export const validateShopifyConnection = (
  connection: {
    shop: string;
    accessToken: string;
    scopes?: string[];
    apiVersion?: string;
  }
): { valid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check required fields
  if (!connection.shop) errors.push("Missing shop domain");
  if (!connection.accessToken) errors.push("Missing access token");
  
  // Check shop format
  if (connection.shop && !connection.shop.match(/^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/)) {
    errors.push("Invalid shop domain format. Use the myshopify.com domain.");
  }
  
  // Check API version
  if (!connection.apiVersion) {
    warnings.push("No API version specified. Using default version.");
  } else {
    const currentYear = new Date().getFullYear();
    const versionRegex = new RegExp(`^${currentYear}-(0[1-9]|1[0-2])$`);
    const lastYearRegex = new RegExp(`^${currentYear-1}-(0[1-9]|1[0-2])$`);
    
    if (!versionRegex.test(connection.apiVersion) && !lastYearRegex.test(connection.apiVersion)) {
      warnings.push("API version may be outdated. Consider updating to the latest version.");
    }
  }
  
  // Check scopes for Shopify Plus requirements
  const requiredScopes = [
    "read_products", 
    "write_products", 
    "read_inventory", 
    "write_inventory"
  ];
  
  const recommendedPlusScopes = [
    "read_price_rules",
    "write_price_rules",
    "read_discounts",
    "write_discounts",
    "read_script_tags",
    "write_script_tags"
  ];
  
  if (connection.scopes) {
    const missingRequiredScopes = requiredScopes.filter(scope => 
      !connection.scopes?.includes(scope)
    );
    
    if (missingRequiredScopes.length > 0) {
      errors.push(`Missing required scopes: ${missingRequiredScopes.join(", ")}`);
    }
    
    const missingRecommendedScopes = recommendedPlusScopes.filter(scope => 
      !connection.scopes?.includes(scope)
    );
    
    if (missingRecommendedScopes.length > 0) {
      warnings.push(`Missing recommended Shopify Plus scopes: ${missingRecommendedScopes.join(", ")}`);
    }
  } else {
    warnings.push("No scopes provided. Cannot validate permission requirements.");
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Ensures the app's usage of Shopify APIs complies with Shopify's
 * rate limiting best practices
 */
export const validateRateLimitCompliance = (
  requestStats: {
    endpoint: string;
    requestsPerMinute: number;
    averageResponseTime: number;
  }[]
): { compliant: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  requestStats.forEach(stat => {
    // Shopify's leaky bucket allows 40 requests in flight
    if (stat.requestsPerMinute > 30) {
      issues.push(`High request rate for ${stat.endpoint}: ${stat.requestsPerMinute} requests/minute`);
    }
    
    // Check for slow endpoints that might lead to timeout issues
    if (stat.averageResponseTime > 5000) {
      issues.push(`Slow response time for ${stat.endpoint}: ${stat.averageResponseTime}ms average`);
    }
  });
  
  return {
    compliant: issues.length === 0,
    issues
  };
};
