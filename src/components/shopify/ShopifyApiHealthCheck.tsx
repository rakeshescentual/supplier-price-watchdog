
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { checkShopifyHealth, ShopifyHealthStatus } from "@/lib/shopify/health";
import { useShopify } from "@/contexts/shopify";

export function ShopifyApiHealthCheck() {
  const { isShopifyConnected } = useShopify();
  const [healthStatus, setHealthStatus] = useState<ShopifyHealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  
  const checkHealth = async () => {
    if (!isShopifyConnected) return;
    
    setIsLoading(true);
    try {
      const status = await checkShopifyHealth();
      setHealthStatus(status);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error checking health:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isShopifyConnected) {
      checkHealth();
      
      // Set up recurring health check every 15 minutes
      const interval = setInterval(checkHealth, 15 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isShopifyConnected]);
  
  const getStatusIcon = () => {
    if (!healthStatus) return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    
    switch (healthStatus.status) {
      case 'healthy':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'unhealthy':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const getStatusBadge = () => {
    if (!healthStatus) return <Badge variant="outline">Unknown</Badge>;
    
    switch (healthStatus.status) {
      case 'healthy':
        return <Badge variant="success">Healthy</Badge>;
      case 'degraded':
        return <Badge variant="warning">Degraded</Badge>;
      case 'unhealthy':
        return <Badge variant="destructive">Unhealthy</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <CardTitle className="text-base">Shopify API Health</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription>
          {healthStatus ? healthStatus.message : 'Checking API health status...'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isShopifyConnected ? (
          <div className="text-center py-2 text-sm text-muted-foreground">
            Connect to Shopify to monitor API health
          </div>
        ) : (
          <>
            {isLoading && <Progress value={40} className="h-1" />}
            
            {healthStatus && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="text-muted-foreground">Admin API:</div>
                  <div className="font-medium flex items-center">
                    {healthStatus.services.admin ? 
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" /> : 
                      <XCircle className="h-4 w-4 text-red-500 mr-1" />}
                    {healthStatus.services.admin ? 'Available' : 'Unavailable'}
                  </div>
                  
                  <div className="text-muted-foreground">Storefront API:</div>
                  <div className="font-medium flex items-center">
                    {healthStatus.services.storefront ? 
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" /> : 
                      <XCircle className="h-4 w-4 text-red-500 mr-1" />}
                    {healthStatus.services.storefront ? 'Available' : 'Unavailable'}
                  </div>
                  
                  <div className="text-muted-foreground">Admin Latency:</div>
                  <div className="font-medium">
                    {healthStatus.latency.admin !== null ? 
                      `${healthStatus.latency.admin.toFixed(0)} ms` : 
                      'Unknown'}
                  </div>
                  
                  <div className="text-muted-foreground">Storefront Latency:</div>
                  <div className="font-medium">
                    {healthStatus.latency.storefront !== null ? 
                      `${healthStatus.latency.storefront.toFixed(0)} ms` : 
                      'Unknown'}
                  </div>
                </div>
                
                {healthStatus.issues.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Active Issues</h4>
                      <ul className="text-sm space-y-1">
                        {healthStatus.issues.map((issue, index) => (
                          <li key={index} className="flex items-start">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground">
          {lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString()}` : 'Not checked yet'}
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={checkHealth} 
          disabled={isLoading || !isShopifyConnected}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
}
