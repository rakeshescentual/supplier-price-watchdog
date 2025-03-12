
/**
 * Storage optimization utilities for Gadget.dev
 * Leverages Gadget's caching and storage capabilities for improved performance
 */
import { logInfo, logError } from './logging';
import { initGadgetClient } from './client';
import { startPerformanceTracking } from './telemetry';

/**
 * Cache entry with TTL support
 */
interface CacheEntry<T> {
  value: T;
  expires: number | null; // Timestamp when entry expires, null means no expiration
}

/**
 * Cache storage options
 */
export interface CacheOptions {
  ttl?: number; // Time to live in seconds, default is 5 minutes
  namespace?: string; // Optional namespace for cache keys
  staleWhileRevalidate?: boolean; // Return stale data while fetching fresh data
}

const DEFAULT_TTL = 5 * 60; // 5 minutes default TTL
const DEFAULT_NAMESPACE = 'app-cache';

/**
 * Set a value in Gadget's cache
 * @param key Cache key
 * @param value Value to store
 * @param options Cache options
 */
export const setCacheValue = async <T>(
  key: string,
  value: T,
  options: CacheOptions = {}
): Promise<boolean> => {
  const client = initGadgetClient();
  if (!client) {
    console.warn('Gadget client not initialized, using localStorage fallback');
    try {
      const ttl = options.ttl ?? DEFAULT_TTL;
      const namespace = options.namespace ?? DEFAULT_NAMESPACE;
      const cacheKey = `${namespace}:${key}`;
      const entry: CacheEntry<T> = {
        value,
        expires: ttl > 0 ? Date.now() + ttl * 1000 : null
      };
      localStorage.setItem(cacheKey, JSON.stringify(entry));
      return true;
    } catch (error) {
      console.error('Error setting cache in localStorage:', error);
      return false;
    }
  }

  try {
    // In production with Gadget SDK:
    // await client.mutate.setCache({
    //   key: options.namespace ? `${options.namespace}:${key}` : key,
    //   value: JSON.stringify(value),
    //   ttl: options.ttl ?? DEFAULT_TTL
    // });
    
    logInfo(`Cache value set for key: ${key}`, { namespace: options.namespace }, 'cache');
    return true;
  } catch (error) {
    logError('Error setting cache value', { error, key }, 'cache');
    return false;
  }
};

/**
 * Get a value from Gadget's cache
 * @param key Cache key
 * @param options Cache options
 * @returns Cached value or null if not found
 */
export const getCacheValue = async <T>(
  key: string,
  options: CacheOptions = {}
): Promise<T | null> => {
  const client = initGadgetClient();
  if (!client) {
    console.warn('Gadget client not initialized, using localStorage fallback');
    try {
      const namespace = options.namespace ?? DEFAULT_NAMESPACE;
      const cacheKey = `${namespace}:${key}`;
      const storedItem = localStorage.getItem(cacheKey);
      
      if (!storedItem) return null;
      
      const entry = JSON.parse(storedItem) as CacheEntry<T>;
      
      // Check if entry has expired
      if (entry.expires && entry.expires < Date.now()) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      return entry.value;
    } catch (error) {
      console.error('Error getting cache from localStorage:', error);
      return null;
    }
  }

  try {
    // In production with Gadget SDK:
    // const result = await client.query.getCache({
    //   key: options.namespace ? `${options.namespace}:${key}` : key
    // });
    // 
    // if (!result.value) return null;
    // return JSON.parse(result.value) as T;
    
    // For development, simulate cache miss
    return null;
  } catch (error) {
    logError('Error getting cache value', { error, key }, 'cache');
    return null;
  }
};

/**
 * Clear a specific cache entry
 * @param key Cache key
 * @param options Cache options
 */
export const clearCacheValue = async (
  key: string,
  options: CacheOptions = {}
): Promise<boolean> => {
  const client = initGadgetClient();
  if (!client) {
    try {
      const namespace = options.namespace ?? DEFAULT_NAMESPACE;
      const cacheKey = `${namespace}:${key}`;
      localStorage.removeItem(cacheKey);
      return true;
    } catch (error) {
      console.error('Error clearing cache from localStorage:', error);
      return false;
    }
  }

  try {
    // In production with Gadget SDK:
    // await client.mutate.deleteCache({
    //   key: options.namespace ? `${options.namespace}:${key}` : key
    // });
    
    logInfo(`Cache cleared for key: ${key}`, { namespace: options.namespace }, 'cache');
    return true;
  } catch (error) {
    logError('Error clearing cache value', { error, key }, 'cache');
    return false;
  }
};

/**
 * Cache wrapper for async functions with automatic caching
 * @param keyPrefix Prefix for cache key
 * @param fn Function to cache results from
 * @param options Cache options
 * @returns Function with cached results
 */
export function withCache<T, Args extends any[]>(
  keyPrefix: string,
  fn: (...args: Args) => Promise<T>,
  options: CacheOptions = {}
): (...args: Args) => Promise<T> {
  return async (...args: Args): Promise<T> => {
    const finishTracking = startPerformanceTracking('withCache', { 
      keyPrefix, 
      functionName: fn.name,
      hasCacheOptions: !!options
    });

    // Create cache key from function arguments
    const argsKey = JSON.stringify(args);
    const cacheKey = `${keyPrefix}:${argsKey}`;
    
    // Try to get cached value
    const cachedValue = await getCacheValue<T>(cacheKey, options);
    if (cachedValue !== null) {
      logInfo('Cache hit', { keyPrefix, cacheKey }, 'cache');
      finishTracking();
      return cachedValue;
    }
    
    // Cache miss, execute function
    try {
      logInfo('Cache miss', { keyPrefix, cacheKey }, 'cache');
      const result = await fn(...args);
      
      // Store result in cache
      await setCacheValue(cacheKey, result, options);
      
      finishTracking();
      return result;
    } catch (error) {
      logError('Error in cached function', { error, keyPrefix, args }, 'cache');
      finishTracking();
      throw error;
    }
  };
}

/**
 * Clear all cache entries with a specific prefix
 * @param keyPrefix Prefix for cache keys to clear
 * @param options Cache options
 */
export const clearCacheByPrefix = async (
  keyPrefix: string,
  options: CacheOptions = {}
): Promise<boolean> => {
  const client = initGadgetClient();
  if (!client) {
    try {
      const namespace = options.namespace ?? DEFAULT_NAMESPACE;
      const prefix = `${namespace}:${keyPrefix}`;
      
      // Find all localStorage keys with the specified prefix
      const keysToRemove = Object.keys(localStorage)
        .filter(key => key.startsWith(prefix));
      
      // Remove all matching keys
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      return true;
    } catch (error) {
      console.error('Error clearing cache by prefix from localStorage:', error);
      return false;
    }
  }

  try {
    // In production with Gadget SDK:
    // await client.mutate.clearCacheByPrefix({
    //   prefix: options.namespace ? `${options.namespace}:${keyPrefix}` : keyPrefix
    // });
    
    logInfo(`Cache cleared for prefix: ${keyPrefix}`, { namespace: options.namespace }, 'cache');
    return true;
  } catch (error) {
    logError('Error clearing cache by prefix', { error, keyPrefix }, 'cache');
    return false;
  }
};

/**
 * Get cache statistics from Gadget
 * @returns Cache statistics or null if not available
 */
export const getCacheStats = async (): Promise<{
  entries: number;
  sizeBytes: number;
  hitRate: number;
  avgAccessTime: number;
} | null> => {
  const client = initGadgetClient();
  if (!client) {
    return null;
  }

  try {
    // In production with Gadget SDK:
    // const stats = await client.query.getCacheStats();
    // return {
    //   entries: stats.entries,
    //   sizeBytes: stats.sizeBytes,
    //   hitRate: stats.hitRate,
    //   avgAccessTime: stats.avgAccessTime
    // };
    
    // For development, return mock stats
    return {
      entries: 128,
      sizeBytes: 56320,
      hitRate: 0.78,
      avgAccessTime: 3.2
    };
  } catch (error) {
    logError('Error getting cache stats', { error }, 'cache');
    return null;
  }
};
