
import { useState, useEffect } from "react";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  TrendingUp, 
  Globe, 
  Search, 
  AlertCircle, 
  BarChart4, 
  RefreshCw 
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
  const [error, setError] = useState<string | null>(null);
  const [popularCategories, setPopularCategories] = useState<string[]>([]);
  const hasMarketData = items.some(item => item.marketData !== undefined);

  // Find popular categories when items change
  useEffect(() => {
    if (items.length === 0) {
      setPopularCategories([]);
      return;
    }
    
    const categories = items
      .map(item => item.category || "")
      .filter(Boolean)
      .reduce((acc: Record<string, number>, cat: string) => {
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});
    
    const topCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat);
      
    setPopularCategories(topCategories);
    
    // Auto-select the most popular category if none is selected
    if (topCategories.length > 0 && !category) {
      setCategory(topCategories[0]);
    }
  }, [items, category]);
  
  // Clear any errors when dependencies change
  useEffect(() => {
    setError(null);
  }, [category, items]);
  
  const handleFetchTrends = async () => {
    if (!category) {
      toast.error("Missing category", {
        description: "Please enter or select a category first."
      });
      return;
    }
    
    setError(null);
    try {
      await fetchCategoryTrends(category);
    } catch (err) {
      setError("Failed to fetch trends. Please try again.");
      console.error("Error fetching trends:", err);
    }
  };

  const handleEnrichData = async () => {
    if (items.length === 0) {
      toast.error("No data to enrich", {
        description: "Please upload a price list first."
      });
      return;
    }
    
    setError(null);
    try {
      await enrichDataWithMarketInfo();
    } catch (err) {
      setError("Failed to enrich data. Please try again.");
      console.error("Error enriching data:", err);
    }
  };

  // Only fetch trends automatically once if popular category is selected
  useEffect(() => {
    if (popularCategories.length > 0 && !marketTrends && !isFetchingTrends && category) {
      handleFetchTrends();
    }
  }, [popularCategories, marketTrends, isFetchingTrends, category]);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-primary" />
        <h3 className="font-medium">Market Insights</h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

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
                className={`text-xs ${cat === category ? 'bg-muted' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}
        
        {isFetchingTrends && (
          <div className="space-y-2 mt-4 animate-pulse">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}
        
        {marketTrends && !isFetchingTrends && (
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
