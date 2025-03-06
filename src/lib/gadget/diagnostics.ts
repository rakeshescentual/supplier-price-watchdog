
import type { GadgetConfig } from '@/types/price';
import { getGadgetConfig } from '@/utils/gadget-helpers';
import { testGadgetConnection } from './client';

/**
 * Get diagnostic information about Gadget connection
 * @returns Promise resolving to diagnostics information
 */
export const getGadgetDiagnostics = async (): Promise<{
  isConfigured: boolean;
  isConnected: boolean;
  appId?: string;
  environment?: 'development' | 'production';
  featureFlags?: Record<string, boolean>;
  connectionLatency?: number;
  lastTestedAt?: Date;
  errors?: string[];
}> => {
  const config = getGadgetConfig();
  const diagnostics: {
    isConfigured: boolean;
    isConnected: boolean;
    appId?: string;
    environment?: 'development' | 'production';
    featureFlags?: Record<string, boolean>;
    connectionLatency?: number;
    lastTestedAt?: Date;
    errors?: string[];
  } = {
    isConfigured: !!config,
    isConnected: false
  };
  
  if (!config) {
    diagnostics.errors = ['Gadget is not configured'];
    return diagnostics;
  }
  
  diagnostics.appId = config.appId;
  diagnostics.environment = config.environment;
  diagnostics.featureFlags = config.featureFlags;
  
  try {
    const startTime = Date.now();
    const connected = await testGadgetConnection(config);
    const endTime = Date.now();
    
    diagnostics.isConnected = connected;
    diagnostics.connectionLatency = endTime - startTime;
    diagnostics.lastTestedAt = new Date();
    
    if (!connected) {
      diagnostics.errors = ['Connection test failed'];
    }
  } catch (error) {
    diagnostics.isConnected = false;
    diagnostics.errors = [error instanceof Error ? error.message : 'Unknown connection error'];
  }
  
  return diagnostics;
};
