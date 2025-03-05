
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { GadgetConfig } from '@/types/price';
import { cn } from '@/lib/utils';

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
  const getInputBorderClass = (field: string) => {
    const isEmpty = !config[field as keyof GadgetConfig];
    return cn(
      isEmpty ? "border-red-300 focus-visible:ring-red-400" : "border-input"
    );
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="space-y-2">
        <Label htmlFor="gadget-app-id">
          App ID
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="gadget-app-id"
          value={config.appId}
          onChange={(e) => handleChange('appId', e.target.value)}
          placeholder="e.g., supplier-price-watch"
          className={getInputBorderClass('appId')}
          aria-required="true"
        />
        <p className="text-xs text-muted-foreground mt-1">
          The ID of your Gadget application
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="gadget-api-key">
          API Key
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="gadget-api-key"
          type="password"
          value={config.apiKey}
          onChange={(e) => handleChange('apiKey', e.target.value)}
          placeholder="Your Gadget API key"
          className={getInputBorderClass('apiKey')}
          aria-required="true"
        />
        <p className="text-xs text-muted-foreground mt-1">
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
        <p className="text-xs text-muted-foreground mt-1">
          The Gadget environment to connect to
        </p>
      </div>
      
      <div className="mt-6">
        <Button 
          variant="outline" 
          onClick={testConnection}
          disabled={isTestingConnection || !config.apiKey || !config.appId}
          className={cn(
            "w-full transition-all",
            connectionStatus === 'success' && "border-green-500 text-green-700",
            connectionStatus === 'error' && "border-red-500 text-red-700"
          )}
        >
          {isTestingConnection ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin inline-block rounded-full border-2 border-current border-t-transparent"></span>
              Testing Connection...
            </>
          ) : connectionStatus === 'success' ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Connection Verified
            </>
          ) : connectionStatus === 'error' ? (
            <>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Test Failed - Retry
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Test Connection
            </>
          )}
        </Button>
        
        {connectionStatus === 'success' && (
          <div className="mt-2 text-sm text-green-600 flex items-center gap-1.5 bg-green-50 p-2 rounded mt-3">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span>Connection to Gadget.dev successfully established</span>
          </div>
        )}
        
        {connectionStatus === 'error' && (
          <div className="mt-2 text-sm text-red-600 flex items-center gap-1.5 bg-red-50 p-2 rounded mt-3">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span>Connection failed. Please check your credentials and try again.</span>
          </div>
        )}
      </div>
    </div>
  );
};
