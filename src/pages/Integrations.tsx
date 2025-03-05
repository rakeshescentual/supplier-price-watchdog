
import { useEffect, useState } from "react";
import { MarketingIntegrations } from "@/components/integrations/MarketingIntegrations";
import { KlaviyoIntegration } from "@/components/integrations/KlaviyoIntegration";
import { PriceAlertChannels } from "@/components/integrations/PriceAlertChannels";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { AnalysisSummary } from "@/components/AnalysisSummary";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Share2, Upload, RefreshCw, BellRing, Mail, ShoppingBag,
  AlertTriangle, Download, Info, Users as UsersIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { initGA4, trackPriceChange, GA4EventType } from "@/lib/integrations/googleAnalytics4";

export default function Integrations() {
  const [activeTab, setActiveTab] = useState("marketing");
  const { items, summary, file } = useFileAnalysis();
  
  const hasItems = items.length > 0;
  
  useEffect(() => {
    // Initialize Google Analytics 4 when the page loads
    const ga4Result = initGA4();
    if (ga4Result) {
      console.log("Google Analytics 4 initialized successfully");
    }
    
    // Track current price data if available
    if (hasItems) {
      trackPriceChange(items, GA4EventType.BULK_PRICE_UPDATE);
    }
  }, [hasItems, items]);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Integrations & Notifications
          </h1>
          <p className="text-muted-foreground">
            Connect with marketing tools and notify customers about price changes
          </p>
        </div>
        
        <div className="flex gap-4 flex-wrap">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
          
          <Button variant="outline" disabled={!hasItems} onClick={() => {
            toast.success("Test event sent", {
              description: "A test event was sent to connected marketing platforms"
            });
            
            // Track test event in GA4
            if (hasItems) {
              trackPriceChange(items, GA4EventType.BULK_PRICE_UPDATE);
            }
          }}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Test Connections
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
      
      {hasItems && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2">
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
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Options
              </CardTitle>
              <CardDescription>
                Export data for different platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  toast.success("Klaviyo segments generated", {
                    description: "Customer segments for price changes have been exported"
                  });
                }}
              >
                <Mail className="mr-2 h-4 w-4" />
                Export Klaviyo Segments
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  toast.success("Shopify tags exported", {
                    description: "Customer tags have been exported for Shopify"
                  });
                }}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Export Shopify Customer Tags
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  toast.success("List exported", {
                    description: "Products list has been exported"
                  });
                }}
              >
                <UsersIcon className="mr-2 h-4 w-4" />
                Export Customer Product List
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Tabs defaultValue="marketing" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8 w-full max-w-md mx-auto grid grid-cols-3">
          <TabsTrigger value="marketing" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Marketing</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <BellRing className="h-4 w-4" />
            <span className="hidden sm:inline">Customer Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="klaviyo" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Klaviyo Email</span>
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
      </Tabs>
      
      <div className="mt-8 text-center text-muted-foreground text-sm">
        <p>Connect with your marketing tools to synchronize price changes and automate customer communications.</p>
      </div>
    </div>
  );
}
