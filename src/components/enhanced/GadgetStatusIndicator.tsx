
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, XCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import { useGadgetConnection } from '@/hooks/useGadgetConnection';
import { formatDistanceToNow } from 'date-fns';

export function GadgetStatusIndicator() {
  const { isConfigured, isConnected, isInitialized, lastConnectionTest, config } = useGadgetConnection();
  
  if (!isConfigured) {
    return (
      <Card className="border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Gadget Integration</CardTitle>
          <CardDescription>Not configured</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Gadget.dev integration not set up</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  let statusColor = "bg-gray-100 text-gray-800";
  let statusIcon = <AlertCircle className="h-4 w-4" />;
  let statusText = "Unknown";
  
  if (isConnected) {
    statusColor = "bg-green-100 text-green-800";
    statusIcon = <CheckCircle className="h-4 w-4" />;
    statusText = "Connected";
  } else if (isInitialized) {
    statusColor = "bg-yellow-100 text-yellow-800";
    statusIcon = <AlertCircle className="h-4 w-4" />;
    statusText = "Initialized, Not Connected";
  } else {
    statusColor = "bg-red-100 text-red-800";
    statusIcon = <XCircle className="h-4 w-4" />;
    statusText = "Configuration Error";
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Gadget Integration</CardTitle>
          <Badge variant="outline" className="capitalize">
            {config?.environment || 'unknown'}
          </Badge>
        </div>
        <CardDescription>
          {config?.appId ? `App: ${config.appId}` : 'No App ID configured'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`${statusColor} p-1 rounded-full`}>
                {statusIcon}
              </div>
              <span className="text-sm font-medium">{statusText}</span>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-xs text-muted-foreground cursor-help">
                    <Clock className="h-3 w-3 mr-1" />
                    {lastConnectionTest 
                      ? `Updated ${formatDistanceToNow(lastConnectionTest, { addSuffix: true })}` 
                      : 'Never checked'}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Last connection test: {lastConnectionTest?.toLocaleString() || 'Never'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {isConnected && config?.featureFlags && (
            <div className="pt-2 mt-2 border-t text-xs space-y-1">
              <div className="font-medium">Enabled Features:</div>
              <div className="flex flex-wrap gap-1">
                {config.featureFlags.enableShopifySync && (
                  <Badge variant="secondary" className="text-[10px]">Shopify Sync</Badge>
                )}
                {config.featureFlags.enablePdfProcessing && (
                  <Badge variant="secondary" className="text-[10px]">PDF Processing</Badge>
                )}
                {config.featureFlags.enableAdvancedAnalytics && (
                  <Badge variant="secondary" className="text-[10px]">Analytics</Badge>
                )}
                {config.featureFlags.enableBackgroundJobs && (
                  <Badge variant="secondary" className="text-[10px]">Background Jobs</Badge>
                )}
              </div>
            </div>
          )}
          
          <div className="pt-2 mt-2 border-t">
            <a 
              href={`https://${config?.appId}.gadget.app/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs flex items-center hover:underline text-muted-foreground hover:text-foreground transition-colors"
            >
              Open Gadget Dashboard
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
