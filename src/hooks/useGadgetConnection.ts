import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  initGadgetClient, 
  isGadgetInitialized,
  checkGadgetHealth,
  isHealthy
} from '@/lib/gadget/client';
import { testGadgetConnection } from '@/lib/gadget/client/connection';
import { GadgetConfig } from '@/types/price';
import { getGadgetConfig } from '@/utils/gadget';

export const useGadgetConnection = (providedConfig?: GadgetConfig) => {
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'testing' | 'success' | 'error'>('none');
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'degraded' | 'unhealthy' | 'unknown'>('unknown');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [detailedStatus, setDetailedStatus] = useState<any>(null);
  const [config, setConfig] = useState<GadgetConfig | null>(null);
  
  const isConfigured = connectionStatus !== 'none';
  const isConnected = connectionStatus === 'success';
  const isInitialized = connectionStatus === 'success' || connectionStatus === 'testing';
  const lastConnectionTest = lastChecked;

  useEffect(() => {
    if (providedConfig) {
      setConfig(providedConfig);
    } else {
      const savedConfig = getGadgetConfig();
      setConfig(savedConfig);
    }
  }, [providedConfig]);

  const initializeGadget = useCallback((newConfig: GadgetConfig) => {
    setConfig(newConfig);
    
    try {
      initGadgetClient();
      return true;
    } catch (error) {
      console.error("Failed to initialize Gadget client:", error);
      return false;
    }
  }, []);

  const testConnection = useCallback(async () => {
    if (!config) {
      setConnectionStatus('error');
      toast.error('Missing configuration', {
        description: 'Gadget configuration is required to test the connection.'
      });
      return false;
    }

    try {
      setConnectionStatus('testing');
      
      initializeGadget(config);
      
      if (!isGadgetInitialized()) {
        setConnectionStatus('error');
        toast.error('Connection failed', {
          description: 'Failed to initialize Gadget client.'
        });
        return false;
      }
      
      const isConnected = await testGadgetConnection();
      
      if (isConnected) {
        setConnectionStatus('success');
        toast.success('Connection successful', {
          description: 'Successfully connected to Gadget.'
        });
        
        await fetchHealthStatus();
        
        return true;
      } else {
        setConnectionStatus('error');
        toast.error('Connection failed', {
          description: 'Could not connect to Gadget. Please check your credentials.'
        });
        return false;
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error('Connection error', {
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
      console.error('Gadget connection error:', error);
      return false;
    }
  }, [config, initializeGadget]);

  const fetchHealthStatus = useCallback(async () => {
    if (!isGadgetInitialized()) {
      setHealthStatus('unhealthy');
      setDetailedStatus(null);
      return;
    }
    
    try {
      const health = await checkGadgetHealth();
      
      setHealthStatus(health.status);
      setDetailedStatus({
        services: health.details?.services || {
          api: false,
          database: false,
          storage: false,
          scheduler: false
        }
      });
      setLastChecked(new Date());
      
      if (isHealthy(health)) {
        console.info('Gadget health check passed:', health);
      } else {
        console.warn('Gadget health check indicates issues:', health);
      }
    } catch (error) {
      setHealthStatus('unhealthy');
      console.error('Failed to check Gadget health:', error);
    }
  }, []);

  useEffect(() => {
    if (connectionStatus === 'success') {
      fetchHealthStatus();
      
      const intervalId = setInterval(fetchHealthStatus, 5 * 60 * 1000);
      
      return () => clearInterval(intervalId);
    }
  }, [connectionStatus, fetchHealthStatus]);

  return {
    connectionStatus,
    healthStatus,
    lastChecked,
    detailedStatus,
    testConnection,
    fetchHealthStatus,
    
    isConfigured,
    isConnected,
    isInitialized,
    lastConnectionTest,
    config,
    initializeGadget
  };
};
