
import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { PriceItem, PriceAnalysis } from '@/types/price';
import { 
  enrichDataWithSearch, 
  getMarketTrends, 
  performBatchOperations,
  analyzePriceVolatility,
  identifyPricingPatterns,
  detectSeasonalPatterns
} from '@/utils/marketDataUtils';
import { 
  calculateCrossSupplierTrends, 
  analyzeCategories, 
  analyzeSuppliers,
  identifyCorrelatedSuppliers,
  identifyCompetitiveCategories,
  identifyProductSizeStrategies
} from '@/utils/crossSupplierAnalysis';
import { useGadgetAnalytics } from '@/components/gadget/GadgetAnalyticsProvider';

export const useMarketData = (
  items: PriceItem[],
  updateItems: (items: PriceItem[]) => void,
  onAnalysisNeeded?: (items: PriceItem[]) => Promise<PriceAnalysis | void>
) => {
  const [isEnrichingData, setIsEnrichingData] = useState(false);
  const [isFetchingTrends, setIsFetchingTrends] = useState(false);
  const [marketTrends, setMarketTrends] = useState<any | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isAnalyzingPatterns, setIsAnalyzingPatterns] = useState(false);
  const [advancedAnalysis, setAdvancedAnalysis] = useState<{
    priceVolatility?: { categoryVolatility: Record<string, number>, supplierVolatility: Record<string, number> };
    pricingPatterns?: { roundedPricing: number, psychologicalPricing: number };
    seasonalPatterns?: { categoriesWithSeasonalPricing: string[], highSeasonCategories: string[], lowSeasonCategories: string[] };
    correlatedSuppliers?: { pair: string[], correlation: number }[];
    competitiveCategories?: { category: string; competitionScore: number; supplierCount: number; priceVariance: number }[];
    productSizeStrategies?: { sizeStrategies: { category: string; trend: 'smaller' | 'larger' | 'stable'; confidence: number }[] };
  }>({});
  
  const analytics = useGadgetAnalytics();
  const marketDataTracker = useMemo(() => analytics.createFeatureTracker('marketData'), [analytics]);
  
  // Cache validation - Only perform operations if data has changed
  const itemsFingerprint = useMemo(() => {
    return items.length > 0 ? 
      items.reduce((acc, item) => acc + item.sku + (item.newPrice || 0), '') : '';
  }, [items]);
  
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
  }, [items, updateItems, onAnalysisNeeded, itemsFingerprint, analytics, marketDataTracker]);

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

  // Analyze advanced pricing patterns
  const analyzeAdvancedPatterns = useCallback(async (): Promise<void> => {
    if (items.length === 0) {
      toast.error("No items to analyze", {
        description: "Please upload a price list first.",
      });
      return;
    }
    
    setIsAnalyzingPatterns(true);
    
    marketDataTracker.trackUse('analyze_patterns', { itemCount: items.length });
    const perfTracker = analytics.startTracking('analyzeAdvancedPatterns', { itemCount: items.length });
    
    try {
      // Perform various advanced analyses
      const priceVolatility = analyzePriceVolatility(items);
      const pricingPatterns = identifyPricingPatterns(items);
      const seasonalPatterns = detectSeasonalPatterns(items);
      const correlatedSuppliers = identifyCorrelatedSuppliers(items);
      const competitiveCategories = identifyCompetitiveCategories(items);
      const productSizeStrategies = identifyProductSizeStrategies(items);
      
      setAdvancedAnalysis({
        priceVolatility,
        pricingPatterns,
        seasonalPatterns,
        correlatedSuppliers,
        competitiveCategories,
        productSizeStrategies
      });
      
      toast.success("Advanced analysis complete", {
        description: "Advanced pricing patterns and market insights are now available.",
      });
      
      marketDataTracker.trackUse('analyze_patterns_success', {
        itemCount: items.length,
        supplierCount: Object.keys(priceVolatility.supplierVolatility).length,
        categoryCount: Object.keys(priceVolatility.categoryVolatility).length
      });
    } catch (error) {
      console.error("Error analyzing patterns:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setLastError(errorMessage);
      
      marketDataTracker.trackError(error instanceof Error ? error : String(error), {
        operation: 'analyze_patterns'
      });
      
      toast.error("Error analyzing patterns", {
        description: "Could not complete advanced analysis. Please try again later.",
      });
    } finally {
      setIsAnalyzingPatterns(false);
      await perfTracker();
    }
  }, [items, analytics, marketDataTracker]);

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
