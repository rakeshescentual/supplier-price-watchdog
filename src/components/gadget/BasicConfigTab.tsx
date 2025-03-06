import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, RefreshCw, Info, Lock, Eye, EyeOff } from 'lucide-react';
import { GadgetConfig } from '@/types/price';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { testGadgetConnection } from '@/utils/gadget-helpers';

interface BasicConfigTabProps {
  config: GadgetConfig;
  handleChange: (field: keyof GadgetConfig, value: string | boolean) => void;
  testConnection: () => void;
  isTestingConnection: boolean;
  connectionStatus: 'none' | 'success' | 'error';
}

export const BasicConfigTab = ({
  config,
  handleChange,
  testConnection,
  isTestingConnection,
  connectionStatus
}: BasicConfigTabProps) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({});

  const getInputBorderClass = (field: keyof GadgetConfig) => {
    const isEmpty = !config[field];
    if (!fieldTouched[field]) return "border-input";
    return cn(
      isEmpty ? "border-red-300 focus-visible:ring-red-400" : "border-green-300 focus-visible:ring-green-400"
    );
  };

  const markFieldAsTouched = (field: keyof GadgetConfig) => {
    setFieldTouched(prev => ({ ...prev, [field]: true }));
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  const handleTestConnection = async () => {
    if (isTestingConnection || !config.apiKey || !config.appId) return;
    
    testConnection();
    
    // You can optionally use the enhanced testGadgetConnection directly:
    // const success = await testGadgetConnection(config);
    // Handle response status here if needed
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="bg-blue-50 p-3 rounded-md border border-blue-100 mb-4">
        <h3 className="text-sm font-medium text-blue-800 flex items-center">
          <Info className="h-4 w-4 mr-2" />
          Gadget Connection Setup
        </h3>
        <p className="text-xs text-blue-700 mt-1">
          Connect to your Gadget.dev application to enable advanced features. You can find these details in your Gadget dashboard.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="gadget-app-id" className="flex items-center">
            App ID
            <Badge variant="outline" className="ml-2 text-xs bg-red-50 text-red-500 border-red-200">Required</Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">The unique identifier for your Gadget application. Find this in your Gadget dashboard.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          {fieldTouched.appId && !config.appId && (
            <span className="text-xs text-red-500 animate-fade-in">This field is required</span>
          )}
        </div>
        <Input
          id="gadget-app-id"
          value={config.appId}
          onChange={(e) => handleChange('appId', e.target.value)}
          onBlur={() => markFieldAsTouched('appId')}
          placeholder="e.g., supplier-price-watch"
          className={getInputBorderClass('appId')}
          aria-required="true"
        />
        <div className="flex justify-between items-start mt-1">
          <p className="text-xs text-muted-foreground">
            The ID of your Gadget application
          </p>
          {fieldTouched.appId && config.appId && (
            <span className="text-xs text-green-600 flex items-center animate-fade-in">
              <CheckCircle className="h-3 w-3 mr-1" />
              Valid format
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="gadget-api-key" className="flex items-center">
            API Key
            <Badge variant="outline" className="ml-2 text-xs bg-red-50 text-red-500 border-red-200">Required</Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Your API key provides secure access to Gadget services. Generate this in your Gadget dashboard's API Keys section.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          {fieldTouched.apiKey && !config.apiKey && (
            <span className="text-xs text-red-500 animate-fade-in">This field is required</span>
          )}
        </div>
        <div className="relative">
          <Input
            id="gadget-api-key"
            type={showApiKey ? "text" : "password"}
            value={config.apiKey}
            onChange={(e) => handleChange('apiKey', e.target.value)}
            onBlur={() => markFieldAsTouched('apiKey')}
            placeholder="Your Gadget API key"
            className={cn(getInputBorderClass('apiKey'), "pr-10")}
            aria-required="true"
          />
          <button
            type="button"
            onClick={toggleShowApiKey}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showApiKey ? "Hide API key" : "Show API key"}
          >
            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex justify-between items-start mt-1">
          <p className="text-xs text-muted-foreground flex items-center">
            <Lock className="h-3 w-3 mr-1" />
            Securely stored in your browser only
          </p>
          {fieldTouched.apiKey && config.apiKey && (
            <span className="text-xs text-green-600 flex items-center animate-fade-in">
              <CheckCircle className="h-3 w-3 mr-1" />
              Valid format
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="gadget-environment" className="flex items-center">
            Environment
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Choose 'Development' for testing and 'Production' for live usage.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
        </div>
        <Select
          value={config.environment}
          onValueChange={(value) => handleChange('environment', value as 'development' | 'production')}
        >
          <SelectTrigger id="gadget-environment">
            <SelectValue placeholder="Select environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="development" className="flex items-center">
              <Badge variant="outline" className="mr-2 bg-blue-50 border-blue-200 text-blue-700">DEV</Badge>
              Development
            </SelectItem>
            <SelectItem value="production" className="flex items-center">
              <Badge variant="outline" className="mr-2 bg-purple-50 border-purple-200 text-purple-700">PROD</Badge>
              Production
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          The Gadget environment to connect to
        </p>
      </div>
      
      <div className="mt-8">
        <Button 
          variant="outline" 
          onClick={handleTestConnection}
          disabled={isTestingConnection || !config.apiKey || !config.appId}
          className={cn(
            "w-full transition-all h-12",
            connectionStatus === 'success' && "border-green-500 text-green-700 bg-green-50",
            connectionStatus === 'error' && "border-red-500 text-red-700 bg-red-50",
            (!config.apiKey || !config.appId) && "opacity-50 cursor-not-allowed"
          )}
        >
          {isTestingConnection ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin inline-block rounded-full border-2 border-current border-t-transparent"></span>
              Testing Connection...
            </>
          ) : connectionStatus === 'success' ? (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Connection Verified
            </>
          ) : connectionStatus === 'error' ? (
            <>
              <AlertTriangle className="h-5 w-5 mr-2" />
              Test Failed - Retry
            </>
          ) : (
            <>
              <RefreshCw className="h-5 w-5 mr-2" />
              Test Connection
            </>
          )}
        </Button>
        
        {!config.apiKey || !config.appId ? (
          <div className="mt-3 text-sm text-amber-600 flex items-center gap-1.5 bg-amber-50 p-2 rounded border border-amber-200 animate-fade-in">
            <Info className="h-4 w-4 flex-shrink-0" />
            <span>Please fill in all required fields to test the connection</span>
          </div>
        ) : connectionStatus === 'success' ? (
          <div className="mt-3 text-sm text-green-600 flex items-center gap-1.5 bg-green-50 p-2 rounded border border-green-200 animate-fade-in">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span>Connection to Gadget.dev successfully established</span>
          </div>
        ) : connectionStatus === 'error' ? (
          <div className="mt-3 text-sm text-red-600 flex items-center gap-1.5 bg-red-50 p-2 rounded border border-red-200 animate-fade-in">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span>Connection failed. Please check your credentials and try again.</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};
