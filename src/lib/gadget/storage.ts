
/**
 * Storage utilities for Gadget integration
 */
import { logInfo, logError } from './logging';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  namespace?: string;
}

/**
 * Set a value in the cache
 */
export const setCacheValue = async <T>(
  key: string,
  value: T,
  options: CacheOptions = {}
): Promise<boolean> => {
  try {
    logInfo('Setting cache value', { key, namespace: options.namespace }, 'storage');
    
    // Mock implementation - use localStorage in browser
    if (typeof window !== 'undefined') {
      const fullKey = options.namespace ? `${options.namespace}:${key}` : key;
      const cacheItem = {
        value,
        expires: options.ttl ? Date.now() + options.ttl * 1000 : undefined
      };
      localStorage.setItem(`gadget_cache:${fullKey}`, JSON.stringify(cacheItem));
    }
    
    return true;
  } catch (error) {
    logError('Failed to set cache value', { error, key }, 'storage');
    return false;
  }
};

/**
 * Get a value from the cache
 */
export const getCacheValue = async <T>(
  key: string,
  options: CacheOptions = {}
): Promise<T | null> => {
  try {
    // Mock implementation - use localStorage in browser
    if (typeof window !== 'undefined') {
      const fullKey = options.namespace ? `${options.namespace}:${key}` : key;
      const cacheItemRaw = localStorage.getItem(`gadget_cache:${fullKey}`);
      
      if (!cacheItemRaw) {
        return null;
      }
      
      const cacheItem = JSON.parse(cacheItemRaw);
      
      // Check if expired
      if (cacheItem.expires && cacheItem.expires < Date.now()) {
        localStorage.removeItem(`gadget_cache:${fullKey}`);
        return null;
      }
      
      return cacheItem.value as T;
    }
    
    return null;
  } catch (error) {
    logError('Failed to get cache value', { error, key }, 'storage');
    return null;
  }
};

/**
 * Clear a value from the cache
 */
export const clearCacheValue = async (
  key: string,
  options: CacheOptions = {}
): Promise<boolean> => {
  try {
    // Mock implementation - use localStorage in browser
    if (typeof window !== 'undefined') {
      const fullKey = options.namespace ? `${options.namespace}:${key}` : key;
      localStorage.removeItem(`gadget_cache:${fullKey}`);
    }
    
    return true;
  } catch (error) {
    logError('Failed to clear cache value', { error, key }, 'storage');
    return false;
  }
};

/**
 * Execute a function with cache
 */
export const withCache = async <T>(
  key: string,
  fn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> => {
  // Try to get from cache first
  const cached = await getCacheValue<T>(key, options);
  if (cached !== null) {
    return cached;
  }
  
  // Execute function
  const result = await fn();
  
  // Cache the result
  await setCacheValue(key, result, options);
  
  return result;
};

/**
 * Clear all cache values with a specific prefix
 */
export const clearCacheByPrefix = async (
  prefix: string,
  options: CacheOptions = {}
): Promise<number> => {
  try {
    // Mock implementation - use localStorage in browser
    if (typeof window !== 'undefined') {
      const fullPrefix = options.namespace ? `${options.namespace}:${prefix}` : prefix;
      let count = 0;
      
      // Find all keys with the prefix
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`gadget_cache:${fullPrefix}`)) {
          localStorage.removeItem(key);
          count++;
        }
      }
      
      return count;
    }
    
    return 0;
  } catch (error) {
    logError('Failed to clear cache by prefix', { error, prefix }, 'storage');
    return 0;
  }
};

/**
 * Get cache stats
 */
export const getCacheStats = async (
  options: CacheOptions = {}
): Promise<{ count: number; size: number }> => {
  try {
    // Mock implementation - use localStorage in browser
    if (typeof window !== 'undefined') {
      const prefix = options.namespace ? `gadget_cache:${options.namespace}:` : 'gadget_cache:';
      let count = 0;
      let size = 0;
      
      // Count items and size
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          count++;
          size += localStorage.getItem(key)?.length || 0;
        }
      }
      
      return { count, size };
    }
    
    return { count: 0, size: 0 };
  } catch (error) {
    logError('Failed to get cache stats', { error }, 'storage');
    return { count: 0, size: 0 };
  }
};

/**
 * Bulk set cache values
 */
export const bulkSetCacheValues = async <T>(
  items: Array<{ key: string; value: T }>,
  options: CacheOptions = {}
): Promise<number> => {
  try {
    let successCount = 0;
    
    for (const item of items) {
      const success = await setCacheValue(item.key, item.value, options);
      if (success) {
        successCount++;
      }
    }
    
    return successCount;
  } catch (error) {
    logError('Failed to bulk set cache values', { error }, 'storage');
    return 0;
  }
};

/**
 * Refresh a cache value (extend TTL without changing value)
 */
export const refreshCacheValue = async (
  key: string,
  options: CacheOptions = {}
): Promise<boolean> => {
  try {
    // Get current value
    const value = await getCacheValue(key, options);
    
    if (value === null) {
      return false;
    }
    
    // Set it again with new TTL
    return await setCacheValue(key, value, options);
  } catch (error) {
    logError('Failed to refresh cache value', { error, key }, 'storage');
    return false;
  }
};
