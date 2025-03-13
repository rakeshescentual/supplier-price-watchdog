
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { AnalysisSummary } from "@/components/AnalysisSummary";
import { MarketInsights } from "@/components/MarketInsights";
import { PriceTable } from "@/components/PriceTable";
import { Info } from "lucide-react";

export const MarketTabContent = () => {
  const { items, summary } = useFileAnalysis();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <AnalysisSummary {...summary} />
        </div>
        <div className="md:col-span-1">
          <MarketInsights />
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground bg-purple-50 p-3 rounded-md">
        <Info className="h-4 w-4 text-purple-500" />
        <p>
          The market data is enriched using web search technology to provide competitive insights for your products.
        </p>
      </div>
      
      <PriceTable items={items} />
    </>
  );
};
