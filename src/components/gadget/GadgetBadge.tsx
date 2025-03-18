
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useGadgetStatus } from '@/hooks/useGadgetStatus';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, AlertTriangle, XCircle, Clock, Server } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface GadgetBadgeProps {
  showEnvironment?: boolean;
  className?: string;
  showIcon?: boolean;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  showLastChecked?: boolean;
  interactive?: boolean;
}

export function GadgetBadge({
  showEnvironment = true,
  showIcon = true,
  showLastChecked = false,
  interactive = true,
  className = '',
  tooltipPlacement = 'top'
}: GadgetBadgeProps) {
  const { isInitialized, healthStatus, environment, detailedStatus, lastChecked } = useGadgetStatus();
  
  if (!isInitialized) {
    return null;
  }
  
  const isHealthy = healthStatus === 'healthy';
  const isDegraded = healthStatus === 'degraded';
  
  let variant: 'success' | 'warning' | 'destructive' = 'success';
  let label = 'Connected';
  let icon = <CheckCircle className="h-3 w-3 mr-1" />;
  
  if (isDegraded) {
    variant = 'warning';
    label = 'Degraded';
    icon = <AlertTriangle className="h-3 w-3 mr-1" />;
  } else if (!isHealthy) {
    variant = 'destructive';
    label = 'Issue';
    icon = <XCircle className="h-3 w-3 mr-1" />;
  }
  
  const formattedLastChecked = lastChecked 
    ? formatDistanceToNow(lastChecked, { addSuffix: true })
    : 'never';
  
  const badgeContent = (
    <Badge 
      variant={variant} 
      className={`text-xs ${className}`}
    >
      {showIcon && icon}
      Gadget {label}
      {showEnvironment && environment && ` (${environment})`}
      {showLastChecked && (
        <span className="ml-1 opacity-70 text-[10px] flex items-center">
          <Clock className="h-2 w-2 mr-0.5" />
          {formattedLastChecked}
        </span>
      )}
    </Badge>
  );
  
  // If we have detailed status and component is interactive, show it in a tooltip
  if (interactive && detailedStatus && detailedStatus.services) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            {badgeContent}
          </TooltipTrigger>
          <TooltipContent side={tooltipPlacement} align="center" className="text-xs p-3 max-w-[280px]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium">Gadget Services Status</p>
                {lastChecked && (
                  <span className="text-[10px] text-muted-foreground flex items-center">
                    <Clock className="h-2.5 w-2.5 mr-0.5" />
                    {formattedLastChecked}
                  </span>
                )}
              </div>
              
              <div className="bg-muted/50 p-1.5 rounded-sm space-y-1">
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(detailedStatus.services).map(([service, status]) => (
                    <div key={service} className="flex items-center text-xs">
                      {status ? (
                        <CheckCircle className="w-3 h-3 mr-1 text-green-500 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 mr-1 text-amber-500 flex-shrink-0" />
                      )}
                      <span className="capitalize truncate">{service}</span>
                      <span className="ml-0.5 text-[10px] text-muted-foreground">
                        {status ? 'OK' : 'Issue'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {environment && (
                <div className="flex items-center text-[10px] text-muted-foreground">
                  <Server className="h-2.5 w-2.5 mr-0.5" />
                  Environment: <span className="font-medium ml-0.5 capitalize">{environment}</span>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return badgeContent;
}
