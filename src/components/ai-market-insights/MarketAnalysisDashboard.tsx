import React, { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  AlertTriangle,
  Download,
  RefreshCw 
} from "lucide-react";
import { CompetitorPriceItem } from "@/types/competitor";
import { toast } from "sonner";

interface MarketAnalysisDashboardProps {
  competitorItems: CompetitorPriceItem[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function MarketAnalysisDashboard({ 
  competitorItems, 
  isLoading = false, 
  onRefresh 
}: MarketAnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState("trends");
  const [isExporting, setIsExporting] = useState(false);
  
  // Calculate market stats
  const totalProducts = competitorItems.length;
  const competitorCount = totalProducts > 0 
    ? Object.keys(competitorItems[0]?.competitorPrices || {}).length 
    : 0;
  
  const competitorData = competitorItems.reduce((acc, item) => {
    Object.entries(item.competitorPrices || {}).forEach(([competitor, price]) => {
      if (!acc[competitor]) {
        acc[competitor] = { 
          totalProducts: 0, 
          lowerPrice: 0, 
          higherPrice: 0,
          samePrice: 0
        };
      }
      
      acc[competitor].totalProducts++;
      
      if (price < item.retailPrice) {
        acc[competitor].lowerPrice++;
      } else if (price > item.retailPrice) {
        acc[competitor].higherPrice++;
      } else {
        acc[competitor].samePrice++;
      }
    });
    
    return acc;
  }, {} as Record<string, { totalProducts: number, lowerPrice: number, higherPrice: number, samePrice: number }>);
  
  const handleExportAnalysis = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      
      toast.success("Analysis exported", {
        description: "Market analysis report downloaded successfully."
      });
    }, 1500);
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Market Position Analysis</CardTitle>
            <CardDescription>
              Comprehensive analysis of your market position relative to competitors
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleExportAnalysis}
              disabled={isExporting || totalProducts === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Export Analysis"}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {totalProducts > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <div className="text-sm text-blue-500 mb-1">Total Products</div>
                  <div className="text-2xl font-bold text-blue-700">{totalProducts}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50">
                <CardContent className="p-4">
                  <div className="text-sm text-green-500 mb-1">Competitors</div>
                  <div className="text-2xl font-bold text-green-700">{competitorCount}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50">
                <CardContent className="p-4">
                  <div className="text-sm text-purple-500 mb-1">Price Position</div>
                  <div className="text-2xl font-bold text-purple-700">
                    {totalProducts > 0 ? 
                      (competitorItems.filter(item => 
                        Object.values(item.competitorPrices || {}).every(price => price >= item.retailPrice)
                      ).length / totalProducts * 100).toFixed(1) + "%" 
                    : "N/A"}
                  </div>
                  <div className="text-xs text-purple-600 mt-1">Products with lowest price</div>
                </CardContent>
              </Card>
            </div>
            
            <Separator className="mb-6" />
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="trends">
                  <LineChart className="h-4 w-4 mr-2" />
                  Price Trends
                </TabsTrigger>
                <TabsTrigger value="comparison">
                  <BarChart className="h-4 w-4 mr-2" />
                  Competitor Comparison
                </TabsTrigger>
                <TabsTrigger value="distribution">
                  <PieChart className="h-4 w-4 mr-2" />
                  Price Distribution
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="trends">
                <div className="h-[300px] bg-gray-50 rounded-lg flex items-center justify-center text-muted-foreground">
                  <div className="text-center p-6">
                    <LineChart className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>Price trend visualization would appear here</p>
                    <p className="text-xs mt-2">
                      Showing trends of your prices vs. competitors over time
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="comparison">
                <div className="h-[300px] bg-gray-50 rounded-lg flex items-center justify-center text-muted-foreground">
                  <div className="text-center p-6">
                    <BarChart className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>Competitor price comparison would appear here</p>
                    <p className="text-xs mt-2">
                      Visual comparison of your prices against competitor pricing
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="distribution">
                <div className="h-[300px] bg-gray-50 rounded-lg flex items-center justify-center text-muted-foreground">
                  <div className="text-center p-6">
                    <PieChart className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>Price distribution visualization would appear here</p>
                    <p className="text-xs mt-2">
                      Distribution of your pricing relative to market averages
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <Separator className="my-6" />
            
            <h3 className="text-lg font-medium mb-4">Competitor Analysis</h3>
            
            {Object.keys(competitorData).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(competitorData).map(([competitor, data]) => (
                  <div key={competitor} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{competitor}</h4>
                      <span className="text-sm text-muted-foreground">
                        {data.totalProducts} products
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="p-2 bg-red-50 rounded text-center">
                        <div className="text-red-700 font-medium">
                          {((data.lowerPrice / data.totalProducts) * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-red-600">Lower Prices</div>
                      </div>
                      
                      <div className="p-2 bg-green-50 rounded text-center">
                        <div className="text-green-700 font-medium">
                          {((data.higherPrice / data.totalProducts) * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-green-600">Higher Prices</div>
                      </div>
                      
                      <div className="p-2 bg-blue-50 rounded text-center">
                        <div className="text-blue-700 font-medium">
                          {((data.samePrice / data.totalProducts) * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-blue-600">Same Price</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center p-4 bg-amber-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                <p className="text-amber-700">No competitor data available</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center p-12 text-center">
            <div>
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Market Data Available</h3>
              <p className="text-muted-foreground max-w-md">
                Add competitor price data to see a comprehensive analysis of your market position.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
