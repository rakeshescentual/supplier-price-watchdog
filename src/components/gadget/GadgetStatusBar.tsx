
import React, { useEffect, useState } from 'react';
import { useGadgetStatus } from '@/hooks/useGadgetStatus';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Server,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';

export function GadgetStatusBar() {
  const { 
    isConfigured, 
    healthStatus, 
    isHealthy,
    checkStatus, 
    lastChecked,
    environment,
    detailedStatus
  } = useGadgetStatus();
  const [isChecking, setIsChecking] = useState(false);
  
  const isDegraded = healthStatus === 'degraded';
  const isUnhealthy = !isHealthy && !isDegraded;
  
  const handleCheckHealth = async () => {
    setIsChecking(true);
    await checkStatus(true);
    setIsChecking(false);
  };
  
  // Refresh health check every 5 minutes
  useEffect(() => {
    if (isConfigured) {
      const interval = setInterval(() => {
        checkStatus();
      }, 1000 * 60 * 5);
      
      return () => clearInterval(interval);
    }
  }, [isConfigured, checkStatus]);
  
  // Format last checked time
  const formattedLastChecked = lastChecked 
    ? formatDistanceToNow(lastChecked, { addSuffix: true })
    : 'Never';
  
  if (!isConfigured) {
    return (
      <div className="flex items-center justify-between py-1.5 px-3 bg-amber-50 border-b border-amber-100 text-amber-700 text-sm">
        <div className="flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" />
          <span className="mr-2">Gadget.dev not configured</span>
          <Badge variant="outline" className="text-xs border-amber-200">
            Enhanced features unavailable
          </Badge>
        </div>
        <Link to="/gadget-settings">
          <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs border-amber-200 hover:bg-amber-100">
            <Settings className="w-3 h-3 mr-1.5" />
            Configure
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className={`flex items-center justify-between py-1.5 px-4 border-b text-sm ${
      isHealthy ? 'bg-green-50 border-green-100 text-green-700' : 
      isDegraded ? 'bg-amber-50 border-amber-100 text-amber-700' :
      'bg-red-50 border-red-100 text-red-700'
    }`}>
      <div className="flex items-center">
        {isHealthy ? (
          <CheckCircle className="w-4 h-4 mr-2" />
        ) : isDegraded ? (
          <AlertTriangle className="w-4 h-4 mr-2" />
        ) : (
          <XCircle className="w-4 h-4 mr-2" />
        )}
        <span className="mr-2">Gadget.dev</span>
        <Badge variant={isHealthy ? "success" : isDegraded ? "warning" : "destructive"} className="mr-2">
          {isHealthy ? 'Connected' : isDegraded ? 'Degraded' : 'Issue Detected'}
        </Badge>
        
        <Separator orientation="vertical" className="h-4 mx-2" />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-xs flex items-center cursor-help">
                <Clock className="w-3 h-3 mr-1" />
                {formattedLastChecked}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs p-2">
              <p>Last health check: {lastChecked?.toLocaleString() || 'Never'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {environment && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="ml-2 text-xs">
                  <Server className="w-2.5 h-2.5 mr-1" />
                  {environment}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <p>Current environment: {environment}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {detailedStatus && detailedStatus.services && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-5 h-5 ml-1 p-0">
                  <div className="relative">
                    <Server className="w-3.5 h-3.5 cursor-help" />
                    {!isHealthy && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
                    )}
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={6} className="text-xs p-3 max-w-[280px]">
                <div>
                  <div className="font-medium mb-2">Gadget Service Status:</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
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
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <a 
          href="https://docs.gadget.dev/troubleshooting"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          Docs
          <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
        </a>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCheckHealth} 
          disabled={isChecking}
          className={`h-7 px-2.5 text-xs ${
            isUnhealthy ? 'border-red-200 hover:bg-red-100' : 
            isDegraded ? 'border-amber-200 hover:bg-amber-100' : 
            'border-green-200 hover:bg-green-100'
          }`}
        >
          <RefreshCw className={`w-3 h-3 mr-1.5 ${isChecking ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    </div>
  );
}
