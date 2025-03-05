
import { CheckCircle } from 'lucide-react';
import { GadgetConfig } from '@/types/price';

interface ConfigStatusIndicatorProps {
  isConfigured: boolean;
  config: GadgetConfig;
}

export const ConfigStatusIndicator = ({ isConfigured, config }: ConfigStatusIndicatorProps) => {
  if (!isConfigured) return null;
  
  return (
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
  );
};
