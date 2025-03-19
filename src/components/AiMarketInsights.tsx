
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
import { Progress } from "@/components/ui/progress";
import { BrainCircuit, RefreshCw, TrendingUp, BarChart4, ArrowRightLeft, ChartPie } from "lucide-react";
import { CompetitorPriceItem } from "@/types/price";
import { generateAIInsights } from "./ai-market-insights/aiInsightsUtils";
import { OpportunitiesTab } from "./ai-market-insights/OpportunitiesTab";
import { PricingTab } from "./ai-market-insights/PricingTab";
import { TrendsTab } from "./ai-market-insights/TrendsTab";
import { LoadingState } from "./ai-market-insights/LoadingState";
import { NoDataState } from "./ai-market-insights/NoDataState";
import { MarketAnalysisDashboard } from "./ai-market-insights/MarketAnalysisDashboard";

interface AiMarketInsightsProps {
  competitorItems: CompetitorPriceItem[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function AiMarketInsights({ competitorItems, isLoading = false, onRefresh }: AiMarketInsightsProps) {
  const [activeTab, setActiveTab] = useState("opportunities");
  const [isGenerating, setIsGenerating] = useState(false);
  const [opportunityReport, setOpportunityReport] = useState<any | null>(null);
  const [priceOptimizations, setPriceOptimizations] = useState<any[] | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);

  // Generate insights when competitor items change
  useEffect(() => {
    if (competitorItems.length > 0 && !isLoading) {
      generateInsights();
    }
  }, [competitorItems, isLoading]);

  const generateInsights = async () => {
    if (competitorItems.length === 0 || isGenerating) return;
    
    await generateAIInsights(
      competitorItems,
      setGenerationProgress,
      setIsGenerating,
      setOpportunityReport,
      setPriceOptimizations,
      onRefresh
    );
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (showDashboard) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowDashboard(false)}
          >
            Return to Insights
          </Button>
        </div>
        <MarketAnalysisDashboard 
          competitorItems={competitorItems}
          onRefresh={onRefresh}
        />
      </div>
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
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowDashboard(true)}
            >
              <ChartPie className="h-3.5 w-3.5 mr-2" />
              Advanced Dashboard
            </Button>
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
          <NoDataState />
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
              <OpportunitiesTab 
                opportunityReport={opportunityReport} 
                isGenerating={isGenerating} 
              />
            </TabsContent>
            
            <TabsContent value="pricing" className="mt-0">
              <PricingTab priceOptimizations={priceOptimizations} />
            </TabsContent>
            
            <TabsContent value="trends" className="mt-0">
              <TrendsTab />
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
