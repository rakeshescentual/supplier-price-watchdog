
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { LATEST_API_VERSION, isGraphQLOnlyVersion } from "@/lib/shopify/api-version";
import { useShopify } from "@/contexts/shopify";
import { GraphQLMigrationAlert } from "./GraphQLMigrationAlert";
import { toast } from "sonner";

export function ShopifyConnectionStatus() {
  const { 
    isShopifyConnected, 
    isShopifyHealthy,
    shopifyContext,
    testConnection,
    lastConnectionCheck
  } = useShopify();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const currentVersion = shopifyContext?.apiVersion || LATEST_API_VERSION;
  const formattedLastCheck = lastConnectionCheck 
    ? new Date(lastConnectionCheck).toLocaleString() 
    : 'Never';

  const handleRefreshConnection = async () => {
    setIsRefreshing(true);
    try {
      const result = await testConnection();
      if (result.success) {
        toast.success("Connection verified", {
          description: result.message || "Shopify connection is healthy"
        });
      } else {
        toast.error("Connection issue", {
          description: result.message || "Failed to connect to Shopify"
        });
      }
    } catch (error) {
      toast.error("Connection error", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-4">
      {isShopifyConnected && currentVersion && !isGraphQLOnlyVersion(currentVersion) && (
        <GraphQLMigrationAlert 
          currentApiVersion={currentVersion}
          onUpdateVersion={() => {
            // This would be connected to your update version functionality
            toast.success("Updating to latest API version...");
          }}
        />
      )}
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Shopify Connection</CardTitle>
              <CardDescription>
                Connection status and health information
              </CardDescription>
            </div>
            <div>
              {isShopifyConnected ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  Disconnected
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isShopifyConnected ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium mb-1">Shop</div>
                  <div className="text-sm">{shopifyContext?.shop || 'Unknown'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">API Version</div>
                  <div className="text-sm flex items-center">
                    {currentVersion}
                    {isGraphQLOnlyVersion(currentVersion) && (
                      <Badge className="ml-2 text-xs bg-blue-50 text-blue-700 border-blue-200">
                        GraphQL Only
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Health Status</div>
                  <div className="text-sm flex items-center">
                    {isShopifyHealthy ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Healthy
                      </span>
                    ) : (
                      <span className="flex items-center text-amber-600">
                        <AlertCircle className="h-3.5 w-3.5 mr-1" />
                        Issues Detected
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Last Checked</div>
                  <div className="text-sm">{formattedLastCheck}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
              <h3 className="text-lg font-medium mb-1">Not Connected</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect to your Shopify store to enable syncing and bulk operations.
              </p>
              <Button className="bg-[#5E8E3E] hover:bg-[#4a7331]">
                Connect to Shopify
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
        
        {isShopifyConnected && (
          <CardFooter className="border-t pt-4 flex justify-between">
            <div className="text-xs text-muted-foreground">
              API: {isShopifyHealthy ? 'Normal' : 'Degraded'}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshConnection}
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-1 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Checking...' : 'Refresh Status'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

