
/**
 * Storage optimization utilities for Gadget
 */
import { logInfo, logError } from '../logging';

// Cache options
export interface CacheOptions {
  ttl?: number;
  skipCache?: boolean;
  namespace?: string;
}

/**
 * Set a cache value
 */
export const setCacheValue = async <T>(
  key: string,
  value: T,
  options: CacheOptions = {}
): Promise<boolean> => {
  try {
    logInfo(`Setting cache value for key: ${key}`, {
      ttl: options.ttl,
      namespace: options.namespace
    }, 'storage');
    
    // In production, this would use Gadget's storage API
    // For now, use localStorage as a simple cache
    localStorage.setItem(
      `gadget_cache_${options.namespace ? `${options.namespace}_` : ''}${key}`,
      JSON.stringify({
        value,
        timestamp: Date.now(),
        expires: options.ttl ? Date.now() + options.ttl : null
      })
    );
    
    return true;
  } catch (error) {
    logError(`Error setting cache value for key: ${key}`, { error }, 'storage');
    return false;
  }
};

/**
 * Get a cache value
 */
export const getCacheValue = async <T>(
  key: string,
  options: CacheOptions = {}
): Promise<T | null> => {
  try {
    if (options.skipCache) {
      return null;
    }
    
    logInfo(`Getting cache value for key: ${key}`, {
      namespace: options.namespace
    }, 'storage');
    
    // In production, this would use Gadget's storage API
    const cached = localStorage.getItem(
      `gadget_cache_${options.namespace ? `${options.namespace}_` : ''}${key}`
    );
    
    if (!cached) {
      return null;
    }
    
    const parsedCache = JSON.parse(cached);
    
    // Check if cache has expired
    if (parsedCache.expires && parsedCache.expires < Date.now()) {
      // Cache expired, clear it
      localStorage.removeItem(
        `gadget_cache_${options.namespace ? `${options.namespace}_` : ''}${key}`
      );
      return null;
    }
    
    return parsedCache.value as T;
  } catch (error) {
    logError(`Error getting cache value for key: ${key}`, { error }, 'storage');
    return null;
  }
};

/**
 * Clear a cache value
 */
export const clearCacheValue = async (
  key: string,
  options: { namespace?: string } = {}
): Promise<boolean> => {
  try {
    logInfo(`Clearing cache value for key: ${key}`, {
      namespace: options.namespace
    }, 'storage');
    
    localStorage.removeItem(
      `gadget_cache_${options.namespace ? `${options.namespace}_` : ''}${key}`
    );
    
    return true;
  } catch (error) {
    logError(`Error clearing cache value for key: ${key}`, { error }, 'storage');
    return false;
  }
};

/**
 * Use cache with an async function
 */
export const withCache = async <T>(
  key: string,
  fn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> => {
  const cachedValue = await getCacheValue<T>(key, options);
  
  if (cachedValue !== null) {
    return cachedValue;
  }
  
  const value = await fn();
  await setCacheValue(key, value, options);
  return value;
};

/**
 * Clear cache by prefix
 */
export const clearCacheByPrefix = async (
  prefix: string,
  options: { namespace?: string } = {}
): Promise<number> => {
  try {
    // Get all keys
    let clearedCount = 0;
    const fullPrefix = `gadget_cache_${options.namespace ? `${options.namespace}_` : ''}${prefix}`;
    
    // In production, this would use Gadget's storage API
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(fullPrefix)) {
        localStorage.removeItem(key);
        clearedCount++;
      }
    }
    
    logInfo(`Cleared ${clearedCount} cache entries with prefix: ${prefix}`, {
      namespace: options.namespace
    }, 'storage');
    
    return clearedCount;
  } catch (error) {
    logError(`Error clearing cache by prefix: ${prefix}`, { error }, 'storage');
    return 0;
  }
};

/**
 * Get cache stats
 */
export const getCacheStats = async (
  options: { namespace?: string } = {}
): Promise<{
  totalEntries: number;
  totalSize: number;
  oldestEntry: number;
  newestEntry: number;
}> => {
  try {
    // In production, this would use Gadget's storage API
    const namespacePrefix = options.namespace ? `gadget_cache_${options.namespace}_` : 'gadget_cache_';
    
    let totalEntries = 0;
    let totalSize = 0;
    let oldestEntry = Date.now();
    let newestEntry = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(namespacePrefix)) {
        const value = localStorage.getItem(key);
        if (value) {
          totalEntries++;
          totalSize += value.length;
          
          try {
            const parsed = JSON.parse(value);
            if (parsed.timestamp) {
              oldestEntry = Math.min(oldestEntry, parsed.timestamp);
              newestEntry = Math.max(newestEntry, parsed.timestamp);
            }
          } catch (e) {
            // Skip invalid entries
          }
        }
      }
    }
    
    return {
      totalEntries,
      totalSize,
      oldestEntry,
      newestEntry
    };
  } catch (error) {
    logError(`Error getting cache stats`, { error }, 'storage');
    return {
      totalEntries: 0,
      totalSize: 0,
      oldestEntry: 0,
      newestEntry: 0
    };
  }
};

/**
 * Bulk set cache values
 */
export const bulkSetCacheValues = async <T>(
  entries: Array<{ key: string; value: T }>,
  options: CacheOptions = {}
): Promise<number> => {
  try {
    let successCount = 0;
    
    for (const entry of entries) {
      const success = await setCacheValue(entry.key, entry.value, options);
      if (success) {
        successCount++;
      }
    }
    
    return successCount;
  } catch (error) {
    logError(`Error bulk setting cache values`, { error }, 'storage');
    return 0;
  }
};

/**
 * Refresh a cache value
 */
export const refreshCacheValue = async <T>(
  key: string,
  fn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> => {
  try {
    const value = await fn();
    await setCacheValue(key, value, options);
    return value;
  } catch (error) {
    logError(`Error refreshing cache value for key: ${key}`, { error }, 'storage');
    
    // Try to get the existing cache as fallback
    const existing = await getCacheValue<T>(key, { ...options, skipCache: false });
    if (existing !== null) {
      return existing;
    }
    
    throw error;
  }
};
