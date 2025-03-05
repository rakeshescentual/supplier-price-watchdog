
import { useState } from "react";
import { MarketingIntegrations } from "@/components/integrations/MarketingIntegrations";
import { PriceAlertChannels } from "@/components/integrations/PriceAlertChannels";
import { GoogleCalendarIntegration } from "@/components/calendar/GoogleCalendarIntegration";
import { GmailIntegration } from "@/components/gmail/GmailIntegration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { AlertCircle, ArrowUpRight, FileUp, RefreshCw, Share2 } from "lucide-react";
import { useShopify } from "@/contexts/ShopifyContext";
import { Separator } from "@/components/ui/separator";

const Integrations = () => {
  const { items, file, isProcessing, handleFileAccepted } = useFileAnalysis();
  const { isShopifyConnected } = useShopify();
  const [activeTab, setActiveTab] = useState("marketing");
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">
            Connect and manage third-party services for your price management
          </p>
        </div>
        
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          {isShopifyConnected && (
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Shopify Connected
            </div>
          )}
          
          <Button variant="outline" size="sm" asChild>
            <a 
              href="https://github.com/rakeshescentual/supplier-price-watchdog"
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <Share2 className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </Button>
        </div>
      </div>
      
      {isProcessing && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Processing file...</span>
          </div>
        </div>
      )}
      
      {!file && !isProcessing && (
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5" />
              Upload Price Data
            </CardTitle>
            <CardDescription>
              Upload a price list file to use integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-4 text-sm bg-amber-50 text-amber-800 rounded-md">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>You need to upload a price list first to use integrations.</p>
            </div>
            
            <div 
              className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => document.getElementById('file-upload-input')?.click()}
            >
              <input 
                id="file-upload-input"
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileAccepted(file);
                  }
                }}
                accept=".xlsx,.xls,.csv,.pdf"
              />
              <FileUp className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium">Click to upload a price list</p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports Excel, CSV, and PDF formats
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="text-xs"
              >
                <a 
                  href="/dashboard"
                  className="flex items-center gap-1"
                >
                  <ArrowUpRight className="h-3 w-3" />
                  <span>Go to Dashboard</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {file && items.length > 0 && (
        <>
          <div className="flex flex-col sm:flex-row items-center gap-2 bg-muted p-3 rounded-md mb-6">
            <div className="p-2 rounded-full bg-primary/10">
              <FileUp className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">{items.length} items analyzed</p>
            </div>
          </div>
          
          <Tabs defaultValue="marketing" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="marketing">Google Marketing</TabsTrigger>
              <TabsTrigger value="workspace">Google Workspace</TabsTrigger>
              <TabsTrigger value="notifications">Customer Alerts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="marketing">
              <div className="md:grid md:grid-cols-5 gap-6">
                <div className="md:col-span-5 mb-4 md:mb-0">
                  <h2 className="text-xl font-semibold mb-2">Google Marketing Platform</h2>
                  <p className="text-muted-foreground mb-6">
                    Connect with Google's marketing and e-commerce tools to ensure your product and price data stays in sync.
                  </p>
                  
                  <MarketingIntegrations />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="workspace">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Google Workspace</h2>
                <p className="text-muted-foreground">
                  Use Gmail and Google Calendar to coordinate price changes with your team and stakeholders.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GmailIntegration />
                <GoogleCalendarIntegration />
              </div>
            </TabsContent>
            
            <TabsContent value="notifications">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Customer Notifications</h2>
                <p className="text-muted-foreground">
                  Configure how customers are notified about upcoming price changes across different channels.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PriceAlertChannels />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Audience Segmentation
                    </CardTitle>
                    <CardDescription>
                      Target specific customer segments with price change notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-6 flex flex-col items-center justify-center text-center">
                      <LockIcon className="h-10 w-10 mb-2 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-1">Premium Feature</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Advanced audience segmentation is available with Shopify Plus
                      </p>
                      <Button variant="outline" size="sm">
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          <Separator className="my-8" />
          
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Need More Integrations?</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              We're constantly adding new integrations to help you manage your pricing strategy effectively.
            </p>
            <Button variant="outline" size="sm">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Request Integration
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Integrations;

// Add missing imports after creating the component
import { LockIcon } from "lucide-react";
