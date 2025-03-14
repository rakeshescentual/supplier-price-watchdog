
/**
 * Platform-related actions for Gadget
 */
import { logInfo } from '../logging';
import { runGadgetAction } from './core';
import { GadgetActionOptions, GadgetActionResponse } from './types';
import { PriceItem } from '@/types/price';

/**
 * Sync prices to multiple platforms
 * @param items Price items to sync
 * @param platforms Platforms to sync to
 * @param options Options for the action
 * @returns Promise resolving to sync results
 */
export const syncPricesToPlatforms = async (
  items: PriceItem[],
  platforms: Array<{
    platform: 'shopify' | 'amazon' | 'ebay' | 'walmart';
    connectionId: string;
  }>,
  options: GadgetActionOptions = {}
): Promise<GadgetActionResponse<{
  results: Array<{
    platform: string;
    success: boolean;
    syncedCount: number;
    errorCount: number;
    details?: string;
  }>;
}>> => {
  logInfo(`Syncing ${items.length} prices to ${platforms.length} platforms with Gadget`, {
    itemCount: items.length,
    platforms: platforms.map(p => p.platform)
  }, 'platform-actions');
  
  return runGadgetAction(
    'syncPricesToPlatforms',
    { items, platforms },
    {
      ...options,
      toastMessages: {
        loading: 'Syncing prices to platforms...',
        success: 'Prices synced to platforms',
        error: 'Error syncing prices',
        ...options.toastMessages
      }
    }
  );
};
