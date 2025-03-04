
import { useState } from "react";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  TrendingUp, 
  Globe, 
  Search, 
  ShoppingBag,
  AlertCircle, 
  ArrowUpDown, 
  BarChart4, 
  RefreshCw 
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const MarketInsights = () => {
  const { 
    items, 
    isEnrichingData,
    marketTrends,
    isFetchingTrends,
    enrichDataWithMarketInfo, 
    fetchCategoryTrends 
  } = useFileAnalysis();
  
  const [category, setCategory] = useState<string>("");
  const hasMarketData = items.some(item => item.marketData !== undefined);

  // Get most common categories from items for suggestions
  const getCategories = () => {
    const categories = items
      .map(item => item.category || "")
      .filter(Boolean)
      .reduce((acc: Record<string, number>, cat: string) => {
        if (cat) {
          acc[cat] = (acc[cat] || 0) + 1;
        }
        return acc;
      }, {});
    
    return Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat);
  };

  const popularCategories = getCategories();
  
  const handleFetchTrends = () => {
    if (category) {
      fetchCategoryTrends(category);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-primary" />
        <h3 className="font-medium">Market Insights</h3>
      </div>

      {/* Web enrichment section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-4 h-4 text-blue-500" />
          <h4 className="font-medium">Web Data Enrichment</h4>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          Enhance your price analysis with real-time market data from the web.
        </p>
        
        <Button 
          onClick={enrichDataWithMarketInfo} 
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

        {hasMarketData && (
          <div className="mt-4 space-y-3">
            <h5 className="text-sm font-medium">Price positioning:</h5>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {(['low', 'average', 'high'] as const).map(position => {
                const count = items.filter(
                  item => item.marketData?.pricePosition === position
                ).length;
                return (
                  <TooltipProvider key={position}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`p-2 rounded ${
                          position === 'low' 
                            ? 'bg-green-50 text-green-700' 
                            : position === 'average'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-orange-50 text-orange-700'
                        }`}>
                          <div className="font-medium">{count}</div>
                          <div>{position}</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{count} products positioned at {position} market price</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Category trends section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-purple-500" />
          <h4 className="font-medium">Category Trends</h4>
        </div>
        
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Enter product category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-sm"
          />
          <Button 
            onClick={handleFetchTrends} 
            disabled={isFetchingTrends || !category}
            size="sm"
          >
            {isFetchingTrends ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {popularCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {popularCategories.map(cat => (
              <Button 
                key={cat} 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => setCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}
        
        {marketTrends && (
          <div className="p-3 rounded-md bg-muted/40 mt-2">
            <div className="flex items-center gap-2 text-sm font-medium mb-2">
              <BarChart4 className="w-4 h-4" /> 
              Market trend: {marketTrends.trends.direction === 'up' ? 'Rising' : 'Falling'}
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>{marketTrends.trends.percentageChange}% change in last {marketTrends.trends.timeframe}</p>
              <p>Related products:</p>
              <ul className="list-disc list-inside">
                {marketTrends.relatedProducts.map((product: any, i: number) => (
                  <li key={i} className="flex items-center justify-between">
                    <span>{product.name}</span>
                    <span className={product.growth > 0 ? "text-green-600" : "text-red-600"}>
                      {product.growth > 0 ? '+' : ''}{product.growth}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
