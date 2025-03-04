
import { Card } from "./ui/card";
import { PriceAnalysis } from "@/types/price";
import { BadgeCheck, Brain, TrendingUp, ShieldAlert, AlertCircle, Percent } from "lucide-react";

interface AIAnalysisProps {
  analysis: PriceAnalysis | null;
  isLoading: boolean;
}

export const AIAnalysis = ({ analysis, isLoading }: AIAnalysisProps) => {
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
      </div>
    </Card>
  );
};
