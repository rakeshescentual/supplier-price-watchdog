
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShopifyHealthcheckResult } from "@/types/shopify";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useShopify } from "@/contexts/shopify";
import { shopifyService } from "@/services/shopify";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  Clock,
  AlertTriangle,
  ArrowUpRightFromCircle,
  Shield,
  Zap,
  Cpu,
  BarChart,
  Network
} from "lucide-react";

export function ShopifyApiHealthCheck() {
  const [activeTab, setActiveTab] = useState("overview");
  const { isShopifyConnected, shopifyContext } = useShopify();
  
  // Use react-query for data fetching with caching
  const { 
    data: healthCheck,
    isLoading,
    isError,
    refetch,
    error
  } = useQuery({
    queryKey: ['shopify-health'],
    queryFn: async () => {
      // Return not connected result if no connection
      if (!isShopifyConnected || !shopifyContext) {
        return {
          success: false,
          message: "Shopify not connected",
          apiVersion: "Unknown"
        } as ShopifyHealthcheckResult;
      }
      
      try {
        return await shopifyService.healthCheck();
      } catch (error) {
        console.error("Error in health check:", error);
        throw error;
      }
    },
    // Refetch every 5 minutes and on reconnect
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
  
  const handleRefresh = () => {
    refetch();
    toast.info("Refreshing Shopify connection status...");
  };
  
  const getHealthStatus = () => {
    if (!healthCheck) {
      return "unknown";
    }
    if (!healthCheck.success) {
      return "error";
    }
    if (healthCheck.rateLimitRemaining && healthCheck.rateLimitRemaining < 10) {
      return "warning";
    }
    if (healthCheck.diagnostics?.missingScopes?.length) {
      return "warning";
    }
    return "healthy";
  };
  
  const healthStatus = getHealthStatus();
  
  // Calculate API response health (mock data for demonstration)
  const calculateResponsePerformance = () => {
    if (!healthCheck?.responseTimeMs) return 0;
    
    // Consider:
    // < 300ms: excellent (90-100%)
    // 300-600ms: good (70-89%)
    // 600-1000ms: fair (50-69%)
    // 1000ms+: poor (0-49%)
    
    if (healthCheck.responseTimeMs < 300) {
      return 95;
    } else if (healthCheck.responseTimeMs < 600) {
      return 80;
    } else if (healthCheck.responseTimeMs < 1000) {
      return 60;
    } else {
      return 40;
    }
  };
  
  const responsePerformance = calculateResponsePerformance();
  
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Shopify API Health
            </CardTitle>
            <CardDescription>
              Monitor your Shopify API connection status
            </CardDescription>
          </div>
          
          {isShopifyConnected && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2 sr-only sm:not-sr-only">Refresh</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to check Shopify connection status"}
            </AlertDescription>
          </Alert>
        ) : !isShopifyConnected ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <ArrowUpRightFromCircle className="h-12 w-12 text-gray-300" />
            <div className="text-center space-y-2">
              <h3 className="font-medium">Not Connected to Shopify</h3>
              <p className="text-muted-foreground max-w-md">
                Connect to your Shopify store to enable API health monitoring
              </p>
            </div>
            <Button onClick={() => refetch()}>Connect to Shopify</Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {healthStatus === "healthy" ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Healthy
                  </Badge>
                ) : healthStatus === "warning" ? (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Warning
                  </Badge>
                ) : healthStatus === "error" ? (
                  <Badge variant="outline" className="bg-red-50 text-red-700 flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    Error
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Unknown
                  </Badge>
                )}
                
                {healthCheck?.message && (
                  <span className="text-sm">{healthCheck.message}</span>
                )}
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  Last checked: {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-gray-50/50">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm">API Version</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="font-medium">{healthCheck?.apiVersion || "Unknown"}</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-50/50">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm">Response Time</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="font-medium">{healthCheck?.responseTimeMs || "Unknown"} ms</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-50/50">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm">Store</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="font-medium">{healthCheck?.shopDetails?.name || shopifyContext?.shop || "Unknown"}</div>
                      <div className="text-xs text-muted-foreground">{healthCheck?.shopDetails?.domain || ""}</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-50/50">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm">Plan</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="font-medium">{healthCheck?.shopDetails?.plan || "Unknown"}</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">API Rate Limit</h3>
                    <span className="text-xs text-muted-foreground">{healthCheck?.rateLimitRemaining || "?"}/40</span>
                  </div>
                  <Progress value={(healthCheck?.rateLimitRemaining || 0) * 2.5} className="h-2" />
                </div>
              </TabsContent>
              
              <TabsContent value="diagnostics" className="pt-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Endpoint Status</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <Network className="h-4 w-4 text-blue-500" />
                        <span>GraphQL API</span>
                      </div>
                      {healthCheck?.diagnostics?.graphqlEndpoint ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700">
                          Disconnected
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <Network className="h-4 w-4 text-blue-500" />
                        <span>REST API</span>
                      </div>
                      {healthCheck?.diagnostics?.restEndpoint ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700">
                          Disconnected
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <Network className="h-4 w-4 text-blue-500" />
                        <span>Webhooks</span>
                      </div>
                      {healthCheck?.diagnostics?.webhooksEndpoint ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700">
                          Disconnected
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Authentication Scopes</h3>
                  
                  {healthCheck?.diagnostics?.authScopes && healthCheck.diagnostics.authScopes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {healthCheck.diagnostics.authScopes.map((scope, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No scopes available</p>
                  )}
                  
                  {healthCheck?.diagnostics?.missingScopes && healthCheck.diagnostics.missingScopes.length > 0 && (
                    <div className="mt-2">
                      <Alert variant="warning">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Missing Required Scopes</AlertTitle>
                        <AlertDescription className="space-y-2">
                          <p>The following scopes are missing but required:</p>
                          <div className="flex flex-wrap gap-2">
                            {healthCheck.diagnostics.missingScopes.map((scope, index) => (
                              <Badge key={index} variant="outline" className="bg-yellow-50 text-yellow-700">
                                {scope}
                              </Badge>
                            ))}
                          </div>
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">API Response Performance</h3>
                    <span className="text-xs text-muted-foreground">{responsePerformance}%</span>
                  </div>
                  <Progress 
                    value={responsePerformance} 
                    className="h-2" 
                    // Apply color based on performance
                    style={{
                      backgroundColor: "rgb(243 244 246)", // bg-gray-100
                      "--progress-color": responsePerformance > 80 ? "rgb(22 163 74)" : 
                                          responsePerformance > 60 ? "rgb(234 179 8)" :
                                          "rgb(220 38 38)",
                      "--progress-track-color": "rgb(243 244 246)", // bg-gray-100
                      color: "var(--progress-color)",
                      background: "var(--progress-track-color)",
                    } as React.CSSProperties}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gray-50/50">
                    <CardHeader className="p-4 pb-0">
                      <div className="flex items-center">
                        <Zap className="h-4 w-4 text-amber-500 mr-2" />
                        <CardTitle className="text-sm">Response Time</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">{healthCheck?.responseTimeMs || "?"} ms</div>
                      <p className="text-xs text-muted-foreground">
                        {healthCheck?.responseTimeMs && healthCheck.responseTimeMs < 500
                          ? "Excellent response time"
                          : healthCheck?.responseTimeMs && healthCheck.responseTimeMs < 1000
                          ? "Good response time"
                          : "Needs improvement"}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-50/50">
                    <CardHeader className="p-4 pb-0">
                      <div className="flex items-center">
                        <Cpu className="h-4 w-4 text-blue-500 mr-2" />
                        <CardTitle className="text-sm">API Calls</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">
                        {healthCheck?.rateLimitRemaining !== undefined
                          ? 40 - healthCheck.rateLimitRemaining
                          : "?"}
                        <span className="text-sm font-normal text-muted-foreground">/40</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Used in current bucket
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-50/50">
                    <CardHeader className="p-4 pb-0">
                      <div className="flex items-center">
                        <BarChart className="h-4 w-4 text-purple-500 mr-2" />
                        <CardTitle className="text-sm">Health Score</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">
                        {healthCheck?.success ? "100%" : healthCheck?.rateLimitRemaining ? "70%" : "0%"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Overall connection health
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Performance Considerations</AlertTitle>
                  <AlertDescription>
                    <p className="text-sm">
                      Shopify API has rate limits of 40 requests per bucket (~1 second). Monitor your request frequency to avoid throttling.
                    </p>
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        {isShopifyConnected && (
          <div className="flex items-center gap-1">
            <span>API Version:</span>
            <Badge variant="outline" className="text-xs h-5">
              {healthCheck?.apiVersion || "Unknown"}
            </Badge>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
