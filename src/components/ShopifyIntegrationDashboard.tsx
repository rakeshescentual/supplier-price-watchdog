
import { useState } from "react";
import { useShopify } from "@/contexts/shopify";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShopifyConnectionStatus } from "@/components/ShopifyConnectionStatus";
import { ShopifyApiHealthCheck } from "@/components/shopify/ShopifyApiHealthCheck";
import { ShopifyPlusFeatures } from "@/components/shopify/ShopifyPlusFeatures";
import { AiMarketInsights } from "@/components/AiMarketInsights";
import { ShopifyBulkOperations } from "@/components/shopify/ShopifyBulkOperations";
import { ShopifyScriptsManager } from "@/components/shopify/ShopifyScriptsManager";
import { ShopifyWebhooks } from "@/components/shopify/ShopifyWebhooks"; 
import { ShopifyIntegrationStatus } from "@/components/shopify/ShopifyIntegrationStatus"; 
import { ShopifyB2BPricing } from "@/components/shopify/ShopifyB2BPricing";
import { MultiLocationInventory } from "@/components/shopify/plus/MultiLocationInventory";
import { ShopifyCompliance } from "@/components/shopify/ShopifyCompliance";
import { ExternalLink, AlertTriangle, Settings, Store, Lock, Zap, Activity, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { shopifyApiVersionManager } from "@/lib/shopify/apiVersionManager";

export function ShopifyIntegrationDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isShopifyConnected, shopifyContext, connectToShopify } = useShopify();
  const [mockCompetitorData] = useState([]);
  const [shopUrl, setShopUrl] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

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
        // Initialize API version manager after successful connection
        shopifyApiVersionManager.init();
        
        setShopUrl("");
        setAccessToken("");
      }
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Check if the current API version is the latest
  const currentApiVersion = shopifyApiVersionManager.getCurrent();
  const latestApiVersion = shopifyApiVersionManager.getLatestStable().version;
  const isLatestApiVersion = currentApiVersion === latestApiVersion;

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
            Connect to your Shopify store to access all features
          </AlertDescription>
        </Alert>
      )}
      
      {isShopifyConnected && !isLatestApiVersion && (
        <Alert variant="warning" className="mb-6">
          <Activity className="h-4 w-4" />
          <AlertTitle>API Version Update Available</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              You're using Shopify API version {currentApiVersion}. Version {latestApiVersion} is now available.
            </span>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                shopifyApiVersionManager.updateToLatest();
                toast.success("API Version Updated", {
                  description: `Updated to Shopify API version ${shopifyApiVersionManager.getCurrent()}`
                });
              }}
            >
              Update API Version
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="insights">Market Insights</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="b2b">B2B Pricing</TabsTrigger>
          <TabsTrigger value="inventory">
            <MapPin className="h-4 w-4 mr-1" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
          <TabsTrigger value="connect">Connect</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ShopifyIntegrationStatus />
            <ShopifyApiHealthCheck />
          </div>
          
          <Separator className="my-8" />
          
          <ShopifyPlusFeatures />
          
          <div className="mt-8">
            <ShopifyCompliance />
          </div>
        </TabsContent>
        
        <TabsContent value="insights">
          <AiMarketInsights competitorItems={mockCompetitorData} onRefresh={fetchMockData} />
        </TabsContent>
        
        <TabsContent value="webhooks">
          <ShopifyWebhooks />
        </TabsContent>
        
        <TabsContent value="b2b">
          <ShopifyB2BPricing />
        </TabsContent>
        
        <TabsContent value="inventory">
          <MultiLocationInventory />
        </TabsContent>
        
        <TabsContent value="bulk">
          <ShopifyBulkOperations />
        </TabsContent>
        
        <TabsContent value="connect">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Connect to Shopify
              </CardTitle>
              <CardDescription>
                Configure your Shopify store connection
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Alert>
                <AlertDescription>
                  For a production app, you would use OAuth for secure authentication. This form is for demonstration purposes only.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="shop-url" className="text-sm font-medium">
                    Shop URL
                  </label>
                  <Input
                    id="shop-url"
                    placeholder="your-store.myshopify.com"
                    value={shopUrl}
                    onChange={e => setShopUrl(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="access-token" className="text-sm font-medium">
                    Admin API Access Token
                  </label>
                  <Input
                    id="access-token"
                    type="password"
                    placeholder="shpat_xxxxxxxxxxxxxxxxxxxx"
                    value={accessToken}
                    onChange={e => setAccessToken(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <a href="https://help.shopify.com/en/manual/apps/custom-apps" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Shopify API Docs
                </a>
              </Button>
              
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
    </div>
  );
}
