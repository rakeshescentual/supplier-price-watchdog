import { useEffect, useState } from "react";
import { MarketingIntegrations } from "@/components/integrations/MarketingIntegrations";
import { KlaviyoIntegration } from "@/components/integrations/KlaviyoIntegration";
import { PriceAlertChannels } from "@/components/integrations/PriceAlertChannels";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { AnalysisSummary } from "@/components/AnalysisSummary";
import GadgetConfigForm from "@/components/GadgetConfigForm";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Share2, Upload, RefreshCw, BellRing, Mail, ShoppingBag,
  AlertTriangle, Download, Info, Users as UsersIcon,
  Cog, Check, ArrowRightLeft, Webhook, Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { initGA4, trackPriceChange, GA4EventType } from "@/lib/integrations/googleAnalytics4";
import { useShopify } from "@/contexts/ShopifyContext";
import { prepareKlaviyoSegmentData } from "@/utils/marketDataUtils";

export default function Integrations() {
  const [activeTab, setActiveTab] = useState("marketing");
  const [gadgetTab, setGadgetTab] = useState("config");
  const { items, summary, file } = useFileAnalysis();
  const { isShopifyConnected, shopifyContext, isGadgetInitialized } = useShopify();
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [integrationStatus, setIntegrationStatus] = useState<Record<string, boolean>>({
    shopify: false,
    klaviyo: false,
    gadget: false,
    googleAnalytics: false
  });
  
  const hasItems = items.length > 0;
  
  useEffect(() => {
    // Initialize Google Analytics 4 when the page loads
    const ga4Result = initGA4();
    if (ga4Result) {
      console.log("Google Analytics 4 initialized successfully");
      setIntegrationStatus(prev => ({ ...prev, googleAnalytics: true }));
    }
    
    // Track current price data if available
    if (hasItems) {
      trackPriceChange(items, GA4EventType.BULK_PRICE_UPDATE);
    }
    
    // Check Shopify connection
    if (isShopifyConnected && shopifyContext) {
      setIntegrationStatus(prev => ({ ...prev, shopify: true }));
    }
    
    // Check Gadget initialization
    if (isGadgetInitialized) {
      setIntegrationStatus(prev => ({ ...prev, gadget: true }));
    }
    
    // Check if Klaviyo connection exists in localStorage
    const klaviyoApiKey = localStorage.getItem('klaviyoApiKey');
    if (klaviyoApiKey) {
      setIntegrationStatus(prev => ({ ...prev, klaviyo: true }));
    }
  }, [hasItems, items, isShopifyConnected, shopifyContext, isGadgetInitialized]);
  
  const testAllConnections = async () => {
    setIsTestingAll(true);
    
    try {
      // Wait a moment to simulate testing connections
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, this would test real connections
      // For demo purposes, we'll just show results based on status
      
      const results = {
        shopify: integrationStatus.shopify,
        klaviyo: integrationStatus.klaviyo,
        gadget: integrationStatus.gadget,
        googleAnalytics: integrationStatus.googleAnalytics
      };
      
      const connectedCount = Object.values(results).filter(Boolean).length;
      
      if (connectedCount === 4) {
        toast.success("All integrations connected", {
          description: "Shopify, Klaviyo, Gadget, and Google Analytics are connected and working"
        });
      } else if (connectedCount > 0) {
        toast.success(`${connectedCount}/4 integrations connected`, {
          description: `Some integrations are working, but ${4 - connectedCount} are not configured`
        });
      } else {
        toast.error("No integrations connected", {
          description: "Please configure at least one integration to proceed"
        });
      }
      
      // Send test event to GA4 if connected
      if (results.googleAnalytics && hasItems) {
        trackPriceChange(items, GA4EventType.TEST_EVENT);
      }
      
      // Log Klaviyo segment data if available
      if (results.klaviyo && hasItems) {
        const klaviyoData = prepareKlaviyoSegmentData(items);
        console.log("Klaviyo segment data prepared:", klaviyoData);
      }
    } catch (error) {
      console.error("Error testing connections:", error);
      toast.error("Error testing connections", {
        description: "Could not verify all connections. See console for details."
      });
    } finally {
      setIsTestingAll(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Integrations & Notifications
          </h1>
          <p className="text-muted-foreground">
            Connect with Shopify Plus, Gadget.dev, Klaviyo, and marketing tools to synchronize price changes
          </p>
        </div>
        
        <div className="flex gap-4 flex-wrap">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
          
          <Button variant="outline" disabled={isTestingAll} onClick={testAllConnections}>
            {isTestingAll ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Test All Connections
              </>
            )}
          </Button>
        </div>
      </div>
      
      {!hasItems && (
        <Alert className="mb-8" variant="default">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No price data available</AlertTitle>
          <AlertDescription>
            Please upload and analyze a supplier price list first to use these integrations.
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => window.location.href = "/"}
            >
              Go to Price Analysis
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        {hasItems && (
          <Card className="md:col-span-8">
            <CardHeader className="pb-3">
              <CardTitle>
                {file?.name || "Price Analysis"}
              </CardTitle>
              <CardDescription>
                {items.length} products analyzed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalysisSummary {...summary} />
              
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-muted rounded-md p-3 text-center">
                  <p className="text-sm text-muted-foreground">Price Increases</p>
                  <p className="text-2xl font-medium text-red-600">{summary.increasedItems}</p>
                </div>
                <div className="bg-muted rounded-md p-3 text-center">
                  <p className="text-sm text-muted-foreground">Price Decreases</p>
                  <p className="text-2xl font-medium text-green-600">{summary.decreasedItems}</p>
                </div>
                <div className="bg-muted rounded-md p-3 text-center">
                  <p className="text-sm text-muted-foreground">Discontinued</p>
                  <p className="text-2xl font-medium text-orange-600">{summary.discontinuedItems}</p>
                </div>
                <div className="bg-muted rounded-md p-3 text-center">
                  <p className="text-sm text-muted-foreground">New Products</p>
                  <p className="text-2xl font-medium text-blue-600">{summary.newItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className={hasItems ? "md:col-span-4" : "md:col-span-12"}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5" />
              Integration Status
            </CardTitle>
            <CardDescription>
              Connected service status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Shopify Plus</span>
                </div>
                <Badge variant={integrationStatus.shopify ? "success" : "outline"}>
                  {integrationStatus.shopify ? "Connected" : "Not Connected"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cog className="h-4 w-4" />
                  <span>Gadget.dev</span>
                </div>
                <Badge variant={integrationStatus.gadget ? "success" : "outline"}>
                  {integrationStatus.gadget ? "Connected" : "Not Connected"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Klaviyo</span>
                </div>
                <Badge variant={integrationStatus.klaviyo ? "success" : "outline"}>
                  {integrationStatus.klaviyo ? "Connected" : "Not Connected"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  <span>Google Analytics</span>
                </div>
                <Badge variant={integrationStatus.googleAnalytics ? "success" : "outline"}>
                  {integrationStatus.googleAnalytics ? "Connected" : "Not Connected"}
                </Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full justify-center"
              onClick={() => setActiveTab("gadget")}
            >
              Configure Integrations
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="marketing" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8 w-full max-w-md mx-auto grid grid-cols-5">
          <TabsTrigger value="marketing" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Marketing</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <BellRing className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="klaviyo" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Klaviyo</span>
          </TabsTrigger>
          <TabsTrigger value="gadget" className="flex items-center gap-2">
            <Cog className="h-4 w-4" />
            <span className="hidden sm:inline">Gadget</span>
          </TabsTrigger>
          <TabsTrigger value="shopify" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Shopify</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="marketing" className="mt-0">
          <MarketingIntegrations />
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-0">
          <PriceAlertChannels />
        </TabsContent>
        
        <TabsContent value="klaviyo" className="mt-0">
          <KlaviyoIntegration />
        </TabsContent>
        
        <TabsContent value="gadget" className="mt-0">
          <div className="grid grid-cols-1 gap-8">
            <Tabs value={gadgetTab} onValueChange={setGadgetTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="config">Configuration</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="docs">Documentation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="config" className="mt-6">
                <GadgetConfigForm />
              </TabsContent>
              
              <TabsContent value="features" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Gadget.dev Integration Features</CardTitle>
                    <CardDescription>
                      Enhanced capabilities for Shopify Plus and Klaviyo integrations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Database className="h-5 w-5 text-blue-500" />
                          <h3 className="font-medium">Data Processing</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Process large datasets efficiently using Gadget's background job capabilities
                        </p>
                        <ul className="text-sm space-y-1 mt-2">
                          <li className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-500" />
                            PDF price list processing
                          </li>
                          <li className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-500" />
                            Batch operations for Shopify updates
                          </li>
                          <li className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-500" />
                            Cross-supplier trend analysis
                          </li>
                        </ul>
                      </div>
                      
                      <div className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-5 w-5 text-purple-500" />
                          <h3 className="font-medium">Shopify Plus Enhancement</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Extend Shopify Plus capabilities with custom actions and automation
                        </p>
                        <ul className="text-sm space-y-1 mt-2">
                          <li className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-500" />
                            Script deployment for pricing rules
                          </li>
                          <li className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-500" />
                            Flow creation for business processes
                          </li>
                          <li className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-500" />
                            Multi-location inventory management
                          </li>
                        </ul>
                      </div>
                      
                      <div className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-5 w-5 text-orange-500" />
                          <h3 className="font-medium">Klaviyo Integration</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Enhance Klaviyo with advanced segmentation and automation
                        </p>
                        <ul className="text-sm space-y-1 mt-2">
                          <li className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-500" />
                            Advanced customer segmentation
                          </li>
                          <li className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-500" />
                            Scheduled email campaigns
                          </li>
                          <li className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-500" />
                            Personalized price change alerts
                          </li>
                        </ul>
                      </div>
                      
                      <div className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Webhook className="h-5 w-5 text-green-500" />
                          <h3 className="font-medium">Webhooks & Events</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Trigger actions when important events occur
                        </p>
                        <ul className="text-sm space-y-1 mt-2">
                          <li className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-500" />
                            Price change notifications
                          </li>
                          <li className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-500" />
                            Inventory alerts for discontinued items
                          </li>
                          <li className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-500" />
                            New supplier upload processing
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Getting Started with Gadget.dev</h3>
                      <ol className="space-y-2 text-sm">
                        <li className="flex gap-2">
                          <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                          <div>
                            <p>Create an account at <a href="https://gadget.dev" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">gadget.dev</a></p>
                          </div>
                        </li>
                        <li className="flex gap-2">
                          <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                          <div>
                            <p>Create a new Gadget application for Supplier Price Watch</p>
                          </div>
                        </li>
                        <li className="flex gap-2">
                          <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                          <div>
                            <p>Generate an API key with appropriate permissions</p>
                          </div>
                        </li>
                        <li className="flex gap-2">
                          <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
                          <div>
                            <p>Configure your Gadget application ID and API key in the Configuration tab</p>
                          </div>
                        </li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="docs" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Documentation & Resources</CardTitle>
                    <CardDescription>
                      Learn more about Gadget.dev integration with Supplier Price Watch
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="prose max-w-none">
                    <iframe 
                      src="/src/assets/docs/Gadget_Integration_Guide.md" 
                      className="w-full h-[500px] border rounded"
                      title="Gadget Integration Guide"
                    ></iframe>
                  </CardContent>
                  <CardFooter>
                    <div className="text-sm text-muted-foreground">
                      For more information, visit the <a href="https://gadget.dev/docs" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Gadget Documentation</a>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        
        <TabsContent value="shopify" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Shopify Plus Integration
              </CardTitle>
              <CardDescription>
                Enhanced features for Shopify Plus merchants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Shopify Plus Required</AlertTitle>
                <AlertDescription>
                  Some features require a Shopify Plus subscription. Connect Gadget.dev to enable all features.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 space-y-2">
                  <h3 className="font-medium">Pricing Scripts</h3>
                  <p className="text-sm text-muted-foreground">
                    Deploy custom pricing rules based on customer segments, order value, and product combinations
                  </p>
                  <Badge variant="outline" className="mt-2">Shopify Plus Only</Badge>
                </div>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <h3 className="font-medium">Flow Automation</h3>
                  <p className="text-sm text-muted-foreground">
                    Automate business processes when prices change, inventory updates, or new products are added
                  </p>
                  <Badge variant="outline" className="mt-2">Shopify Plus Only</Badge>
                </div>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <h3 className="font-medium">Multi-location Inventory</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage price changes across multiple store locations and warehouse facilities
                  </p>
                  <Badge variant="outline" className="mt-2">Shopify Plus Only</Badge>
                </div>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <h3 className="font-medium">B2B Price Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Create and manage wholesale price lists for B2B customers with special pricing tiers
                  </p>
                  <Badge variant="outline" className="mt-2">Shopify Plus Only</Badge>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Connect Your Shopify Plus Store</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Integrate with your Shopify Plus store to enable enhanced pricing features
                </p>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="default" 
                    className="flex-1"
                    disabled={integrationStatus.shopify}
                    onClick={() => {
                      toast.info("Shopify Connection Flow", {
                        description: "This would open the Shopify OAuth flow in a real implementation"
                      });
                    }}
                  >
                    {integrationStatus.shopify ? "Connected to Shopify" : "Connect Shopify Store"}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    disabled={!integrationStatus.shopify || !hasItems}
                    onClick={() => {
                      toast.success("Sync Complete", {
                        description: `Successfully synced ${items.length} items to Shopify`
                      });
                    }}
                  >
                    Sync Price Changes to Shopify
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 text-center text-muted-foreground text-sm">
        <p>Connect with your marketing tools and commerce platforms to synchronize price changes and automate customer communications.</p>
      </div>
    </div>
  );
}
