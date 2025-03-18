
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  CheckCircle2, 
  RotateCw, 
  Server, 
  Database,
  HardDrive,
  Cpu
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  getDetailedGadgetStatus, 
  checkGadgetReadiness,
  getGadgetStatusSummary
} from '@/utils/gadget/status';
import { Skeleton } from '@/components/ui/skeleton';

export const GadgetHealthMonitor = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [status, setStatus] = useState<{
    healthy: boolean;
    components: Record<string, { status: 'healthy' | 'degraded' | 'down'; message?: string }>;
    latency?: number;
    version?: string;
  } | null>(null);
  
  const [readiness, setReadiness] = useState<ReturnType<typeof checkGadgetReadiness> | null>(null);
  
  // Fetch status on mount
  useEffect(() => {
    fetchStatus();
  }, []);
  
  // Function to fetch detailed status
  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      
      // Check if Gadget is properly configured
      const readyCheck = checkGadgetReadiness();
      setReadiness(readyCheck);
      
      if (!readyCheck.ready) {
        setIsLoading(false);
        return;
      }
      
      // Fetch detailed status
      const result = await getDetailedGadgetStatus();
      setStatus(result);
    } catch (error) {
      console.error('Error fetching Gadget status:', error);
      toast.error('Failed to fetch Gadget status', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to refresh status
  const refreshStatus = async () => {
    try {
      setIsRefreshing(true);
      
      // Get status summary for toast notification
      const summary = await getGadgetStatusSummary();
      
      // Fetch detailed status
      await fetchStatus();
      
      toast.success(`Gadget Status: ${summary.status}`, {
        description: summary.message
      });
    } catch (error) {
      console.error('Error refreshing status:', error);
      toast.error('Failed to refresh status', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Get component icon
  const getComponentIcon = (component: string) => {
    switch (component) {
      case 'api':
        return <Server className="h-4 w-4" />;
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'storage':
        return <HardDrive className="h-4 w-4" />;
      case 'processing':
        return <Cpu className="h-4 w-4" />;
      default:
        return <Server className="h-4 w-4" />;
    }
  };
  
  // Get status badge color
  const getStatusBadge = (status: 'healthy' | 'degraded' | 'down') => {
    switch (status) {
      case 'healthy':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Operational
          </Badge>
        );
      case 'degraded':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <AlertTriangle className="h-3 w-3 mr-1" /> Degraded
          </Badge>
        );
      case 'down':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <AlertTriangle className="h-3 w-3 mr-1" /> Down
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Not configured view
  if (readiness && !readiness.ready) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Gadget Integration</span>
            <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
              Not Configured
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 text-center">
            <div>
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {readiness.reason === 'configuration_missing' && 'Gadget configuration is missing.'}
                {readiness.reason === 'api_key_missing' && 'Gadget API key is missing.'}
                {readiness.reason === 'app_id_missing' && 'Gadget App ID is missing.'}
                {readiness.reason === 'unexpected_error' && 'Unexpected error occurred.'}
              </p>
              <Button 
                size="sm" 
                onClick={() => window.location.href = '/gadget-settings'}
              >
                Configure Gadget
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Gadget System Status</span>
          {!isLoading && status && (
            <Badge className={`
              ${status.healthy ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}
            `}>
              {status.healthy ? (
                <><CheckCircle2 className="h-3 w-3 mr-1" /> Healthy</>
              ) : (
                <><AlertTriangle className="h-3 w-3 mr-1" /> Issues Detected</>
              )}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : status ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {Object.entries(status.components).map(([name, info]) => (
                <div 
                  key={name}
                  className={`p-3 border rounded-md flex items-center justify-between ${
                    info.status === 'healthy' ? 'border-green-100 bg-green-50' :
                    info.status === 'degraded' ? 'border-yellow-100 bg-yellow-50' :
                    'border-red-100 bg-red-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {getComponentIcon(name)}
                    <span className="capitalize">{name}</span>
                  </div>
                  {getStatusBadge(info.status)}
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-xs text-muted-foreground">
              <div className="flex justify-between items-center">
                <div>
                  {status.latency && (
                    <span>Latency: {status.latency}ms</span>
                  )}
                  {status.version && (
                    <span className="ml-3">Version: {status.version}</span>
                  )}
                </div>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={refreshStatus} 
                  disabled={isRefreshing}
                  className="h-7 text-xs"
                >
                  {isRefreshing ? (
                    <>
                      <RotateCw className="h-3 w-3 mr-1 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RotateCw className="h-3 w-3 mr-1" />
                      Refresh
                    </>
                  )}
                </Button>
              </div>
              
              <div className="mt-2">
                Last checked: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-40 text-center">
            <div>
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Unable to fetch Gadget status.
              </p>
              <Button 
                size="sm" 
                onClick={refreshStatus} 
                disabled={isRefreshing}
              >
                {isRefreshing ? 'Retrying...' : 'Retry'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
