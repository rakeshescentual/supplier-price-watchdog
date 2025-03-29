
import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { PriceItem, PriceAnalysis } from '@/types/price';
import { useGadgetAnalytics } from '@/components/gadget/GadgetAnalyticsProvider';
import { useMarketDataEnrichment } from './useMarketDataEnrichment';
import { useMarketDataTrends } from './useMarketDataTrends';
import { useMarketDataAnalysis } from './useMarketDataAnalysis';
import { useMarketDataBatching } from './useMarketDataBatching';
import { 
  calculateCrossSupplierTrends, 
  analyzeCategories, 
  analyzeSuppliers
} from '@/utils/crossSupplierAnalysis';

export const useMarketData = (
  items: PriceItem[],
  updateItems: (items: PriceItem[]) => void,
  onAnalysisNeeded?: (items: PriceItem[]) => Promise<PriceAnalysis | void>
) => {
  const [lastError, setLastError] = useState<string | null>(null);
  
  const analytics = useGadgetAnalytics();
  const marketDataTracker = useMemo(() => analytics.createFeatureTracker('marketData'), [analytics]);
  
  // Cache validation - Only perform operations if data has changed
  const itemsFingerprint = useMemo(() => {
    return items.length > 0 ? 
      items.reduce((acc, item) => acc + item.sku + (item.newPrice || 0), '') : '';
  }, [items]);
  
  // Import specialized hooks
  const { 
    isEnrichingData, 
    enrichDataWithMarketInfo 
  } = useMarketDataEnrichment(items, updateItems, onAnalysisNeeded, analytics, marketDataTracker);
  
  const { 
    isFetchingTrends, 
    marketTrends, 
    fetchCategoryTrends 
  } = useMarketDataTrends(analytics, marketDataTracker);
  
  const { 
    isAnalyzingPatterns, 
    advancedAnalysis, 
    analyzeAdvancedPatterns 
  } = useMarketDataAnalysis(items, analytics, marketDataTracker);
  
  const { batchProcessItems } = useMarketDataBatching(items, analytics, marketDataTracker);
  
  // Calculate cross-supplier price trends
  const crossSupplierTrends = useMemo(() => {
    return calculateCrossSupplierTrends(items);
  }, [items]);
  
  // Calculate category analysis
  const categoryAnalysis = useMemo(() => {
    return analyzeCategories(items);
  }, [items]);
  
  // Calculate supplier analysis
  const supplierAnalysis = useMemo(() => {
    return analyzeSuppliers(items);
  }, [items]);

  // Reset error state
  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  return {
    isEnrichingData,
    isFetchingTrends,
    isAnalyzingPatterns,
    marketTrends,
    lastError,
    crossSupplierTrends,
    categoryAnalysis,
    supplierAnalysis,
    advancedAnalysis,
    enrichDataWithMarketInfo,
    fetchCategoryTrends,
    analyzeAdvancedPatterns,
    batchProcessItems,
    clearError
  };
};
