
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle, Zap } from "lucide-react";
import { CompetitorInsight } from "@/types/price";

interface CompetitorInsightsProps {
  isLoading: boolean;
  insights: CompetitorInsight[];
}

export const CompetitorInsights = ({ isLoading, insights }: CompetitorInsightsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <ArrowUpRight className="h-5 w-5 text-green-500" />;
      case 'risk':
        return <ArrowDownRight className="h-5 w-5 text-red-500" />;
      case 'trend':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Zap className="h-5 w-5 text-purple-500" />;
    }
  };

  const getInsightBadgeColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 'risk':
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case 'trend':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 'alert':
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    }
  };

  return insights.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {insights.map((insight) => (
        <Card key={insight.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                {getInsightIcon(insight.type)}
                <CardTitle>{insight.title}</CardTitle>
              </div>
              <Badge className={getInsightBadgeColor(insight.type)}>
                {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
              </Badge>
            </div>
            <CardDescription>{insight.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insight.metrics && (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {Object.entries(insight.metrics).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <p className="text-xs text-muted-foreground capitalize">{key.replace('_', ' ')}</p>
                      <p className="text-lg font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {insight.recommendations && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-1">Recommendations:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    {insight.recommendations.map((recommendation, i) => (
                      <li key={i}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {insight.affectedProducts && insight.affectedProducts.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Affected Products:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {insight.affectedProducts.map((product) => (
                      <Badge key={product} variant="outline" className="text-xs">{product}</Badge>
                    ))}
                    {insight.affectedProducts.length > 5 && (
                      <Badge variant="outline" className="text-xs">+{insight.affectedProducts.length - 5} more</Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>No Insights Available</CardTitle>
        <CardDescription>
          We don't have enough data to generate insights yet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Run competitor price scraping for a few days to start generating insights.
        </p>
      </CardContent>
    </Card>
  );
};
