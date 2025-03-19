
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Zap, Settings, Database, AlertCircle, Check, UploadCloud, RefreshCw } from "lucide-react";

// Gadget integration component
export function GadgetIntegrationPanel() {
  const [apiKey, setApiKey] = useState<string>("");
  const [appId, setAppId] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [environment, setEnvironment] = useState<string>("development");
  const [activeTab, setActiveTab] = useState<string>("config");
  const [enableAnalytics, setEnableAnalytics] = useState<boolean>(true);
  const [enablePdfProcessing, setEnablePdfProcessing] = useState<boolean>(true);
  const [enableBackgroundJobs, setEnableBackgroundJobs] = useState<boolean>(false);
  const [enableShopifySync, setEnableShopifySync] = useState<boolean>(true);
  
  // Simulated feature toggle data
  const [featureFlags, setFeatureFlags] = useState({
    enableAdvancedAnalytics: true,
    enablePdfProcessing: true,
    enableBackgroundJobs: false,
    enableShopifySync: true
  });
  
  // Simulated config load
  useEffect(() => {
    const timer = setTimeout(() => {
      setApiKey("gsk_prod_abcdef123456789");
      setAppId("escentual-price-manager");
      setIsConnected(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleConnect = () => {
    if (!apiKey || !appId) {
      toast.error("Connection failed", {
        description: "API Key and App ID are required to connect to Gadget.dev"
      });
      return;
    }
    
    setIsConnecting(true);
    
    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      
      toast.success("Connected to Gadget.dev", {
        description: "Successfully connected to the Gadget.dev API"
      });
    }, 1500);
  };
  
  const handleDisconnect = () => {
    setIsConnected(false);
    
    toast.success("Disconnected from Gadget.dev", {
      description: "The connection to Gadget.dev has been terminated"
    });
  };
  
  const handleSaveFeatureFlags = () => {
    // Update feature flags
    setFeatureFlags({
      enableAdvancedAnalytics: enableAnalytics,
      enablePdfProcessing: enablePdfProcessing,
      enableBackgroundJobs: enableBackgroundJobs,
      enableShopifySync: enableShopifySync
    });
    
    toast.success("Feature flags updated", {
      description: "Your Gadget.dev feature configuration has been saved"
    });
  };
  
  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center">
              <Zap className="h-5 w-5 mr-2 text-purple-500" />
              Gadget.dev Integration
            </CardTitle>
            <CardDescription>
              Connect to Gadget.dev for enhanced data processing and integrations
            </CardDescription>
          </div>
          
          {isConnected && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-green-600 flex items-center">
                <Check className="h-4 w-4 mr-1" />
                Connected
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="data" disabled={!isConnected}>Data Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="config">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter Gadget.dev API key"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    disabled={isConnected}
                  />
                  <p className="text-xs text-muted-foreground">
                    You can find your API key in your Gadget.dev dashboard
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="app-id">App ID</Label>
                  <Input
                    id="app-id"
                    placeholder="Enter Gadget.dev App ID"
                    value={appId}
                    onChange={e => setAppId(e.target.value)}
                    disabled={isConnected}
                  />
                  <p className="text-xs text-muted-foreground">
                    The unique identifier for your Gadget application
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="environment">Environment</Label>
                <Select 
                  value={environment} 
                  onValueChange={setEnvironment}
                  disabled={isConnected}
                >
                  <SelectTrigger id="environment">
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose which Gadget.dev environment to connect to
                </p>
              </div>
              
              {!isConnected && (
                <Button 
                  className="mt-4 w-full" 
                  onClick={handleConnect}
                  disabled={isConnecting || !apiKey || !appId}
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect to Gadget.dev"
                  )}
                </Button>
              )}
              
              {isConnected && (
                <div className="rounded-md bg-green-50 p-4 mt-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Gadget.dev is connected
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>
                          Your application is successfully connected to the Gadget.dev API.
                          You can now use enhanced data processing and integrations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="features">
            <div className="space-y-6">
              <div className="rounded-md bg-amber-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">
                      Feature Configuration
                    </h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>
                        Enable or disable Gadget.dev features for your application.
                        Changes will take effect immediately after saving.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Advanced Analytics</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable AI-powered analytics and reporting
                    </p>
                  </div>
                  <Switch
                    checked={enableAnalytics}
                    onCheckedChange={setEnableAnalytics}
                    disabled={!isConnected}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>PDF Processing</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable OCR and content extraction from PDF files
                    </p>
                  </div>
                  <Switch
                    checked={enablePdfProcessing}
                    onCheckedChange={setEnablePdfProcessing}
                    disabled={!isConnected}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Background Jobs</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable running scheduled tasks in the background
                    </p>
                  </div>
                  <Switch
                    checked={enableBackgroundJobs}
                    onCheckedChange={setEnableBackgroundJobs}
                    disabled={!isConnected}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Shopify Sync</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable automatic synchronization with Shopify
                    </p>
                  </div>
                  <Switch
                    checked={enableShopifySync}
                    onCheckedChange={setEnableShopifySync}
                    disabled={!isConnected}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleSaveFeatureFlags}
                disabled={!isConnected}
                className="w-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                Save Feature Configuration
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="data">
            <div className="space-y-6">
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Database className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Data Management
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Manage your data stored in Gadget.dev. You can import, export,
                        or synchronize data with your other systems.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Import Data</CardTitle>
                    <CardDescription>
                      Import data from external sources
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                      <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop files or click to browse
                      </p>
                      <Button size="sm" variant="secondary">
                        Select Files
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" disabled>
                      Import to Gadget.dev
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Export Data</CardTitle>
                    <CardDescription>
                      Export data from Gadget.dev
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="export-type">Export Type</Label>
                      <Select defaultValue="all">
                        <SelectTrigger id="export-type">
                          <SelectValue placeholder="Select export type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Data</SelectItem>
                          <SelectItem value="products">Products Only</SelectItem>
                          <SelectItem value="prices">Prices Only</SelectItem>
                          <SelectItem value="analytics">Analytics Data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="export-format">Export Format</Label>
                      <Select defaultValue="csv">
                        <SelectTrigger id="export-format">
                          <SelectValue placeholder="Select export format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="xlsx">Excel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      Export from Gadget.dev
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="text-center">
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Synchronize All Data
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Powered by Gadget.dev API v3
        </div>
        <Button variant="ghost" size="sm">
          View Documentation
        </Button>
      </CardFooter>
    </Card>
  );
}
