
import { Card } from "./ui/card";
import { PriceAnalysis } from "@/types/price";
import { 
  BadgeCheck, 
  Brain, 
  TrendingUp, 
  ShieldAlert, 
  AlertCircle, 
  Percent, 
  ArrowRight,
  BarChart4,
  PackageOpen,
  Tags,
  ChevronDown,
  ChevronUp,
  Compass,
  Lightbulb,
  LineChart,
  Scale
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface AIAnalysisProps {
  analysis: PriceAnalysis | null;
  isLoading: boolean;
}

export const AIAnalysis = ({ analysis, isLoading }: AIAnalysisProps) => {
  const [showCrossSupplierTrends, setShowCrossSupplierTrends] = useState(false);
  const [showDiscontinuedInsights, setShowDiscontinuedInsights] = useState(false);
  const [showPackagingTrends, setShowPackagingTrends] = useState(false);
  const [showBrandFocus, setShowBrandFocus] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("summary");

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-medium">AI Analysis</h3>
        </div>
        <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-muted rounded w-full mb-3"></div>
        <div className="h-4 bg-muted rounded w-2/3 mb-6"></div>
        
        <div className="space-y-4">
          <div>
            <div className="h-5 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
          </div>
          <div>
            <div className="h-5 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <Card className="p-6 animate-fade-up">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-5 h-5 text-primary" />
        <h3 className="font-medium">AI Analysis</h3>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <p className="text-muted-foreground mb-6">{analysis.summary}</p>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BadgeCheck className="w-4 h-4 text-green-500" />
                <h4 className="font-medium">Recommendations</h4>
              </div>
              <ul className="list-disc list-inside text-sm text-muted-foreground pl-1 space-y-1">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <h4 className="font-medium">Risk Assessment</h4>
              </div>
              <p className="text-sm text-muted-foreground">{analysis.riskAssessment}</p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <h4 className="font-medium">Opportunity Insights</h4>
              </div>
              <p className="text-sm text-muted-foreground">{analysis.opportunityInsights}</p>
            </div>

            {analysis.anomalies.count > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-purple-500" />
                  <h4 className="font-medium">Data Anomalies</h4>
                </div>
                <p className="text-sm text-muted-foreground">{analysis.anomalies.description}</p>
                {analysis.anomalies.types.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-muted-foreground mt-1 pl-1">
                    {analysis.anomalies.types.map((type, i) => (
                      <li key={i}>{type}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Percent className="w-4 h-4 text-orange-500" />
                <h4 className="font-medium">Margin Impact</h4>
              </div>
              <p className="text-sm text-muted-foreground">{analysis.marginImpact}</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="trends">
          <div className="space-y-4">
            {analysis.crossSupplierTrends && (
              <Collapsible open={showCrossSupplierTrends} onOpenChange={setShowCrossSupplierTrends}>
                <div className="border-t pt-3">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-1 rounded-md">
                      <div className="flex items-center gap-2">
                        <BarChart4 className="w-4 h-4 text-indigo-500" />
                        <h4 className="font-medium">Cross-Supplier Trends</h4>
                      </div>
                      {showCrossSupplierTrends ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-medium mb-1">Category Price Trends</h5>
                        <ul className="text-xs text-muted-foreground space-y-1 pl-1">
                          {analysis.crossSupplierTrends.categoryTrends.slice(0, 3).map((trend, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <ArrowRight className="w-3 h-3 flex-shrink-0" />
                              {trend.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-1">Supplier Focus Areas</h5>
                        <ul className="text-xs text-muted-foreground space-y-2 pl-1">
                          {analysis.crossSupplierTrends.supplierComparison.slice(0, 3).map((supplier, i) => (
                            <li key={i}>
                              <p className="font-medium">{supplier.supplierName}</p>
                              <p>Avg. increase: {supplier.averageIncrease.toFixed(2)}%</p>
                              <p>Focus on: {supplier.focusCategories.join(', ')}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )}

            {analysis.packagingTrends && (
              <Collapsible open={showPackagingTrends} onOpenChange={setShowPackagingTrends}>
                <div className="border-t pt-3">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-1 rounded-md">
                      <div className="flex items-center gap-2">
                        <PackageOpen className="w-4 h-4 text-emerald-500" />
                        <h4 className="font-medium">Size & Packaging Trends</h4>
                      </div>
                      {showPackagingTrends ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">{analysis.packagingTrends.details}</p>
                      
                      {analysis.packagingTrends.affectedCategories.length > 0 && (
                        <div className="mt-2">
                          <h5 className="text-sm font-medium mb-1">Affected Categories</h5>
                          <div className="flex flex-wrap gap-1 text-xs">
                            {analysis.packagingTrends.affectedCategories.map((cat, i) => (
                              <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )}
            
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 mb-2">
                <LineChart className="w-4 h-4 text-blue-500" />
                <h4 className="font-medium">Category Inflation Analysis</h4>
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  Categories with highest price increases:
                </p>
                <div className="space-y-1">
                  {analysis.crossSupplierTrends?.categoryTrends
                    .sort((a, b) => b.averageChangePercent - a.averageChangePercent)
                    .slice(0, 3)
                    .map((category, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${Math.min(100, category.averageChangePercent * 10)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{category.category}: {category.averageChangePercent.toFixed(1)}%</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="insights">
          <div className="space-y-4">
            {analysis.discontinuedItemsInsights && (
              <Collapsible open={showDiscontinuedInsights} onOpenChange={setShowDiscontinuedInsights}>
                <div className="border-t pt-3">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-1 rounded-md">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <h4 className="font-medium">Discontinued Items Insights</h4>
                      </div>
                      {showDiscontinuedInsights ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{analysis.discontinuedItemsInsights.recommendation}</p>
                      
                      {analysis.discontinuedItemsInsights.categories.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium mb-1">Affected Categories</h5>
                          <div className="flex flex-wrap gap-1 text-xs">
                            {analysis.discontinuedItemsInsights.categories.map((cat, i) => (
                              <span key={i} className="px-2 py-1 bg-red-50 text-red-700 rounded-full">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h5 className="text-sm font-medium mb-1">Possible Reasons</h5>
                        <ul className="text-xs text-muted-foreground space-y-1 pl-1">
                          {analysis.discontinuedItemsInsights.possibleReasons.map((reason, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <ArrowRight className="w-3 h-3 flex-shrink-0" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )}

            {analysis.brandFocusAreas && (
              <Collapsible open={showBrandFocus} onOpenChange={setShowBrandFocus}>
                <div className="border-t pt-3">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-1 rounded-md">
                      <div className="flex items-center gap-2">
                        <Tags className="w-4 h-4 text-blue-500" />
                        <h4 className="font-medium">Brand Focus Areas</h4>
                      </div>
                      {showBrandFocus ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <ul className="text-xs text-muted-foreground space-y-2 pl-1">
                      {analysis.brandFocusAreas.map((brand, i) => (
                        <li key={i}>
                          <p className="font-medium">{brand.brand}</p>
                          <p>Focus on: {brand.focusCategories.join(', ')}</p>
                          <p>Strategy: {brand.priceStrategy}</p>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )}
            
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 mb-2">
                <Compass className="w-4 h-4 text-violet-500" />
                <h4 className="font-medium">Market Position Insights</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Analysis of your position relative to market competitors:
              </p>
              <div className="p-3 bg-violet-50 rounded-md">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Lower Price</span>
                  <span>Average</span>
                  <span>Premium</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-violet-600 h-2.5 rounded-full" 
                    style={{ width: '35%', marginLeft: '10%' }}
                  ></div>
                </div>
                <p className="text-xs text-violet-700">
                  Your price position is slightly below market average
                </p>
              </div>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h4 className="font-medium">Strategic Recommendations</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 pl-1">
                <li className="flex items-start gap-2">
                  <Scale className="w-4 h-4 text-amber-500 mt-0.5" />
                  <span>Consider selective price increases in {analysis.crossSupplierTrends?.categoryTrends[0]?.category || 'high-margin categories'} where competitors have already raised prices.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Scale className="w-4 h-4 text-amber-500 mt-0.5" />
                  <span>Watch for discontinued items in {analysis.discontinuedItemsInsights?.categories[0] || 'key categories'} - search for alternatives or consider stocking up.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Scale className="w-4 h-4 text-amber-500 mt-0.5" />
                  <span>Track packaging changes - they often precede more significant price adjustments.</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
