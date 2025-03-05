
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { CheckCircle, Cog, Save, X, AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GadgetConfig } from '@/types/price';

export const GadgetConfigForm = () => {
  const [config, setConfig] = useState<GadgetConfig>({
    apiKey: '',
    appId: '',
    environment: 'development',
    featureFlags: {
      enableAdvancedAnalytics: false,
      enablePdfProcessing: false,
      enableBackgroundJobs: false,
      enableShopifySync: true,
    }
  });
  const [activeTab, setActiveTab] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'success' | 'error'>('none');

  useEffect(() => {
    // Check if Gadget config exists in localStorage
    const storedConfig = localStorage.getItem('gadgetConfig');
    if (storedConfig) {
      try {
        const parsedConfig = JSON.parse(storedConfig);
        setConfig(parsedConfig);
        setIsConfigured(true);
      } catch (error) {
        console.error("Error parsing stored Gadget config:", error);
      }
    }
  }, []);

  const handleChange = (field: keyof GadgetConfig, value: string | boolean) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureFlagChange = (flag: string, value: boolean) => {
    setConfig(prev => ({
      ...prev,
      featureFlags: {
        ...prev.featureFlags,
        [flag]: value
      }
    }));
  };

  const testConnection = async () => {
    if (!config.apiKey || !config.appId) {
      toast.error("Missing configuration", {
        description: "Please enter your Gadget API key and App ID."
      });
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('none');

    try {
      // Simulate testing the connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, this would verify connectivity to Gadget.dev
      // const client = createClient({ apiKey: config.apiKey });
      // await client.verify();
      
      setConnectionStatus('success');
      toast.success("Connection successful", {
        description: "Successfully connected to Gadget.dev"
      });
    } catch (error) {
      setConnectionStatus('error');
      toast.error("Connection failed", {
        description: "Could not connect to Gadget.dev. Please check your API key and App ID."
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = () => {
    // Validate config
    if (!config.apiKey.trim()) {
      toast.error("API Key Required", {
        description: "Please enter your Gadget API key."
      });
      return;
    }

    if (!config.appId.trim()) {
      toast.error("App ID Required", {
        description: "Please enter your Gadget App ID."
      });
      return;
    }

    setIsSaving(true);

    try {
      // Save to localStorage
      localStorage.setItem('gadgetConfig', JSON.stringify(config));
      
      setIsConfigured(true);
      
      toast.success("Configuration Saved", {
        description: "Your Gadget configuration has been saved. Please reload the page to apply changes."
      });
      
      // Reload page to apply new configuration
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error saving Gadget config:", error);
      toast.error("Save Error", {
        description: "Could not save your configuration."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('gadgetConfig');
    setConfig({
      apiKey: '',
      appId: '',
      environment: 'development',
      featureFlags: {
        enableAdvancedAnalytics: false,
        enablePdfProcessing: false,
        enableBackgroundJobs: false,
        enableShopifySync: true,
      }
    });
    setIsConfigured(false);
    
    toast.success("Configuration Cleared", {
      description: "Gadget configuration has been removed. Please reload the page to apply changes."
    });
    
    // Reload page to apply changes
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Cog className="h-5 w-5" />
            Gadget.dev Configuration
          </CardTitle>
          
          {isConfigured && (
            <Badge variant="outline" className="ml-2">
              {config.environment}
            </Badge>
          )}
        </div>
        <CardDescription>
          Configure your Gadget.dev integration for enhanced features with Shopify Plus and Klaviyo
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isConfigured && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm flex items-start gap-2">
            <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Gadget.dev is configured</p>
              <p className="text-sm">
                App ID: {config.appId} 
                <br />
                Environment: {config.environment}
              </p>
            </div>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="basic">Basic Configuration</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Features</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="gadget-app-id">App ID</Label>
              <Input
                id="gadget-app-id"
                value={config.appId}
                onChange={(e) => handleChange('appId', e.target.value)}
                placeholder="e.g., supplier-price-watch"
              />
              <p className="text-xs text-muted-foreground">
                The ID of your Gadget application
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gadget-api-key">API Key</Label>
              <Input
                id="gadget-api-key"
                type="password"
                value={config.apiKey}
                onChange={(e) => handleChange('apiKey', e.target.value)}
                placeholder="Your Gadget API key"
              />
              <p className="text-xs text-muted-foreground">
                The API key used for authentication with Gadget
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gadget-environment">Environment</Label>
              <Select
                value={config.environment}
                onValueChange={(value) => handleChange('environment', value as 'development' | 'production')}
              >
                <SelectTrigger id="gadget-environment">
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The Gadget environment to connect to
              </p>
            </div>
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={testConnection}
                disabled={isTestingConnection || !config.apiKey || !config.appId}
                className="w-full"
              >
                {isTestingConnection ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin inline-block rounded-full border-2 border-current border-t-transparent"></span>
                    Testing Connection...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>
              
              {connectionStatus === 'success' && (
                <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Connection successful
                </div>
              )}
              
              {connectionStatus === 'error' && (
                <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  Connection failed
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 mt-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Advanced Features</AlertTitle>
              <AlertDescription>
                Enable or disable specific Gadget.dev capabilities
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Shopify Plus Integration</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable enhanced Shopify Plus features via Gadget
                  </p>
                </div>
                <Switch
                  checked={config.featureFlags?.enableShopifySync || false}
                  onCheckedChange={(checked) => handleFeatureFlagChange('enableShopifySync', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">PDF Processing</Label>
                  <p className="text-sm text-muted-foreground">
                    Process supplier PDF price lists with Gadget
                  </p>
                </div>
                <Switch
                  checked={config.featureFlags?.enablePdfProcessing || false}
                  onCheckedChange={(checked) => handleFeatureFlagChange('enablePdfProcessing', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Advanced Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable AI-powered market analysis via Gadget
                  </p>
                </div>
                <Switch
                  checked={config.featureFlags?.enableAdvancedAnalytics || false}
                  onCheckedChange={(checked) => handleFeatureFlagChange('enableAdvancedAnalytics', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Background Jobs</Label>
                  <p className="text-sm text-muted-foreground">
                    Process large datasets asynchronously
                  </p>
                </div>
                <Switch
                  checked={config.featureFlags?.enableBackgroundJobs || false}
                  onCheckedChange={(checked) => handleFeatureFlagChange('enableBackgroundJobs', checked)}
                />
              </div>
            </div>
            
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="shopify-plus">
                <AccordionTrigger>Shopify Plus Features</AccordionTrigger>
                <AccordionContent className="space-y-3 px-2">
                  <Alert variant="outline" className="mb-2">
                    <AlertDescription className="text-xs">
                      These features require Shopify Plus subscription and appropriate Gadget app permissions
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Scripts</Badge>
                    <p className="text-sm">Manage custom pricing rules via Gadget</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Flows</Badge>
                    <p className="text-sm">Automate price change workflows</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Multi-location</Badge>
                    <p className="text-sm">Sync inventory across locations</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">B2B</Badge>
                    <p className="text-sm">Manage wholesale price lists</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="klaviyo">
                <AccordionTrigger>Klaviyo Integration</AccordionTrigger>
                <AccordionContent className="space-y-3 px-2">
                  <Alert variant="outline" className="mb-2">
                    <AlertDescription className="text-xs">
                      Gadget.dev enhances Klaviyo integration for better marketing automation
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Segments</Badge>
                    <p className="text-sm">Advanced customer segmentation for price changes</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Flows</Badge>
                    <p className="text-sm">Automated email sequences for price updates</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Events</Badge>
                    <p className="text-sm">Track customer interactions with price notifications</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex gap-2 justify-between">
        {isConfigured && (
          <Button variant="outline" onClick={handleClear}>
            <X className="mr-2 h-4 w-4" />
            Clear Configuration
          </Button>
        )}
        
        <Button
          className="ml-auto"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin inline-block rounded-full border-2 border-current border-t-transparent"></span>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
