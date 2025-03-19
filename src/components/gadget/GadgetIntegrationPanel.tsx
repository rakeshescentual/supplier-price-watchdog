
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Layers, 
  CheckCircle, 
  XCircle, 
  PackageOpen, 
  RefreshCw,
  AlarmCheck,
  FileSpreadsheet,
  Bot,
  Cpu,
  Upload,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { 
  initializeGadgetIntegration,
  validateGadgetConnection,
  getGadgetConfig,
  GADGET_VERSION
} from "@/utils/gadget";

export function GadgetIntegrationPanel() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [healthStatus, setHealthStatus] = useState<{
    healthy: boolean;
    details: {
      apiAccess: boolean;
      shopifyAccess: boolean;
      fileProcessing: boolean;
      bulkOperations: boolean;
      aiCapabilities: boolean;
    };
    lastChecked: Date | null;
  }>({
    healthy: false,
    details: {
      apiAccess: false,
      shopifyAccess: false,
      fileProcessing: false,
      bulkOperations: false,
      aiCapabilities: false
    },
    lastChecked: null
  });
  
  const [features, setFeatures] = useState({
    pdfProcessing: false,
    aiEnrichment: false,
    shopifySync: false,
    telemetry: false,
    bulkOperations: false
  });
  
  const [gadgetApiKey, setGadgetApiKey] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  
  // Simulate loading the integration status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // In a real implementation, this would check if Gadget is connected
        const config = getGadgetConfig();
        setIsConnected(!!config?.apiKey);
        
        if (config?.apiKey) {
          setGadgetApiKey("●".repeat(12) + config.apiKey.slice(-4));
          await checkHealth();
        }
      } catch (error) {
        console.error("Error checking Gadget connection:", error);
      }
    };
    
    checkConnection();
  }, []);
  
  const checkHealth = async () => {
    // In a real implementation, this would check the health of the Gadget connection
    // Simulating health check
    const successRate = Math.random();
    
    // Simulate some services being down
    const healthDetails = {
      apiAccess: successRate > 0.1,
      shopifyAccess: successRate > 0.2,
      fileProcessing: successRate > 0.3,
      bulkOperations: successRate > 0.15,
      aiCapabilities: successRate > 0.25
    };
    
    // Overall health is true only if all critical services are available
    const isHealthy = healthDetails.apiAccess && healthDetails.fileProcessing;
    
    setHealthStatus({
      healthy: isHealthy,
      details: healthDetails,
      lastChecked: new Date()
    });
    
    return isHealthy;
  };
  
  const connectToGadget = async () => {
    if (!gadgetApiKey) {
      toast.error("API Key Required", {
        description: "Please enter your Gadget.dev API key"
      });
      return;
    }
    
    setIsConnecting(true);
    
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would connect to Gadget.dev
      const result = await initializeGadgetIntegration();
      
      if (result.initialized && result.healthy) {
        setIsConnected(true);
        await checkHealth();
        
        toast.success("Connected to Gadget.dev", {
          description: "Integration is active and healthy"
        });
      } else {
        toast.error("Connection Failed", {
          description: "Could not establish connection to Gadget.dev"
        });
      }
    } catch (error) {
      console.error("Error connecting to Gadget:", error);
      
      toast.error("Connection Error", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  const disconnectGadget = async () => {
    // In a real implementation, this would disconnect from Gadget.dev
    setIsConnected(false);
    setHealthStatus({
      healthy: false,
      details: {
        apiAccess: false,
        shopifyAccess: false,
        fileProcessing: false,
        bulkOperations: false,
        aiCapabilities: false
      },
      lastChecked: null
    });
    
    toast.success("Disconnected from Gadget.dev", {
      description: "Integration has been disabled"
    });
  };
  
  const toggleFeature = (feature: keyof typeof features) => {
    if (!isConnected) {
      toast.error("Gadget Not Connected", {
        description: "Please connect to Gadget.dev first"
      });
      return;
    }
    
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
    
    toast.success(`Feature ${features[feature] ? "Disabled" : "Enabled"}`, {
      description: `${feature.charAt(0).toUpperCase() + feature.slice(1)} has been ${features[feature] ? "disabled" : "enabled"}`
    });
  };
  
  const refreshHealth = async () => {
    if (!isConnected) {
      toast.error("Gadget Not Connected", {
        description: "Please connect to Gadget.dev first"
      });
      return;
    }
    
    toast.info("Checking Health", {
      description: "Verifying Gadget.dev connection health..."
    });
    
    const isHealthy = await checkHealth();
    
    toast.success("Health Check Complete", {
      description: isHealthy 
        ? "All Gadget.dev services are operational" 
        : "Some Gadget.dev services are experiencing issues"
    });
  };
  
  const getServiceHealth = (serviceName: keyof typeof healthStatus.details) => {
    if (!isConnected || !healthStatus.lastChecked) return "unknown";
    return healthStatus.details[serviceName] ? "operational" : "issues";
  };
  
  const renderHealthIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "issues":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Gadget.dev Integration
            </CardTitle>
            <CardDescription>
              Enhanced data processing and Shopify synchronization
            </CardDescription>
          </div>
          
          <Badge variant={isConnected ? "success" : "outline"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
              <PackageOpen className="h-8 w-8 text-blue-500 mt-1" />
              <div>
                <h3 className="text-lg font-medium mb-1">Gadget.dev Integration</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Use Gadget.dev to enhance data processing, Shopify synchronization, and add AI-powered features.
                </p>
                <div className="flex gap-2 text-sm">
                  <Badge variant="outline">v{GADGET_VERSION}</Badge>
                  {isConnected && healthStatus.healthy && (
                    <Badge variant="success" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Healthy
                    </Badge>
                  )}
                  {isConnected && !healthStatus.healthy && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Issues Detected
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {isConnected && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Service Health</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-card border rounded-md">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-blue-500" />
                      <span>API Access</span>
                    </div>
                    <div className="flex items-center">
                      {renderHealthIcon(getServiceHealth("apiAccess"))}
                      <span className="ml-2 text-sm">
                        {healthStatus.details.apiAccess ? "Operational" : "Issues Detected"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-card border rounded-md">
                    <div className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-blue-500" />
                      <span>Shopify Access</span>
                    </div>
                    <div className="flex items-center">
                      {renderHealthIcon(getServiceHealth("shopifyAccess"))}
                      <span className="ml-2 text-sm">
                        {healthStatus.details.shopifyAccess ? "Operational" : "Issues Detected"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-card border rounded-md">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5 text-blue-500" />
                      <span>File Processing</span>
                    </div>
                    <div className="flex items-center">
                      {renderHealthIcon(getServiceHealth("fileProcessing"))}
                      <span className="ml-2 text-sm">
                        {healthStatus.details.fileProcessing ? "Operational" : "Issues Detected"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-card border rounded-md">
                    <div className="flex items-center gap-2">
                      <AlarmCheck className="h-5 w-5 text-blue-500" />
                      <span>Bulk Operations</span>
                    </div>
                    <div className="flex items-center">
                      {renderHealthIcon(getServiceHealth("bulkOperations"))}
                      <span className="ml-2 text-sm">
                        {healthStatus.details.bulkOperations ? "Operational" : "Issues Detected"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-card border rounded-md">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-blue-500" />
                      <span>AI Capabilities</span>
                    </div>
                    <div className="flex items-center">
                      {renderHealthIcon(getServiceHealth("aiCapabilities"))}
                      <span className="ml-2 text-sm">
                        {healthStatus.details.aiCapabilities ? "Operational" : "Issues Detected"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {healthStatus.lastChecked && (
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <AlarmCheck className="h-4 w-4" />
                      Last checked: {healthStatus.lastChecked.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {!isConnected && (
              <div className="p-4 border rounded-md bg-amber-50">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3" />
                  <div>
                    <h4 className="font-medium text-amber-800">Not Connected</h4>
                    <p className="text-sm text-amber-700 mb-4">
                      Connect to Gadget.dev to enable enhanced features for your Escentual.com integration.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="api-key">Gadget.dev API Key</Label>
                        <Input
                          id="api-key"
                          type="password"
                          placeholder="Enter your Gadget.dev API key"
                          value={gadgetApiKey}
                          onChange={(e) => setGadgetApiKey(e.target.value)}
                        />
                      </div>
                      
                      <Button
                        onClick={connectToGadget}
                        disabled={isConnecting || !gadgetApiKey}
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
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="features" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Enhanced Features</h3>
              <p className="text-sm text-muted-foreground">
                Enable or disable Gadget.dev enhanced features for your application.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h4 className="font-medium mb-1">PDF Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      Extract data from supplier PDF documents automatically
                    </p>
                  </div>
                  <Switch
                    checked={features.pdfProcessing}
                    onCheckedChange={() => toggleFeature("pdfProcessing")}
                    disabled={!isConnected}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h4 className="font-medium mb-1">AI Enrichment</h4>
                    <p className="text-sm text-muted-foreground">
                      Add AI-powered insights and recommendations to your price data
                    </p>
                  </div>
                  <Switch
                    checked={features.aiEnrichment}
                    onCheckedChange={() => toggleFeature("aiEnrichment")}
                    disabled={!isConnected}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h4 className="font-medium mb-1">Shopify Synchronization</h4>
                    <p className="text-sm text-muted-foreground">
                      Enhanced Shopify data synchronization with rate limiting and batching
                    </p>
                  </div>
                  <Switch
                    checked={features.shopifySync}
                    onCheckedChange={() => toggleFeature("shopifySync")}
                    disabled={!isConnected}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h4 className="font-medium mb-1">Usage Telemetry</h4>
                    <p className="text-sm text-muted-foreground">
                      Collect anonymous usage data to improve application performance
                    </p>
                  </div>
                  <Switch
                    checked={features.telemetry}
                    onCheckedChange={() => toggleFeature("telemetry")}
                    disabled={!isConnected}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h4 className="font-medium mb-1">Bulk Operations</h4>
                    <p className="text-sm text-muted-foreground">
                      Process large datasets with optimized performance
                    </p>
                  </div>
                  <Switch
                    checked={features.bulkOperations}
                    onCheckedChange={() => toggleFeature("bulkOperations")}
                    disabled={!isConnected}
                  />
                </div>
              </div>
            </div>
            
            {!isConnected && (
              <div className="p-4 border rounded-md bg-amber-50">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3" />
                  <div>
                    <h4 className="font-medium text-amber-800">Not Connected</h4>
                    <p className="text-sm text-amber-700">
                      Connect to Gadget.dev to enable and configure these features.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="configuration" className="space-y-6">
            {isConnected ? (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">API Configuration</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-key-masked">Gadget.dev API Key</Label>
                    <div className="flex">
                      <Input
                        id="api-key-masked"
                        value={gadgetApiKey}
                        className="rounded-r-none"
                        readOnly
                      />
                      <Button variant="secondary" className="rounded-l-none">
                        Regenerate
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>API Rate Limits</Label>
                    <div className="p-3 border rounded-md space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Used: 287</span>
                        <span>Limit: 1000</span>
                      </div>
                      <Progress value={28.7} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">Shopify Integration</h3>
                  
                  <div className="space-y-2">
                    <Label>Sync Frequency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Every 4 hours" />
                      </SelectTrigger>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Batch Size</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="50 items per batch" />
                      </SelectTrigger>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">File Processing</h3>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h4 className="font-medium mb-1">PDF OCR Enhancement</h4>
                      <p className="text-sm text-muted-foreground">
                        Use advanced OCR for better extraction from poor quality PDFs
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h4 className="font-medium mb-1">Excel Formula Evaluation</h4>
                      <p className="text-sm text-muted-foreground">
                        Process and evaluate Excel formulas during import
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 border rounded-md bg-amber-50">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3" />
                  <div>
                    <h4 className="font-medium text-amber-800">Not Connected</h4>
                    <p className="text-sm text-amber-700">
                      Connect to Gadget.dev to configure integration settings.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {isConnected ? (
          <>
            <Button 
              variant="outline" 
              onClick={refreshHealth}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={disconnectGadget}
            >
              Disconnect
            </Button>
          </>
        ) : (
          <Button 
            className="w-full"
            onClick={() => setSelectedTab("overview")}
          >
            <Upload className="h-4 w-4 mr-2" />
            Set Up Gadget Integration
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
