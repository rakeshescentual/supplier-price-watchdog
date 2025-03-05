
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CircleCheck, CircleAlert, CircleX, CircleDashed } from "lucide-react";
import { useGadgetConnection } from '@/hooks/useGadgetConnection';

export const GadgetStatusIndicator: React.FC = () => {
  const { isConnected, isLoading, error, lastChecked, config } = useGadgetConnection();

  let status: 'connected' | 'error' | 'disconnected' | 'checking' = 'disconnected';
  let icon = <CircleX className="h-4 w-4" />;
  let label = "Disconnected";
  let color = "text-gray-500 bg-gray-100";
  
  if (isLoading) {
    status = 'checking';
    icon = <CircleDashed className="h-4 w-4 animate-spin" />;
    label = "Checking...";
    color = "text-blue-500 bg-blue-100";
  } else if (isConnected) {
    status = 'connected';
    icon = <CircleCheck className="h-4 w-4" />;
    label = "Connected";
    color = "text-green-500 bg-green-100";
  } else if (error) {
    status = 'error';
    icon = <CircleAlert className="h-4 w-4" />;
    label = "Error";
    color = "text-red-500 bg-red-100";
  }
  
  const formattedTime = lastChecked 
    ? new Intl.DateTimeFormat('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      }).format(lastChecked) 
    : 'Never';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`${color} flex items-center gap-1 cursor-default`}>
            {icon}
            <span>Gadget: {label}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="w-64 p-3">
          <div className="space-y-2">
            <p className="font-medium text-sm">Gadget.dev Status</p>
            
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium">{label}</span>
              
              <span className="text-muted-foreground">App ID:</span>
              <span className="font-medium">{config?.appId || 'Not configured'}</span>
              
              <span className="text-muted-foreground">Environment:</span>
              <span className="font-medium">{config?.environment || 'Not configured'}</span>
              
              <span className="text-muted-foreground">Last Checked:</span>
              <span className="font-medium">{formattedTime}</span>
              
              {error && (
                <>
                  <span className="text-muted-foreground">Error:</span>
                  <span className="font-medium text-red-500">{error.message}</span>
                </>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
