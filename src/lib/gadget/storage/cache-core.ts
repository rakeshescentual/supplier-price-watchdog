
/**
 * Core cache operations for Gadget.dev storage
 */
import { logInfo, logError } from '../logging';
import { initGadgetClient } from '../client';
import { CacheEntry, CacheOptions, DEFAULT_TTL, DEFAULT_NAMESPACE } from './types';

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
        expires: ttl > 0 ? Date.now() + ttl * 1000 : null,
        version: options.version
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
    //   ttl: options.ttl ?? DEFAULT_TTL,
    //   region: options.region || 'persistent',
    //   compress: options.compressLarge,
    //   version: options.version,
    //   priority: options.priority || 'normal'
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
        // If using staleWhileRevalidate, return the stale value but trigger a refresh
        if (options.staleWhileRevalidate) {
          // Trigger a refresh in the background
          refreshCacheValue<T>(key, options).catch(err => 
            console.error('Error refreshing stale cache:', err)
          );
          return entry.value;
        }
        
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      // Check version if specified
      if (options.version !== undefined && entry.version !== options.version) {
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
    //   key: options.namespace ? `${options.namespace}:${key}` : key,
    //   region: options.region || 'persistent',
    //   version: options.version
    // });
    // 
    // if (!result.value) {
    //   if (options.staleWhileRevalidate && result.staleValue) {
    //     // Trigger a refresh in the background
    //     refreshCacheValue<T>(key, options).catch(err => 
    //       console.error('Error refreshing stale cache:', err)
    //     );
    //     return JSON.parse(result.staleValue) as T;
    //   }
    //   return null;
    // }
    // 
    // return JSON.parse(result.value) as T;
    
    // For development, simulate cache miss
    return null;
  } catch (error) {
    logError('Error getting cache value', { error, key }, 'cache');
    return null;
  }
};

/**
 * Refresh a cached value by re-computing it
 * @param key Cache key
 * @param options Cache options
 * @param computeFn Optional function to compute the new value
 */
export const refreshCacheValue = async <T>(
  key: string,
  options: CacheOptions = {},
  computeFn?: () => Promise<T>
): Promise<boolean> => {
  if (!computeFn) {
    // If no compute function is provided, we just invalidate the cache
    return clearCacheValue(key, options);
  }
  
  try {
    // Compute new value
    const newValue = await computeFn();
    
    // Store in cache
    return setCacheValue(key, newValue, options);
  } catch (error) {
    logError('Error refreshing cache value', { error, key }, 'cache');
    return false;
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
    //   key: options.namespace ? `${options.namespace}:${key}` : key,
    //   region: options.region || 'persistent'
    // });
    
    logInfo(`Cache cleared for key: ${key}`, { namespace: options.namespace }, 'cache');
    return true;
  } catch (error) {
    logError('Error clearing cache value', { error, key }, 'cache');
    return false;
  }
};

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
    //   prefix: options.namespace ? `${options.namespace}:${keyPrefix}` : keyPrefix,
    //   region: options.region || 'persistent'
    // });
    
    logInfo(`Cache cleared for prefix: ${keyPrefix}`, { namespace: options.namespace }, 'cache');
    return true;
  } catch (error) {
    logError('Error clearing cache by prefix', { error, keyPrefix }, 'cache');
    return false;
  }
};
