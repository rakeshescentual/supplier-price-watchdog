
// Simple memory cache implementation with enhanced features
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
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const DEFAULT_MAX_SIZE = 100; // Default max cache size

export class APICache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private options: CacheOptions;
  
  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || DEFAULT_TTL,
      staleWhileRevalidate: options.staleWhileRevalidate !== undefined ? options.staleWhileRevalidate : true,
      maxSize: options.maxSize || DEFAULT_MAX_SIZE
    };
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
    this.cache.delete(key);
    this.cache.set(key, entry);
    
    return entry.data as T;
  }
  
  // Store data in cache
  set<T>(key: string, data: T, options?: { ttl?: number, etag?: string }): void {
    const ttl = options?.ttl || this.options.ttl || DEFAULT_TTL;
    const now = Date.now();
    
    // Enforce cache size limit with LRU eviction
    if (this.cache.size >= (this.options.maxSize || DEFAULT_MAX_SIZE)) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, { 
      data, 
      timestamp: now,
      expiresAt: now + ttl,
      etag: options?.etag 
    });
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
  }
  
  // Clear all cached data
  clear(): void {
    this.cache.clear();
  }
  
  // Clear expired entries
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
  
  // Get cache stats
  getStats(): { size: number, maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.options.maxSize || DEFAULT_MAX_SIZE
    };
  }
}

// Create a singleton instance for global use
export const apiCache = new APICache();

// Create a separate cache for Shopify API requests with proper TTL for rate limiting
export const shopifyCache = new APICache({
  ttl: 30 * 60 * 1000, // 30 minutes for Shopify data
  staleWhileRevalidate: true,
  maxSize: 200 // Larger cache size for Shopify products
});

// Create a separate cache instance for Gadget API requests
export const gadgetCache = new APICache({
  ttl: 10 * 60 * 1000, // 10 minutes for Gadget data
  staleWhileRevalidate: true,
  maxSize: 150
});
