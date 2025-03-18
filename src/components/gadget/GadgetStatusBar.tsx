
import React, { useEffect, useState } from 'react';
import { useGadgetConnection } from '@/hooks/useGadgetConnection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Server
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';

export function GadgetStatusBar() {
  const { 
    isConfigured, 
    healthStatus, 
    fetchHealthStatus, 
    lastChecked,
    detailedStatus
  } = useGadgetConnection();
  const [isChecking, setIsChecking] = useState(false);
  
  const isHealthy = healthStatus === 'healthy';
  const isDegraded = healthStatus === 'degraded';
  
  const handleCheckHealth = async () => {
    setIsChecking(true);
    await fetchHealthStatus();
    setIsChecking(false);
  };
  
  // Refresh health check every 5 minutes
  useEffect(() => {
    if (isConfigured) {
      const interval = setInterval(() => {
        fetchHealthStatus();
      }, 1000 * 60 * 5);
      
      return () => clearInterval(interval);
    }
  }, [isConfigured, fetchHealthStatus]);
  
  // Format last checked time
  const formattedLastChecked = lastChecked 
    ? formatDistanceToNow(lastChecked, { addSuffix: true })
    : 'Never';
  
  if (!isConfigured) {
    return (
      <div className="flex items-center justify-between py-2 px-3 bg-amber-50 border-b border-amber-100 text-amber-700 text-sm">
        <div className="flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" />
          <span>Gadget.dev not configured</span>
        </div>
        <Link to="/gadget-settings">
          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
            <Settings className="w-3 h-3 mr-1" />
            Configure
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className={`flex items-center justify-between py-2 px-3 border-b text-sm ${
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
          <AlertTriangle className="w-4 h-4 mr-2" />
        )}
        <span>Gadget.dev</span>
        <Badge variant={isHealthy ? "success" : isDegraded ? "warning" : "destructive"} className="ml-2">
          {isHealthy ? 'Connected' : isDegraded ? 'Degraded' : 'Issue Detected'}
        </Badge>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="ml-3 text-xs flex items-center cursor-help">
                <Clock className="w-3 h-3 mr-1" />
                {formattedLastChecked}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Last health check: {lastChecked?.toLocaleString() || 'Never'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {detailedStatus && detailedStatus.services && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="ml-3">
                  <Server className="w-3 h-3 cursor-help" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <p className="font-medium mb-1">Service Status:</p>
                  <ul>
                    {Object.entries(detailedStatus.services).map(([service, status]) => (
                      <li key={service} className="flex items-center">
                        {status ? (
                          <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 mr-1 text-amber-500" />
                        )}
                        {service}: {status ? 'OK' : 'Issue'}
                      </li>
                    ))}
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleCheckHealth} 
        disabled={isChecking}
        className="h-7 px-2 text-xs"
      >
        <RefreshCw className={`w-3 h-3 mr-1 ${isChecking ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
}
