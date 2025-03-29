
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { PriceItem, PriceAnalysis } from '@/types/price';
import { enrichDataWithSearch } from '@/utils/marketDataUtils';

export const useMarketDataEnrichment = (
  items: PriceItem[],
  updateItems: (items: PriceItem[]) => void,
  analytics: any,
  marketDataTracker: any,
  onAnalysisNeeded?: (items: PriceItem[]) => Promise<PriceAnalysis | void>
) => {
  const [isEnrichingData, setIsEnrichingData] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

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
    
    marketDataTracker.trackUse('enrich_start', { itemCount: items.length });
    const perfTracker = analytics.startTracking('enrichDataWithMarketInfo', { itemCount: items.length });
    
    try {
      // Optimized implementation with batching for large datasets
      const enrichedItems = await enrichDataWithSearch(items);
      updateItems(enrichedItems);
      
      toast.success("Market data enrichment complete", {
        description: "Items have been enriched with market insights.",
      });
      
      marketDataTracker.trackUse('enrich_success', { 
        itemCount: items.length, 
        enrichedCount: enrichedItems.length 
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
          
          marketDataTracker.trackError(analysisError instanceof Error ? analysisError : String(analysisError), {
            operation: 'analysis_after_enrichment'
          });
        }
      }
      
      await perfTracker();
      return enrichedItems;
    } catch (error) {
      console.error("Error enriching data:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setLastError(errorMessage);
      
      marketDataTracker.trackError(error instanceof Error ? error : String(error), {
        operation: 'enrich_data'
      });
      
      toast.error("Error enriching data", {
        description: "Could not fetch market data. Please try again later.",
      });
    } finally {
      setIsEnrichingData(false);
      await perfTracker();
    }
  }, [items, updateItems, onAnalysisNeeded, analytics, marketDataTracker]);

  return {
    isEnrichingData,
    lastError,
    enrichDataWithMarketInfo
  };
};
