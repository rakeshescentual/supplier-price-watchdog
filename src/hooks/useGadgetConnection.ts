
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
import { getGadgetConfig } from '@/utils/gadget-helpers';

export const useGadgetConnection = (providedConfig?: GadgetConfig) => {
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'testing' | 'success' | 'error'>('none');
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'degraded' | 'unhealthy' | 'unknown'>('unknown');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [detailedStatus, setDetailedStatus] = useState<any>(null);
  const [config, setConfig] = useState<GadgetConfig | null>(null);
  
  // Computed properties to match expected API
  const isConfigured = connectionStatus !== 'none';
  const isConnected = connectionStatus === 'success';
  const isInitialized = connectionStatus === 'success' || connectionStatus === 'testing';
  const lastConnectionTest = lastChecked;

  // Load or update config
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
      // Updated to use new initialization approach for Gadget client
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
      
      // Initialize the Gadget client with the provided config
      initializeGadget(config);
      
      if (!isGadgetInitialized()) {
        setConnectionStatus('error');
        toast.error('Connection failed', {
          description: 'Failed to initialize Gadget client.'
        });
        return false;
      }
      
      // Test the connection with updated method
      const isConnected = await testGadgetConnection();
      
      if (isConnected) {
        setConnectionStatus('success');
        toast.success('Connection successful', {
          description: 'Successfully connected to Gadget.'
        });
        
        // After successful connection, fetch detailed status
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
      // Updated health check to use latest Gadget API pattern
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

  // Effect to periodically check health status if connected
  useEffect(() => {
    if (connectionStatus === 'success') {
      // Initial check
      fetchHealthStatus();
      
      // Set up periodic health checks (every 5 minutes)
      const intervalId = setInterval(fetchHealthStatus, 5 * 60 * 1000);
      
      // Clean up on unmount
      return () => clearInterval(intervalId);
    }
  }, [connectionStatus, fetchHealthStatus]);

  return {
    // Original properties
    connectionStatus,
    healthStatus,
    lastChecked,
    detailedStatus,
    testConnection,
    fetchHealthStatus,
    
    // Additional properties needed by components
    isConfigured,
    isConnected,
    isInitialized,
    lastConnectionTest,
    config,
    initializeGadget
  };
};
