
/**
 * Cache statistics utilities for Gadget.dev storage
 */
import { logError } from '../logging';
import { initGadgetClient } from '../client';

/**
 * Get cache statistics from Gadget
 * @returns Cache statistics or null if not available
 */
export const getCacheStats = async (
  region: 'memory' | 'persistent' = 'persistent'
): Promise<{
  entries: number;
  sizeBytes: number;
  hitRate: number;
  avgAccessTime: number;
  memoryUsage?: number;
} | null> => {
  const client = initGadgetClient();
  if (!client) {
    return null;
  }

  try {
    // In production with Gadget SDK:
    // const stats = await client.query.getCacheStats({ region });
    // return {
    //   entries: stats.entries,
    //   sizeBytes: stats.sizeBytes,
    //   hitRate: stats.hitRate,
    //   avgAccessTime: stats.avgAccessTime,
    //   memoryUsage: stats.memoryUsage
    // };
    
    // For development, return mock stats
    return {
      entries: 128,
      sizeBytes: 56320,
      hitRate: 0.78,
      avgAccessTime: 3.2,
      memoryUsage: 0.02 // percentage of total available memory
    };
  } catch (error) {
    logError('Error getting cache stats', { error }, 'cache');
    return null;
  }
};
