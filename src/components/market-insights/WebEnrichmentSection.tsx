
import { Button } from "@/components/ui/button";
import { RefreshCw, Globe, Search } from "lucide-react";
import { MarketPositioningCard } from "./MarketPositioningCard";
import { PriceItem } from "@/types/price";

interface WebEnrichmentSectionProps {
  isEnrichingData: boolean;
  hasMarketData: boolean;
  items: PriceItem[];
  handleEnrichData: () => Promise<void>;
}

export const WebEnrichmentSection = ({ 
  isEnrichingData, 
  hasMarketData, 
  items, 
  handleEnrichData 
}: WebEnrichmentSectionProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Search className="w-4 h-4 text-blue-500" />
        <h4 className="font-medium">Web Data Enrichment</h4>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">
        Enhance your price analysis with real-time market data from the web.
      </p>
      
      <Button 
        onClick={handleEnrichData} 
        disabled={isEnrichingData || items.length === 0}
        variant="outline"
        size="sm"
        className="w-full"
      >
        {isEnrichingData ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Enriching data...
          </>
        ) : hasMarketData ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh market data
          </>
        ) : (
          <>
            <Globe className="mr-2 h-4 w-4" />
            Fetch market insights
          </>
        )}
      </Button>

      <MarketPositioningCard items={items} hasMarketData={hasMarketData} />
    </div>
  );
};
