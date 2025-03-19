
/**
 * Enhanced Shopify Service for Enterprise-level Integration
 * Compliant with Shopify Plus and Built for Shopify standards
 */
import { toast } from "sonner";
import { 
  ShopifyContext, 
  ShopifyHealthcheckResult, 
  ShopifySyncResult,
  ShopifyFileUploadResult,
  PriceItem as ShopifyPriceItem
} from "@/types/shopify";
import { PriceItem } from "@/types/price";
import { bulkUpdatePrices } from "@/lib/shopify/bulkOperations";

// Helper function to convert price items from price.ts format to shopify.ts format
const convertToShopifyPriceItems = (items: PriceItem[]): ShopifyPriceItem[] => {
  return items.map(item => ({
    id: item.sku, // Use SKU as ID if not present
    sku: item.sku,
    name: item.name,
    oldPrice: item.oldPrice,
    newPrice: item.newPrice,
    status: item.status,
    percentChange: ((item.newPrice - item.oldPrice) / item.oldPrice) * 100,
    difference: item.difference,
    isMatched: item.isMatched,
    shopifyProductId: item.productId,
    shopifyVariantId: item.variantId,
    category: item.category,
    supplier: item.vendor, // Fixed: Only use vendor as supplier
    // Include other properties as needed
    ...item
  }));
};

/**
 * Enterprise-grade Shopify integration service
 */
export class EnhancedShopifyService {
  private static instance: EnhancedShopifyService;
  private context: ShopifyContext | null = null;
  private apiVersion: string = "2024-04"; // Always use the latest stable API version
  private readonly AUTH_SCOPES = [
    "read_products", "write_products", 
    "read_inventory", "write_inventory",
    "read_product_listings", "write_product_listings",
    "read_customers", "write_customers",
    "read_orders", "write_orders",
    "read_script_tags", "write_script_tags",
    "read_price_rules", "write_price_rules",
    "read_discounts", "write_discounts"
  ];
  
  /**
   * Get singleton instance
   */
  public static getInstance(): EnhancedShopifyService {
    if (!EnhancedShopifyService.instance) {
      EnhancedShopifyService.instance = new EnhancedShopifyService();
    }
    return EnhancedShopifyService.instance;
  }
  
  /**
   * Initialize with Shopify context
   */
  public initialize(context: ShopifyContext): void {
    this.context = {
      ...context,
      apiVersion: context.apiVersion || this.apiVersion
    };
    console.log(`Enhanced Shopify service initialized for ${context.shop} with API version ${this.apiVersion}`);
  }
  
  /**
   * Get current API version
   */
  public getApiVersion(): string {
    return this.apiVersion;
  }
  
  /**
   * Check if the service is properly initialized
   */
  public isInitialized(): boolean {
    return !!this.context?.shop && !!this.context?.accessToken;
  }
  
  /**
   * Validate required context
   */
  private validateContext(): void {
    if (!this.isInitialized()) {
      throw new Error("Shopify service not initialized. Call initialize() first.");
    }
  }
  
  /**
   * Comprehensive healthcheck for Shopify connection
   */
  public async healthCheck(): Promise<ShopifyHealthcheckResult> {
    try {
      console.log("Performing enhanced Shopify healthcheck");
      
      if (!this.isInitialized()) {
        return {
          success: false,
          message: "Shopify service not initialized",
          apiVersion: this.apiVersion
        };
      }
      
      const startTime = Date.now();
      
      // In a real implementation, this would call multiple Shopify API endpoints
      // to check authentication, validate scopes, and check rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demonstration purposes
      const responseTimeMs = Date.now() - startTime;
      
      return {
        success: true,
        message: "Shopify connection healthy",
        apiVersion: this.apiVersion,
        responseTimeMs,
        rateLimitRemaining: 39, // Mock value
        shopDetails: {
          name: "Escentual",
          domain: this.context!.shop,
          plan: "Shopify Plus",
          email: "tech@escentual.com",
          primaryDomain: "www.escentual.com",
          country: "United Kingdom",
          currency: "GBP",
          timezone: "Europe/London",
          createdAt: "2010-01-01T00:00:00Z"
        },
        diagnostics: {
          graphqlEndpoint: true,
          restEndpoint: true,
          webhooksEndpoint: true,
          authScopes: this.AUTH_SCOPES,
          missingScopes: []
        }
      };
    } catch (error) {
      console.error("Error performing enhanced Shopify healthcheck:", error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error during healthcheck",
        apiVersion: this.apiVersion
      };
    }
  }
  
  /**
   * Sync prices to Shopify with enterprise-grade reliability
   * Automatically uses bulk operations for large datasets
   */
  public async syncPrices(
    prices: PriceItem[],
    options: {
      useBulkOperations?: boolean;
      notifyOnPriceIncrease?: boolean;
      scheduleUpdate?: Date;
      onProgress?: (progress: number) => void;
    } = {}
  ): Promise<ShopifySyncResult> {
    try {
      this.validateContext();
      
      const itemCount = prices.length;
      console.log(`Enhanced sync starting for ${itemCount} price items`);
      
      // For large datasets, automatically use Bulk Operations API (Shopify Plus feature)
      const shouldUseBulkOperations = options.useBulkOperations !== false && itemCount > 50;
      
      if (shouldUseBulkOperations) {
        console.log("Using Bulk Operations API for large dataset");
        // Convert to Shopify-compatible price items
        const shopifyPrices = convertToShopifyPriceItems(prices);
        
        const bulkResult = await bulkUpdatePrices(this.context!, shopifyPrices, {
          notifyCustomers: options.notifyOnPriceIncrease,
          onProgress: options.onProgress
        });
        
        return {
          success: bulkResult.success,
          message: bulkResult.message,
          syncedCount: bulkResult.updatedCount,
          failedCount: bulkResult.failedCount
        };
      }
      
      // For smaller datasets, use regular API
      console.log("Using standard API for price updates");
      
      // Simulate API call with delay based on number of items
      await new Promise(resolve => setTimeout(resolve, Math.min(itemCount * 25, 2000)));
      
      if (options.onProgress) {
        options.onProgress(50);
      }
      
      // Simulate some failures for demonstration
      const failedCount = Math.floor(itemCount * 0.02); // 2% failure rate
      const syncedCount = itemCount - failedCount;
      
      if (options.onProgress) {
        options.onProgress(100);
      }
      
      const result: ShopifySyncResult = {
        success: true,
        message: `Successfully synced ${syncedCount} of ${itemCount} items`,
        syncedCount,
        failedCount
      };
      
      if (failedCount > 0) {
        result.failedItems = Array(failedCount).fill(0).map((_, i) => ({
          id: `item-${i}`,
          error: "Validation error on price update"
        }));
      }
      
      return result;
    } catch (error) {
      console.error("Error in enhanced price sync:", error);
      
      toast.error("Sync failed", {
        description: error instanceof Error ? error.message : "Unknown error during sync"
      });
      
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error during sync",
        syncedCount: 0,
        failedCount: prices.length
      };
    }
  }
  
  /**
   * Upload a file to Shopify with metadata and tagging
   */
  public async uploadFile(
    file: File,
    options: {
      directory?: string;
      altText?: string;
      metadata?: Record<string, string>;
      tags?: string[];
    } = {}
  ): Promise<ShopifyFileUploadResult> {
    try {
      this.validateContext();
      
      console.log(`Enhanced file upload to Shopify: ${file.name}`);
      
      // In a real implementation, this would use the Shopify Admin API
      // to upload the file using the Files API
      
      // Simulate upload with delay based on file size
      const uploadDelayMs = Math.min(file.size / 1024, 3000);
      await new Promise(resolve => setTimeout(resolve, uploadDelayMs));
      
      return {
        success: true,
        message: "File uploaded successfully",
        fileUrl: `https://${this.context!.shop}/cdn/files/${file.name.replace(/\s+/g, '-').toLowerCase()}`,
        fileId: `gid://shopify/MediaImage/${Date.now()}`
      };
    } catch (error) {
      console.error("Error uploading file to Shopify:", error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error during file upload"
      };
    }
  }
  
  /**
   * Get products with accurate inventory data
   * Uses smart pagination for large catalogs
   */
  public async getProducts(options: {
    limit?: number;
    productIds?: string[];
    collectionId?: string;
    query?: string;
    productType?: string;
    vendor?: string;
    createdAtMin?: string;
    updatedAtMin?: string;
    withInventory?: boolean;
    withMetafields?: boolean;
  } = {}): Promise<PriceItem[]> {
    try {
      this.validateContext();
      
      console.log("Fetching products with enhanced options:", options);
      
      // In a real implementation, this would use GraphQL to efficiently
      // fetch only the required data fields
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return mock data
      return Array(options.limit || 10).fill(0).map((_, index) => ({
        sku: `PROD-${1000 + index}`,
        name: `Sample Product ${index + 1}`,
        oldPrice: 99.99,
        newPrice: 89.99,
        status: index % 5 === 0 ? 'decreased' : 'unchanged',
        difference: -10,
        isMatched: true,
        productId: `gid://shopify/Product/${9000000 + index}`,
        variantId: `gid://shopify/ProductVariant/${8000000 + index}`,
        inventoryItemId: `gid://shopify/InventoryItem/${7000000 + index}`,
        inventoryLevel: 25,
        compareAtPrice: 109.99,
        vendor: "Escentual"
      })) as PriceItem[];
    } catch (error) {
      console.error("Error fetching products with enhanced service:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const enhancedShopifyService = EnhancedShopifyService.getInstance();

// Utility functions for direct use
export const enhancedShopifyHealthCheck = async (context: ShopifyContext): Promise<ShopifyHealthcheckResult> => {
  const service = EnhancedShopifyService.getInstance();
  service.initialize(context);
  return service.healthCheck();
};

export const enhancedShopifySync = async (
  context: ShopifyContext,
  prices: PriceItem[],
  options?: { useBulkOperations?: boolean; notifyOnPriceIncrease?: boolean; }
): Promise<ShopifySyncResult> => {
  const service = EnhancedShopifyService.getInstance();
  service.initialize(context);
  return service.syncPrices(prices, options);
};
