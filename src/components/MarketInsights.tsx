
import { useState, useEffect } from "react";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { Card } from "./ui/card";
import { Globe, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { WebEnrichmentSection } from "./market-insights/WebEnrichmentSection";
import { CategoryTrendsSection } from "./market-insights/CategoryTrendsSection";

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

      <WebEnrichmentSection 
        isEnrichingData={isEnrichingData}
        hasMarketData={hasMarketData}
        items={items}
        handleEnrichData={handleEnrichData}
      />
      
      <CategoryTrendsSection 
        popularCategories={popularCategories}
        isFetchingTrends={isFetchingTrends}
        marketTrends={marketTrends}
        handleFetchTrends={handleFetchTrends}
        category={category}
        setCategory={setCategory}
      />
    </Card>
  );
};
