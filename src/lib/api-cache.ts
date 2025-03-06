
// Enhanced memory cache implementation with better performance features
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  etag?: string;
  expiresAt: number;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  staleWhileRevalidate?: boolean; // Return stale data while fetching fresh
  maxSize?: number; // Maximum number of entries in cache
  purgeInterval?: number; // Interval to auto-purge expired items
  namespace?: string; // Optional namespace for the cache
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const DEFAULT_MAX_SIZE = 100; // Default max cache size
const DEFAULT_PURGE_INTERVAL = 60 * 1000; // 1 minute

export class APICache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private options: CacheOptions;
  private accessOrder: string[] = []; // For LRU tracking
  private purgeIntervalId: number | null = null;
  private hitCount = 0;
  private missCount = 0;
  
  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || DEFAULT_TTL,
      staleWhileRevalidate: options.staleWhileRevalidate !== undefined ? options.staleWhileRevalidate : true,
      maxSize: options.maxSize || DEFAULT_MAX_SIZE,
      purgeInterval: options.purgeInterval || DEFAULT_PURGE_INTERVAL,
      namespace: options.namespace || 'default'
    };
    
    // Set up automatic purging of expired items
    if (typeof window !== 'undefined') {
      this.purgeIntervalId = window.setInterval(() => {
        this.clearExpired();
      }, this.options.purgeInterval);
    }
  }
  
  // Get data from cache
  get<T>(key: string): T | null {
    const cacheKey = this.getCacheKey(key);
    const entry = this.cache.get(cacheKey);
    
    if (!entry) {
      this.missCount++;
      return null;
    }
    
    const now = Date.now();
    const isExpired = now >= entry.expiresAt;
    
    if (isExpired) {
      if (!this.options.staleWhileRevalidate) {
        this.delete(key);
        this.missCount++;
        return null;
      }
      // Mark as stale but still return
    }
    
    // Update the access order for LRU implementation
    this.updateAccessOrder(cacheKey);
    this.hitCount++;
    
    return entry.data as T;
  }
  
  // Store data in cache
  set<T>(key: string, data: T, options?: { ttl?: number, etag?: string }): void {
    const ttl = options?.ttl || this.options.ttl || DEFAULT_TTL;
    const now = Date.now();
    const cacheKey = this.getCacheKey(key);
    
    // Enforce cache size limit with LRU eviction
    this.ensureCacheSize();
    
    this.cache.set(cacheKey, { 
      data, 
      timestamp: now,
      expiresAt: now + ttl,
      etag: options?.etag 
    });
    
    // Update access order
    this.updateAccessOrder(cacheKey);
  }
  
  // Check if data is stale but still usable
  isStale(key: string): boolean {
    const cacheKey = this.getCacheKey(key);
    const entry = this.cache.get(cacheKey);
    if (!entry) return true;
    
    return Date.now() >= entry.expiresAt;
  }
  
  // Get etag if available
  getEtag(key: string): string | undefined {
    const cacheKey = this.getCacheKey(key);
    return this.cache.get(cacheKey)?.etag;
  }
  
  // Delete an entry
  delete(key: string): void {
    const cacheKey = this.getCacheKey(key);
    this.cache.delete(cacheKey);
    this.accessOrder = this.accessOrder.filter(k => k !== cacheKey);
  }
  
  // Clear all cached data
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    this.resetStats();
  }
  
  // Clear expired entries
  clearExpired(): void {
    const now = Date.now();
    let expiredCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.expiresAt && !this.options.staleWhileRevalidate) {
        this.delete(key.replace(`${this.options.namespace}:`, ''));
        expiredCount++;
      }
    }
    
    if (expiredCount > 0) {
      console.debug(`[APICache:${this.options.namespace}] Purged ${expiredCount} expired entries`);
    }
  }
  
  // Get all cache keys
  getAllKeys(): string[] {
    return Array.from(this.cache.keys()).map(key => 
      key.replace(`${this.options.namespace}:`, '')
    );
  }
  
  // Get cache stats
  getStats(): { 
    size: number, 
    maxSize: number, 
    oldestKey?: string, 
    newestKey?: string,
    hitCount: number,
    missCount: number,
    hitRatio: number,
    namespace: string
  } {
    const totalRequests = this.hitCount + this.missCount;
    const hitRatio = totalRequests > 0 ? this.hitCount / totalRequests : 0;
    
    // Remove namespace prefix from display keys
    const oldestRawKey = this.accessOrder[0];
    const newestRawKey = this.accessOrder[this.accessOrder.length - 1];
    
    return {
      size: this.cache.size,
      maxSize: this.options.maxSize || DEFAULT_MAX_SIZE,
      oldestKey: oldestRawKey ? oldestRawKey.replace(`${this.options.namespace}:`, '') : undefined,
      newestKey: newestRawKey ? newestRawKey.replace(`${this.options.namespace}:`, '') : undefined,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRatio,
      namespace: this.options.namespace || 'default'
    };
  }
  
  // Reset cache statistics
  resetStats(): void {
    this.hitCount = 0;
    this.missCount = 0;
  }
  
  // Clean up resources when no longer needed
  destroy(): void {
    if (this.purgeIntervalId !== null && typeof window !== 'undefined') {
      window.clearInterval(this.purgeIntervalId);
      this.purgeIntervalId = null;
    }
    this.clear();
    console.debug(`[APICache:${this.options.namespace}] Destroyed`);
  }
  
  // Private helper methods
  private getCacheKey(key: string): string {
    return `${this.options.namespace}:${key}`;
  }
  
  private updateAccessOrder(key: string): void {
    // Remove key if it already exists in the access order
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    // Add key to the end of the access order (most recently used)
    this.accessOrder.push(key);
  }
  
  private ensureCacheSize(): void {
    const maxSize = this.options.maxSize || DEFAULT_MAX_SIZE;
    while (this.cache.size >= maxSize && this.accessOrder.length > 0) {
      // Remove least recently used item
      const oldestKey = this.accessOrder[0];
      this.delete(oldestKey.replace(`${this.options.namespace}:`, ''));
    }
  }
}

// Create a singleton instance for global use
export const apiCache = new APICache({ namespace: 'global' });

// Create a separate cache for Shopify API requests with proper TTL for rate limiting
export const shopifyCache = new APICache({
  ttl: 30 * 60 * 1000, // 30 minutes for Shopify data
  staleWhileRevalidate: true,
  maxSize: 200, // Larger cache size for Shopify products
  purgeInterval: 5 * 60 * 1000, // Purge every 5 minutes
  namespace: 'shopify'
});

// Create a separate cache instance for Gadget API requests
export const gadgetCache = new APICache({
  ttl: 10 * 60 * 1000, // 10 minutes for Gadget data
  staleWhileRevalidate: true,
  maxSize: 150,
  purgeInterval: 2 * 60 * 1000, // Purge every 2 minutes
  namespace: 'gadget'
});
