
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { getMarketTrends } from '@/utils/marketDataUtils';

export const useMarketDataTrends = (
  analytics: any,
  marketDataTracker: any
) => {
  const [isFetchingTrends, setIsFetchingTrends] = useState(false);
  const [marketTrends, setMarketTrends] = useState<any | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  // Fetch category trends with improved error handling
  const fetchCategoryTrends = useCallback(async (category: string): Promise<any | void> => {
    if (!category?.trim()) {
      toast.error("Invalid category", {
        description: "Please provide a valid category name.",
      });
      return;
    }
    
    setIsFetchingTrends(true);
    setLastError(null);
    
    marketDataTracker.trackUse('fetch_trends', { category });
    const perfTracker = analytics.startTracking('fetchCategoryTrends', { category });
    
    try {
      const trends = await getMarketTrends(category);
      setMarketTrends(trends);
      
      toast.success("Market trends fetched", {
        description: `Market trends for ${category} are now available.`,
      });
      
      marketDataTracker.trackUse('fetch_trends_success', { 
        category,
        dataPoints: trends?.dataPoints?.length || 0
      });
      
      await perfTracker();
      return trends;
    } catch (error) {
      console.error("Error fetching market trends:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setLastError(errorMessage);
      
      marketDataTracker.trackError(error instanceof Error ? error : String(error), {
        operation: 'fetch_trends',
        category
      });
      
      toast.error("Error fetching market trends", {
        description: "Could not fetch market trends. Please try again later.",
      });
    } finally {
      setIsFetchingTrends(false);
      await perfTracker();
    }
  }, [analytics, marketDataTracker]);

  return {
    isFetchingTrends,
    marketTrends,
    lastError,
    fetchCategoryTrends
  };
};
