
/**
 * Shopify API Client Singleton
 * 
 * This client handles all Shopify API interactions using proper versioning,
 * rate limit handling, and authentication.
 */
import { ShopifyContext } from '@/types/shopify';

class ShopifyClient {
  private static instance: ShopifyClient;
  private context: ShopifyContext | null = null;
  private rateLimitRemaining: number = 40; // Default Shopify leaky bucket limit
  private apiVersions: string[] = ['2024-04', '2024-01', '2023-10']; // Supported API versions
  private lastResponseHeaders: Record<string, string> = {};
  
  private constructor() {
    console.log('Creating Shopify API client singleton');
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): ShopifyClient {
    if (!ShopifyClient.instance) {
      ShopifyClient.instance = new ShopifyClient();
    }
    return ShopifyClient.instance;
  }
  
  /**
   * Initialize with context
   */
  public initialize(context: ShopifyContext): void {
    this.context = context;
    console.log(`Initialized Shopify client for ${context.shop} with API version ${context.apiVersion || this.apiVersions[0]}`);
  }
  
  /**
   * Reset client state
   */
  public reset(): void {
    this.context = null;
    this.lastResponseHeaders = {};
    console.log('Shopify client reset');
  }
  
  /**
   * Check if client is initialized
   */
  public get isInitialized(): boolean {
    return !!this.context;
  }
  
  /**
   * Get current API version
   */
  public get apiVersion(): string {
    return this.context?.apiVersion || this.apiVersions[0];
  }
  
  /**
   * Create REST API URL
   */
  private buildRestUrl(endpoint: string, params: Record<string, string> = {}): string {
    if (!this.context) {
      throw new Error('Shopify client not initialized');
    }
    
    const apiVersion = this.context.apiVersion || this.apiVersions[0];
    const baseUrl = `https://${this.context.shop}/admin/api/${apiVersion}`;
    
    // Add endpoint
    let url = `${baseUrl}/${endpoint.startsWith('/') ? endpoint.substring(1) : endpoint}`;
    
    // Add query parameters
    if (Object.keys(params).length > 0) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      url += `?${queryString}`;
    }
    
    return url;
  }
  
  /**
   * Create GraphQL API URL
   */
  private buildGraphQLUrl(): string {
    if (!this.context) {
      throw new Error('Shopify client not initialized');
    }
    
    const apiVersion = this.context.apiVersion || this.apiVersions[0];
    return `https://${this.context.shop}/admin/api/${apiVersion}/graphql.json`;
  }
  
  /**
   * Handle Shopify API response and extract headers
   */
  private handleResponse(response: Response): void {
    // Store headers for rate limit tracking
    this.lastResponseHeaders = {};
    response.headers.forEach((value, key) => {
      this.lastResponseHeaders[key.toLowerCase()] = value;
    });
    
    // Track API call limits
    const rateLimitHeader = this.lastResponseHeaders['x-shopify-shop-api-call-limit'];
    if (rateLimitHeader) {
      const [current, limit] = rateLimitHeader.split('/').map(v => parseInt(v.trim(), 10));
      this.rateLimitRemaining = limit - current;
      console.log(`Shopify API call limit: ${current}/${limit} (${this.rateLimitRemaining} remaining)`);
    }
  }
  
  /**
   * Make a REST API request with rate limit handling
   */
  public async rest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string, 
    data?: any,
    params: Record<string, string> = {}
  ): Promise<T> {
    if (!this.context) {
      throw new Error('Shopify client not initialized');
    }
    
    // Check rate limiting - wait if approaching limit
    if (this.rateLimitRemaining < 5) {
      console.log('Approaching rate limit, waiting before next request');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const url = this.buildRestUrl(endpoint, params);
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': this.context.accessToken
      }
    };
    
    if (data && ['POST', 'PUT'].includes(method)) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    this.handleResponse(response);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shopify API error (${response.status}): ${errorText}`);
    }
    
    return await response.json();
  }
  
  /**
   * Make a GraphQL API request
   */
  public async graphql<T>(query: string, variables?: Record<string, any>): Promise<T> {
    if (!this.context) {
      throw new Error('Shopify client not initialized');
    }
    
    const url = this.buildGraphQLUrl();
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': this.context.accessToken
      },
      body: JSON.stringify({
        query,
        variables
      })
    });
    
    this.handleResponse(response);
    
    const result = await response.json();
    
    if (result.errors) {
      const errorMessage = result.errors[0]?.message || 'Unknown GraphQL error';
      throw new Error(`Shopify GraphQL error: ${errorMessage}`);
    }
    
    return result.data as T;
  }
  
  /**
   * Get a list of supported API versions
   */
  public getSupportedVersions(): string[] {
    return [...this.apiVersions];
  }
  
  /**
   * Check if a version is supported
   */
  public isVersionSupported(version: string): boolean {
    return this.apiVersions.includes(version);
  }
  
  /**
   * Utility method to retry a request if it fails due to rate limiting
   */
  public async retryWithBackoff<T>(
    fn: () => Promise<T>, 
    maxRetries = 3
  ): Promise<T> {
    let retries = 0;
    
    while (true) {
      try {
        return await fn();
      } catch (error) {
        if (retries >= maxRetries) {
          throw error;
        }
        
        // Check if this is a rate limit error
        if (error instanceof Error && 
            (error.message.includes('429') || 
             error.message.toLowerCase().includes('rate limit'))) {
          
          // Exponential backoff with jitter
          const delay = Math.min(1000 * 2 ** retries, 10000) + Math.random() * 1000;
          console.log(`Shopify rate limit hit, retrying in ${Math.round(delay)}ms (retry ${retries + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retries++;
        } else {
          throw error;
        }
      }
    }
  }
}

// Export the singleton instance
export const shopifyClient = ShopifyClient.getInstance();

/**
 * Initialize the Shopify client with context
 */
export const initializeShopifyClient = (context: ShopifyContext): void => {
  shopifyClient.initialize(context);
};

/**
 * Reset the Shopify client
 */
export const resetShopifyClient = (): void => {
  shopifyClient.reset();
};

/**
 * Get the current Shopify API version
 */
export const getShopifyApiVersion = (): string => {
  return shopifyClient.apiVersion;
};

/**
 * Check if the Shopify client is initialized
 */
export const isShopifyClientInitialized = (): boolean => {
  return shopifyClient.isInitialized;
};

/**
 * Get supported API versions
 */
export const getSupportedShopifyVersions = (): string[] => {
  return shopifyClient.getSupportedVersions();
};
