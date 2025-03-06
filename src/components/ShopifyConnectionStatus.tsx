
import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, RefreshCw, History, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useShopify } from "@/contexts/ShopifyContext";
import { checkShopifyConnection, getShopifySyncHistory } from "@/lib/shopifyApi";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

export function ShopifyConnectionStatus() {
  const { toast } = useToast();
  const { 
    shopifyContext,
    isShopifyConnected,
    isShopifyHealthy,
    lastConnectionCheck
  } = useShopify();
  
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [syncHistory, setSyncHistory] = useState<{timestamp: number, itemCount: number, status: string}[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // Load sync history when connected
  useEffect(() => {
    if (isShopifyConnected && shopifyContext) {
      loadSyncHistory();
    }
  }, [isShopifyConnected, shopifyContext]);
  
  const handleCheckConnection = async () => {
    if (!shopifyContext) return;
    
    setIsCheckingConnection(true);
    
    try {
      const isHealthy = await checkShopifyConnection(shopifyContext);
      
      if (isHealthy) {
        toast({
          title: "Connection healthy",
          description: "Your Shopify connection is working properly.",
          variant: "default",
        });
      } else {
        toast({
          title: "Connection issues",
          description: "Your Shopify connection may be experiencing problems.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking connection:", error);
      toast({
        title: "Connection check failed",
        description: "Unable to verify Shopify connection status.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingConnection(false);
    }
  };
  
  const loadSyncHistory = async () => {
    if (!shopifyContext) return;
    
    setIsLoadingHistory(true);
    
    try {
      const history = getShopifySyncHistory(shopifyContext);
      setSyncHistory(history);
    } catch (error) {
      console.error("Error loading sync history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };
  
  if (!isShopifyConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shopify Connection</CardTitle>
          <CardDescription>Connect to your Shopify store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <XCircle className="h-5 w-5 text-muted-foreground" />
            <span>Not connected</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Shopify Connection</span>
          <Badge variant={isShopifyHealthy ? "default" : "outline"} className={isShopifyHealthy ? "bg-green-500" : "text-amber-500 border-amber-500"}>
            {isShopifyHealthy ? "Healthy" : "Degraded"}
          </Badge>
        </CardTitle>
        <CardDescription>
          {shopifyContext?.shop}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-2">
          {isShopifyHealthy ? (
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
          )}
          <div>
            <div className="font-medium">
              {isShopifyHealthy ? "Connection is healthy" : "Connection issues detected"}
            </div>
            <div className="text-sm text-muted-foreground">
              {lastConnectionCheck 
                ? `Last checked ${formatDistanceToNow(lastConnectionCheck)} ago` 
                : "Connection not yet verified"}
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <History className="h-4 w-4 mr-1" /> Recent Sync Activity
          </h4>
          
          {isLoadingHistory ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : syncHistory.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {syncHistory.slice(0, 3).map((sync, index) => (
                <li key={index} className="flex justify-between border-b pb-1 last:border-0">
                  <span>{new Date(sync.timestamp).toLocaleString()}</span>
                  <span>{sync.itemCount} items</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-muted-foreground">No recent sync activity</div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={handleCheckConnection}
          disabled={isCheckingConnection}
        >
          {isCheckingConnection ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Connection
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
