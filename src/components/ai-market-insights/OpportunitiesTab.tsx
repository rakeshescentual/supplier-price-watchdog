
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, AlertTriangle, RefreshCw } from "lucide-react";

interface OpportunitiesTabProps {
  opportunityReport: any | null;
  isGenerating: boolean;
}

export function OpportunitiesTab({ opportunityReport, isGenerating }: OpportunitiesTabProps) {
  if (!opportunityReport) {
    return (
      <div className="flex items-center justify-center p-6 h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-10 w-10 text-gray-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium mb-2">Generating Analysis</h3>
          <p className="text-muted-foreground">
            AI is analyzing market data to identify opportunities...
          </p>
        </div>
      </div>
    );
  }

  return (
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
  );
}
