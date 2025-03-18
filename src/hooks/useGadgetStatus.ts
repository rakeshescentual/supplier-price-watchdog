
import { useState, useEffect, useCallback } from 'react';
import { 
  isGadgetInitialized, 
  checkGadgetHealth, 
  isHealthy as checkIsHealthy 
} from '@/lib/gadget/client';
import { getGadgetConfig } from '@/utils/gadget/config';

/**
 * Custom hook to track Gadget client status
 */
export const useGadgetStatus = () => {
  const [status, setStatus] = useState({
    isInitialized: false,
    isHealthy: false,
    isConfigured: false,
    environment: 'development',
    lastChecked: null as Date | null
  });

  const checkStatus = useCallback(async () => {
    const config = getGadgetConfig();
    const initialized = isGadgetInitialized();
    
    setStatus(prev => ({
      ...prev,
      isInitialized: initialized,
      isConfigured: !!config
    }));

    if (initialized) {
      const healthResult = await checkGadgetHealth();
      setStatus(prev => ({
        ...prev,
        isHealthy: checkIsHealthy(healthResult),
        environment: config?.environment || 'development',
        lastChecked: new Date()
      }));
      return checkIsHealthy(healthResult);
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
