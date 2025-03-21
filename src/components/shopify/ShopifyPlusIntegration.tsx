
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ShoppingBag, Code, GitBranch, Building2, Zap, CreditCard, Users, Globe, Lock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useShopify } from "@/contexts/shopify";
import { gadgetAnalytics } from "@/lib/gadget/analytics";
import { PriceItem } from "@/types/price";

export function ShopifyPlusIntegration() {
  const [activeTab, setActiveTab] = useState("scripts");
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [isLoading, setIsLoading] = useState(false);
  
  // Usage tracker for analytics
  const usageTracker = gadgetAnalytics.createUsageTracker('shopify_plus');
  
  // Track view
  usageTracker.trackView('page');
  
  // Demo functions for Shopify Plus features
  const handleCreatePricingScript = () => {
    setIsLoading(true);
    usageTracker.trackUse('create_pricing_script');
    
    setTimeout(() => {
      toast.success("Script Created", {
        description: "Pricing script has been deployed to your Shopify Plus store"
      });
      setIsLoading(false);
    }, 1500);
  };
  
  const handleCreateFlow = () => {
    setIsLoading(true);
    usageTracker.trackUse('create_flow');
    
    setTimeout(() => {
      toast.success("Flow Created", {
        description: "Price change notification flow has been created"
      });
      setIsLoading(false);
    }, 1500);
  };
  
  const handleSyncB2BPricing = () => {
    setIsLoading(true);
    usageTracker.trackUse('sync_b2b_pricing');
    
    setTimeout(() => {
      toast.success("B2B Pricing Synced", {
        description: "All wholesale price lists have been updated"
      });
      setIsLoading(false);
    }, 1500);
  };
  
  // Track tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    usageTracker.trackUse(`tab_${value}`);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Shopify Plus Enhanced Integration
        </CardTitle>
        <CardDescription>
          Advanced features and capabilities exclusive to Shopify Plus merchants
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!isShopifyConnected && (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Shopify Connection Required</AlertTitle>
            <AlertDescription>
              Connect to your Shopify Plus store to enable these enhanced features
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="scripts">Scripts</TabsTrigger>
            <TabsTrigger value="flows">Flows</TabsTrigger>
            <TabsTrigger value="b2b">B2B</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scripts" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Shopify Scripts</h3>
                <p className="text-sm text-muted-foreground">Custom pricing rules for checkout</p>
              </div>
              
              <Badge variant="outline" className="font-normal">Plus Only</Badge>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Pricing Scripts</h3>
                </div>
                
                <div className="border rounded-md p-4 space-y-3">
                  <p className="text-sm">Create dynamic pricing rules based on customer segments and cart conditions</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Script Features:</h4>
                    <ul className="text-sm list-disc pl-5 space-y-1">
                      <li>Tiered quantity discounts</li>
                      <li>Customer segment pricing</li>
                      <li>Bundle discounts</li>
                      <li>Conditional promotions</li>
                    </ul>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={handleCreatePricingScript}
                    disabled={isLoading || !isShopifyConnected}
                  >
                    {isLoading ? "Creating..." : "Create Pricing Script"}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <h3 className="font-medium">Script Templates</h3>
                </div>
                
                <div className="border rounded-md divide-y">
                  <div className="p-3 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Tiered Wholesale Pricing</h4>
                      <p className="text-xs text-muted-foreground">Volume-based pricing for wholesale customers</p>
                    </div>
                    <Badge>Popular</Badge>
                  </div>
                  
                  <div className="p-3 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Buy X Get Y Free</h4>
                      <p className="text-xs text-muted-foreground">Promotional offer for product bundles</p>
                    </div>
                    <Badge variant="outline">New</Badge>
                  </div>
                  
                  <div className="p-3 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium">VIP Customer Pricing</h4>
                      <p className="text-xs text-muted-foreground">Special rates for top customers</p>
                    </div>
                    <Badge variant="secondary">Advanced</Badge>
                  </div>
                  
                  <div className="p-3 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Holiday Price Rules</h4>
                      <p className="text-xs text-muted-foreground">Seasonal pricing adjustments</p>
                    </div>
                    <Badge variant="outline">Seasonal</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-md border mt-2">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-slate-600" />
                <h4 className="font-medium text-sm">Script Security & Performance</h4>
              </div>
              <p className="text-xs text-slate-600">
                All scripts are sandboxed by Shopify for security and undergo performance testing to ensure they don't impact checkout speed. Scripts execute in under 50ms with minimal memory usage.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="flows" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Shopify Flow</h3>
                <p className="text-sm text-muted-foreground">Automate business processes</p>
              </div>
              
              <Badge variant="outline" className="font-normal">Plus Only</Badge>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Price Change Automation</h3>
                </div>
                
                <div className="border rounded-md p-4 space-y-3">
                  <p className="text-sm">Create automated workflows that trigger when prices change</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Flow Features:</h4>
                    <ul className="text-sm list-disc pl-5 space-y-1">
                      <li>Email notifications to team members</li>
                      <li>Update product tags based on price changes</li>
                      <li>Create marketing campaigns for sales</li>
                      <li>Auto-adjust inventory settings</li>
                    </ul>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={handleCreateFlow}
                    disabled={isLoading || !isShopifyConnected}
                  >
                    {isLoading ? "Creating..." : "Create Flow Automation"}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <h3 className="font-medium">Flow Templates</h3>
                </div>
                
                <div className="border rounded-md divide-y">
                  <div className="p-3 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Price Increase Notification</h4>
                      <p className="text-xs text-muted-foreground">Notify team and schedule customer emails</p>
                    </div>
                    <Badge>Recommended</Badge>
                  </div>
                  
                  <div className="p-3 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Price Drop Promotion</h4>
                      <p className="text-xs text-muted-foreground">Tag products and create marketing campaigns</p>
                    </div>
                    <Badge variant="outline">Marketing</Badge>
                  </div>
                  
                  <div className="p-3 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Competitor Price Match</h4>
                      <p className="text-xs text-muted-foreground">Auto-adjust pricing based on competitor data</p>
                    </div>
                    <Badge variant="secondary">Advanced</Badge>
                  </div>
                  
                  <div className="p-3 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Margin Protection</h4>
                      <p className="text-xs text-muted-foreground">Alert when prices fall below profit threshold</p>
                    </div>
                    <Badge variant="outline">Business</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-md border mt-2">
              <h4 className="font-medium text-sm mb-2">Flow Analytics</h4>
              <p className="text-xs text-slate-600 mb-3">Performance of your active Flow automations</p>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Price Increase Notification</span>
                    <span>24 executions/month</span>
                  </div>
                  <Progress value={80} className="h-1" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Price Drop Promotion</span>
                    <span>12 executions/month</span>
                  </div>
                  <Progress value={40} className="h-1" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Inventory Alert</span>
                    <span>35 executions/month</span>
                  </div>
                  <Progress value={90} className="h-1" />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="b2b" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">B2B & Wholesale</h3>
                <p className="text-sm text-muted-foreground">Business customer pricing management</p>
              </div>
              
              <Badge variant="outline" className="font-normal">Plus Only</Badge>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-500" />
                  <h3 className="font-medium">B2B Price Lists</h3>
                </div>
                
                <div className="border rounded-md p-4 space-y-3">
                  <p className="text-sm">Manage custom pricing for business customers and wholesale accounts</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">B2B Features:</h4>
                    <ul className="text-sm list-disc pl-5 space-y-1">
                      <li>Custom price lists by customer or company</li>
                      <li>Volume-based pricing tiers</li>
                      <li>Contract pricing with start/end dates</li>
                      <li>Custom payment terms</li>
                    </ul>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={handleSyncB2BPricing}
                    disabled={isLoading || !isShopifyConnected}
                  >
                    {isLoading ? "Syncing..." : "Sync B2B Pricing"}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Customer Groups</h3>
                </div>
                
                <div className="border rounded-md divide-y">
                  <div className="p-3 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Wholesale</h4>
                      <p className="text-xs text-muted-foreground">25% off retail prices</p>
                    </div>
                    <Badge variant="outline">52 customers</Badge>
                  </div>
                  
                  <div className="p-3 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Distributors</h4>
                      <p className="text-xs text-muted-foreground">40% off retail prices + volume discounts</p>
                    </div>
                    <Badge variant="outline">18 customers</Badge>
                  </div>
                  
                  <div className="p-3 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Key Accounts</h4>
                      <p className="text-xs text-muted-foreground">Custom negotiated prices</p>
                    </div>
                    <Badge variant="outline">7 customers</Badge>
                  </div>
                  
                  <div className="p-3 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium">International</h4>
                      <p className="text-xs text-muted-foreground">Region-specific pricing</p>
                    </div>
                    <Badge variant="outline">12 customers</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-md border mt-2">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-slate-600" />
                <h4 className="font-medium text-sm">International B2B</h4>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Manage international B2B pricing across different markets and currencies. 
                Automatically sync price changes while maintaining different margins for each market.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Configure International Pricing
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Manage Currency Conversions
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <Separator />
        
        <div className="flex flex-col sm:flex-row items-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Shopify Plus required</span>
          </div>
          
          <div className="bg-muted h-1 w-1 rounded-full hidden sm:block"></div>
          
          <a 
            href="https://www.shopify.com/plus" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:text-blue-700"
          >
            Learn more about Shopify Plus
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
