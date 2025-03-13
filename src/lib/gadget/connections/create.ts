
/**
 * Create connection functionality for Gadget.dev
 */
import { logInfo, logError } from '../logging';
import { initGadgetClient } from '../client';
import { startPerformanceTracking } from '../telemetry';
import { toast } from 'sonner';
import { ConnectionConfig, ConnectionResponse } from './types';

/**
 * Create a new connection to an external service via Gadget
 * @param config Connection configuration
 * @returns Promise resolving to connection details
 */
export const createGadgetConnection = async (
  config: ConnectionConfig
): Promise<ConnectionResponse> => {
  const finishTracking = startPerformanceTracking('createGadgetConnection', { 
    type: config.type
  });
  
  try {
    logInfo(`Creating ${config.type} connection`, { name: config.name }, 'connections');
    
    // Get Gadget client
    const client = initGadgetClient();
    if (!client) {
      throw new Error('Gadget client not initialized');
    }
    
    // For development, return mock data
    // In production with Gadget.dev:
    // const result = await client.connections.create({
    //   type: config.type,
    //   name: config.name,
    //   credentials: config.credentials,
    //   scopes: config.scopes,
    //   metadata: config.metadata,
    //   authMethod: config.authMethod,
    //   webhookUrl: config.webhookUrl,
    //   environment: config.environment,
    //   refreshToken: config.refreshToken
    // });
    // return { 
    //   success: true, 
    //   connectionId: result.id 
    // };
    
    // Development mock
    const mockConnectionId = `${config.type}_${Date.now()}`;
    
    finishTracking();
    
    toast.success("Connection created", {
      description: `Successfully connected to ${config.name}`
    });
    
    return { 
      success: true, 
      connectionId: mockConnectionId 
    };
  } catch (error) {
    logError('Error creating connection', { error, config }, 'connections');
    finishTracking();
    
    toast.error("Connection failed", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    
    return { 
      success: false, 
      error: {
        code: error instanceof Error ? 'CONNECTION_ERROR' : 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : "Unknown error occurred"
      }
    };
  }
};
