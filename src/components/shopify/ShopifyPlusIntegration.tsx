
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Crown, Code, GitBranch, Users, ShoppingCart, AlertTriangle } from "lucide-react";
import { useShopify } from "@/contexts/shopify";
import { toast } from "sonner";
import { gadgetAnalytics } from "@/lib/gadget/analytics";

export function ShopifyPlusIntegration() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [activeTab, setActiveTab] = useState("scripts");
  const [isDeploying, setIsDeploying] = useState(false);
  const [scriptType, setScriptType] = useState("discount");
  const [scriptCode, setScriptCode] = useState(`# Example Ruby script for Shopify discount
if Input.cart.line_items.size > 3
  # Apply 10% discount when customer buys more than 3 items
  Input.cart.line_items.each do |line_item|
    line_item.change_line_price(line_item.line_price * 0.9, message: "10% Volume Discount")
  end
end

Output.cart = Input.cart`);

  const handleDeployScript = () => {
    if (!isShopifyConnected) {
      toast.error("Shopify not connected", {
        description: "Please connect to Shopify before deploying scripts"
      });
      return;
    }
    
    setIsDeploying(true);
    
    // Track this Plus-specific action
    gadgetAnalytics.trackShopifyPlusMetrics('script_performance', 1, {
      scriptType,
      codeLength: scriptCode.length
    });
    
    setTimeout(() => {
      setIsDeploying(false);
      toast.success("Script deployed successfully", {
        description: "Your script has been deployed to your Shopify Plus store"
      });
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-amber-500" />
          Shopify Plus Features
        </CardTitle>
        <CardDescription>
          Advanced features available exclusively for Shopify Plus merchants
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!isShopifyConnected && (
          <Alert variant="warning" className="mb-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Shopify Plus Required</AlertTitle>
            <AlertDescription>
              These features require a Shopify Plus plan and an active connection
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="scripts">
              <Code className="h-4 w-4 mr-2" />
              Scripts
            </TabsTrigger>
            <TabsTrigger value="flows">
              <GitBranch className="h-4 w-4 mr-2" />
              Flows
            </TabsTrigger>
            <TabsTrigger value="b2b">
              <Users className="h-4 w-4 mr-2" />
              B2B
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="scripts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="script-type" className="text-sm font-medium">Script Type</label>
                  <Select 
                    value={scriptType} 
                    onValueChange={setScriptType}
                  >
                    <SelectTrigger id="script-type">
                      <SelectValue placeholder="Select script type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discount">Discount</SelectItem>
                      <SelectItem value="shipping">Shipping</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="script-code" className="text-sm font-medium">Script Code (Ruby)</label>
                  <Textarea 
                    id="script-code"
                    value={scriptCode}
                    onChange={(e) => setScriptCode(e.target.value)}
                    className="font-mono text-sm h-[300px]"
                  />
                </div>
                
                <Button 
                  onClick={handleDeployScript} 
                  disabled={isDeploying || !isShopifyConnected || !scriptCode.trim()}
                  className="w-full"
                >
                  {isDeploying ? "Deploying..." : "Deploy Script"}
                </Button>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Available Script Templates</h3>
                
                <div className="space-y-3">
                  <div className="p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">Volume Discount</h4>
                      <Badge>Discount</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Apply tiered discounts based on number of items in cart
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">Free Shipping Threshold</h4>
                      <Badge>Shipping</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Provide free shipping when order exceeds threshold
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">Brand-specific Discount</h4>
                      <Badge>Discount</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Apply discounts to specific brands or vendors
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">BOGO Discount</h4>
                      <Badge>Discount</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Buy one, get one free or discounted
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="flows" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Price Change Notifications</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Automatically notify customers when prices change on products they've viewed
                  </p>
                  <Button variant="outline" size="sm" disabled={!isShopifyConnected}>
                    Create Flow
                  </Button>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Back-in-Stock Alerts</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Notify customers when products they're interested in are restocked
                  </p>
                  <Button variant="outline" size="sm" disabled={!isShopifyConnected}>
                    Create Flow
                  </Button>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Competitor Price Monitoring</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Automatically adjust prices when competitor prices change
                  </p>
                  <Button variant="outline" size="sm" disabled={!isShopifyConnected}>
                    Create Flow
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-3">Custom Flow Builder</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Trigger Event</label>
                    <Select disabled={!isShopifyConnected} defaultValue="price_changed">
                      <SelectTrigger>
                        <SelectValue placeholder="Select trigger" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price_changed">Price Changed</SelectItem>
                        <SelectItem value="inventory_updated">Inventory Updated</SelectItem>
                        <SelectItem value="product_created">Product Created</SelectItem>
                        <SelectItem value="order_placed">Order Placed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Conditions</label>
                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-2 text-sm">
                        <span>Price difference is greater than</span>
                        <Input 
                          type="number" 
                          className="w-16 h-7" 
                          disabled={!isShopifyConnected}
                          defaultValue="10"
                        />
                        <span>%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Actions</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="email-customer" disabled={!isShopifyConnected} />
                        <label htmlFor="email-customer" className="text-sm">Email Customer</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="create-discount" disabled={!isShopifyConnected} />
                        <label htmlFor="create-discount" className="text-sm">Create Discount Code</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="update-tag" disabled={!isShopifyConnected} />
                        <label htmlFor="update-tag" className="text-sm">Update Product Tag</label>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full" disabled={!isShopifyConnected}>
                    Save Flow
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="b2b" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">B2B Price Lists</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Create and manage price lists for wholesale customers
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm">Wholesale Tier 1</span>
                      <Badge>10% off</Badge>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm">Wholesale Tier 2</span>
                      <Badge>15% off</Badge>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm">Distributor Pricing</span>
                      <Badge>25% off</Badge>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="mt-3" disabled={!isShopifyConnected}>
                    Add Price List
                  </Button>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">B2B Customer Groups</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Organize wholesale customers into groups with specific permissions
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm">Small Retailers</span>
                      <Badge variant="outline">12 customers</Badge>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm">Distributors</span>
                      <Badge variant="outline">5 customers</Badge>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm">Chain Stores</span>
                      <Badge variant="outline">3 customers</Badge>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="mt-3" disabled={!isShopifyConnected}>
                    Manage Groups
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingCart className="h-5 w-5" />
                  <h3 className="font-medium">Bulk Pricing Tool</h3>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Create wholesale pricing for multiple products at once
                </p>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Customer Group</label>
                    <Select disabled={!isShopifyConnected} defaultValue="distributors">
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small_retailers">Small Retailers</SelectItem>
                        <SelectItem value="distributors">Distributors</SelectItem>
                        <SelectItem value="chain_stores">Chain Stores</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Discount Type</label>
                    <Select disabled={!isShopifyConnected} defaultValue="percentage">
                      <SelectTrigger>
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage Discount</SelectItem>
                        <SelectItem value="fixed_amount">Fixed Amount Off</SelectItem>
                        <SelectItem value="fixed_price">Fixed Price</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Discount Value</label>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        className="w-full" 
                        disabled={!isShopifyConnected}
                        defaultValue="25"
                      />
                      <span className="text-sm">%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Product Categories</label>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="fragrances" disabled={!isShopifyConnected} />
                        <label htmlFor="fragrances" className="text-sm">Fragrances</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="skincare" disabled={!isShopifyConnected} />
                        <label htmlFor="skincare" className="text-sm">Skincare</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="makeup" disabled={!isShopifyConnected} />
                        <label htmlFor="makeup" className="text-sm">Makeup</label>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full" disabled={!isShopifyConnected}>
                    Apply Bulk Pricing
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
