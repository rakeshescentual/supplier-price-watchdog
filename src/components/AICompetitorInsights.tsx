
/**
 * AI-powered Competitor Insights Component
 * Visualizes AI-enhanced competitor analysis
 */
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CompetitorScrapingService } from "@/services/competitorScraping";
import { CompetitorPriceItem, CompetitorInsight, PriceOptimizationSuggestion } from "@/types/competitor";
import { generatePriceOptimizations, generateMarketOpportunityReport } from "@/utils/aiCompetitorInsights";
import { 
  BarChart3, LineChart, TrendingUp, ShoppingCart, AlertTriangle,
  PieChart, Brain, Sparkles, RefreshCw, ExternalLink, Lightbulb, 
  ArrowUpRight, ArrowDownRight, ArrowRight, ChevronUp, ChevronDown, ChevronRight
} from "lucide-react";
import { toast } from "sonner";

interface AICompetitorInsightsProps {
  items?: CompetitorPriceItem[];
  isConnected?: boolean;
}

export function AICompetitorInsights({ items = [], isConnected = false }: AICompetitorInsightsProps) {
  const [activeTab, setActiveTab] = useState("pricing");
  const [selectedInsight, setSelectedInsight] = useState<CompetitorInsight | null>(null);
  
  // Query for insights using react-query
  const { 
    data: insights,
    isLoading: isLoadingInsights,
    refetch: refetchInsights,
    isError: insightsError
  } = useQuery({
    queryKey: ['competitor-insights'],
    queryFn: async () => {
      if (items.length === 0) {
        return [];
      }
      
      try {
        // Simulate API call
        const result = await CompetitorScrapingService.analyzeWithAI(items);
        return result.insights || [];
      } catch (error) {
        console.error("Error fetching competitor insights:", error);
        throw error;
      }
    },
    enabled: items.length > 0 && isConnected
  });
  
  // Query for price optimization suggestions
  const {
    data: optimizations,
    isLoading: isLoadingOptimizations,
    refetch: refetchOptimizations,
    isError: optimizationsError
  } = useQuery({
    queryKey: ['price-optimizations'],
    queryFn: async () => {
      if (items.length === 0) {
        return [];
      }
      
      try {
        return await generatePriceOptimizations(items);
      } catch (error) {
        console.error("Error generating price optimizations:", error);
        throw error;
      }
    },
    enabled: items.length > 0 && isConnected
  });
  
  // Query for market opportunity report
  const {
    data: opportunityReport,
    isLoading: isLoadingReport,
    refetch: refetchReport,
    isError: reportError
  } = useQuery({
    queryKey: ['market-opportunity'],
    queryFn: async () => {
      if (items.length === 0) {
        return null;
      }
      
      try {
        return await generateMarketOpportunityReport(items);
      } catch (error) {
        console.error("Error generating market opportunity report:", error);
        throw error;
      }
    },
    enabled: items.length > 0 && isConnected
  });
  
  // Handle refresh of all data
  const handleRefreshAll = () => {
    toast.info("Refreshing all competitor insights", {
      description: "This may take a few moments"
    });
    
    refetchInsights();
    refetchOptimizations();
    refetchReport();
  };
  
  // Determine if any data is loading
  const isAnyLoading = isLoadingInsights || isLoadingOptimizations || isLoadingReport;
  
  // Determine if we have any data
  const hasAnyData = !!(insights?.length || optimizations?.length || opportunityReport);
  
  // Determine if there are any errors
  const hasAnyError = insightsError || optimizationsError || reportError;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              AI Competitor Insights
            </CardTitle>
            <CardDescription>
              Intelligent analysis of your pricing against competitors
            </CardDescription>
          </div>
          {hasAnyData && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshAll}
              disabled={isAnyLoading}
            >
              {isAnyLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="ml-2">Refresh</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No connection to competitor data</AlertTitle>
            <AlertDescription>
              Connect to enable AI-powered competitor insights and price analysis.
            </AlertDescription>
          </Alert>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <LineChart className="h-12 w-12 text-muted-foreground" />
            <div className="text-center space-y-2 max-w-md">
              <h3 className="font-medium">No competitor data available</h3>
              <p className="text-sm text-muted-foreground">
                Add competitor price data or schedule scraping to enable AI-powered insights.
              </p>
            </div>
            <Button>Set Up Competitor Tracking</Button>
          </div>
        ) : !hasAnyData && !isAnyLoading && !hasAnyError ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Sparkles className="h-12 w-12 text-purple-400" />
            <div className="text-center space-y-2 max-w-md">
              <h3 className="font-medium">Generate AI Competitor Insights</h3>
              <p className="text-sm text-muted-foreground">
                Let AI analyze your competitor data to provide actionable insights and recommendations.
              </p>
            </div>
            <Button onClick={handleRefreshAll} className="bg-purple-600 hover:bg-purple-700">
              <Brain className="mr-2 h-4 w-4" />
              Generate Insights
            </Button>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="pricing" className="flex-1">
                <BarChart3 className="h-4 w-4 mr-2" />
                Price Analysis
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex-1">
                <Lightbulb className="h-4 w-4 mr-2" />
                AI Insights
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex-1">
                <TrendingUp className="h-4 w-4 mr-2" />
                Market Trends
              </TabsTrigger>
            </TabsList>
            
            {/* Price Analysis Tab */}
            <TabsContent value="pricing" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Price Optimization Suggestions</h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {optimizations?.length || 0} Opportunities
                </Badge>
              </div>
              
              {isLoadingOptimizations ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="w-full h-20" />
                  ))}
                </div>
              ) : optimizationsError ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error loading price optimizations</AlertTitle>
                  <AlertDescription>
                    There was a problem analyzing your data. Please try again later.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {optimizations && optimizations.length > 0 ? (
                    optimizations.map((opt: PriceOptimizationSuggestion, i) => (
                      <Card key={i} className="shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="font-medium">{opt.name}</div>
                              <div className="text-sm text-muted-foreground">SKU: {opt.sku}</div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={
                                opt.change > 0 
                                  ? "bg-green-50 text-green-700 flex items-center gap-1" 
                                  : "bg-red-50 text-red-700 flex items-center gap-1"
                              }
                            >
                              {opt.change > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                              {Math.abs(opt.change)}%
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-3">
                            <div className="text-sm">
                              <div className="text-muted-foreground">Current Price</div>
                              <div className="font-medium">£{opt.currentPrice.toFixed(2)}</div>
                            </div>
                            <div className="text-sm">
                              <div className="text-muted-foreground">Suggested Price</div>
                              <div className="font-medium">£{opt.recommendedPrice.toFixed(2)}</div>
                            </div>
                          </div>
                          
                          <div className="mt-3 text-sm">
                            <div className="text-muted-foreground mb-1">Reasoning:</div>
                            <div>{opt.reason}</div>
                          </div>
                          
                          <div className="mt-2 flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {opt.confidence.charAt(0).toUpperCase() + opt.confidence.slice(1)} confidence
                            </Badge>
                            <Button variant="ghost" size="sm">Apply</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No price optimization suggestions available</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            {/* AI Insights Tab */}
            <TabsContent value="insights" className="space-y-4">
              <h3 className="text-lg font-medium">AI-Generated Insights</h3>
              
              {isLoadingInsights ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="w-full h-20" />
                  ))}
                </div>
              ) : insightsError ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error loading insights</AlertTitle>
                  <AlertDescription>
                    There was a problem retrieving AI insights. Please try again later.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insights && insights.length > 0 ? (
                    insights.map((insight: CompetitorInsight, i) => (
                      <Card key={i} className={`shadow-sm ${selectedInsight === insight ? 'ring-2 ring-purple-500' : ''}`}>
                        <CardHeader className="p-4">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                              {insight.type === 'opportunity' ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              ) : insight.type === 'risk' ? (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              ) : insight.type === 'trend' ? (
                                <LineChart className="h-4 w-4 text-blue-500" />
                              ) : (
                                <ShoppingCart className="h-4 w-4 text-amber-500" />
                              )}
                              {insight.title}
                            </CardTitle>
                            <Badge 
                              variant="outline" 
                              className={
                                insight.type === 'opportunity' 
                                  ? "bg-green-50 text-green-700" 
                                  : insight.type === 'risk'
                                    ? "bg-red-50 text-red-700"
                                    : insight.type === 'trend'
                                      ? "bg-blue-50 text-blue-700"
                                      : "bg-amber-50 text-amber-700"
                              }
                            >
                              {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                            </Badge>
                          </div>
                          <CardDescription>{insight.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          {insight.recommendations && insight.recommendations.length > 0 && (
                            <div className="text-sm">
                              <div className="font-medium mb-1">Recommendations:</div>
                              <ul className="space-y-1">
                                {insight.recommendations.slice(0, 2).map((rec, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <ArrowRight className="h-3 w-3 text-purple-500 mt-1 shrink-0" />
                                    <span>{rec}</span>
                                  </li>
                                ))}
                                {insight.recommendations.length > 2 && (
                                  <li className="text-purple-600 text-xs cursor-pointer hover:underline"
                                    onClick={() => setSelectedInsight(insight)}>
                                    +{insight.recommendations.length - 2} more recommendations
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                          
                          {insight.metrics && Object.keys(insight.metrics).length > 0 && (
                            <div className="mt-3 grid grid-cols-2 gap-2">
                              {Object.entries(insight.metrics).slice(0, 4).map(([key, value]) => (
                                <div key={key} className="text-xs">
                                  <div className="text-muted-foreground">{key.split('_').join(' ')}</div>
                                  <div className="font-medium">{value}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() => setSelectedInsight(selectedInsight === insight ? null : insight)}
                          >
                            {selectedInsight === insight ? 'Close details' : 'View details'}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 col-span-2">
                      <p className="text-muted-foreground">No AI insights available</p>
                    </div>
                  )}
                </div>
              )}
              
              {selectedInsight && (
                <Card className="mt-4 border-purple-200 bg-purple-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-600" />
                      Detailed Insight: {selectedInsight.title}
                    </CardTitle>
                    <CardDescription>{selectedInsight.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    {selectedInsight.recommendations && (
                      <div className="mb-4">
                        <h4 className="font-medium text-sm mb-2">All Recommendations:</h4>
                        <ul className="space-y-2">
                          {selectedInsight.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <ArrowRight className="h-3 w-3 text-purple-500 mt-1 shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {selectedInsight.metrics && Object.keys(selectedInsight.metrics).length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Metrics:</h4>
                        <div className="grid grid-cols-3 gap-3">
                          {Object.entries(selectedInsight.metrics).map(([key, value]) => (
                            <div key={key} className="text-sm">
                              <div className="text-muted-foreground text-xs">{key.split('_').join(' ')}</div>
                              <div className="font-medium">{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedInsight.affectedProducts && selectedInsight.affectedProducts.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Affected Products:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedInsight.affectedProducts.map((sku, i) => (
                            <Badge key={i} variant="outline" className="bg-white">
                              {sku}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedInsight(null)}
                    >
                      Close
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
            
            {/* Market Trends Tab */}
            <TabsContent value="trends" className="space-y-4">
              <h3 className="text-lg font-medium">Market Opportunity Analysis</h3>
              
              {isLoadingReport ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="w-full h-20" />
                  ))}
                </div>
              ) : reportError ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error loading market report</AlertTitle>
                  <AlertDescription>
                    There was a problem generating the market opportunity report. Please try again later.
                  </AlertDescription>
                </Alert>
              ) : opportunityReport ? (
                <div className="space-y-4">
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Market Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-sm">
                          <div className="text-muted-foreground">Total Items</div>
                          <div className="font-medium">{opportunityReport.summary.totalItems}</div>
                        </div>
                        <div className="text-sm">
                          <div className="text-muted-foreground">Categories</div>
                          <div className="font-medium">{opportunityReport.summary.categoriesAnalyzed}</div>
                        </div>
                        <div className="text-sm">
                          <div className="text-muted-foreground">Top Opportunity</div>
                          <div className="font-medium">{opportunityReport.summary.topOpportunities}</div>
                        </div>
                        <div className="text-sm">
                          <div className="text-muted-foreground">Highest Threat</div>
                          <div className="font-medium">{opportunityReport.summary.highestThreats}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div>
                    <h4 className="font-medium mb-2">Category Analysis</h4>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {opportunityReport.categoryReports.map((report, i) => (
                        <Card key={i} className="shadow-sm">
                          <CardHeader className="p-4 pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">{report.category}</CardTitle>
                              <Badge 
                                variant="outline" 
                                className={
                                  report.competitiveness === 'high' 
                                    ? "bg-green-50 text-green-700" 
                                    : report.competitiveness === 'low'
                                      ? "bg-red-50 text-red-700"
                                      : "bg-blue-50 text-blue-700"
                                }
                              >
                                {report.competitiveness === 'high' 
                                  ? "Highly Competitive" 
                                  : report.competitiveness === 'low'
                                    ? "Low Competitiveness"
                                    : "Medium Competitiveness"}
                              </Badge>
                            </div>
                            <CardDescription>
                              {report.itemCount} products • Average price difference: 
                              <span className={report.avgPriceDifference > 0 ? "text-green-600" : "text-red-600"}>
                                {' '}{report.avgPriceDifference > 0 ? '+' : ''}{report.avgPriceDifference}%
                              </span>
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {report.opportunities.length > 0 && (
                                <div className="text-sm">
                                  <div className="font-medium mb-1 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                    Opportunities ({report.opportunities.length})
                                  </div>
                                  {report.opportunities.length > 0 ? (
                                    <ul className="space-y-1">
                                      {report.opportunities.slice(0, 3).map((opp, i) => (
                                        <li key={i} className="text-xs flex justify-between">
                                          <span className="truncate mr-2">{opp.name}</span>
                                          <span className="text-green-600">{opp.potentialIncrease}</span>
                                        </li>
                                      ))}
                                      {report.opportunities.length > 3 && (
                                        <li className="text-xs text-purple-600">
                                          +{report.opportunities.length - 3} more
                                        </li>
                                      )}
                                    </ul>
                                  ) : (
                                    <p className="text-xs text-muted-foreground">No opportunities identified</p>
                                  )}
                                </div>
                              )}
                              
                              {report.threats.length > 0 && (
                                <div className="text-sm">
                                  <div className="font-medium mb-1 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3 text-red-500" />
                                    Threats ({report.threats.length})
                                  </div>
                                  {report.threats.length > 0 ? (
                                    <ul className="space-y-1">
                                      {report.threats.slice(0, 3).map((threat, i) => (
                                        <li key={i} className="text-xs flex justify-between">
                                          <span className="truncate mr-2">{threat.name}</span>
                                          <span className="text-red-600">{threat.lowestCompetitorPrice}</span>
                                        </li>
                                      ))}
                                      {report.threats.length > 3 && (
                                        <li className="text-xs text-purple-600">
                                          +{report.threats.length - 3} more
                                        </li>
                                      )}
                                    </ul>
                                  ) : (
                                    <p className="text-xs text-muted-foreground">No threats identified</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No market opportunity data available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Brain className="h-3 w-3" />
          <span>AI insights powered by advanced competitor analysis</span>
        </div>
        <a 
          href="https://www.escentual.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
        >
          View Escentual.com <ExternalLink className="h-3 w-3" />
        </a>
      </CardFooter>
    </Card>
  );
}
