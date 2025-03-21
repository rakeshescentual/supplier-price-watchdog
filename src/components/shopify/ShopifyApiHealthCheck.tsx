import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Clock, 
  BarChart,
  Shield,
  Command
} from "lucide-react";
import { toast } from "sonner";
import { useShopify } from "@/contexts/shopify";
import { checkShopifyHealth, ShopifyHealthStatus } from "@/lib/shopify/health";
import { gadgetAnalytics } from "@/lib/gadget/analytics";

const Globe = Command;
const ShoppingCart = Command;
const Package = Command;

export function ShopifyApiHealthCheck() {
  const { isShopifyConnected } = useShopify();
  const [isChecking, setIsChecking] = useState(false);
  const [healthStatus, setHealthStatus] = useState<ShopifyHealthStatus | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  
  useEffect(() => {
    // Check health on first load if connected
    if (isShopifyConnected) {
      checkHealth();
    }
    
    // Track view
    gadgetAnalytics.trackFeatureUsage('shopify.health_check', 'viewed');
  }, [isShopifyConnected]);
  
  const checkHealth = async () => {
    if (!isShopifyConnected) {
      toast.error("Not Connected", {
        description: "Connect to Shopify to check API health"
      });
      return;
    }
    
    setIsChecking(true);
    
    try {
      // Track usage
      gadgetAnalytics.trackFeatureUsage('shopify.health_check', 'used', {
        action: 'check_health'
      });
      
      const status = await checkShopifyHealth();
      setHealthStatus(status);
      setLastChecked(new Date());
      
      // Show toast based on status
      if (status.status === 'healthy') {
        toast.success("Shopify API Healthy", {
          description: "All Shopify services are operating normally"
        });
      }
    } catch (error) {
      console.error("Error checking Shopify health:", error);
      toast.error("Health Check Failed", {
        description: "Could not check Shopify API health"
      });
      
      // Track error
      gadgetAnalytics.trackError(error instanceof Error ? error : String(error), {
        action: 'check_shopify_health'
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Healthy</Badge>;
      case 'degraded':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Degraded</Badge>;
      case 'unhealthy':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Unhealthy</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'unhealthy':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  const formatLatency = (latency: number | null) => {
    if (latency === null) return 'N/A';
    return `${latency.toFixed(0)}ms`;
  };
  
  const getLatencyColor = (latency: number | null) => {
    if (latency === null) return 'text-muted-foreground';
    if (latency < 200) return 'text-green-600';
    if (latency < 500) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    
    // If within the last hour, show "X minutes ago"
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
    // Otherwise, show full date and time
    return date.toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Shopify API Health
        </CardTitle>
        <CardDescription>
          Monitor Shopify API performance and service status
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isShopifyConnected ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Connect to Shopify to check API health status
            </AlertDescription>
          </Alert>
        ) : healthStatus ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(healthStatus.status)}
                <h3 className="font-medium">Shopify API Status</h3>
              </div>
              {getStatusBadge(healthStatus.status)}
            </div>
            
            <p className="text-sm">{healthStatus.message}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="border rounded-md p-3 space-y-1">
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <Command className="h-4 w-4 text-muted-foreground" />
                  Admin API
                </h4>
                <div className="flex items-center gap-2">
                  {healthStatus.services.admin ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={getLatencyColor(healthStatus.latency.admin)}>
                    {formatLatency(healthStatus.latency.admin)}
                  </span>
                </div>
              </div>
              
              <div className="border rounded-md p-3 space-y-1">
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Storefront API
                </h4>
                <div className="flex items-center gap-2">
                  {healthStatus.services.storefront ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={getLatencyColor(healthStatus.latency.storefront)}>
                    {formatLatency(healthStatus.latency.storefront)}
                  </span>
                </div>
              </div>
              
              <div className="border rounded-md p-3 space-y-1">
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  Checkout
                </h4>
                <div className="flex items-center gap-2">
                  {healthStatus.services.checkout ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <span>
                    {healthStatus.services.checkout ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              
              <div className="border rounded-md p-3 space-y-1">
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Inventory
                </h4>
                <div className="flex items-center gap-2">
                  {healthStatus.services.inventory ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <span>
                    {healthStatus.services.inventory ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </div>
            
            {healthStatus.issues.length > 0 && (
              <Alert variant={healthStatus.status === 'unhealthy' ? 'destructive' : 'warning'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <span className="font-medium block mb-1">Issues Detected:</span>
                  <ul className="list-disc pl-5 space-y-1">
                    {healthStatus.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last checked: {formatDate(lastChecked)}
              </span>
              
              <span className="flex items-center gap-1">
                <BarChart className="h-3 w-3" />
                API Latency: {formatLatency(healthStatus.latency.admin)}
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <Shield className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="font-medium mb-1">API Health Unknown</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click the button below to check Shopify API health
            </p>
          </div>
        )}
        
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={checkHealth}
            disabled={isChecking || !isShopifyConnected}
          >
            {isChecking ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Activity className="mr-2 h-4 w-4" />
                Check API Health
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
