
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Search, RefreshCw, BarChart4 } from "lucide-react";

interface CategoryTrendsSectionProps {
  popularCategories: string[];
  isFetchingTrends: boolean;
  marketTrends: any | null;
  handleFetchTrends: () => void;
  category: string;
  setCategory: (category: string) => void;
}

export const CategoryTrendsSection = ({
  popularCategories,
  isFetchingTrends,
  marketTrends,
  handleFetchTrends,
  category,
  setCategory
}: CategoryTrendsSectionProps) => {
  return (
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
  );
};
