import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  initGadgetClient, 
  resetGadgetClient, 
  isGadgetInitialized,
  checkGadgetHealth,
  isHealthy
} from '@/lib/gadgetApi';
import { getGadgetConfig } from '@/utils/gadget/config';
import { GadgetConfig } from '@/types/price';

export function useGadgetIntegration() {
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const initializeGadget = (config: GadgetConfig) => {
    try {
      initGadgetClient();
      return true;
    } catch (error) {
      console.error("Failed to initialize Gadget client:", error);
      return false;
    }
  };

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const config = getGadgetConfig();
      setIsConfigured(!!config);

      if (config) {
        // Initialize Gadget client
        initGadgetClient();
        
        // Check if initialized properly
        const initialized = isGadgetInitialized();
        setIsConnected(initialized);
        
        // If initialized, check the health
        if (initialized) {
          const health = await checkGadgetHealth();
          setIsConnected(health.status === 'healthy');
        }
      }
    } catch (error) {
      console.error('Gadget connection error:', error);
      setIsConnected(false);
      toast.error('Gadget connection error', {
        description: 'Could not connect to Gadget service.'
      });
    } finally {
      setIsLoading(false);
      setLastChecked(new Date());
    }
  };

  const resetConnection = () => {
    resetGadgetClient();
    toast.info('Gadget connection reset', {
      description: 'The connection has been reset.'
    });
    checkConnection();
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection every 15 minutes
    const interval = setInterval(checkConnection, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    isLoading,
    isConfigured,
    isConnected,
    lastChecked,
    checkConnection,
    resetConnection,
    initializeGadget
  };
}
