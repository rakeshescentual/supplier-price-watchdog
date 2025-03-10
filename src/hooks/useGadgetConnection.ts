
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  initGadgetClient, 
  isGadgetInitialized, 
  checkGadgetHealth,
  resetGadgetClient,
  testGadgetConnection,
  getGadgetStatus
} from '@/lib/gadget/client';
import { getGadgetConfig } from '@/utils/gadget-helpers';
import { GadgetConfig } from '@/types/price';

export interface UseGadgetConnectionResult {
  isInitialized: boolean;
  isConnected: boolean;
  isConfigured: boolean;
  isHealthy: boolean;
  lastHealthCheck: Date | null;
  lastConnectionTest: Date | null;
  connectionStatus: 'connected' | 'disconnected' | 'degraded' | 'unknown';
  healthCheckMessage: string | null;
  config: GadgetConfig | null;
  testConnection: () => Promise<boolean>;
  checkHealth: () => Promise<void>;
  resetClient: () => void;
  getStatus: () => Promise<{
    isConnected: boolean;
    environment: string;
    latency?: number;
    version?: string;
    services: {
      api: boolean;
      database: boolean;
      storage: boolean;
      scheduler: boolean;
    };
  }>;
}

/**
 * Hook for managing Gadget connection and health checks
 */
export const useGadgetConnection = (): UseGadgetConnectionResult => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isHealthy, setIsHealthy] = useState<boolean>(false);
  const [lastHealthCheck, setLastHealthCheck] = useState<Date | null>(null);
  const [lastConnectionTest, setLastConnectionTest] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'degraded' | 'unknown'>('unknown');
  const [healthCheckMessage, setHealthCheckMessage] = useState<string | null>(null);
  const [config, setConfig] = useState<GadgetConfig | null>(null);
  
  // Check if Gadget is initialized and configured
  const isInitialized = isGadgetInitialized();
  const isConfigured = !!getGadgetConfig();
  
  // Initialize on mount
  useEffect(() => {
    // Get the current config
    const currentConfig = getGadgetConfig();
    setConfig(currentConfig);
    
    // If configured, check connection
    if (currentConfig) {
      testConnection();
    }
  }, []);
  
  // Test connection
  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      const connected = await testGadgetConnection();
      setIsConnected(connected);
      setLastConnectionTest(new Date());
      setConnectionStatus(connected ? 'connected' : 'disconnected');
      
      // If connected, also check health
      if (connected) {
        checkHealth();
      }
      
      return connected;
    } catch (error) {
      console.error('Error testing Gadget connection:', error);
      setIsConnected(false);
      setConnectionStatus('disconnected');
      setLastConnectionTest(new Date());
      
      toast.error('Connection Error', {
        description: 'Failed to test Gadget connection.'
      });
      
      return false;
    }
  }, []);
  
  // Check health
  const checkHealth = useCallback(async (): Promise<void> => {
    try {
      const health = await checkGadgetHealth();
      setIsHealthy(health.healthy);
      setHealthCheckMessage(health.message || null);
      setLastHealthCheck(new Date());
      
      if (isConnected && !health.healthy) {
        setConnectionStatus('degraded');
      } else if (isConnected && health.healthy) {
        setConnectionStatus('connected');
      }
    } catch (error) {
      console.error('Error checking Gadget health:', error);
      setIsHealthy(false);
      setHealthCheckMessage('Error checking health status');
      setLastHealthCheck(new Date());
      
      if (isConnected) {
        setConnectionStatus('degraded');
      }
      
      toast.error('Health Check Error', {
        description: 'Failed to check Gadget health status.'
      });
    }
  }, [isConnected]);
  
  // Reset client
  const resetClient = useCallback((): void => {
    resetGadgetClient();
    setIsConnected(false);
    setIsHealthy(false);
    setConnectionStatus('unknown');
    setLastConnectionTest(null);
    setLastHealthCheck(null);
    setHealthCheckMessage(null);
    
    toast.info('Gadget Client Reset', {
      description: 'Gadget client has been reset. You may need to reconnect.'
    });
  }, []);
  
  // Get detailed status - fixed the return type to avoid the Promise<Promise<...>> issue
  const getStatus = useCallback(async () => {
    return getGadgetStatus();
  }, []);
  
  return {
    isInitialized,
    isConnected,
    isConfigured,
    isHealthy,
    lastHealthCheck,
    lastConnectionTest,
    connectionStatus,
    healthCheckMessage,
    config,
    testConnection,
    checkHealth,
    resetClient,
    getStatus
  };
};

export default useGadgetConnection;
