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
import { 
  getGadgetConfig, 
  saveGadgetConfig, 
  clearGadgetConfig, 
  validateGadgetConfig, 
  testGadgetConnection 
} from '@/utils/gadget-helpers';

const GadgetConfigForm = () => {
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
    const storedConfig = getGadgetConfig();
    
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
    const { isValid, errors } = validateGadgetConfig(config);
    
    if (!isValid) {
      toast.error("Missing configuration", {
        description: errors.join(", ")
      });
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('none');

    try {
      const success = await testGadgetConnection(config);
      
      setConnectionStatus(success ? 'success' : 'error');
      
      if (success) {
        toast.success("Connection successful", {
          description: "Successfully connected to Gadget.dev"
        });
      } else {
        toast.error("Connection failed", {
          description: "Could not connect to Gadget.dev. Please check your API key and App ID."
        });
      }
    } catch (error) {
      console.error("Error testing Gadget connection:", error);
      setConnectionStatus('error');
      toast.error("Connection error", {
        description: "An error occurred while testing the connection."
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = () => {
    const { isValid, errors } = validateGadgetConfig(config);
    
    if (!isValid) {
      toast.error("Validation error", {
        description: errors.join(", ")
      });
      return;
    }

    setIsSaving(true);

    try {
      const saved = saveGadgetConfig(config, () => {
        setIsConfigured(true);
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
      
      if (!saved) {
        toast.error("Save error", {
          description: "Could not save your configuration."
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    clearGadgetConfig();
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

export default GadgetConfigForm;
