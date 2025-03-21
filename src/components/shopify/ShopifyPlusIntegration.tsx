import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useShopify } from "@/contexts/shopify";
import { ShopifyScriptsManager } from "./ShopifyScriptsManager";
import { ShopifyFlowManager } from "./ShopifyFlowManager";
import { ShopifyB2BPricing } from "./ShopifyB2BPricing";
import { AlertTriangle, Zap, ArrowRight } from "lucide-react";
import { createShopifyFeatureTracker } from "@/lib/gadget/analytics/shopifyMetrics";

// Create feature trackers
const scriptsTracker = createShopifyFeatureTracker('scripts');
const flowTracker = createShopifyFeatureTracker('flow');
const b2bTracker = createShopifyFeatureTracker('b2b');

export function ShopifyPlusIntegration() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [activeTab, setActiveTab] = useState("scripts");
  
  // Check if store is on Shopify Plus plan - using shopPlan property instead of plan
  const isShopifyPlus = shopifyContext?.shopPlan === 'plus' || false;
  
  // Track tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Track feature view
    switch (value) {
      case "scripts":
        scriptsTracker.trackView();
        break;
      case "flow":
        flowTracker.trackView();
        break;
      case "b2b":
        b2bTracker.trackView();
        break;
    }
  };
  
  if (!isShopifyConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-purple-500" />
            Shopify Plus Features
          </CardTitle>
          <CardDescription>
            Enhanced features for Shopify Plus stores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Connect to Shopify</AlertTitle>
            <AlertDescription>
              Connect to your Shopify store to access Shopify Plus features
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  if (!isShopifyPlus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-purple-500" />
            Shopify Plus Features
          </CardTitle>
          <CardDescription>
            Enhanced features for Shopify Plus stores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Shopify Plus Required</AlertTitle>
              <AlertDescription>
                Your store is not on a Shopify Plus plan. Upgrade to access these features.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Shopify Scripts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Customize checkout with advanced price rules and discounts
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Shopify Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Automate business processes and customer workflows
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">B2B Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Advanced wholesale pricing and company management
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-center">
              <Button variant="outline" className="mt-2">
                Learn More About Shopify Plus
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-purple-500" />
            <div>
              <CardTitle>Shopify Plus Features</CardTitle>
              <CardDescription>
                Enhanced features for your Shopify Plus store
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="px-2 py-1">
            Shopify Plus
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="scripts">Scripts</TabsTrigger>
            <TabsTrigger value="flow">Flow</TabsTrigger>
            <TabsTrigger value="b2b">B2B</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scripts">
            <ShopifyScriptsManager />
          </TabsContent>
          
          <TabsContent value="flow">
            <ShopifyFlowManager />
          </TabsContent>
          
          <TabsContent value="b2b">
            <ShopifyB2BPricing />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
