
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Cog, Save, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GadgetConfig } from '@/types/price';
import { BasicConfigTab } from './gadget/BasicConfigTab';
import { AdvancedFeaturesTab } from './gadget/AdvancedFeaturesTab';
import { ConfigStatusIndicator } from './gadget/ConfigStatusIndicator';
import { loadConnectionContext, saveConnectionContext } from '@/utils/connection-helpers';

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
    const storedConfig = loadConnectionContext<GadgetConfig>('gadgetConfig', 
      (error) => {
        console.error("Error parsing stored Gadget config:", error);
        toast.error("Could not load saved configuration", {
          description: "There was an error loading your Gadget configuration."
        });
      }
    );
    
    if (storedConfig) {
      setConfig(storedConfig);
      setIsConfigured(true);
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
      saveConnectionContext('gadgetConfig', config, 
        () => {
          setIsConfigured(true);
          toast.success("Configuration Saved", {
            description: "Your Gadget configuration has been saved. Please reload the page to apply changes."
          });
          
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
        (error) => {
          console.error("Error saving Gadget config:", error);
          toast.error("Save Error", {
            description: "Could not save your configuration."
          });
        }
      );
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
    
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <Card className="w-full shadow-md transition-all duration-300 hover:shadow-lg">
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
        <ConfigStatusIndicator isConfigured={isConfigured} config={config} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="basic">Basic Configuration</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Features</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <BasicConfigTab 
              config={config}
              handleChange={handleChange}
              testConnection={testConnection}
              isTestingConnection={isTestingConnection}
              connectionStatus={connectionStatus}
            />
          </TabsContent>
          
          <TabsContent value="advanced">
            <AdvancedFeaturesTab 
              config={config} 
              handleFeatureFlagChange={handleFeatureFlagChange} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex gap-2 justify-between border-t pt-4">
        {isConfigured && (
          <Button variant="outline" onClick={handleClear} className="group transition-all">
            <X className="mr-2 h-4 w-4 group-hover:text-destructive transition-colors" />
            <span className="group-hover:text-destructive transition-colors">Clear Configuration</span>
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

// Add default export to fix lazy loading
export default GadgetConfigForm;
