
import { CheckCircle, Info } from 'lucide-react';
import { GadgetConfig } from '@/types/price';
import { cn } from '@/lib/utils';

interface ConfigStatusIndicatorProps {
  isConfigured: boolean;
  config: GadgetConfig;
}

export const ConfigStatusIndicator = ({ isConfigured, config }: ConfigStatusIndicatorProps) => {
  if (!isConfigured) return null;
  
  return (
    <div 
      className="bg-green-50 text-green-700 p-3 rounded-md text-sm flex items-start gap-2"
      role="status"
      aria-live="polite"
    >
      <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        <p className="font-medium">Gadget.dev is configured</p>
        <div className="text-sm space-y-1 mt-1">
          <div className="flex items-center gap-1">
            <span className="font-medium">App ID:</span> 
            <code className="bg-green-100 px-1.5 py-0.5 rounded text-green-800">{config.appId}</code>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Environment:</span>
            <span className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              config.environment === 'production' 
                ? "bg-purple-100 text-purple-800" 
                : "bg-blue-100 text-blue-800"
            )}>
              {config.environment}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
