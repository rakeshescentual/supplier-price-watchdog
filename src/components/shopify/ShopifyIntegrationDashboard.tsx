
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
import { ShopifyWebhookManager } from "@/components/shopify/WebhookManager";
import { ShopifyIntegrationStatus } from "@/components/shopify/ShopifyIntegrationStatus"; 
import { ShopifyB2BPricing } from "@/components/shopify/ShopifyB2BPricing";
import { MultiLocationInventory } from "@/components/shopify/plus/MultiLocationInventory";
import { ShopifyCompliance } from "@/components/shopify/ShopifyCompliance";
import { FlowsAutomation } from "@/components/shopify/plus/FlowsAutomation";
import { ShopifyOAuth } from "@/components/shopify/ShopifyOAuth";
import { MultipassManager } from "@/components/shopify/plus/MultipassManager";
import { GiftCardManager } from "@/components/shopify/plus/GiftCardManager";
import { GraphQLMigrationAlert } from "@/components/shopify/GraphQLMigrationAlert";
import { ExternalLink, AlertTriangle, Settings, Store, Activity, MapPin, Zap, Gift, KeyRound, HelpCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { shopifyApiVersionManager } from "@/lib/shopify/apiVersionManager";
import { TooltipProvider, TooltipContent, Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { isGraphQLOnlyVersion } from "@/lib/shopify/api-version";

export function ShopifyIntegrationDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isShopifyConnected, shopifyContext, testConnection } = useShopify();
  const [mockCompetitorData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMockData = () => {
    toast.success("Data refreshed", {
      description: "Latest Shopify data has been loaded"
    });
  };

  const currentApiVersion = shopifyApiVersionManager.getCurrent();
  const latestApiVersion = shopifyApiVersionManager.getLatestStable().version;
  const isLatestApiVersion = currentApiVersion === latestApiVersion;
  const isUsingGraphQLOnly = isGraphQLOnlyVersion(currentApiVersion);
  
  const isPlusStore = shopifyContext?.shopPlan?.toLowerCase().includes('plus');

  const handleRefreshConnection = async () => {
    setIsRefreshing(true);
    try {
      const result = await testConnection();
      if (result.success) {
        toast.success("Connection verified", {
          description: "Your Shopify connection is working properly"
        });
      } else {
        toast.error("Connection issue", {
          description: result.message || "There was a problem with your Shopify connection"
        });
      }
    } catch (error) {
      toast.error("Connection error", {
        description: "Failed to test Shopify connection"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDocumentation = () => {
    window.open('/documentation/docs/ShopifyIntegration', '_blank');
  };
  
  const handleUpdateApiVersion = () => {
    shopifyApiVersionManager.updateToVersion('2025-04');
    toast.success("API Version Updated", {
      description: `Updated to Shopify API version 2025-04 (GraphQL-only)`
    });
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
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleRefreshConnection} disabled={isRefreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Test and refresh your Shopify connection</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleDocumentation}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Shopify integration documentation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {!isShopifyConnected && (
            <Button variant="default" size="sm" onClick={() => setActiveTab("connect")}>
              <Settings className="h-4 w-4 mr-2" />
              Connect Store
            </Button>
          )}
        </div>
      </div>
      
      {!isShopifyConnected && (
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Shopify Not Connected</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Connect to your Shopify store to access all features</span>
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => setActiveTab("connect")}
            >
              Connect Now
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {isShopifyConnected && !isUsingGraphQLOnly && (
        <GraphQLMigrationAlert 
          currentApiVersion={currentApiVersion} 
          onUpdateVersion={handleUpdateApiVersion}
        />
      )}
      
      {isShopifyConnected && isUsingGraphQLOnly && !isLatestApiVersion && (
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
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="dashboard" className="flex items-center">
            <Store className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Market Insights
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center">
            <ExternalLink className="h-4 w-4 mr-2" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="flows" className="flex items-center">
            <Zap className="h-4 w-4 mr-1" />
            Flows
          </TabsTrigger>
          <TabsTrigger value="b2b" className="flex items-center">
            <Store className="h-4 w-4 mr-2" />
            B2B Pricing
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="multipass" className="flex items-center">
            <KeyRound className="h-4 w-4 mr-1" />
            Multipass
          </TabsTrigger>
          <TabsTrigger value="giftcards" className="flex items-center">
            <Gift className="h-4 w-4 mr-1" />
            Gift Cards
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Bulk Operations
          </TabsTrigger>
          <TabsTrigger value="connect" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Connect
          </TabsTrigger>
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
          <ShopifyWebhookManager />
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
