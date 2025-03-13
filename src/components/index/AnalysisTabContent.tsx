
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { AnalysisSummary } from "@/components/AnalysisSummary";
import { AIAnalysis } from "@/components/AIAnalysis";
import { CrossComparisonInsights } from "@/components/CrossComparisonInsights";
import { PriceChangeTimeline } from "@/components/PriceChangeTimeline";
import { PriceSuggestions } from "@/components/PriceSuggestions";
import { PriceTable } from "@/components/PriceTable";
import { Info } from "lucide-react";
import { useShopify } from "@/contexts/shopify";

export const AnalysisTabContent = () => {
  const { analysis, isAnalyzing, items, summary } = useFileAnalysis();
  const { isShopifyConnected } = useShopify();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <AnalysisSummary {...summary} />
        </div>
        <div className="md:col-span-1">
          <AIAnalysis analysis={analysis} isLoading={isAnalyzing} />
        </div>
      </div>
      
      <div className="mt-6">
        <CrossComparisonInsights />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <PriceChangeTimeline />
        <PriceSuggestions />
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 p-3 rounded-md">
        <Info className="h-4 w-4 text-blue-500" />
        <p>
          {isShopifyConnected 
            ? "This analysis is integrated with your Shopify store data. You can sync price changes directly or export them."
            : "You can export this analysis in Shopify-compatible format for easy importing."}
        </p>
      </div>
      
      <PriceTable items={items} />
    </>
  );
};
