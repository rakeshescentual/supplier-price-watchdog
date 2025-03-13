
import { useState, useCallback } from "react";
import { generateAIAnalysis } from "@/lib/aiAnalysis";
import { toast } from "sonner";
import type { PriceItem, PriceAnalysis } from "@/types/price";
import { useMarketData } from "@/hooks/useMarketData";
import type { AnalysisState } from "../types";

export const useAnalysisState = (
  items: PriceItem[],
  setItems: (items: PriceItem[]) => void
): AnalysisState => {
  const [analysis, setAnalysis] = useState<PriceAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [priceIncreaseEffectiveDate, setPriceIncreaseEffectiveDate] = useState<Date>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );

  const analyzeData = useCallback(async (data: PriceItem[]): Promise<PriceAnalysis | void> => {
    if (data.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const result = await generateAIAnalysis(data);
      setAnalysis(result);
      
      toast.success("AI analysis complete", {
        description: "Insights and recommendations are ready.",
      });
      
      return result;
    } catch (error) {
      console.error("AI analysis error:", error);
      toast.error("Error generating AI analysis", {
        description: "Please try again later.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const { 
    isEnrichingData, 
    isFetchingTrends, 
    marketTrends,
    enrichDataWithMarketInfo,
    fetchCategoryTrends
  } = useMarketData(items, setItems, analyzeData);

  return {
    analysis,
    isAnalyzing,
    isEnrichingData,
    marketTrends,
    isFetchingTrends,
    priceIncreaseEffectiveDate,
    setPriceIncreaseEffectiveDate,
    analyzeData,
    enrichDataWithMarketInfo,
    fetchCategoryTrends
  };
};
