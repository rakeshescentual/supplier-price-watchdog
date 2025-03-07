
/**
 * React hook for interacting with Gadget.dev services
 */
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  initGadgetClient, 
  testGadgetConnection,
  checkGadgetHealth,
  getGadgetStatus
} from '@/lib/gadget/client';
import { runGadgetDiagnostics } from '@/lib/gadget/diagnostics';
import { getGadgetConfig } from '@/utils/gadget-helpers';
import { GadgetConfig } from '@/types/price';

export interface UseGadgetConnectionResult {
  isInitialized: boolean;
  isConnected: boolean;
  isHealthy: boolean;
  status: {
    environment: string;
    appId?: string;
    featureFlags: Record<string, boolean>;
  };
  lastChecked: Date | null;
  testConnection: (config?: GadgetConfig) => Promise<boolean>;
  checkHealth: () => Promise<{ healthy: boolean; message?: string }>;
  runDiagnostics: () => Promise<any>;
  refreshClient: () => void;
}

export const useGadgetConnection = (): UseGadgetConnectionResult => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isHealthy, setIsHealthy] = useState(false);
  const [status, setStatus] = useState({
    environment: 'development',
    appId: undefined as string | undefined,
    featureFlags: {} as Record<string, boolean>
  });
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    // Initialize on mount
    const client = initGadgetClient();
    setIsInitialized(!!client?.ready);
    
    if (client?.ready) {
      const currentStatus = getGadgetStatus();
      setStatus({
        environment: currentStatus.environment,
        appId: currentStatus.appId,
        featureFlags: currentStatus.featureFlags
      });
    }
    
    // Check connection status on mount if initialized
    if (client?.ready) {
      testConnection();
    }
  }, []);

  const testConnection = useCallback(async (config?: GadgetConfig): Promise<boolean> => {
    try {
      const connected = await testGadgetConnection(config);
      setIsConnected(connected);
      setLastChecked(new Date());
      
      if (connected) {
        // If connected, also check health
        const health = await checkGadgetHealth();
        setIsHealthy(health.healthy);
      } else {
        setIsHealthy(false);
      }
      
      return connected;
    } catch (error) {
      console.error('Error testing Gadget connection:', error);
      setIsConnected(false);
      setIsHealthy(false);
      setLastChecked(new Date());
      return false;
    }
  }, []);

  const checkHealth = useCallback(async (): Promise<{ healthy: boolean; message?: string }> => {
    try {
      const health = await checkGadgetHealth();
      setIsHealthy(health.healthy);
      setLastChecked(new Date());
      return { 
        healthy: health.healthy, 
        message: health.message 
      };
    } catch (error) {
      console.error('Error checking Gadget health:', error);
      setIsHealthy(false);
      setLastChecked(new Date());
      return { 
        healthy: false, 
        message: error instanceof Error ? error.message : 'Unknown error checking health' 
      };
    }
  }, []);

  const runDiagnostics = useCallback(async () => {
    try {
      const diagnostics = await runGadgetDiagnostics({
        checkConnection: true,
        checkHealth: true,
        checkFeatureFlags: true
      });
      
      setLastChecked(new Date());
      
      // Update status based on diagnostics
      setIsConnected(diagnostics.status !== 'down');
      setIsHealthy(diagnostics.status === 'healthy');
      
      return diagnostics;
    } catch (error) {
      console.error('Error running Gadget diagnostics:', error);
      toast.error('Diagnostics error', {
        description: 'Could not run Gadget diagnostics'
      });
      return null;
    }
  }, []);

  const refreshClient = useCallback(() => {
    const config = getGadgetConfig();
    if (!config) {
      setIsInitialized(false);
      setIsConnected(false);
      setIsHealthy(false);
      return;
    }
    
    const client = initGadgetClient();
    setIsInitialized(!!client?.ready);
    
    if (client?.ready) {
      const currentStatus = getGadgetStatus();
      setStatus({
        environment: currentStatus.environment,
        appId: currentStatus.appId,
        featureFlags: currentStatus.featureFlags
      });
      
      // Test connection after refresh
      testConnection();
    }
  }, [testConnection]);

  return {
    isInitialized,
    isConnected,
    isHealthy,
    status,
    lastChecked,
    testConnection,
    checkHealth,
    runDiagnostics,
    refreshClient
  };
};

export default useGadgetConnection;
