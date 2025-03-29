
import { useCallback } from 'react';
import { PriceItem } from '@/types/price';
import { performBatchOperations } from '@/utils/marketDataUtils';

export const useMarketDataBatching = (
  items: PriceItem[],
  analytics: any,
  marketDataTracker: any
) => {
  // Batch process items for market analysis
  const batchProcessItems = useCallback(<T, R>(processFn: (item: T) => Promise<R>): Promise<R[]> => {
    if (items.length === 0) return Promise.resolve([]) as Promise<R[]>;
    
    marketDataTracker.trackUse('batch_process', { itemCount: items.length });
    const perfTracker = analytics.startTracking('batchProcessItems', { itemCount: items.length });
    
    try {
      // We need to cast here since our items are PriceItem[] but we want to allow generic processing
      const results = performBatchOperations(items as unknown as T[], processFn, 50);
      perfTracker();
      return results;
    } catch (error) {
      marketDataTracker.trackError(error instanceof Error ? error : String(error), {
        operation: 'batch_process'
      });
      perfTracker();
      throw error;
    }
  }, [items, analytics, marketDataTracker]);

  return {
    batchProcessItems
  };
};
