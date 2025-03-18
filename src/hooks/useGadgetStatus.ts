
import { useState, useEffect, useCallback } from 'react';
import { 
  isGadgetInitialized, 
  checkGadgetHealth, 
  isHealthy as checkIsHealthy 
} from '@/lib/gadget/client';
import { getGadgetConfig } from '@/utils/gadget/config';
import { toast } from 'sonner';

/**
 * Custom hook to track Gadget client status
 */
export const useGadgetStatus = () => {
  const [status, setStatus] = useState({
    isInitialized: false,
    isHealthy: false,
    isConfigured: false,
    environment: 'development',
    lastChecked: null as Date | null,
    healthStatus: 'unknown' as 'healthy' | 'degraded' | 'unhealthy' | 'unknown',
    detailedStatus: null as any
  });

  const checkStatus = useCallback(async (showToast = false) => {
    const config = getGadgetConfig();
    const initialized = isGadgetInitialized();
    
    setStatus(prev => ({
      ...prev,
      isInitialized: initialized,
      isConfigured: !!config
    }));

    if (initialized) {
      try {
        const healthResult = await checkGadgetHealth();
        const isHealthy = checkIsHealthy(healthResult);
        
        setStatus(prev => ({
          ...prev,
          isHealthy,
          healthStatus: healthResult.status,
          detailedStatus: healthResult.details || null,
          environment: config?.environment || 'development',
          lastChecked: new Date()
        }));
        
        if (showToast) {
          if (isHealthy) {
            toast.success('Gadget connection is healthy');
          } else if (healthResult.status === 'degraded') {
            toast.warning('Gadget services are degraded', {
              description: healthResult.message || 'Some services may be affected'
            });
          } else {
            toast.error('Gadget connection is unhealthy', {
              description: healthResult.message || 'Please check your configuration'
            });
          }
        }
        
        return isHealthy;
      } catch (error) {
        console.error('Error checking Gadget health:', error);
        setStatus(prev => ({
          ...prev,
          isHealthy: false,
          healthStatus: 'unhealthy',
          lastChecked: new Date()
        }));
        
        if (showToast) {
          toast.error('Failed to check Gadget health', {
            description: error instanceof Error ? error.message : 'Unknown error'
          });
        }
        
        return false;
      }
    }
    
    return false;
  }, []);

  useEffect(() => {
    checkStatus();
    
    // Check status every 5 minutes
    const interval = setInterval(() => {
      checkStatus();
    }, 1000 * 60 * 5);
    
    return () => {
      clearInterval(interval);
    };
  }, [checkStatus]);

  return {
    ...status,
    checkStatus
  };
};
