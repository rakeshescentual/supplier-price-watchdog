
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, AlertCircle, RefreshCw, ShoppingBag } from "lucide-react";
import { useShopify } from "@/contexts/shopify";
import { useToast } from "@/components/ui/use-toast";

interface ApiLimits {
  pointsUsed: number;
  maxPoints: number;
  percentUsed: number;
  resetsAt: string;
  restoreRate: number; // points per second
  graphqlLimits?: {
    actualQueryCost: number;
    requestedQueryCost: number;
    throttleStatus: {
      currentlyAvailable: number;
      maximumAvailable: number;
      restoresIn: number;
    }
  }
}

export function ShopifyApiHealthCheck() {
  const { isShopifyConnected } = useShopify();
  const { toast } = useToast();
  const [apiLimits, setApiLimits] = useState<ApiLimits>({
    pointsUsed: 0,
    maxPoints: 1000,
    percentUsed: 0,
    resetsAt: '',
    restoreRate: 0.5
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  
  // Simulated function to fetch API limits
  // In a real implementation, this would query the Shopify Admin API
  const fetchApiLimits = async () => {
    if (!isShopifyConnected) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      const mockLimits: ApiLimits = {
        pointsUsed: Math.floor(Math.random() * 400),
        maxPoints: 1000,
        percentUsed: 0, // Will be calculated
        resetsAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        restoreRate: 0.5,
        graphqlLimits: {
          actualQueryCost: Math.floor(Math.random() * 200),
          requestedQueryCost: 250,
          throttleStatus: {
            currentlyAvailable: 1000 - Math.floor(Math.random() * 300),
            maximumAvailable: 1000,
            restoresIn: Math.floor(Math.random() * 60)
          }
        }
      };
      
      // Calculate percentage
      mockLimits.percentUsed = (mockLimits.pointsUsed / mockLimits.maxPoints) * 100;
      
      setApiLimits(mockLimits);
      setLastChecked(new Date().toLocaleTimeString());
      
      // Show toast for high usage
      if (mockLimits.percentUsed > 80) {
        toast({
          title: "High API Usage",
          description: `You're using ${mockLimits.percentUsed.toFixed(1)}% of your Shopify API limits.`,
        });
      }
    } catch (error) {
      console.error("Error fetching Shopify API limits:", error);
      toast({
        title: "Error checking API limits",
        description: "Could not retrieve Shopify API limits.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Initial fetch
    if (isShopifyConnected) {
      fetchApiLimits();
    }
    
    // Set up interval to check every 5 minutes
    const interval = setInterval(() => {
      if (isShopifyConnected) {
        fetchApiLimits();
      }
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isShopifyConnected]);
  
  if (!isShopifyConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopify API Health
          </CardTitle>
          <CardDescription>
            Monitor your Shopify API usage limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <div className="text-center">
              <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">Not Connected</h3>
              <p className="text-sm text-muted-foreground">
                Connect to Shopify to monitor API limits
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const getStatusColor = (percent: number) => {
    if (percent < 50) return "bg-green-500";
    if (percent < 80) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const timeUntilReset = () => {
    if (!apiLimits.resetsAt) return "Unknown";
    
    const resetTime = new Date(apiLimits.resetsAt);
    const now = new Date();
    const diffMs = resetTime.getTime() - now.getTime();
    
    if (diffMs <= 0) return "Resetting...";
    
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffSeconds = Math.floor((diffMs % 60000) / 1000);
    
    return `${diffMinutes}m ${diffSeconds}s`;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Shopify API Health
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={isLoading}
            onClick={fetchApiLimits}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
        <CardDescription>
          Monitor your Shopify API usage limits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">REST API Usage</span>
            <Badge variant="outline">
              {apiLimits.pointsUsed} / {apiLimits.maxPoints}
            </Badge>
          </div>
          <Progress
            value={apiLimits.percentUsed}
            className={getStatusColor(apiLimits.percentUsed)}
          />
          <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
            <span>Resets in: {timeUntilReset()}</span>
            <span>Restore rate: {apiLimits.restoreRate} / sec</span>
          </div>
        </div>
        
        {apiLimits.graphqlLimits && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">GraphQL Available Cost</span>
              <Badge variant="outline">
                {apiLimits.graphqlLimits.throttleStatus.currentlyAvailable} / {apiLimits.graphqlLimits.throttleStatus.maximumAvailable}
              </Badge>
            </div>
            <Progress
              value={(apiLimits.graphqlLimits.throttleStatus.currentlyAvailable / apiLimits.graphqlLimits.throttleStatus.maximumAvailable) * 100}
              className={getStatusColor(100 - (apiLimits.graphqlLimits.throttleStatus.currentlyAvailable / apiLimits.graphqlLimits.throttleStatus.maximumAvailable) * 100)}
            />
            <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
              <span>Last query cost: {apiLimits.graphqlLimits.actualQueryCost}</span>
              <span>Restores in: {apiLimits.graphqlLimits.throttleStatus.restoresIn}s</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        {lastChecked ? (
          <div className="flex items-center gap-1">
            <span>Last checked:</span>
            <time>{lastChecked}</time>
          </div>
        ) : (
          "Checking API limits..."
        )}
      </CardFooter>
    </Card>
  );
}
