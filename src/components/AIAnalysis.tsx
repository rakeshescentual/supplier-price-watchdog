
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
  ChevronUp
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface AIAnalysisProps {
  analysis: PriceAnalysis | null;
  isLoading: boolean;
}

export const AIAnalysis = ({ analysis, isLoading }: AIAnalysisProps) => {
  const [showCrossSupplierTrends, setShowCrossSupplierTrends] = useState(false);
  const [showDiscontinuedInsights, setShowDiscontinuedInsights] = useState(false);
  const [showPackagingTrends, setShowPackagingTrends] = useState(false);
  const [showBrandFocus, setShowBrandFocus] = useState(false);

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

        {/* NEW: Enhanced AI Insights Sections */}
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
      </div>
    </Card>
  );
};
