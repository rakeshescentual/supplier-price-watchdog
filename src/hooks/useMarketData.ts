
import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { PriceItem, PriceAnalysis } from '@/types/price';
import { enrichDataWithSearch, getMarketTrends, performBatchOperations } from '@/lib/gadgetApi';

export const useMarketData = (
  items: PriceItem[],
  updateItems: (items: PriceItem[]) => void,
  onAnalysisNeeded?: (items: PriceItem[]) => Promise<PriceAnalysis | void>
) => {
  const [isEnrichingData, setIsEnrichingData] = useState(false);
  const [isFetchingTrends, setIsFetchingTrends] = useState(false);
  const [marketTrends, setMarketTrends] = useState<any | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  
  // Cache validation - Only perform operations if data has changed
  const itemsFingerprint = useMemo(() => {
    return items.length > 0 ? 
      items.reduce((acc, item) => acc + item.sku + (item.newPrice || 0), '') : '';
  }, [items]);
  
  // Enrich data with market info
  const enrichDataWithMarketInfo = useCallback(async (): Promise<PriceItem[] | void> => {
    if (items.length === 0) {
      toast.error("No items to enrich", {
        description: "Please upload a price list first.",
      });
      return;
    }
    
    setIsEnrichingData(true);
    setLastError(null);
    
    try {
      // Optimized implementation with batching for large datasets
      const enrichedItems = await enrichDataWithSearch(items);
      updateItems(enrichedItems);
      
      toast.success("Market data enrichment complete", {
        description: "Items have been enriched with market insights.",
      });
      
      // Update analysis with new data
      if (enrichedItems.length > 0 && onAnalysisNeeded) {
        try {
          await onAnalysisNeeded(enrichedItems);
        } catch (analysisError) {
          console.error("Error updating analysis after enrichment:", analysisError);
          // Don't fail the entire operation if just the analysis update fails
          toast.warning("Analysis update partial", {
            description: "Market data was updated but analysis couldn't be refreshed.",
          });
        }
      }
      
      return enrichedItems;
    } catch (error) {
      console.error("Error enriching data:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setLastError(errorMessage);
      toast.error("Error enriching data", {
        description: "Could not fetch market data. Please try again later.",
      });
    } finally {
      setIsEnrichingData(false);
    }
  }, [items, updateItems, onAnalysisNeeded, itemsFingerprint]);

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
    
    try {
      const trends = await getMarketTrends(category);
      setMarketTrends(trends);
      
      toast.success("Market trends fetched", {
        description: `Market trends for ${category} are now available.`,
      });
      
      return trends;
    } catch (error) {
      console.error("Error fetching market trends:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setLastError(errorMessage);
      toast.error("Error fetching market trends", {
        description: "Could not fetch market trends. Please try again later.",
      });
    } finally {
      setIsFetchingTrends(false);
    }
  }, []);

  // Batch process items for market analysis
  const batchProcessItems = useCallback(async (processFn: (item: PriceItem) => Promise<any>): Promise<any[]> => {
    if (items.length === 0) return [];
    
    return performBatchOperations(items, processFn, 50);
  }, [items]);

  // Reset error state
  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  return {
    isEnrichingData,
    isFetchingTrends,
    marketTrends,
    lastError,
    enrichDataWithMarketInfo,
    fetchCategoryTrends,
    batchProcessItems,
    clearError
  };
};
