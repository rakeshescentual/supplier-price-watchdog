
import { useState } from "react";
import { useShopify } from "@/contexts/shopify";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Store, 
  ShieldCheck, 
  Code, 
  Users, 
  PieChart, 
  CreditCard, 
  Truck, 
  AlertTriangle,
  Settings
} from "lucide-react";
import { toast } from "sonner";
import { enhancedFlowService } from "@/services/enhanced-shopify";

export function ShopifyPlusIntegration() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [activeTab, setActiveTab] = useState("scripts");
  const [isCreatingFlow, setIsCreatingFlow] = useState(false);
  const [isCreatingScript, setIsCreatingScript] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState("");
  const [scriptTitle, setScriptTitle] = useState("");
  const [scriptCode, setScriptCode] = useState(`/* Shopify Script Example */\nclass Campaign\n  def run(cart)\n    # Apply discount to cart items when customer is purchasing multiple items\n    if cart.line_items.length >= 3\n      cart.line_items.each do |line_item|\n        line_item.change_line_price(line_item.line_price * 0.9, message: \"10% off for buying 3+ items\")\n      end\n    end\n    cart\n  end\nend`);

  if (!isShopifyConnected || !shopifyContext?.shopPlan?.toLowerCase().includes("plus")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6" />
            Shopify Plus Features
          </CardTitle>
          <CardDescription>
            Exclusive capabilities for Shopify Plus merchants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Shopify Plus Required</AlertTitle>
            <AlertDescription>
              These advanced features require a Shopify Plus subscription. Please connect your Shopify Plus store to access these features.
            </AlertDescription>
          </Alert>
          
          <div className="mt-4">
            <Button variant="outline" onClick={() => toast.info("Please connect a Shopify Plus store first")}>
              <Store className="mr-2 h-4 w-4" />
              Connect Shopify Plus Store
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleCreateFlow = async () => {
    if (!notificationEmail) {
      toast.error("Please enter a notification email");
      return;
    }
    
    setIsCreatingFlow(true);
    try {
      const result = await enhancedFlowService.createPriceChangeFlow(notificationEmail);
      if (result.success) {
        toast.success("Flow created", {
          description: `Price change notification flow has been created successfully.`
        });
        setNotificationEmail("");
      } else {
        toast.error("Failed to create flow", {
          description: result.message
        });
      }
    } catch (error) {
      toast.error("Error creating flow", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsCreatingFlow(false);
    }
  };

  const handleCreateScript = async () => {
    if (!scriptTitle || !scriptCode) {
      toast.error("Please enter both script title and code");
      return;
    }
    
    setIsCreatingScript(true);
    try {
      // Implement script creation logic here
      setTimeout(() => {
        toast.success("Script created", {
          description: `Script "${scriptTitle}" has been created successfully.`
        });
        setScriptTitle("");
        setScriptCode(`/* Shopify Script Example */\nclass Campaign\n  def run(cart)\n    # Apply your discount logic here\n    cart\n  end\nend`);
        setIsCreatingScript(false);
      }, 2000);
    } catch (error) {
      toast.error("Error creating script", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
      setIsCreatingScript(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6" />
            Shopify Plus Features
          </CardTitle>
          <Badge variant="outline" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            Shopify Plus
          </Badge>
        </div>
        <CardDescription>
          Exclusive capabilities available for Shopify Plus merchants
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="scripts">
              <Code className="mr-2 h-4 w-4" />
              Scripts
            </TabsTrigger>
            <TabsTrigger value="flows">
              <PieChart className="mr-2 h-4 w-4" />
              Flows
            </TabsTrigger>
            <TabsTrigger value="b2b">
              <Users className="mr-2 h-4 w-4" />
              B2B
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="scripts">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-purple-500" />
                    <h3 className="font-medium">Payment Scripts</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Customize the available payment methods based on order value, customer location, and more.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-purple-500" />
                    <h3 className="font-medium">Discount Scripts</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create complex discount rules with tiered pricing, bundle discounts, and loyalty rewards.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-purple-500" />
                    <h3 className="font-medium">Shipping Scripts</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Customize shipping rates based on cart contents, destination, and customer segments.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Create a New Script</h3>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="script-title">Script Title</Label>
                    <Input 
                      id="script-title" 
                      placeholder="e.g., Tiered Discount Script"
                      value={scriptTitle}
                      onChange={(e) => setScriptTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="script-code">Script Code (Ruby)</Label>
                    <div className="relative">
                      <textarea
                        id="script-code"
                        className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                        placeholder="Enter Ruby code for your script..."
                        value={scriptCode}
                        onChange={(e) => setScriptCode(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="activate-script" defaultChecked />
                      <Label htmlFor="activate-script">Activate immediately</Label>
                    </div>
                    
                    <Button 
                      onClick={handleCreateScript}
                      disabled={isCreatingScript || !scriptTitle || !scriptCode}
                    >
                      {isCreatingScript ? "Creating..." : "Create Script"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="flows">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 space-y-2">
                  <h3 className="font-medium">Automated Price Change Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Send notifications when prices are updated through the app
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <h3 className="font-medium">Low Stock Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Trigger actions when inventory reaches critical levels
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Create Price Change Flow</h3>
                <p className="text-sm text-muted-foreground">
                  This flow will send notifications when product prices are updated
                </p>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="notification-email">Notification Email</Label>
                    <Input 
                      id="notification-email" 
                      type="email"
                      placeholder="email@escentual.com"
                      value={notificationEmail}
                      onChange={(e) => setNotificationEmail(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleCreateFlow}
                    disabled={isCreatingFlow || !notificationEmail}
                  >
                    {isCreatingFlow ? "Creating..." : "Create Flow"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="b2b">
            <div className="space-y-6">
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>B2B Commerce Features</AlertTitle>
                <AlertDescription>
                  Create company accounts, price lists, and payment terms for your B2B customers
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 space-y-2">
                  <h3 className="font-medium">Wholesale Price Lists</h3>
                  <p className="text-sm text-muted-foreground">
                    Create specialized pricing for wholesale customers
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <h3 className="font-medium">Company Accounts</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage business customers with multiple users
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <h3 className="font-medium">Payment Terms</h3>
                  <p className="text-sm text-muted-foreground">
                    Offer net payment terms to qualified business customers
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 space-y-2">
                  <h3 className="font-medium">Catalog Customization</h3>
                  <p className="text-sm text-muted-foreground">
                    Show or hide products for specific business customers
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => toast.info("Coming soon", { description: "B2B advanced features are in development" })}>
                  Configure B2B Commerce
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
