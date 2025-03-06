
import { CheckCircle, Info, ExternalLink } from 'lucide-react';
import { GadgetConfig } from '@/types/price';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ConfigStatusIndicatorProps {
  isConfigured: boolean;
  config: GadgetConfig;
}

export const ConfigStatusIndicator = ({ isConfigured, config }: ConfigStatusIndicatorProps) => {
  if (!isConfigured) return null;
  
  return (
    <div 
      className="bg-green-50 text-green-700 p-3 rounded-md text-sm flex items-start gap-2 shadow-sm border border-green-100"
      role="status"
      aria-live="polite"
    >
      <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        <p className="font-medium">Gadget.dev is configured</p>
        <div className="text-sm space-y-1 mt-1">
          <div className="flex items-center gap-1">
            <span className="font-medium">App ID:</span> 
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <code className="bg-green-100 px-1.5 py-0.5 rounded text-green-800 cursor-help">{config.appId}</code>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Application identifier for Gadget.dev</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
          <div className="flex items-center mt-2 text-green-600">
            <Info className="h-4 w-4 mr-1" />
            <span className="text-xs">API key is securely stored in your browser</span>
          </div>
        </div>
        <div className="mt-3 text-xs">
          <a 
            href="https://gadget.dev/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-green-700 hover:text-green-800 hover:underline"
          >
            View Gadget documentation
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
