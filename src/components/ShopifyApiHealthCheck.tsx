
import { useState, useEffect } from 'react';
import { useShopify } from '@/contexts/shopify';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RefreshCw, CheckCircle, AlertTriangle, XCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export function ShopifyApiHealthCheck() {
  const { isShopifyConnected, isShopifyHealthy, lastConnectionCheck, shopifyContext } = useShopify();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('status');
  const [apiLimits, setApiLimits] = useState<{
    restApiCallsMade: number;
    restApiCallsLimit: number;
    graphqlPointsConsumed: number;
    graphqlPointsLimit: number;
  }>({
    restApiCallsMade: 0,
    restApiCallsLimit: 0,
    graphqlPointsConsumed: 0,
    graphqlPointsLimit: 0,
  });

  useEffect(() => {
    if (isShopifyConnected) {
      fetchApiLimits();
    }
  }, [isShopifyConnected]);

  const fetchApiLimits = async () => {
    // In a real implementation, this would fetch actual API limit data from Shopify
    // For demo purposes, we'll simulate it
    setApiLimits({
      restApiCallsMade: Math.floor(Math.random() * 30) + 10,
      restApiCallsLimit: 80,
      graphqlPointsConsumed: Math.floor(Math.random() * 300) + 100,
      graphqlPointsLimit: 1000,
    });
  };

  const checkApiHealth = async () => {
    if (!isShopifyConnected) {
      toast.error("Not connected to Shopify");
      return;
    }

    setIsRefreshing(true);
    try {
      // In a production app, this would make an actual API call to check health
      await new Promise(resolve => setTimeout(resolve, 1000));
      fetchApiLimits();
      toast.success("API health check completed");
    } catch (error) {
      toast.error("API health check failed");
      console.error("API health check error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusBadge = () => {
    if (!isShopifyConnected) {
      return <Badge variant="outline" className="bg-gray-100 text-gray-500">Not Connected</Badge>;
    }
    
    if (isShopifyHealthy) {
      return <Badge variant="outline" className="bg-green-100 text-green-700">Healthy</Badge>;
    }
    
    return <Badge variant="outline" className="bg-amber-100 text-amber-700">Degraded</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Shopify API Health</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>
          Monitor your Shopify API connection status and limits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="limits">API Limits</TabsTrigger>
            <TabsTrigger value="logs">Recent Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Connection Status</p>
                <div className="flex items-center mt-1">
                  {isShopifyConnected ? (
                    isShopifyHealthy ? (
                      <><CheckCircle className="h-4 w-4 text-green-500 mr-2" /> Connected</>
                    ) : (
                      <><AlertTriangle className="h-4 w-4 text-amber-500 mr-2" /> Degraded</>
                    )
                  ) : (
                    <><XCircle className="h-4 w-4 text-gray-400 mr-2" /> Not Connected</>
                  )}
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkApiHealth}
                disabled={isRefreshing || !isShopifyConnected}
              >
                {isRefreshing ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>
            
            {isShopifyConnected && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Connected Store</span>
                  <span className="font-medium">{shopifyContext?.shop || 'Unknown'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Checked</span>
                  <span>
                    {lastConnectionCheck 
                      ? formatDistanceToNow(lastConnectionCheck, { addSuffix: true })
                      : 'Never'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API Version</span>
                  <span className="font-medium">2024-04</span>
                </div>
              </div>
            )}
            
            {!isShopifyConnected && (
              <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm mt-2">
                Connect to your Shopify store in the settings panel to monitor API health.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="limits" className="space-y-4">
            {isShopifyConnected ? (
              <>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">REST API Calls</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(apiLimits.restApiCallsMade / apiLimits.restApiCallsLimit) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right mt-1 text-muted-foreground">
                      {apiLimits.restApiCallsMade} / {apiLimits.restApiCallsLimit} calls
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">GraphQL Points</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full" 
                        style={{ width: `${(apiLimits.graphqlPointsConsumed / apiLimits.graphqlPointsLimit) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right mt-1 text-muted-foreground">
                      {apiLimits.graphqlPointsConsumed} / {apiLimits.graphqlPointsLimit} points
                    </p>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground mt-4">
                  <p>Limits reset on a per-minute basis. <a href="https://shopify.dev/api/usage" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
                    Learn more <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a></p>
                </div>
              </>
            ) : (
              <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
                Connect to your Shopify store to view API limits.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-4">
            {isShopifyConnected ? (
              <div className="text-sm">
                <p className="font-medium mb-2">Recent API Interactions</p>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">{new Date(Date.now() - 300000).toLocaleTimeString()}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">GET /products</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs"><span className="text-green-600">200 OK</span></td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">{new Date(Date.now() - 600000).toLocaleTimeString()}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">GraphQL products query</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs"><span className="text-green-600">Success</span></td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">{new Date(Date.now() - 1200000).toLocaleTimeString()}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">PUT /variants</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs"><span className="text-green-600">200 OK</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Showing the 3 most recent API calls. Full logs available in the dashboard.
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
                Connect to your Shopify store to view API logs.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
