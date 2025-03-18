
import { useState } from "react";
import { useShopify } from "@/contexts/shopify";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ShopifyConnectionStatus } from "@/components/ShopifyConnectionStatus";
import { ShopifyApiHealthCheck } from "@/components/ShopifyApiHealthCheck";
import { ShopifyPlusFeatures } from "@/components/ShopifyPlusFeatures";
import { AiMarketInsights } from "@/components/AiMarketInsights";
import { ShopifyBulkOperations } from "@/components/shopify/ShopifyBulkOperations";
import { ShopifyScriptsManager } from "@/components/shopify/ShopifyScriptsManager";
import { ExternalLink, AlertTriangle, Settings, Store } from "lucide-react";
import { toast } from "sonner";

export function ShopifyIntegrationDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isShopifyConnected, shopifyContext, connectToShopify } = useShopify();
  const [mockCompetitorData] = useState([]);
  const [shopUrl, setShopUrl] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  // This could be expanded to fetch real data from the API in a production app
  const fetchMockData = () => {
    toast.success("Data refreshed", {
      description: "Latest Shopify data has been loaded"
    });
  };

  const handleConnect = async () => {
    if (!shopUrl || !accessToken) {
      toast.error("Missing credentials", {
        description: "Please enter both shop URL and access token"
      });
      return;
    }
    
    setIsConnecting(true);
    try {
      const success = await connectToShopify(shopUrl, accessToken);
      if (success) {
        setShopUrl("");
        setAccessToken("");
      }
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Store className="h-8 w-8" />
            Shopify Integration
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your Escentual.com Shopify store integration and pricing
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <ShopifyConnectionStatus />
          
          {!isShopifyConnected && (
            <Button variant="outline" size="sm" onClick={() => setActiveTab("connect")}>
              <Settings className="h-4 w-4 mr-2" />
              Connect
            </Button>
          )}
        </div>
      </div>
      
      {!isShopifyConnected && (
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Shopify Not Connected</AlertTitle>
          <AlertDescription>
            Connect to your Shopify store to enable all integration features.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="pricing">Price Management</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
          <TabsTrigger value="scripts">Scripts</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="plus">Shopify Plus</TabsTrigger>
          {!isShopifyConnected && <TabsTrigger value="connect">Connect</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="w-full h-full">
                <CardHeader>
                  <CardTitle>Integration Overview</CardTitle>
                  <CardDescription>
                    Your Shopify integration status and recent activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {isShopifyConnected ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <Card className="bg-gray-50">
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-sm">Store</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="font-medium">{shopifyContext?.shop || 'Unknown'}</div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-gray-50">
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-sm">API Version</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="font-medium">{shopifyContext?.apiVersion || '2024-04'}</div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-gray-50">
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-sm">Plan</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="font-medium">{shopifyContext?.shopPlan || 'Basic'}</div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="p-4 border rounded-md">
                          <h3 className="text-sm font-medium mb-2">Recent Activity</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                              <span>Price sync completed</span>
                              <span className="text-muted-foreground">3 hours ago</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Competitor price analysis</span>
                              <span className="text-muted-foreground">6 hours ago</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Product inventory update</span>
                              <span className="text-muted-foreground">1 day ago</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm" onClick={fetchMockData}>
                            Refresh Data
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Store className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Connect Your Shopify Store</h3>
                        <p className="text-muted-foreground max-w-md mb-4">
                          Connect to your Escentual.com Shopify store to enable pricing synchronization, 
                          automated price updates, and competitor analysis.
                        </p>
                        <Button onClick={() => setActiveTab("connect")}>
                          <Settings className="h-4 w-4 mr-2" />
                          Connect to Shopify
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <ShopifyApiHealthCheck />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pricing" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Price Synchronization</CardTitle>
                <CardDescription>
                  Sync pricing changes from supplier price lists to Shopify
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">
                    <p className="font-medium">Ready to Sync</p>
                    <p>12 products with updated prices ready to sync to Shopify</p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button disabled={!isShopifyConnected}>
                      Sync to Shopify
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Price History</CardTitle>
                <CardDescription>
                  Track historical price changes in your Shopify store
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center border rounded-md bg-gray-50">
                  <p className="text-muted-foreground text-sm">
                    Price history chart will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Price Changes</CardTitle>
              <CardDescription>
                Upcoming price changes to be applied to your Shopify store
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isShopifyConnected ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">New Price</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Sample data rows */}
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Chanel No. 5 (100ml)</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">£85.00</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">£90.00</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600">+5.9%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">December 1, 2023</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Dior Sauvage (100ml)</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">£72.50</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">£78.00</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600">+7.6%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">December 1, 2023</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-blue-50 p-4 rounded-md text-center">
                  <p className="text-blue-700">
                    Connect to Shopify to view scheduled price changes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bulk" className="mt-0">
          <ShopifyBulkOperations />
        </TabsContent>
        
        <TabsContent value="scripts" className="mt-0">
          <ShopifyScriptsManager />
        </TabsContent>
        
        <TabsContent value="insights" className="mt-0">
          <AiMarketInsights competitorItems={mockCompetitorData} />
        </TabsContent>
        
        <TabsContent value="plus" className="mt-0">
          <ShopifyPlusFeatures />
        </TabsContent>
        
        <TabsContent value="connect" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Connect to Shopify</CardTitle>
              <CardDescription>
                Enter your Shopify store URL and access token to connect
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="shop-url" className="text-sm font-medium">
                      Shopify Store URL
                    </label>
                    <input
                      id="shop-url"
                      type="text"
                      placeholder="your-store.myshopify.com"
                      className="w-full px-3 py-2 border rounded-md"
                      value={shopUrl}
                      onChange={(e) => setShopUrl(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="access-token" className="text-sm font-medium">
                      Access Token
                    </label>
                    <input
                      id="access-token"
                      type="password"
                      placeholder="shpat_..."
                      className="w-full px-3 py-2 border rounded-md"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700">
                  <p className="font-medium mb-1">How to get your access token:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Go to your Shopify admin</li>
                    <li>Navigate to Apps &gt; App and sales channel settings</li>
                    <li>Scroll to the bottom and click "Develop apps for your store"</li>
                    <li>Create a new app or select an existing one</li>
                    <li>Under API credentials, create an admin API access token</li>
                    <li>Select the necessary scopes (read_products, write_products)</li>
                    <li>Copy the access token (it will only be shown once)</li>
                  </ol>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleConnect}
                disabled={isConnecting || !shopUrl || !accessToken}
              >
                {isConnecting ? "Connecting..." : "Connect to Shopify"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 text-sm">
        <p className="text-muted-foreground">
          <a 
            href="https://help.shopify.com/en/api" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline inline-flex items-center"
          >
            Shopify API Documentation <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </p>
      </div>
    </div>
  );
}
