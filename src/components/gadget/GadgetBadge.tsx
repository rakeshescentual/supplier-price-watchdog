
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useGadgetStatus } from '@/hooks/useGadgetStatus';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface GadgetBadgeProps {
  showEnvironment?: boolean;
  className?: string;
  showIcon?: boolean;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
}

export function GadgetBadge({
  showEnvironment = true,
  showIcon = true,
  className = '',
  tooltipPlacement = 'top'
}: GadgetBadgeProps) {
  const { isInitialized, healthStatus, environment, detailedStatus } = useGadgetStatus();
  
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
  
  const badgeContent = (
    <Badge 
      variant={variant} 
      className={`text-xs ${className}`}
    >
      {showIcon && icon}
      Gadget {label}
      {showEnvironment && environment && ` (${environment})`}
    </Badge>
  );
  
  // If we have detailed status, show it in a tooltip
  if (detailedStatus && detailedStatus.services) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            {badgeContent}
          </TooltipTrigger>
          <TooltipContent side={tooltipPlacement} align="center" className="text-xs p-2">
            <div>
              <p className="font-medium mb-1">Gadget Services:</p>
              <ul className="space-y-1">
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
    );
  }
  
  return badgeContent;
}
