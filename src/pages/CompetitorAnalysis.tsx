
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompetitorPriceTable } from "@/components/CompetitorPriceTable";
import { CompetitorScrapingSchedule } from "@/components/CompetitorScrapingSchedule";
import { CompetitorInsights } from "@/components/CompetitorInsights";
import { CompetitorPriceGraph } from "@/components/CompetitorPriceGraph";
import { fetchCompetitorData } from "@/utils/competitorAnalysisUtils";

const CompetitorAnalysis = () => {
  const [selectedTab, setSelectedTab] = useState("comparison");

  const { data: competitorData, isLoading, error } = useQuery({
    queryKey: ['competitorData'],
    queryFn: fetchCompetitorData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (error) {
    toast.error("Failed to fetch competitor data", { 
      description: "Please try again later" 
    });
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Competitor Price Analysis</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Price Comparison</CardTitle>
            <CardDescription>
              Our prices vs market average
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? "Loading..." : `${competitorData?.averageDifference || 0}%`}
            </div>
            <p className="text-sm text-muted-foreground">
              {competitorData?.averageDifference && competitorData.averageDifference > 0 
                ? "Your prices are higher than competitors" 
                : "Your prices are lower than competitors"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tracked Products</CardTitle>
            <CardDescription>
              Products with competitor data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? "Loading..." : competitorData?.trackedProductsCount || 0}
            </div>
            <p className="text-sm text-muted-foreground">
              Across {competitorData?.competitorCount || 0} competitor websites
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Last Update</CardTitle>
            <CardDescription>
              Data freshness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? "Loading..." : competitorData?.lastUpdate 
                ? new Date(competitorData.lastUpdate).toLocaleString() 
                : "No data yet"}
            </div>
            <p className="text-sm text-muted-foreground">
              Next update: {competitorData?.nextUpdate 
                ? new Date(competitorData.nextUpdate).toLocaleString() 
                : "Not scheduled"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="comparison">Price Comparison</TabsTrigger>
          <TabsTrigger value="schedule">Scraping Schedule</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="history">Price History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison" className="mt-0">
          <CompetitorPriceTable isLoading={isLoading} data={competitorData?.items || []} />
        </TabsContent>
        
        <TabsContent value="schedule" className="mt-0">
          <CompetitorScrapingSchedule 
            isLoading={isLoading} 
            schedules={competitorData?.scrapingSchedules || []} 
          />
        </TabsContent>
        
        <TabsContent value="insights" className="mt-0">
          <CompetitorInsights 
            isLoading={isLoading} 
            insights={competitorData?.insights || []} 
          />
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          <CompetitorPriceGraph 
            isLoading={isLoading} 
            historicalData={competitorData?.historicalData || []} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompetitorAnalysis;
