
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, Cog, Save, X } from 'lucide-react';

export interface GadgetConfig {
  apiKey: string;
  appId: string;
  environment: 'development' | 'production';
}

export const GadgetConfigForm = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<GadgetConfig>({
    apiKey: '',
    appId: '',
    environment: 'development'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

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

  const handleChange = (field: keyof GadgetConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Validate config
    if (!config.apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gadget API key.",
        variant: "destructive"
      });
      return;
    }

    if (!config.appId.trim()) {
      toast({
        title: "App ID Required",
        description: "Please enter your Gadget App ID.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    try {
      // Save to localStorage
      localStorage.setItem('gadgetConfig', JSON.stringify(config));
      
      setIsConfigured(true);
      
      toast({
        title: "Configuration Saved",
        description: "Your Gadget configuration has been saved. Please reload the page to apply changes.",
      });
      
      // Reload page to apply new configuration
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error saving Gadget config:", error);
      toast({
        title: "Save Error",
        description: "Could not save your configuration.",
        variant: "destructive"
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
      environment: 'development'
    });
    setIsConfigured(false);
    
    toast({
      title: "Configuration Cleared",
      description: "Gadget configuration has been removed. Please reload the page to apply changes.",
    });
    
    // Reload page to apply changes
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cog className="h-5 w-5" />
          Gadget.dev Configuration
        </CardTitle>
        <CardDescription>
          Configure your Gadget.dev integration for enhanced features
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
        
        <div className="space-y-4">
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
        </div>
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
