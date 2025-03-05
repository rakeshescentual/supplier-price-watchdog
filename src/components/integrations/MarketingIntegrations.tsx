
import { useState, useEffect } from "react";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  AlertCircle, CheckCircle, BarChart4, Globe, ShoppingBag,
  RefreshCw, Zap, Info, Share2, ArrowUpRight 
} from "lucide-react";

import { 
  initGA4, 
  trackPriceChange, 
  GA4EventType 
} from "@/lib/integrations/googleAnalytics4";

import {
  initGSC,
  submitProductUrlsForIndexing
} from "@/lib/integrations/googleSearchConsole";

import {
  initMerchantCenter,
  updateProductPrices
} from "@/lib/integrations/googleMerchantCenter";

export const MarketingIntegrations = () => {
  const { items, summary } = useFileAnalysis();
  const [activeTab, setActiveTab] = useState("analytics");
  
  // Integration states
  const [isGA4Initialized, setIsGA4Initialized] = useState(false);
  const [isGSCInitialized, setIsGSCInitialized] = useState(false);
  const [isMCInitialized, setIsMCInitialized] = useState(false);
  
  // Form states
  const [baseProductUrl, setBaseProductUrl] = useState("https://www.escentual.com/products/");
  const [merchantId, setMerchantId] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Initialize integrations on component mount
  useEffect(() => {
    // Initialize Google Analytics 4
    const ga4Result = initGA4();
    setIsGA4Initialized(ga4Result);
    
    // Initialize other integrations only if there are items to work with
    if (items.length > 0) {
      // Initialize Google Search Console with base URL
      const gscResult = initGSC({ siteUrl: baseProductUrl });
      setIsGSCInitialized(gscResult);
      
      // Initialize Google Merchant Center
      if (merchantId) {
        const mcResult = initMerchantCenter({ merchantId });
        setIsMCInitialized(mcResult);
      }
    }
  }, [items.length, baseProductUrl, merchantId]);
  
  // Generate product URLs for the current items
  const getProductUrls = () => {
    return items.map(item => `${baseProductUrl}${item.sku}`);
  };
  
  // Handle tracking price changes in GA4
  const handleTrackPriceChanges = async () => {
    if (!isGA4Initialized) {
      toast.error("Google Analytics not connected", {
        description: "Please connect to Google Analytics 4 first.",
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const success = trackPriceChange(items, GA4EventType.BULK_PRICE_UPDATE);
      
      if (success) {
        toast.success("Events sent to GA4", {
          description: `Price changes for ${items.length} products were tracked in Google Analytics 4.`,
        });
      } else {
        toast.error("Failed to track events", {
          description: "There was an error sending events to Google Analytics 4.",
        });
      }
    } catch (error) {
      console.error("Error tracking price changes:", error);
      toast.error("Tracking failed", {
        description: "An unexpected error occurred while tracking price changes.",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle submitting product URLs to Google Search Console
  const handleSubmitToSearchConsole = async () => {
    if (!isGSCInitialized) {
      toast.error("Search Console not connected", {
        description: "Please connect to Google Search Console first.",
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // Get product URLs
      const productUrls = getProductUrls();
      
      // Only submit URLs for products with price changes
      const changedProductUrls = productUrls.filter((_, index) => 
        items[index].status === 'increased' || items[index].status === 'decreased'
      );
      
      if (changedProductUrls.length === 0) {
        toast.info("No URLs to submit", {
          description: "There are no products with price changes to submit for indexing.",
        });
        return;
      }
      
      // Submit URLs for indexing
      const result = await submitProductUrlsForIndexing(changedProductUrls);
      
      if (result.success > 0) {
        toast.success("URLs submitted for indexing", {
          description: `Successfully submitted ${result.success} product URLs to Google Search Console.`,
        });
      }
    } catch (error) {
      console.error("Error submitting to Search Console:", error);
      toast.error("Submission failed", {
        description: "An unexpected error occurred while submitting URLs to Google Search Console.",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle updating product prices in Google Merchant Center
  const handleUpdateMerchantCenter = async () => {
    if (!isMCInitialized) {
      toast.error("Merchant Center not connected", {
        description: "Please connect to Google Merchant Center first.",
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const result = await updateProductPrices(items);
      
      if (result.success && result.updatedCount > 0) {
        toast.success("Prices updated in Merchant Center", {
          description: `Successfully updated ${result.updatedCount} product prices in Google Merchant Center.`,
        });
      } else if (result.updatedCount === 0) {
        toast.info("No prices to update", {
          description: "There are no price changes to update in Google Merchant Center.",
        });
      }
    } catch (error) {
      console.error("Error updating Merchant Center:", error);
      toast.error("Update failed", {
        description: "An unexpected error occurred while updating prices in Google Merchant Center.",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Connect to Google Merchant Center
  const handleConnectMerchantCenter = () => {
    if (!merchantId.trim()) {
      toast.error("Merchant ID required", {
        description: "Please enter your Google Merchant Center ID.",
      });
      return;
    }
    
    const result = initMerchantCenter({ merchantId });
    setIsMCInitialized(result);
    
    if (result) {
      toast.success("Merchant Center connected", {
        description: "Successfully connected to Google Merchant Center.",
      });
    } else {
      toast.error("Connection failed", {
        description: "Failed to connect to Google Merchant Center. Please check your Merchant ID.",
      });
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Marketing Integrations
        </CardTitle>
        <CardDescription>
          Sync price changes with Google marketing and e-commerce tools
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="analytics" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="analytics" className="flex items-center justify-center gap-1">
              <BarChart4 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center justify-center gap-1">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Search Console</span>
            </TabsTrigger>
            <TabsTrigger value="merchant" className="flex items-center justify-center gap-1">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Merchant Center</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Google Analytics 4 */}
          <TabsContent value="analytics">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <BarChart4 className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Google Analytics 4</h3>
                    <p className="text-sm text-muted-foreground">Track price change events</p>
                  </div>
                </div>
                <Badge variant={isGA4Initialized ? "success" : "outline"} className="ml-auto">
                  {isGA4Initialized ? "Connected" : "Not Connected"}
                </Badge>
              </div>

              {isGA4Initialized ? (
                <div className="space-y-4">
                  <Alert variant="success" className="bg-blue-50">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Google Analytics 4 Connected</AlertTitle>
                    <AlertDescription>
                      You can now track price change events in Google Analytics 4.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Available Events:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        price_increase
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        price_decrease
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        bulk_price_update
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        price_sync
                      </li>
                    </ul>
                  </div>
                  
                  <Button 
                    variant="default" 
                    onClick={handleTrackPriceChanges} 
                    disabled={isUpdating || items.length === 0}
                    className="w-full"
                  >
                    {isUpdating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending Events...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Track Price Changes in GA4
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Google Analytics 4 Not Connected</AlertTitle>
                    <AlertDescription>
                      Connect to Google Analytics 4 to track price change events.
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const result = initGA4();
                      setIsGA4Initialized(result);
                      
                      if (result) {
                        toast.success("GA4 Connected", {
                          description: "Successfully connected to Google Analytics 4.",
                        });
                      }
                    }}
                    className="w-full"
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Connect to Google Analytics 4
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Google Search Console */}
          <TabsContent value="search">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Google Search Console</h3>
                    <p className="text-sm text-muted-foreground">Submit URLs for re-indexing</p>
                  </div>
                </div>
                <Badge variant={isGSCInitialized ? "success" : "outline"} className="ml-auto">
                  {isGSCInitialized ? "Connected" : "Not Connected"}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="baseUrl">Product URL Base Path</Label>
                  <Input
                    id="baseUrl"
                    value={baseProductUrl}
                    onChange={(e) => setBaseProductUrl(e.target.value)}
                    placeholder="https://www.example.com/products/"
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll append the SKU to this base URL to create the full product URL
                  </p>
                </div>
                
                {isGSCInitialized ? (
                  <div className="space-y-4">
                    <Alert variant="success" className="bg-green-50">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Search Console Connected</AlertTitle>
                      <AlertDescription>
                        You can now submit product URLs for re-indexing after price changes.
                      </AlertDescription>
                    </Alert>
                    
                    {items.length > 0 && (
                      <div className="p-3 border rounded-md">
                        <h4 className="text-sm font-medium mb-2">Example URL Preview:</h4>
                        <p className="text-sm truncate text-muted-foreground">
                          {baseProductUrl}{items[0].sku}
                        </p>
                      </div>
                    )}
                    
                    <Button 
                      variant="default" 
                      onClick={handleSubmitToSearchConsole} 
                      disabled={isUpdating || items.length === 0}
                      className="w-full"
                    >
                      {isUpdating ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Submitting URLs...
                        </>
                      ) : (
                        <>
                          <Globe className="mr-2 h-4 w-4" />
                          Submit Changed Products for Indexing
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Search Console Not Connected</AlertTitle>
                      <AlertDescription>
                        Connect to Google Search Console to submit product URLs for re-indexing.
                      </AlertDescription>
                    </Alert>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const result = initGSC({ siteUrl: baseProductUrl });
                        setIsGSCInitialized(result);
                        
                        if (result) {
                          toast.success("Search Console Connected", {
                            description: "Successfully connected to Google Search Console.",
                          });
                        }
                      }}
                      className="w-full"
                    >
                      <ArrowUpRight className="mr-2 h-4 w-4" />
                      Connect to Google Search Console
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Google Merchant Center */}
          <TabsContent value="merchant">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Google Merchant Center</h3>
                    <p className="text-sm text-muted-foreground">Update product prices in your feed</p>
                  </div>
                </div>
                <Badge variant={isMCInitialized ? "success" : "outline"} className="ml-auto">
                  {isMCInitialized ? "Connected" : "Not Connected"}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="merchantId">Merchant ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="merchantId"
                      value={merchantId}
                      onChange={(e) => setMerchantId(e.target.value)}
                      placeholder="123456789"
                      className="flex-1"
                    />
                    {!isMCInitialized && (
                      <Button 
                        variant="outline" 
                        onClick={handleConnectMerchantCenter}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your Google Merchant Center account ID
                  </p>
                </div>
                
                {isMCInitialized ? (
                  <div className="space-y-4">
                    <Alert variant="success" className="bg-green-50">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Merchant Center Connected</AlertTitle>
                      <AlertDescription>
                        You can now update product prices in Google Merchant Center.
                      </AlertDescription>
                    </Alert>
                    
                    {summary && (
                      <div className="p-3 border rounded-md bg-muted/30">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Price increases:</span>
                            <span className="font-medium text-red-600">{summary.increasedItems}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Price decreases:</span>
                            <span className="font-medium text-green-600">{summary.decreasedItems}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Unchanged prices:</span>
                            <span className="font-medium">{summary.unchangedItems}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      variant="default" 
                      onClick={handleUpdateMerchantCenter} 
                      disabled={isUpdating || items.length === 0}
                      className="w-full"
                    >
                      {isUpdating ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Updating Prices...
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Update Prices in Merchant Center
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Merchant Center Not Connected</AlertTitle>
                    <AlertDescription>
                      Enter your Merchant ID and connect to update product prices in Google Merchant Center.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2 justify-between">
        <div className="text-sm text-muted-foreground">
          {items.length > 0 ? (
            <span>{items.length} products available for integration</span>
          ) : (
            <span>Upload a price list to use integrations</span>
          )}
        </div>
        
        <Button 
          variant="link" 
          size="sm" 
          className="h-auto p-0"
          asChild
        >
          <a 
            href="https://developers.google.com/analytics/devguides/collection/ga4/ecommerce"
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1"
          >
            <span>Google Documentation</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
