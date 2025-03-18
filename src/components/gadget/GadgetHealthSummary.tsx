
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGadgetStatus } from '@/hooks/useGadgetStatus';
import { CheckCircle, AlertTriangle, Clock, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

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
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await checkStatus(true);
    setIsRefreshing(false);
  };
  
  if (!isConfigured) {
    return (
      <Card className="border-amber-200">
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
    <Card className={`border-${isHealthy ? 'green' : isDegraded ? 'amber' : 'red'}-200`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className={`text-sm text-${isHealthy ? 'green' : isDegraded ? 'amber' : 'red'}-700 flex items-center`}>
            {isHealthy ? (
              <CheckCircle className="h-4 w-4 mr-2" />
            ) : (
              <AlertTriangle className="h-4 w-4 mr-2" />
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
            <Badge variant="outline" className="text-xs">
              {environment}
            </Badge>
          </div>
          
          {detailedStatus && detailedStatus.services && (
            <div className="bg-muted p-2 rounded-md text-xs space-y-1">
              <div className="font-medium mb-1">Service Status:</div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(detailedStatus.services).map(([service, status]) => (
                  <div key={service} className="flex items-center">
                    {status ? (
                      <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 mr-1 text-amber-500" />
                    )}
                    <span className="capitalize">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-xs"
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
