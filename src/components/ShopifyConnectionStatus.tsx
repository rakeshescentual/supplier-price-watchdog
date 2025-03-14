
import { useState, useEffect } from "react";
import { useShopify } from "@/contexts/shopify";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkShopifyConnection } from "@/lib/shopifyApi";
import { toast } from "sonner";

export const ShopifyConnectionStatus = () => {
  const { 
    shopifyContext, 
    isShopifyConnected, 
    isShopifyHealthy, 
    lastConnectionCheck 
  } = useShopify();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshConnectionStatus = async () => {
    if (!shopifyContext) return;
    
    setIsRefreshing(true);
    try {
      const isHealthy = await checkShopifyConnection(shopifyContext);
      if (isHealthy) {
        toast.success("Shopify connection is healthy");
      } else {
        toast.warning("Shopify connection has issues", {
          description: "API may be experiencing slowdowns"
        });
      }
    } catch (error) {
      toast.error("Connection check failed");
    } finally {
      setIsRefreshing(false);
    }
  };

  let statusIndicator = null;
  
  if (!isShopifyConnected) {
    statusIndicator = (
      <Badge variant="outline" className="text-gray-500 border-gray-300">
        Not Connected
      </Badge>
    );
  } else if (isShopifyHealthy) {
    statusIndicator = (
      <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Connected
      </Badge>
    );
  } else {
    statusIndicator = (
      <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50">
        <AlertCircle className="w-3 h-3 mr-1" />
        Degraded
      </Badge>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {statusIndicator}
      
      {isShopifyConnected && lastConnectionCheck && (
        <span className="text-xs text-muted-foreground">
          {`Checked ${formatDistanceToNow(lastConnectionCheck, { addSuffix: true })}`}
        </span>
      )}
      
      {isShopifyConnected && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={refreshConnectionStatus}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      )}
    </div>
  );
};
