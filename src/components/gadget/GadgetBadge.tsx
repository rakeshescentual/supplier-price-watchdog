
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useGadgetStatus } from '@/hooks/useGadgetStatus';

interface GadgetBadgeProps {
  showEnvironment?: boolean;
  className?: string;
}

export function GadgetBadge({ showEnvironment = true, className = '' }: GadgetBadgeProps) {
  const { isInitialized, isHealthy, environment } = useGadgetStatus();
  
  if (!isInitialized) {
    return null;
  }
  
  return (
    <Badge 
      variant={isHealthy ? 'success' : 'warning'} 
      className={`text-xs ${className}`}
    >
      {isHealthy ? 'Gadget Connected' : 'Gadget Issue'}
      {showEnvironment && environment && ` (${environment})`}
    </Badge>
  );
}
