
import React, { useState, useEffect } from 'react';
import { useShopify } from '@/contexts/shopify';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, CheckCircle, AlertTriangle, Gauge, Server, ShieldCheck, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { ShopifyHealthcheckResult } from '@/types/shopify';
import { LATEST_API_VERSION, getVersionStatusMessage } from '@/lib/shopify/api-version';

export function ShopifyIntegrationStatus() {
  const { isShopifyConnected, isShopifyHealthy, shopifyContext, testConnection } = useShopify();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [healthStatus, setHealthStatus] = useState<ShopifyHealthcheckResult | null>(null);
  const [apiVersion, setApiVersion] = useState(shopifyContext?.apiVersion || LATEST_API_VERSION);
  
  useEffect(() => {
    if (shopifyContext?.apiVersion) {
      setApiVersion(shopifyContext.apiVersion);
    }
  }, [shopifyContext]);

  const handleTestConnection = async () => {
    if (!testConnection) {
      toast.error("Test connection function not available");
      return;
    }
    
    setIsRunningTest(true);
    try {
      const result = await testConnection();
      setHealthStatus(result as ShopifyHealthcheckResult);
      
      if (result.success) {
        toast.success("Connection test passed", {
          description: result.message || "Your Shopify connection is healthy"
        });
      } else {
        toast.error("Connection test failed", {
          description: result.message || "Your Shopify connection is not working properly"
        });
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      toast.error("Connection test error", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsRunningTest(false);
    }
  };

  const getStatusColor = (status: boolean | undefined) => {
    if (status === undefined) return "gray";
    return status ? "green" : "red";
  };

  const getRateLimitColor = (remaining?: number) => {
    if (remaining === undefined) return "gray";
    if (remaining > 20) return "green";
    if (remaining > 5) return "yellow";
    return "red";
  };

  const getVersionStatus = () => {
    if (!apiVersion) return { status: 'unknown', message: 'Unknown API version' };
    return getVersionStatusMessage(apiVersion);
  };

  const versionStatus = getVersionStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Shopify Integration Status
        </CardTitle>
        <CardDescription>
          Monitor the health and performance of your Shopify integration
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mx-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-${getStatusColor(isShopifyConnected)}-500`}></div>
                <span className="font-medium">Connection Status</span>
              </div>
              <Badge variant={isShopifyConnected ? "success" : "destructive"}>
                {isShopifyConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-${getStatusColor(isShopifyHealthy)}-500`}></div>
                <span className="font-medium">Health Status</span>
              </div>
              <Badge variant={isShopifyHealthy ? "success" : "destructive"}>
                {isShopifyHealthy ? "Healthy" : "Unhealthy"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-${versionStatus.status === 'current' ? 'green' : versionStatus.status === 'supported' ? 'yellow' : 'red'}-500`}></div>
                <span className="font-medium">API Version</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{apiVersion || 'Unknown'}</span>
                <Badge variant={
                  versionStatus.status === 'current' ? "success" : 
                  versionStatus.status === 'supported' ? "default" : 
                  versionStatus.status === 'deprecated' ? "warning" : "destructive"
                }>
                  {versionStatus.status === 'current' ? "Current" : 
                   versionStatus.status === 'supported' ? "Supported" : 
                   versionStatus.status === 'deprecated' ? "Deprecated" : "Unsupported"}
                </Badge>
              </div>
            </div>
            
            {healthStatus && (
              <>
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Response Time</span>
                    <span className="text-sm">{healthStatus.responseTimeMs || 'N/A'} ms</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>API Limit Usage</span>
                      <span>{healthStatus.rateLimitRemaining} remaining</span>
                    </div>
                    <Progress 
                      value={(healthStatus.rateLimitRemaining || 0) * 2.5} 
                      className={`h-2 bg-gray-100 ${
                        getRateLimitColor(healthStatus.rateLimitRemaining) === 'green' ? 'text-green-500' :
                        getRateLimitColor(healthStatus.rateLimitRemaining) === 'yellow' ? 'text-yellow-500' :
                        'text-red-500'
                      }`} 
                    />
                  </div>
                </div>
              </>
            )}
            
            {shopifyContext && (
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Store</p>
                    <p className="font-medium">{shopifyContext.shop}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Plan</p>
                    <p className="font-medium">{shopifyContext.shopPlan || 'Unknown'}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="diagnostics">
          <CardContent className="space-y-4">
            {isShopifyConnected ? (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Endpoint Status</h3>
                    {healthStatus?.diagnostics ? (
                      <Badge variant="outline" className="font-normal">
                        {healthStatus.diagnostics.graphqlEndpoint && 
                         healthStatus.diagnostics.restEndpoint && 
                         healthStatus.diagnostics.webhooksEndpoint ? 'All Endpoints Available' : 'Some Endpoints Unavailable'}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="font-normal">Unknown</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${healthStatus?.diagnostics?.graphqlEndpoint ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm">GraphQL API</span>
                      </div>
                      <Badge variant={healthStatus?.diagnostics?.graphqlEndpoint ? "success" : "destructive"} className="font-normal">
                        {healthStatus?.diagnostics?.graphqlEndpoint ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${healthStatus?.diagnostics?.restEndpoint ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm">REST API</span>
                      </div>
                      <Badge variant={healthStatus?.diagnostics?.restEndpoint ? "success" : "destructive"} className="font-normal">
                        {healthStatus?.diagnostics?.restEndpoint ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${healthStatus?.diagnostics?.webhooksEndpoint ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm">Webhooks API</span>
                      </div>
                      <Badge variant={healthStatus?.diagnostics?.webhooksEndpoint ? "success" : "destructive"} className="font-normal">
                        {healthStatus?.diagnostics?.webhooksEndpoint ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Authentication Scopes</h3>
                    
                    {healthStatus?.diagnostics?.authScopes ? (
                      <div className="flex flex-wrap gap-2">
                        {healthStatus.diagnostics.authScopes.map(scope => (
                          <Badge key={scope} variant="outline" className="font-normal">
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No scope information available</p>
                    )}
                    
                    {healthStatus?.diagnostics?.missingScopes && healthStatus.diagnostics.missingScopes.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-red-500 font-medium">Missing Required Scopes:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {healthStatus.diagnostics.missingScopes.map(scope => (
                            <Badge key={scope} variant="destructive" className="font-normal">
                              {scope}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <AlertTriangle className="h-10 w-10 text-yellow-500 mb-2" />
                <h3 className="text-lg font-medium">Not Connected</h3>
                <p className="text-muted-foreground text-center mt-1 max-w-md">
                  Connect to your Shopify store to see diagnostics information
                </p>
              </div>
            )}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="security">
          <CardContent className="space-y-4">
            {isShopifyConnected ? (
              <>
                <div className="bg-green-50 border border-green-100 rounded-md p-4 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-800">Secure Connection</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Your connection to Shopify uses industry-standard security practices
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Security Features</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="h-4 w-4 text-blue-500" />
                        <h4 className="font-medium">API Authentication</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Using secure OAuth 2.0 authorization with access tokens
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Gauge className="h-4 w-4 text-blue-500" />
                        <h4 className="font-medium">Rate Limiting</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Automatic handling of Shopify's leaky bucket rate limiting
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Access Token Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Your access token is stored securely and never exposed in client-side code
                  </p>
                  
                  <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                    <div>
                      <p className="text-sm font-medium">Access Token</p>
                      <p className="text-xs text-muted-foreground mt-1">For {shopifyContext?.shop || 'your store'}</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="font-normal">
                        {shopifyContext?.accessToken ? '••••••••' + shopifyContext.accessToken.slice(-4) : 'Not available'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <Lock className="h-10 w-10 text-gray-400 mb-2" />
                <h3 className="text-lg font-medium">Not Connected</h3>
                <p className="text-muted-foreground text-center mt-1 max-w-md">
                  Connect to your Shopify store to see security information
                </p>
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="justify-between">
        <div className="text-xs text-muted-foreground">
          {isShopifyConnected ? (
            <div className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
              Connected to {shopifyContext?.shop || 'Shopify'}
            </div>
          ) : (
            <div className="flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1 text-yellow-500" />
              Not connected to Shopify
            </div>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          disabled={isRunningTest || !isShopifyConnected}
          onClick={handleTestConnection}
        >
          {isRunningTest ? (
            <>
              <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <RefreshCw className="h-3 w-3 mr-2" />
              Test Connection
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
