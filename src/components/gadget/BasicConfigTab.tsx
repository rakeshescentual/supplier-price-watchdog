
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { GadgetConfig } from '@/types/price';

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
  return (
    <div className="space-y-4 mt-4">
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
    </div>
  );
};
