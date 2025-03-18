
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, ShoppingBag, Calendar, Map, FileText, Workflow } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useShopify } from "@/contexts/shopify";
import { useState } from "react";

export function ShopifyPlusFeatures() {
  const { isShopifyConnected } = useShopify();
  // Since isShopifyPlus doesn't exist in the context, we'll simulate it for now
  const [isShopifyPlus] = useState(true); // Simulate Shopify Plus status
  
  if (!isShopifyConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopify Plus Features
          </CardTitle>
          <CardDescription>
            Advanced features for Shopify Plus merchants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertTitle>Connect to Shopify</AlertTitle>
            <AlertDescription>
              Connect to your Shopify store to enable advanced Shopify Plus features.
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
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopify Plus Features
          </CardTitle>
          <CardDescription>
            Advanced features for Shopify Plus merchants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertTitle>Shopify Plus Required</AlertTitle>
            <AlertDescription>
              These features are only available for Shopify Plus merchants. Contact your Shopify representative to upgrade.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Shopify Plus Features
        </CardTitle>
        <CardDescription>
          Advanced features enabled for your Shopify Plus store
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scripts">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="scripts">Scripts</TabsTrigger>
            <TabsTrigger value="flows">Flows</TabsTrigger>
            <TabsTrigger value="launchpad">Launchpad</TabsTrigger>
            <TabsTrigger value="locations">Multi-Location</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scripts" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-purple-500" />
                <h3 className="font-medium">Price Scripts</h3>
              </div>
              <Badge>Active</Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <p>
                Use custom scripts to create dynamic pricing rules based on:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Customer purchase history</li>
                <li>Quantity discounts</li>
                <li>Bundle pricing</li>
                <li>Time-based promotions</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Scripts are automatically applied at checkout based on your configured rules.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="flows" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Workflow className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Flow Automation</h3>
              </div>
              <Badge>Active</Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <p>
                Automate price change workflows, including:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Scheduled price updates based on supplier changes</li>
                <li>Tagging products for marketing campaigns</li>
                <li>Inventory alerts and management</li>
                <li>Customer segmentation based on purchase patterns</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Flow automations run in the background to streamline your operations.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="launchpad" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">Launchpad Events</h3>
              </div>
              <Badge>Active</Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <p>
                Schedule and automate major price changes:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Seasonal price adjustments</li>
                <li>Flash sales and limited-time promotions</li>
                <li>New collection launches</li>
                <li>Coordinated price changes across product categories</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Launchpad allows you to schedule and orchestrate complex price change events.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="locations" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Map className="h-5 w-5 text-orange-500" />
                <h3 className="font-medium">Multi-Location Support</h3>
              </div>
              <Badge>Active</Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <p>
                Manage pricing across multiple locations:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Region-specific pricing strategies</li>
                <li>Location-based inventory management</li>
                <li>Fulfillment-optimized pricing</li>
                <li>Tax and currency adjustments</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Multi-location support enables sophisticated pricing strategies for different markets.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        These features are exclusive to Shopify Plus merchants and fully integrated with Supplier Price Watch
      </CardFooter>
    </Card>
  );
}
