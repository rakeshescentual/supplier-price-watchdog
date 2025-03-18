
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getGadgetConfig } from '@/utils/gadget/config';
import { checkGadgetStatus } from '@/utils/gadget/status';

export const useGadgetContext = () => {
  const [isGadgetConfigured, setIsGadgetConfigured] = useState<boolean>(false);
  const [isGadgetConnected, setIsGadgetConnected] = useState<boolean>(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'ready' | 'degraded' | 'down'>('down');
  const [latency, setLatency] = useState<number | null>(null);

  // Check if Gadget is configured
  useEffect(() => {
    const config = getGadgetConfig();
    setIsGadgetConfigured(!!config && !!config.apiKey && !!config.appId);
  }, []);

  // Check connection status
  const checkConnection = useCallback(async (silent: boolean = false) => {
    if (!isGadgetConfigured) {
      setIsGadgetConnected(false);
      setConnectionStatus('down');
      return false;
    }

    setIsCheckingConnection(true);
    
    try {
      const result = await checkGadgetStatus({
        retry: true,
        retryAttempts: 2,
        retryDelay: 1000
      });
      
      setConnectionStatus(result.status);
      setIsGadgetConnected(result.status === 'ready');
      setLastChecked(new Date());
      setLatency(result.latency || null);
      
      if (!silent) {
        if (result.status === 'ready') {
          toast.success('Connected to Gadget', {
            description: `Successfully connected to Gadget services (${result.latency}ms)`,
          });
        } else if (result.status === 'degraded') {
          toast.warning('Gadget connection degraded', {
            description: result.message,
          });
        } else {
          toast.error('Failed to connect to Gadget', {
            description: result.message,
          });
        }
      }
      
      return result.status === 'ready';
    } catch (error) {
      console.error('Error checking Gadget connection:', error);
      setIsGadgetConnected(false);
      setConnectionStatus('down');
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (!silent) {
        toast.error('Connection error', {
          description: errorMessage,
        });
      }
      
      return false;
    } finally {
      setIsCheckingConnection(false);
    }
  }, [isGadgetConfigured]);

  // Check connection on mount
  useEffect(() => {
    if (isGadgetConfigured) {
      checkConnection(true);
    }
    
    // Set up periodic check every 5 minutes
    const intervalId = setInterval(() => {
      if (isGadgetConfigured) {
        checkConnection(true);
      }
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [isGadgetConfigured, checkConnection]);

  return {
    isGadgetConfigured,
    isGadgetConnected,
    isCheckingConnection,
    connectionStatus,
    lastChecked,
    latency,
    checkConnection,
  };
};
