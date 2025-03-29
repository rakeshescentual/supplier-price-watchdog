
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { PriceItem } from '@/types/price';
import {
  analyzePriceVolatility,
  identifyPricingPatterns,
  detectSeasonalPatterns
} from '@/utils/marketDataUtils';
import {
  identifyCorrelatedSuppliers,
  identifyCompetitiveCategories,
  identifyProductSizeStrategies
} from '@/utils/crossSupplierAnalysis';

export const useMarketDataAnalysis = (
  items: PriceItem[],
  analytics: any,
  marketDataTracker: any
) => {
  const [isAnalyzingPatterns, setIsAnalyzingPatterns] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [advancedAnalysis, setAdvancedAnalysis] = useState<{
    priceVolatility?: { categoryVolatility: Record<string, number>, supplierVolatility: Record<string, number> };
    pricingPatterns?: { roundedPricing: number, psychologicalPricing: number };
    seasonalPatterns?: { categoriesWithSeasonalPricing: string[], highSeasonCategories: string[], lowSeasonCategories: string[] };
    correlatedSuppliers?: { pair: string[], correlation: number }[];
    competitiveCategories?: { category: string; competitionScore: number; supplierCount: number; priceVariance: number }[];
    productSizeStrategies?: { sizeStrategies: { category: string; trend: 'smaller' | 'larger' | 'stable'; confidence: number }[] };
  }>({});

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

  return {
    isAnalyzingPatterns,
    lastError,
    advancedAnalysis,
    analyzeAdvancedPatterns
  };
};
