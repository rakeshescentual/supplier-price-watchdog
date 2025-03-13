
/**
 * Cache wrapper functionality for Gadget.dev storage
 */
import { logInfo, logError } from '../logging';
import { startPerformanceTracking } from '../telemetry';
import { getCacheValue, setCacheValue } from './cache-core';
import { CacheOptions } from './types';

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
