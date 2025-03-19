
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
      const currentProgress = Math.random() * 5;
      // Instead of using a function callback, calculate the new progress here
      // and call setGenerationProgress with the direct number value
      const newProgress = Math.min(generationProgress + currentProgress, 100);
      setGenerationProgress(newProgress);
      
      // Track the current progress in a variable
      generationProgress = newProgress;
    }, 200);
    
    // Variable to track progress
    let generationProgress = 0;
    
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
