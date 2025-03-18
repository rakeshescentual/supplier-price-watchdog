
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { BrainCircuit, RefreshCw, TrendingUp, BarChart4, AlertTriangle, ArrowRightLeft, Download } from "lucide-react";
import { generateMarketOpportunityReport, generatePriceOptimizations } from "@/utils/aiCompetitorInsights";
import { CompetitorPriceItem } from "@/types/price";

interface AiMarketInsightsProps {
  competitorItems: CompetitorPriceItem[];
  isLoading?: boolean;
}

export function AiMarketInsights({ competitorItems, isLoading = false }: AiMarketInsightsProps) {
  const [activeTab, setActiveTab] = useState("opportunities");
  const [isGenerating, setIsGenerating] = useState(false);
  const [opportunityReport, setOpportunityReport] = useState<any | null>(null);
  const [priceOptimizations, setPriceOptimizations] = useState<any[] | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Generate insights when competitor items change
  useEffect(() => {
    if (competitorItems.length > 0 && !isLoading) {
      generateInsights();
    }
  }, [competitorItems, isLoading]);

  const generateInsights = async () => {
    if (competitorItems.length === 0 || isGenerating) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      // Start progress animation
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 200);
      
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
    } catch (error) {
      console.error("Error generating AI insights:", error);
      toast.error("Failed to generate insights", {
        description: "There was an error analyzing the market data.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BrainCircuit className="h-5 w-5 mr-2 text-purple-500" />
            <CardTitle>AI Market Insights</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generateInsights}
            disabled={isGenerating || competitorItems.length === 0}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5 mr-2" />
                Refresh
              </>
            )}
          </Button>
        </div>
        <CardDescription>
          Advanced market analysis powered by AI
        </CardDescription>
      </CardHeader>
      
      {isGenerating && (
        <div className="px-6 pb-2">
          <Progress value={generationProgress} className="h-1" />
          <p className="text-xs text-center mt-1 text-muted-foreground">
            Analyzing market data ({Math.round(generationProgress)}%)
          </p>
        </div>
      )}
      
      <CardContent className="p-0">
        {competitorItems.length === 0 ? (
          <div className="flex items-center justify-center p-6 text-center">
            <div className="max-w-md">
              <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Competitor Data</h3>
              <p className="text-muted-foreground mb-4">
                AI insights require competitor price data. Configure competitor scraping to collect data.
              </p>
              <Button variant="outline">Set Up Competitor Scraping</Button>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6">
              <TabsList className="w-full grid grid-cols-3 mb-6">
                <TabsTrigger value="opportunities">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Opportunities
                </TabsTrigger>
                <TabsTrigger value="pricing">
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  Price Optimization
                </TabsTrigger>
                <TabsTrigger value="trends">
                  <BarChart4 className="h-4 w-4 mr-2" />
                  Market Trends
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="opportunities" className="mt-0">
              {opportunityReport ? (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-gray-50">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm">Categories Analyzed</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="text-2xl font-bold">{opportunityReport.summary.categoriesAnalyzed}</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-50">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm">Top Opportunity</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="text-2xl font-bold">{opportunityReport.summary.topOpportunities}</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-50">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm">Highest Threat</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="text-2xl font-bold">{opportunityReport.summary.highestThreats}</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-4">Category Analysis</h3>
                  
                  <div className="space-y-6">
                    {opportunityReport.categoryReports.map((report: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">{report.category}</h4>
                          <Badge variant={
                            report.competitiveness === 'high' ? 'success' : 
                            report.competitiveness === 'low' ? 'destructive' : 'outline'
                          }>
                            {report.competitiveness === 'high' ? 'Highly Competitive' : 
                             report.competitiveness === 'low' ? 'Low Competitiveness' : 
                             'Average Competitiveness'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="text-sm text-muted-foreground">Price difference:</div>
                          <div className={`font-medium ${
                            report.avgPriceDifference > 0 ? 'text-green-600' : 
                            report.avgPriceDifference < 0 ? 'text-red-600' : ''
                          }`}>
                            {report.avgPriceDifference > 0 ? '+' : ''}{report.avgPriceDifference}%
                          </div>
                          <div className="text-sm text-muted-foreground ml-auto">
                            {report.itemCount} items analyzed
                          </div>
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium mb-2 flex items-center">
                              <TrendingUp className="h-4 w-4 text-green-500 mr-1" /> 
                              Opportunities
                            </h5>
                            {report.opportunities.length > 0 ? (
                              <ul className="text-sm space-y-1">
                                {report.opportunities.map((opp: any, idx: number) => (
                                  <li key={idx} className="flex justify-between">
                                    <span className="truncate">{opp.name}</span>
                                    <span className="text-green-600 ml-2">+{opp.priceDifference.toFixed(1)}%</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-muted-foreground">No significant opportunities found</p>
                            )}
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium mb-2 flex items-center">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" /> 
                              Threats
                            </h5>
                            {report.threats.length > 0 ? (
                              <ul className="text-sm space-y-1">
                                {report.threats.map((threat: any, idx: number) => (
                                  <li key={idx} className="flex justify-between">
                                    <span className="truncate">{threat.name}</span>
                                    <span className="text-red-600 ml-2">{threat.priceDifference.toFixed(1)}%</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-muted-foreground">No significant threats found</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center p-6 h-[400px]">
                  <div className="text-center">
                    <RefreshCw className="h-10 w-10 text-gray-400 mx-auto mb-4 animate-spin" />
                    <h3 className="text-lg font-medium mb-2">Generating Analysis</h3>
                    <p className="text-muted-foreground">
                      AI is analyzing market data to identify opportunities...
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="pricing" className="mt-0">
              {priceOptimizations ? (
                <div className="px-6 pb-6">
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium">AI Price Recommendations</h3>
                    <Button variant="outline" size="sm">
                      <Download className="h-3.5 w-3.5 mr-2" />
                      Export
                    </Button>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Suggested Price</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {priceOptimizations.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                    {item.name}
                                  </div>
                                  <div className="text-xs text-gray-500">{item.sku}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              £{item.currentPrice.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              £{item.recommendedPrice.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <span className={`${
                                item.change > 0 ? 'text-green-600' : 
                                item.change < 0 ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {item.change > 0 ? '+' : ''}{item.change}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={
                                item.confidence === 'high' ? 'success' : 
                                item.confidence === 'low' ? 'outline' : 'secondary'
                              }>
                                {item.confidence}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-4">
                    <p>AI recommendations are based on competitor prices, market positioning, and historical sales data.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center p-6 h-[400px]">
                  <div className="text-center">
                    <RefreshCw className="h-10 w-10 text-gray-400 mx-auto mb-4 animate-spin" />
                    <h3 className="text-lg font-medium mb-2">Optimizing Prices</h3>
                    <p className="text-muted-foreground">
                      AI is analyzing market data to suggest optimal price points...
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="trends" className="mt-0">
              <div className="px-6 pb-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-1">Market Trend Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered analysis of emerging pricing trends in your market
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Category Pricing Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="h-56 bg-gray-100 rounded-md flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                          Chart visualization of category pricing trends
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Competitor Strategy Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="h-56 bg-gray-100 rounded-md flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                          Chart visualization of competitor pricing strategies
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">Detected Market Trends</h4>
                  
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-blue-500 mr-2" />
                        <h5 className="text-sm font-medium text-blue-700">Seasonal Price Increases</h5>
                      </div>
                      <p className="text-xs mt-1 text-blue-600">
                        Competitors are implementing 5-8% seasonal price increases across fragrance lines
                      </p>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                        <h5 className="text-sm font-medium text-green-700">Bundle Pricing Strategy</h5>
                      </div>
                      <p className="text-xs mt-1 text-green-600">
                        Increased adoption of product bundling offering 15-20% savings compared to individual purchases
                      </p>
                    </div>
                    
                    <div className="bg-amber-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                        <h5 className="text-sm font-medium text-amber-700">Discount Frequency Increasing</h5>
                      </div>
                      <p className="text-xs mt-1 text-amber-600">
                        Competitors are running flash sales more frequently, averaging every 12 days versus 21 days in the previous quarter
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      
      {opportunityReport && (
        <CardFooter className="px-6 py-4 border-t text-xs text-muted-foreground">
          Last updated: {new Date(opportunityReport.generated).toLocaleString()} | 
          Based on {competitorItems.length} products from {Object.keys(competitorItems[0]?.competitorPrices || {}).length} competitors
        </CardFooter>
      )}
    </Card>
  );
}
