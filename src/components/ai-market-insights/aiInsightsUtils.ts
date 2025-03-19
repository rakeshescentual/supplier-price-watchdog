
import { CompetitorPriceItem } from "@/types/price";
import { generateMarketOpportunityReport, generatePriceOptimizations } from "@/utils/aiCompetitorInsights";
import { toast } from "sonner";

/**
 * Generates AI insights from competitor data
 */
export const generateAIInsights = async (
  competitorItems: CompetitorPriceItem[],
  setGenerationProgress: (progress: number) => void,
  setIsGenerating: (generating: boolean) => void,
  setOpportunityReport: (report: any) => void,
  setPriceOptimizations: (optimizations: any[]) => void,
  onRefresh?: () => void
) => {
  if (competitorItems.length === 0) return;
  
  setIsGenerating(true);
  setGenerationProgress(0);
  
  try {
    // Start progress animation
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);
    
    // Generate market opportunity report
    const report = await generateMarketOpportunityReport(competitorItems);
    setOpportunityReport(report);
    
    // Generate price optimizations
    const optimizations = await generatePriceOptimizations(competitorItems);
    setPriceOptimizations(optimizations);
    
    clearInterval(interval);
    setGenerationProgress(100);
    
    toast.success("AI insights generated", {
      description: "Market analysis and price optimizations are ready.",
    });
    
    // Call onRefresh if provided
    if (onRefresh) {
      onRefresh();
    }
  } catch (error) {
    console.error("Error generating AI insights:", error);
    toast.error("Failed to generate insights", {
      description: "There was an error analyzing the market data.",
    });
  } finally {
    setIsGenerating(false);
  }
};
