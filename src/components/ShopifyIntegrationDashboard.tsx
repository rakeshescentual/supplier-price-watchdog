
import { useState } from "react";
import { useShopify } from "@/contexts/shopify";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ShopifyConnectionStatus } from "@/components/ShopifyConnectionStatus";
import { ShopifyApiHealthCheck } from "@/components/shopify/ShopifyApiHealthCheck";
import { ShopifyPlusFeatures } from "@/components/shopify/ShopifyPlusFeatures";
import { AiMarketInsights } from "@/components/AiMarketInsights";
import { ShopifyBulkOperations } from "@/components/shopify/ShopifyBulkOperations";
import { ShopifyScriptsManager } from "@/components/shopify/ShopifyScriptsManager";
import { WebhookManager } from "@/components/shopify/WebhookManager";
import { ShopifyIntegrationStatus } from "@/components/shopify/ShopifyIntegrationStatus"; 
import { ShopifyB2BPricing } from "@/components/shopify/ShopifyB2BPricing";
import { MultiLocationInventory } from "@/components/shopify/plus/MultiLocationInventory";
import { ShopifyCompliance } from "@/components/shopify/ShopifyCompliance";
import { FlowsAutomation } from "@/components/shopify/plus/FlowsAutomation";
import { ShopifyOAuth } from "@/components/shopify/ShopifyOAuth";
import { MultipassManager } from "@/components/shopify/plus/MultipassManager";
import { GiftCardManager } from "@/components/shopify/plus/GiftCardManager";
import { ExternalLink, AlertTriangle, Settings, Store, Activity, MapPin, Zap, Gift, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { shopifyApiVersionManager } from "@/lib/shopify/apiVersionManager";

export function ShopifyIntegrationDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [mockCompetitorData] = useState([]);

  const fetchMockData = () => {
    toast.success("Data refreshed", {
      description: "Latest Shopify data has been loaded"
    });
  };

  // Check if the current API version is the latest
  const currentApiVersion = shopifyApiVersionManager.getCurrent();
  const latestApiVersion = shopifyApiVersionManager.getLatestStable().version;
  const isLatestApiVersion = currentApiVersion === latestApiVersion;
  
  // Check if store is on Shopify Plus plan
  const isPlusStore = shopifyContext?.shopPlan?.toLowerCase().includes('plus');

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
          <TabsTrigger value="flows">
            <Zap className="h-4 w-4 mr-1" />
            Flows
          </TabsTrigger>
          <TabsTrigger value="b2b">B2B Pricing</TabsTrigger>
          <TabsTrigger value="inventory">
            <MapPin className="h-4 w-4 mr-1" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="multipass">
            <KeyRound className="h-4 w-4 mr-1" />
            Multipass
          </TabsTrigger>
          <TabsTrigger value="giftcards">
            <Gift className="h-4 w-4 mr-1" />
            Gift Cards
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
          <WebhookManager />
        </TabsContent>
        
        <TabsContent value="flows">
          <FlowsAutomation />
        </TabsContent>
        
        <TabsContent value="b2b">
          <ShopifyB2BPricing />
        </TabsContent>
        
        <TabsContent value="inventory">
          <MultiLocationInventory />
        </TabsContent>
        
        <TabsContent value="multipass">
          <MultipassManager />
        </TabsContent>
        
        <TabsContent value="giftcards">
          <GiftCardManager />
        </TabsContent>
        
        <TabsContent value="bulk">
          <ShopifyBulkOperations />
        </TabsContent>
        
        <TabsContent value="connect">
          <ShopifyOAuth />
        </TabsContent>
      </Tabs>
    </div>
  );
}
