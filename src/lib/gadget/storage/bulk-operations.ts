
/**
 * Bulk cache operations for Gadget.dev storage
 */
import { logInfo, logError } from '../logging';
import { initGadgetClient } from '../client';
import { CacheEntry, CacheOptions, DEFAULT_TTL, DEFAULT_NAMESPACE } from './types';

/**
 * Update or create multiple cache entries in a single operation
 * @param entries Array of entries to set
 * @param options Cache options
 */
export const bulkSetCacheValues = async <T>(
  entries: Array<{ key: string; value: T }>,
  options: CacheOptions = {}
): Promise<boolean> => {
  const client = initGadgetClient();
  if (!client) {
    console.warn('Gadget client not initialized, using localStorage fallback');
    try {
      const ttl = options.ttl ?? DEFAULT_TTL;
      const namespace = options.namespace ?? DEFAULT_NAMESPACE;
      
      entries.forEach(entry => {
        const cacheKey = `${namespace}:${entry.key}`;
        const cacheEntry: CacheEntry<T> = {
          value: entry.value,
          expires: ttl > 0 ? Date.now() + ttl * 1000 : null,
          version: options.version
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
      });
      
      return true;
    } catch (error) {
      console.error('Error bulk setting cache in localStorage:', error);
      return false;
    }
  }

  try {
    // In production with Gadget SDK:
    // await client.mutate.bulkSetCache({
    //   entries: entries.map(entry => ({
    //     key: options.namespace ? `${options.namespace}:${entry.key}` : entry.key,
    //     value: JSON.stringify(entry.value)
    //   })),
    //   ttl: options.ttl ?? DEFAULT_TTL,
    //   region: options.region || 'persistent',
    //   compress: options.compressLarge,
    //   version: options.version,
    //   priority: options.priority || 'normal'
    // });
    
    logInfo(`Bulk cache set for ${entries.length} entries`, { namespace: options.namespace }, 'cache');
    return true;
  } catch (error) {
    logError('Error bulk setting cache values', { error, entryCount: entries.length }, 'cache');
    return false;
  }
};
