
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Code, 
  Workflow, 
  Calendar, 
  Globe, 
  RefreshCw, 
  ArrowDown, 
  Package,
  Check,
  ExternalLink
} from "lucide-react";
import { useShopify } from "@/contexts/shopify";
import { deployShopifyScript, createShopifyFlow, scheduleShopifyPriceChanges } from "@/lib/gadget/shopify-integration";

export function ShopifyPlusFeatures() {
  const [activeTab, setActiveTab] = useState("scripts");
  const [isDeploying, setIsDeploying] = useState(false);
  const { isShopifyConnected } = useShopify();

  const handleDeployScript = async (scriptId: string) => {
    if (!isShopifyConnected) {
      toast.error("Shopify not connected", {
        description: "Please connect to Shopify before deploying scripts."
      });
      return;
    }
    
    setIsDeploying(true);
    
    try {
      // Update to match the proper function signature
      await deployShopifyScript("store.myshopify.com", scriptId, "// Script content here");
      toast.success("Script deployed successfully");
    } catch (error) {
      console.error("Error deploying script:", error);
      toast.error("Failed to deploy script");
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCreateFlow = async (flowId: string) => {
    if (!isShopifyConnected) {
      toast.error("Shopify not connected", {
        description: "Please connect to Shopify before creating flows."
      });
      return;
    }
    
    setIsDeploying(true);
    
    try {
      // Update to match the expected function signature
      await createShopifyFlow("store.myshopify.com", {
        name: flowId,
        trigger: "product_update",
        conditions: [],
        actions: []
      });
      toast.success("Flow created successfully");
    } catch (error) {
      console.error("Error creating flow:", error);
      toast.error("Failed to create flow");
    } finally {
      setIsDeploying(false);
    }
  };

  const handleSchedulePriceChanges = async () => {
    if (!isShopifyConnected) {
      toast.error("Shopify not connected", {
        description: "Please connect to Shopify before scheduling price changes."
      });
      return;
    }
    
    setIsDeploying(true);
    
    try {
      await scheduleShopifyPriceChanges("store.myshopify.com", [
        { variantId: 'product-1', newPrice: 19.99, effectiveDate: '2023-12-01' },
        { variantId: 'product-2', newPrice: 29.99, effectiveDate: '2023-12-01' }
      ]);
      toast.success("Price changes scheduled successfully");
    } catch (error) {
      console.error("Error scheduling price changes:", error);
      toast.error("Failed to schedule price changes");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
            Shopify Plus
          </Badge>
          <CardTitle>Advanced Shopify Features</CardTitle>
        </div>
        <CardDescription>
          Leverage Shopify Plus capabilities for enhanced pricing management
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="scripts">
                <Code className="h-4 w-4 mr-2" />
                Scripts
              </TabsTrigger>
              <TabsTrigger value="flows">
                <Workflow className="h-4 w-4 mr-2" />
                Flows
              </TabsTrigger>
              <TabsTrigger value="launchpad">
                <Calendar className="h-4 w-4 mr-2" />
                Launchpad
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="scripts" className="mt-0">
            <div className="px-6 pb-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-1">Price Management Scripts</h3>
                <p className="text-sm text-muted-foreground">
                  Deploy scripts to dynamically manage pricing in your Shopify Plus store
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Tiered Quantity Discounts</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Automatically apply quantity-based discounts using price tiers from supplier data
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleDeployScript('tiered-discount')}
                      disabled={isDeploying || !isShopifyConnected}
                    >
                      {isDeploying ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                      Deploy Script
                    </Button>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="text-sm">
                    <h5 className="font-medium mb-2">Script Details</h5>
                    <ul className="space-y-1">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Applies discounts based on quantity purchased</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Syncs with supplier minimum order quantity data</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Maintains profit margins while offering volume discounts</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Competitor Price Matching</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Dynamically match competitor prices while preserving margin requirements
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleDeployScript('price-matching')}
                      disabled={isDeploying || !isShopifyConnected}
                    >
                      Deploy Script
                    </Button>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="text-sm">
                    <h5 className="font-medium mb-2">Script Details</h5>
                    <ul className="space-y-1">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Uses competitor price data to adjust pricing in real-time</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Applies rules to ensure prices don't fall below minimum thresholds</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Includes customizable rules for different product categories</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">B2B Pricing Rules</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Implement specialized B2B pricing based on supplier agreements
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleDeployScript('b2b-pricing')}
                      disabled={isDeploying || !isShopifyConnected}
                    >
                      Deploy Script
                    </Button>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="text-sm">
                    <h5 className="font-medium mb-2">Script Details</h5>
                    <ul className="space-y-1">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Applies special pricing for B2B customers</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Handles complex customer-specific price agreements</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Supports tiered B2B pricing based on account level</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="flows" className="mt-0">
            <div className="px-6 pb-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-1">Automated Price Flows</h3>
                <p className="text-sm text-muted-foreground">
                  Set up automated workflows for price changes based on supplier updates
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Price Increase Notification</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Automatically notify customers about upcoming price increases
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleCreateFlow('price-increase-notification')}
                      disabled={isDeploying || !isShopifyConnected}
                    >
                      Create Flow
                    </Button>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-2">Trigger</h5>
                      <p className="text-muted-foreground">When price increase is detected in supplier data</p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Conditions</h5>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>Price increase &gt; 5%</li>
                        <li>Customer purchased in last 6 months</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Actions</h5>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>Add customer to segment</li>
                        <li>Send email notification</li>
                        <li>Add product tag</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Margin Protection</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Automatically adjust retail prices when supplier costs increase
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleCreateFlow('margin-protection')}
                      disabled={isDeploying || !isShopifyConnected}
                    >
                      Create Flow
                    </Button>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-2">Trigger</h5>
                      <p className="text-muted-foreground">When supplier price increases</p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Conditions</h5>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>Margin would drop below threshold</li>
                        <li>Product not in promotion</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Actions</h5>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>Calculate new retail price</li>
                        <li>Update product price</li>
                        <li>Notify store manager</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Competitive Price Monitoring</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Adjust prices based on competitor price changes
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleCreateFlow('competitive-price-monitoring')}
                      disabled={isDeploying || !isShopifyConnected}
                    >
                      Create Flow
                    </Button>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-2">Trigger</h5>
                      <p className="text-muted-foreground">When competitor price data is updated</p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Conditions</h5>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>Price difference &gt; 10%</li>
                        <li>Product has "price match" tag</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Actions</h5>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>Calculate competitive price</li>
                        <li>Update product price</li>
                        <li>Add price match badge</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="launchpad" className="mt-0">
            <div className="px-6 pb-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-1">Scheduled Price Changes</h3>
                <p className="text-sm text-muted-foreground">
                  Schedule supplier price changes to take effect at specific dates and times
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <h4 className="font-medium">Upcoming Price Changes</h4>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 text-blue-500 mr-1" />
                        <p className="text-sm text-muted-foreground">
                          Scheduled for December 1, 2023
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 self-end sm:self-auto">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast.success("Changes previewed", {
                            description: "2 product price changes loaded for preview."
                          });
                        }}
                      >
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleSchedulePriceChanges}
                        disabled={isDeploying || !isShopifyConnected}
                      >
                        {isDeploying ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                        Schedule
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="text-sm grid gap-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-gray-400 mr-2" />
                        <span>Product A</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-2">£18.99</span>
                        <ArrowDown className="h-3 w-3 text-gray-400 mx-1" />
                        <span className="font-medium">£19.99</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-gray-400 mr-2" />
                        <span>Product B</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-2">£24.99</span>
                        <ArrowDown className="h-3 w-3 text-gray-400 mx-1" />
                        <span className="font-medium">£29.99</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-blue-700 flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Multi-Location Support
                  </h4>
                  <p className="text-xs text-blue-600 mt-1">
                    Schedule location-specific price changes for your multi-location Shopify Plus store
                  </p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-blue-700 p-0 h-auto mt-2"
                    onClick={() => {
                      window.open("https://shopify.dev/docs/plus/launchpad", "_blank");
                    }}
                  >
                    Learn more about Launchpad <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="px-6 py-4 border-t">
        <div className="text-xs text-muted-foreground">
          These features require a Shopify Plus subscription. <a href="https://www.shopify.com/plus" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Learn more about Shopify Plus</a>
        </div>
      </CardFooter>
    </Card>
  );
}
