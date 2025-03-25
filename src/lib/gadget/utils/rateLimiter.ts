/**
 * RateLimiter for Shopify API requests
 * Implements leaky bucket algorithm to respect Shopify API rate limits
 */

// Default costs for different API operations
const DEFAULT_COSTS: Record<string, number> = {
  default: 1,
  shopify_flow: 10,
  shopify_script: 10,
  shopify_b2b: 2,
  shopify_b2b_company: 5,
  shopify_price_schedule: 2,
  shopify_multipass: 3,
  shopify_gift_card: 5,
  bulk_operation: 20,
  graphql_query: 1,
  rest_query: 1
};

// Rate limit configuration
interface RateLimitConfig {
  bucketSize: number; // Maximum tokens in the bucket
  refillRate: number; // Tokens per second to refill
  refillInterval: number; // Milliseconds between refills
}

// Default configuration based on Shopify Plus limits
const DEFAULT_CONFIG: RateLimitConfig = {
  bucketSize: 80, // Shopify Plus has higher bucket size
  refillRate: 4, // Tokens per second
  refillInterval: 250 // Check every 250ms
};

class RateLimiter {
  private bucket: number;
  private lastRefill: number;
  private config: RateLimitConfig;
  private costs: Record<string, number>;
  private timer: NodeJS.Timeout | null = null;
  private queue: Array<{ 
    resolve: () => void; 
    reject: (error: Error) => void;
    cost: number;
    operation: string;
    timestamp: number;
  }> = [];

  constructor(config: Partial<RateLimitConfig> = {}, costs: Record<string, number> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.costs = { ...DEFAULT_COSTS, ...costs };
    this.bucket = this.config.bucketSize;
    this.lastRefill = Date.now();
    
    // Start the refill timer
    this.startRefillTimer();
  }
  
  /**
   * Wait for a token to become available
   * @param operation The type of operation
   * @param multiplier Multiply the cost (for batch operations)
   * @returns Promise that resolves when a token is available
   */
  public async waitForToken(operation: string = 'default', multiplier: number = 1): Promise<void> {
    const baseCost = this.costs[operation] || this.costs.default;
    const cost = Math.max(1, Math.floor(baseCost * multiplier));
    
    // Refill the bucket before checking
    this.refill();
    
    // If we have enough tokens, consume immediately
    if (this.bucket >= cost) {
      this.bucket -= cost;
      return Promise.resolve();
    }
    
    // Otherwise, queue the request
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        // Remove from queue if it times out
        this.queue = this.queue.filter(item => item.timestamp !== timestamp);
        reject(new Error(`Operation timed out waiting for rate limit: ${operation}`));
      }, 30000); // 30 second timeout
      
      const timestamp = Date.now();
      
      this.queue.push({
        resolve: () => {
          clearTimeout(timeout);
          resolve();
        },
        reject,
        cost,
        operation,
        timestamp
      });
    });
  }
  
  /**
   * Refill the token bucket based on elapsed time
   */
  private refill(): void {
    const now = Date.now();
    const elapsedTime = now - this.lastRefill;
    
    if (elapsedTime > 0) {
      // Calculate how many tokens to add based on elapsed time
      const tokensToAdd = Math.floor((elapsedTime / 1000) * this.config.refillRate);
      
      if (tokensToAdd > 0) {
        this.bucket = Math.min(this.config.bucketSize, this.bucket + tokensToAdd);
        this.lastRefill = now;
      }
    }
  }
  
  /**
   * Process the queue of waiting requests
   */
  private processQueue(): void {
    if (this.queue.length === 0) return;
    
    // Refill the bucket first
    this.refill();
    
    // Sort queue by timestamp (oldest first)
    this.queue.sort((a, b) => a.timestamp - b.timestamp);
    
    // Try to process queue items
    const stillQueued: typeof this.queue = [];
    
    for (const item of this.queue) {
      if (this.bucket >= item.cost) {
        // We have enough tokens, resolve this request
        this.bucket -= item.cost;
        item.resolve();
      } else {
        // Not enough tokens, keep in queue
        stillQueued.push(item);
      }
    }
    
    // Update the queue
    this.queue = stillQueued;
  }
  
  /**
   * Start the refill timer
   */
  private startRefillTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    
    this.timer = setInterval(() => {
      this.refill();
      this.processQueue();
    }, this.config.refillInterval);
  }
  
  /**
   * Stop the refill timer
   */
  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  
  /**
   * Get current bucket status
   */
  public getStatus(): { 
    availableTokens: number; 
    queueLength: number; 
    bucketSize: number;
  } {
    this.refill(); // Make sure the bucket is up to date
    return {
      availableTokens: this.bucket,
      queueLength: this.queue.length,
      bucketSize: this.config.bucketSize
    };
  }
}

// Export a singleton instance
export const rateLimiter = new RateLimiter();

// Also export the class for testing or custom instances
export default RateLimiter;
