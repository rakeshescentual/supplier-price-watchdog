
import { CheckCircle, Info, ExternalLink, Link as LinkIcon, FileText } from 'lucide-react';
import { GadgetConfig } from '@/types/price';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ConfigStatusIndicatorProps {
  isConfigured: boolean;
  config: GadgetConfig;
}

export const ConfigStatusIndicator = ({ isConfigured, config }: ConfigStatusIndicatorProps) => {
  if (!isConfigured) return null;
  
  const openGadgetDashboard = () => {
    const url = `https://${config.appId}.gadget.app/`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 p-4 rounded-lg text-sm flex items-start gap-3 shadow-sm border border-green-200 animate-fade-in transition-all duration-300"
      role="status"
      aria-live="polite"
    >
      <div className="bg-green-100 p-2 rounded-full">
        <CheckCircle className="h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-base mb-1">Gadget.dev is connected</p>
        <div className="text-sm space-y-2 mt-2">
          <div className="flex items-center gap-2 group hover:bg-green-100/50 p-1 rounded transition-colors">
            <span className="font-medium min-w-20">App ID:</span> 
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <code className="bg-green-100 px-2 py-1 rounded text-green-800 cursor-help font-mono text-xs border border-green-200">{config.appId}</code>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Application identifier for Gadget.dev</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2 group hover:bg-green-100/50 p-1 rounded transition-colors">
            <span className="font-medium min-w-20">Environment:</span>
            <span className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
              config.environment === 'production' 
                ? "bg-purple-100 text-purple-800 border border-purple-200" 
                : "bg-blue-100 text-blue-800 border border-blue-200"
            )}>
              {config.environment}
            </span>
          </div>
          <div className="flex items-center gap-2 group hover:bg-green-100/50 p-1 rounded transition-colors">
            <span className="font-medium min-w-20">API Key:</span>
            <span className="text-green-800 bg-green-100 px-2 py-0.5 rounded border border-green-200 text-xs">
              ••••••••••••••••
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-green-600" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-xs max-w-60">Your API key is securely stored in your browser's local storage and is never sent to our servers.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center mt-2 text-green-600 bg-green-50 p-2 rounded border border-green-200">
            <Info className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-xs">All API interactions are handled securely. Your credentials never leave your browser except to authenticate with Gadget.dev</span>
          </div>
        </div>
        <div className="mt-4 flex gap-3 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
            onClick={openGadgetDashboard}
          >
            <LinkIcon className="mr-1 h-3.5 w-3.5" />
            Open Dashboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
            asChild
          >
            <Link to="/gadget-documentation">
              <FileText className="mr-1 h-3.5 w-3.5" />
              View Integration Docs
            </Link>
          </Button>
          <a 
            href="https://gadget.dev/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-green-700 hover:text-green-800 hover:underline transition-colors"
          >
            Gadget.dev Documentation
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
