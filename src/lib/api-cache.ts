
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
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const DEFAULT_MAX_SIZE = 100; // Default max cache size
const DEFAULT_PURGE_INTERVAL = 60 * 1000; // 1 minute

export class APICache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private options: CacheOptions;
  private accessOrder: string[] = []; // For LRU tracking
  private purgeIntervalId: number | null = null;
  
  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || DEFAULT_TTL,
      staleWhileRevalidate: options.staleWhileRevalidate !== undefined ? options.staleWhileRevalidate : true,
      maxSize: options.maxSize || DEFAULT_MAX_SIZE,
      purgeInterval: options.purgeInterval || DEFAULT_PURGE_INTERVAL
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
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    const isExpired = now >= entry.expiresAt;
    
    if (isExpired) {
      if (!this.options.staleWhileRevalidate) {
        this.delete(key);
        return null;
      }
      // Mark as stale but still return
    }
    
    // Update the access order for LRU implementation
    this.updateAccessOrder(key);
    
    return entry.data as T;
  }
  
  // Store data in cache
  set<T>(key: string, data: T, options?: { ttl?: number, etag?: string }): void {
    const ttl = options?.ttl || this.options.ttl || DEFAULT_TTL;
    const now = Date.now();
    
    // Enforce cache size limit with LRU eviction
    this.ensureCacheSize();
    
    this.cache.set(key, { 
      data, 
      timestamp: now,
      expiresAt: now + ttl,
      etag: options?.etag 
    });
    
    // Update access order
    this.updateAccessOrder(key);
  }
  
  // Check if data is stale but still usable
  isStale(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return true;
    
    return Date.now() >= entry.expiresAt;
  }
  
  // Get etag if available
  getEtag(key: string): string | undefined {
    return this.cache.get(key)?.etag;
  }
  
  // Delete an entry
  delete(key: string): void {
    this.cache.delete(key);
    this.accessOrder = this.accessOrder.filter(k => k !== key);
  }
  
  // Clear all cached data
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }
  
  // Clear expired entries
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.expiresAt && !this.options.staleWhileRevalidate) {
        this.delete(key);
      }
    }
  }
  
  // Get all cache keys
  getAllKeys(): string[] {
    return Array.from(this.cache.keys());
  }
  
  // Get cache stats
  getStats(): { size: number, maxSize: number, oldestKey?: string, newestKey?: string } {
    return {
      size: this.cache.size,
      maxSize: this.options.maxSize || DEFAULT_MAX_SIZE,
      oldestKey: this.accessOrder[0],
      newestKey: this.accessOrder[this.accessOrder.length - 1]
    };
  }
  
  // Clean up resources when no longer needed
  destroy(): void {
    if (this.purgeIntervalId !== null && typeof window !== 'undefined') {
      window.clearInterval(this.purgeIntervalId);
      this.purgeIntervalId = null;
    }
    this.clear();
  }
  
  // Private helper methods
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
      this.delete(oldestKey);
    }
  }
}

// Create a singleton instance for global use
export const apiCache = new APICache();

// Create a separate cache for Shopify API requests with proper TTL for rate limiting
export const shopifyCache = new APICache({
  ttl: 30 * 60 * 1000, // 30 minutes for Shopify data
  staleWhileRevalidate: true,
  maxSize: 200, // Larger cache size for Shopify products
  purgeInterval: 5 * 60 * 1000 // Purge every 5 minutes
});

// Create a separate cache instance for Gadget API requests
export const gadgetCache = new APICache({
  ttl: 10 * 60 * 1000, // 10 minutes for Gadget data
  staleWhileRevalidate: true,
  maxSize: 150,
  purgeInterval: 2 * 60 * 1000 // Purge every 2 minutes
});
