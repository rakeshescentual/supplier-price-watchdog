
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, TrendingDown, TrendingUp } from "lucide-react";
import { CompetitorPriceItem } from "@/types/competitor";

interface CompetitorPriceHistoryProps {
  item: CompetitorPriceItem;
  competitors: string[];
}

export function CompetitorPriceHistory({ item, competitors }: CompetitorPriceHistoryProps) {
  // This would be real history data in a production app
  const generateMockHistory = (competitor: string) => {
    const basePrice = item.competitorPrices?.[competitor] || item.retailPrice;
    return Array(6).fill(0).map((_, i) => ({
      date: new Date(Date.now() - (i + 1) * 30 * 24 * 60 * 60 * 1000),
      price: Math.round((basePrice * (0.9 + Math.random() * 0.2)) * 100) / 100
    })).sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const priceHistories = competitors.reduce((acc, competitor) => {
    if (item.competitorPrices?.[competitor] !== undefined) {
      acc[competitor] = generateMockHistory(competitor);
    }
    return acc;
  }, {} as Record<string, { date: Date; price: number }[]>);

  // Calculate min and max prices for consistent visualizations
  let minPrice = item.retailPrice;
  let maxPrice = item.retailPrice;
  
  Object.values(priceHistories).forEach(history => {
    history.forEach(entry => {
      minPrice = Math.min(minPrice, entry.price);
      maxPrice = Math.max(maxPrice, entry.price);
    });
  });
  
  // Add some padding to min/max for better visualization
  minPrice = Math.floor(minPrice * 0.95);
  maxPrice = Math.ceil(maxPrice * 1.05);
  
  const priceRange = maxPrice - minPrice;
  
  const getBarHeight = (price: number) => {
    return `${Math.max(5, Math.min(100, ((price - minPrice) / priceRange) * 100))}%`;
  };

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <div className="flex justify-between items-start mb-4">
          <div>
            <CardTitle className="text-xl">{item.name}</CardTitle>
            <CardDescription>
              SKU: {item.sku} | Current Price: £{item.retailPrice.toFixed(2)}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="px-0 pb-0">
        <ScrollArea className="h-[450px]">
          <div className="space-y-8">
            {Object.entries(priceHistories).map(([competitor, history]) => (
              <div key={competitor} className="space-y-2">
                <h3 className="font-medium text-lg">{competitor}</h3>
                <p className="text-sm text-muted-foreground">
                  Current: £{item.competitorPrices?.[competitor].toFixed(2) || "N/A"} |  
                  Compared to Escentual: {" "}
                  {item.competitorPrices?.[competitor] !== undefined && (
                    item.competitorPrices[competitor] < item.retailPrice ? (
                      <Badge variant="destructive" className="ml-1">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        {(100 - (item.competitorPrices[competitor] / item.retailPrice * 100)).toFixed(1)}% lower
                      </Badge>
                    ) : item.competitorPrices[competitor] > item.retailPrice ? (
                      <Badge variant="success" className="ml-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {((item.competitorPrices[competitor] / item.retailPrice * 100) - 100).toFixed(1)}% higher
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="ml-1">Equal</Badge>
                    )
                  )}
                </p>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-end justify-between h-[200px] gap-2 mb-4">
                    <div className="text-xs text-muted-foreground h-full flex flex-col justify-between py-2">
                      <span>£{maxPrice.toFixed(2)}</span>
                      <span>£{((maxPrice + minPrice) / 2).toFixed(2)}</span>
                      <span>£{minPrice.toFixed(2)}</span>
                    </div>
                    
                    {history.map((entry, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div className="h-full w-full relative flex items-end justify-center">
                          <div 
                            className="w-12 bg-blue-200 rounded-t-sm relative group"
                            style={{ height: getBarHeight(entry.price) }}
                          >
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-blue-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              £{entry.price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {entry.date.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex-1 flex flex-col items-center">
                      <div className="h-full w-full relative flex items-end justify-center">
                        <div 
                          className="w-12 bg-green-200 rounded-t-sm relative group"
                          style={{ height: getBarHeight(item.competitorPrices?.[competitor] || 0) }}
                        >
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            £{item.competitorPrices?.[competitor]?.toFixed(2) || "N/A"}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs font-medium">
                        Current
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
