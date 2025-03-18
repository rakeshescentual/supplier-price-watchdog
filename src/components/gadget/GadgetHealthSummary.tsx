
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGadgetStatus } from '@/hooks/useGadgetStatus';
import { CheckCircle, AlertTriangle, Clock, RefreshCw, ExternalLink, XCircle, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function GadgetHealthSummary() {
  const { 
    isConfigured, 
    isHealthy, 
    healthStatus, 
    lastChecked, 
    environment, 
    detailedStatus, 
    checkStatus 
  } = useGadgetStatus();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
  const isDegraded = healthStatus === 'degraded';
  const isUnhealthy = healthStatus === 'unhealthy';
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await checkStatus(true);
    setIsRefreshing(false);
  };
  
  if (!isConfigured) {
    return (
      <Card className="border-amber-200 bg-amber-50/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-amber-700 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Gadget Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-amber-600">
            Gadget.dev is not configured. Please configure it to enable enhanced features.
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 text-xs"
            asChild
          >
            <a href="/gadget-settings">Configure Gadget</a>
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={`${isHealthy ? 'border-green-200 bg-green-50/30' : isDegraded ? 'border-amber-200 bg-amber-50/30' : 'border-red-200 bg-red-50/30'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className={`text-sm flex items-center ${isHealthy ? 'text-green-700' : isDegraded ? 'text-amber-700' : 'text-red-700'}`}>
            {isHealthy ? (
              <CheckCircle className="h-4 w-4 mr-2" />
            ) : isDegraded ? (
              <AlertTriangle className="h-4 w-4 mr-2" />
            ) : (
              <XCircle className="h-4 w-4 mr-2" />
            )}
            Gadget Status
          </CardTitle>
          
          <Badge variant={isHealthy ? 'success' : isDegraded ? 'warning' : 'destructive'}>
            {isHealthy ? 'Healthy' : isDegraded ? 'Degraded' : 'Unhealthy'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              Last checked: {lastChecked ? formatDistanceToNow(lastChecked, { addSuffix: true }) : 'Never'}
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs">
                    <Server className="h-2.5 w-2.5 mr-1" />
                    {environment}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <p>Current environment: {environment}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Separator className="my-1" />
          
          {detailedStatus && detailedStatus.services && (
            <div className="bg-background rounded-md p-2 text-xs space-y-1 border">
              <div className="font-medium mb-1.5">Service Status:</div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                {Object.entries(detailedStatus.services).map(([service, status]) => (
                  <div key={service} className="flex items-center">
                    {status ? (
                      <CheckCircle className="w-3 h-3 mr-1.5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 mr-1.5 text-amber-500" />
                    )}
                    <span className="capitalize">{service}</span>
                    <span className="ml-1 text-[10px] text-muted-foreground">
                      {status ? 'OK' : 'Issue'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`text-xs ${isUnhealthy ? 'border-red-200 hover:bg-red-100' : ''}`}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
            
            <a 
              href="https://docs.gadget.dev/troubleshooting"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              Help
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
