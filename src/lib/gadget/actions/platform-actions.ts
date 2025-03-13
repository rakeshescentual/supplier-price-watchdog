
/**
 * Platform synchronization Gadget actions
 */
import { runGadgetAction } from './core';
import { GadgetActionResponse } from './types';
import type { PriceItem } from '@/types/price';

/**
 * Synchronize price changes to multiple platforms via Gadget
 */
export async function syncPricesToPlatforms(
  items: PriceItem[],
  platforms: ('shopify' | 'klaviyo' | 'erp')[]
): Promise<GadgetActionResponse<{
  successful: number;
  failed: number;
  platforms: Record<string, { success: boolean; message?: string }>
}>> {
  return runGadgetAction(
    'syncPricesToPlatforms',
    { items, platforms },
    {
      showToast: true,
      toastMessages: {
        loading: "Syncing prices to platforms...",
        success: "Prices synced successfully",
        error: "Price sync failed"
      },
      retries: 2
    }
  );
}
