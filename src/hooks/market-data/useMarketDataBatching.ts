
import { useCallback } from 'react';
import { PriceItem } from '@/types/price';
import { performBatchOperations } from '@/utils/marketDataUtils';

export const useMarketDataBatching = (
  items: PriceItem[],
  analytics: any,
  marketDataTracker: any
) => {
  // Batch process items for market analysis
  const batchProcessItems = useCallback(async (processFn: (item: PriceItem) => Promise<any>): Promise<any[]> => {
    if (items.length === 0) return [];
    
    marketDataTracker.trackUse('batch_process', { itemCount: items.length });
    const perfTracker = analytics.startTracking('batchProcessItems', { itemCount: items.length });
    
    try {
      const results = await performBatchOperations(items, processFn, 50);
      await perfTracker();
      return results;
    } catch (error) {
      marketDataTracker.trackError(error instanceof Error ? error : String(error), {
        operation: 'batch_process'
      });
      await perfTracker();
      throw error;
    }
  }, [items, analytics, marketDataTracker]);

  return {
    batchProcessItems
  };
};
