
/**
 * Type definitions for Gadget.dev storage module
 */

/**
 * Cache entry with TTL support
 */
export interface CacheEntry<T> {
  value: T;
  expires: number | null; // Timestamp when entry expires, null means no expiration
  version?: number; // For cache versioning
}

/**
 * Cache storage options
 */
export interface CacheOptions {
  ttl?: number; // Time to live in seconds, default is 5 minutes
  namespace?: string; // Optional namespace for cache keys
  staleWhileRevalidate?: boolean; // Return stale data while fetching fresh data
  region?: 'memory' | 'persistent'; // Where to store cache (memory is faster but not persistent)
  version?: number; // Cache version for invalidation
  compressLarge?: boolean; // Whether to compress large values
  priority?: 'high' | 'normal' | 'low'; // Cache priority
}

// Constants
export const DEFAULT_TTL = 5 * 60; // 5 minutes default TTL
export const DEFAULT_NAMESPACE = 'app-cache';
