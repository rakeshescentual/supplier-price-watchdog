
// Simple memory cache implementation with enhanced features
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  etag?: string;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  staleWhileRevalidate?: boolean; // Return stale data while fetching fresh
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export class APICache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private options: CacheOptions;
  
  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || DEFAULT_TTL,
      staleWhileRevalidate: options.staleWhileRevalidate !== undefined ? options.staleWhileRevalidate : true
    };
  }
  
  // Get data from cache
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    const isExpired = now - entry.timestamp > (this.options.ttl || DEFAULT_TTL);
    
    if (isExpired) {
      if (!this.options.staleWhileRevalidate) {
        this.delete(key);
        return null;
      }
      // Mark as stale but still return
    }
    
    return entry.data as T;
  }
  
  // Store data in cache
  set<T>(key: string, data: T, etag?: string): void {
    this.cache.set(key, { 
      data, 
      timestamp: Date.now(),
      etag 
    });
  }
  
  // Check if data is stale but still usable
  isStale(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return true;
    
    const now = Date.now();
    return now - entry.timestamp > (this.options.ttl || DEFAULT_TTL);
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
      if (now - entry.timestamp > (this.options.ttl || DEFAULT_TTL)) {
        this.cache.delete(key);
      }
    }
  }
}

// Create a singleton instance for global use
export const apiCache = new APICache();
