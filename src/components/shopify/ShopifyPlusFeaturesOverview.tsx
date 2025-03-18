
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Info, Settings, Star, FileText, Briefcase, Clock, RefreshCcw, ArrowRight, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useShopify } from "@/contexts/shopify";

export function ShopifyPlusFeaturesOverview() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [activeTab, setActiveTab] = useState("scripts");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);

  const isShopifyPlus = shopifyContext?.shopPlan === "Shopify Plus" || shopifyContext?.shopPlan === "Plus";

  const simulateScriptDeployment = async () => {
    if (!isShopifyConnected) {
      toast.error("Shopify not connected", {
        description: "Please connect to your Shopify Plus store first"
      });
      return;
    }
    
    setIsDeploying(true);
    setDeployProgress(0);
    
    const interval = setInterval(() => {
      setDeployProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 10);
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 300);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    clearInterval(interval);
    setDeployProgress(100);
    
    toast.success("Script deployed successfully", {
      description: "The price rule script has been deployed to your Shopify Plus store"
    });
    
    setTimeout(() => {
      setIsDeploying(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Shopify Plus Features</h2>
          <p className="text-muted-foreground">
            Advanced features available exclusively for Shopify Plus merchants
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {isShopifyPlus ? (
            <Badge className="bg-purple-600">
              <Star className="h-3 w-3 mr-1" />
              Shopify Plus Enabled
            </Badge>
          ) : (
            <Badge variant="outline">
              <Info className="h-3 w-3 mr-1" />
              Requires Shopify Plus
            </Badge>
          )}
        </div>
      </div>
      
      {!isShopifyPlus && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Shopify Plus Required</AlertTitle>
          <AlertDescription>
            The features shown below require a Shopify Plus subscription. Contact your Shopify account manager to upgrade.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="scripts">Pricing Scripts</TabsTrigger>
          <TabsTrigger value="flows">Flow Automation</TabsTrigger>
          <TabsTrigger value="multistore">Multi-Store</TabsTrigger>
          <TabsTrigger value="b2b">B2B Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scripts" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Shopify Scripts</CardTitle>
              <CardDescription>
                Create and deploy custom pricing logic that runs directly on Shopify's servers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border p-4 rounded-md">
                  <h3 className="font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Tiered Price Rules
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automatically apply tiered pricing based on quantity purchased
                  </p>
                  <div className="mt-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={!isShopifyConnected || isDeploying}
                      onClick={simulateScriptDeployment}
                    >
                      {isDeploying ? (
                        <>
                          <RefreshCcw className="h-3 w-3 mr-2 animate-spin" />
                          Deploying...
                        </>
                      ) : (
                        "Deploy Script"
                      )}
                    </Button>
                  </div>
                  
                  {isDeploying && (
                    <div className="mt-3">
                      <Progress value={deployProgress} className="h-1" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Deploying script to Shopify ({deployProgress}%)
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="border p-4 rounded-md">
                  <h3 className="font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Customer Segment Pricing
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Apply specific pricing rules based on customer tags or segments
                  </p>
                  <div className="mt-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={!isShopifyConnected || isDeploying}
                      onClick={simulateScriptDeployment}
                    >
                      Deploy Script
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border p-4 rounded-md bg-muted/20">
                <h3 className="font-medium mb-2">Script Variables</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Minimum order value:</span>
                    <Badge variant="outline">£50.00</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>VIP discount rate:</span>
                    <Badge variant="outline">15%</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Bundle threshold:</span>
                    <Badge variant="outline">3 items</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>New release protection:</span>
                    <Badge variant="outline">30 days</Badge>
                  </div>
                </div>
                <Button variant="link" size="sm" className="mt-2 px-0">
                  Edit script variables
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="flows" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Flow Automation</CardTitle>
              <CardDescription>
                Create automated workflows triggered by price changes or other events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Price Change Notification Flow
                    </h3>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    When product prices change by more than 5%, automatically notify customers who have purchased that product
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <Check className="h-3 w-3 mr-2 text-green-500" />
                      <span>Triggered 23 times in the last 30 days</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-3 w-3 mr-2 text-green-500" />
                      <span>1,450 customer notifications sent</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full sm:w-auto">
                  Create New Flow
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="multistore" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Store Management</CardTitle>
              <CardDescription>
                Manage pricing across multiple stores and markets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4 text-center">
                <p className="text-muted-foreground">
                  Connect multiple Shopify stores to sync pricing across your international markets.
                </p>
                <Button className="mt-4">
                  Connect Additional Store
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="b2b" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>B2B Pricing Management</CardTitle>
              <CardDescription>
                Manage wholesale pricing for B2B customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border p-4 rounded-md">
                  <h3 className="font-medium flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Wholesale Price Lists
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create and manage price lists for wholesale customers
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Manage Price Lists
                  </Button>
                </div>
                
                <div className="border p-4 rounded-md">
                  <h3 className="font-medium flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    B2B Company Management
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage B2B companies and their assigned price lists
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Manage Companies
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Shopify Plus API Integration</CardTitle>
          <CardDescription>
            Connect with advanced Shopify Plus APIs for enhanced functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">
              This Supplier Price Watch app utilizes the following Shopify Plus APIs and features:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-3 bg-green-50 text-green-800 rounded-md flex items-start">
                <Check className="h-4 w-4 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Bulk Operations API</p>
                  <p className="text-xs">For processing large product catalogs</p>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 text-green-800 rounded-md flex items-start">
                <Check className="h-4 w-4 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Scripts API</p>
                  <p className="text-xs">For custom pricing logic</p>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 text-green-800 rounded-md flex items-start">
                <Check className="h-4 w-4 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Flow API</p>
                  <p className="text-xs">For automated workflow triggers</p>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 text-green-800 rounded-md flex items-start">
                <Check className="h-4 w-4 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">B2B API</p>
                  <p className="text-xs">For wholesale customer management</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col sm:flex-row gap-2 w-full justify-end">
            <Button variant="outline" className="sm:w-auto w-full">
              <Settings className="h-4 w-4 mr-2" />
              Configure APIs
            </Button>
            <Button className="sm:w-auto w-full">
              View Documentation
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
