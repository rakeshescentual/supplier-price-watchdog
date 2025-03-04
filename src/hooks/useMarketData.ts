
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { PriceItem } from '@/types/price';
import { enrichDataWithSearch, getMarketTrends } from '@/lib/gadgetApi';

export const useMarketData = (
  items: PriceItem[],
  updateItems: (items: PriceItem[]) => void,
  onAnalysisNeeded?: (items: PriceItem[]) => void
) => {
  const [isEnrichingData, setIsEnrichingData] = useState(false);
  const [isFetchingTrends, setIsFetchingTrends] = useState(false);
  const [marketTrends, setMarketTrends] = useState<any | null>(null);
  
  // Enrich data with market info
  const enrichDataWithMarketInfo = useCallback(async () => {
    if (items.length === 0) {
      toast.error("No items to enrich", {
        description: "Please upload a price list first.",
      });
      return;
    }
    
    setIsEnrichingData(true);
    try {
      const enrichedItems = await enrichDataWithSearch(items);
      updateItems(enrichedItems);
      
      toast.success("Market data enrichment complete", {
        description: "Items have been enriched with market insights.",
      });
      
      // Update analysis with new data
      if (enrichedItems.length > 0 && onAnalysisNeeded) {
        onAnalysisNeeded(enrichedItems);
      }
      
      return enrichedItems;
    } catch (error) {
      console.error("Error enriching data:", error);
      toast.error("Error enriching data", {
        description: "Could not fetch market data. Please try again later.",
      });
      throw error;
    } finally {
      setIsEnrichingData(false);
    }
  }, [items, updateItems, onAnalysisNeeded]);

  // Fetch category trends
  const fetchCategoryTrends = useCallback(async (category: string) => {
    if (!category.trim()) {
      toast.error("Invalid category", {
        description: "Please provide a valid category name.",
      });
      return;
    }
    
    setIsFetchingTrends(true);
    try {
      const trends = await getMarketTrends(category);
      setMarketTrends(trends);
      
      toast.success("Market trends fetched", {
        description: `Market trends for ${category} are now available.`,
      });
      
      return trends;
    } catch (error) {
      console.error("Error fetching market trends:", error);
      toast.error("Error fetching market trends", {
        description: "Could not fetch market trends. Please try again later.",
      });
      throw error;
    } finally {
      setIsFetchingTrends(false);
    }
  }, []);

  return {
    isEnrichingData,
    isFetchingTrends,
    marketTrends,
    enrichDataWithMarketInfo,
    fetchCategoryTrends
  };
};
