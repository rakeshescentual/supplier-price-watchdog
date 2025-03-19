
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  CircleDollarSign 
} from "lucide-react";

interface OpportunitiesTabProps {
  opportunityReport: any; // Consider creating a specific type for this
  isGenerating: boolean;
}

export function OpportunitiesTab({ opportunityReport, isGenerating }: OpportunitiesTabProps) {
  if (isGenerating || !opportunityReport) {
    return (
      <div className="px-6 pb-6 space-y-6">
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse space-y-6 w-full">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-[200px] bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  const { opportunities, categoryInsights, brandOpportunities } = opportunityReport;

  return (
    <div className="px-6 pb-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Market Opportunities</h3>
        <p className="text-sm text-muted-foreground mb-4">
          AI-identified opportunities based on competitive analysis
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opportunities.map((opportunity: any, index: number) => (
          <Card key={index}>
            <CardHeader className="py-4">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base flex items-center">
                  <Lightbulb className="h-4 w-4 text-amber-500 mr-2" />
                  {opportunity.title}
                </CardTitle>
                
                <Badge className={
                  opportunity.impact === 'high' ? 'bg-green-100 text-green-800' :
                  opportunity.impact === 'medium' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {opportunity.impact} impact
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="py-0 text-sm">
              <p>{opportunity.description}</p>
              
              {opportunity.potentialRevenue && (
                <div className="mt-3 flex items-center gap-1 text-green-600">
                  <CircleDollarSign className="h-4 w-4" />
                  <span>Potential revenue: {opportunity.potentialRevenue}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
              Category Growth Insights
            </CardTitle>
            <CardDescription>
              Pricing trends by product category
            </CardDescription>
          </CardHeader>
          
          <CardContent className="py-0">
            <ul className="space-y-2">
              {categoryInsights.map((insight: any, index: number) => (
                <li key={index} className="flex items-center justify-between p-2 border-b last:border-0">
                  <span className="font-medium">{insight.category}</span>
                  <Badge variant={insight.growth > 0 ? "success" : "destructive"}>
                    {insight.growth > 0 ? "+" : ""}{insight.growth}%
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <ShoppingBag className="h-4 w-4 mr-2 text-purple-500" />
              Brand-Specific Opportunities
            </CardTitle>
            <CardDescription>
              Competitive positioning by brand
            </CardDescription>
          </CardHeader>
          
          <CardContent className="py-0">
            <ul className="space-y-2">
              {brandOpportunities.map((brand: any, index: number) => (
                <li key={index} className="flex items-center justify-between p-2 border-b last:border-0">
                  <span className="font-medium">{brand.name}</span>
                  <Badge variant="outline" className="whitespace-nowrap">
                    {brand.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
