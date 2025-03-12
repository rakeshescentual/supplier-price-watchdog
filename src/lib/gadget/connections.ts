
/**
 * Gadget Connections API integration
 * 
 * This module provides functionality for managing external connections
 * using Gadget.dev's Connections API.
 */
import { logInfo, logError } from './logging';
import { initGadgetClient } from './client';
import { startPerformanceTracking } from './telemetry';
import { toast } from 'sonner';

/**
 * Connection types supported by Gadget
 */
export type ConnectionType = 
  'shopify' | 
  'stripe' | 
  'klaviyo' | 
  'googleAnalytics' | 
  'googleCloud' |
  'aws' |
  'salesforce' |
  'mailchimp';

/**
 * Connection configuration
 */
export interface ConnectionConfig {
  type: ConnectionType;
  name: string;
  credentials?: Record<string, any>;
  scopes?: string[];
  metadata?: Record<string, any>;
}

/**
 * Create a new connection to an external service via Gadget
 * @param config Connection configuration
 * @returns Promise resolving to connection details
 */
export const createGadgetConnection = async (
  config: ConnectionConfig
): Promise<{ success: boolean; connectionId?: string }> => {
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
    //   metadata: config.metadata
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
    
    return { success: false };
  }
};

/**
 * List available connections
 * @param type Optional connection type to filter by
 * @returns Promise resolving to list of connections
 */
export const listGadgetConnections = async (
  type?: ConnectionType
): Promise<{ 
  success: boolean; 
  connections: Array<{
    id: string;
    type: ConnectionType;
    name: string;
    status: 'active' | 'error' | 'pending';
    createdAt: Date;
  }> 
}> => {
  try {
    logInfo('Listing connections', { type }, 'connections');
    
    // Get Gadget client
    const client = initGadgetClient();
    if (!client) {
      throw new Error('Gadget client not initialized');
    }
    
    // For development, return mock data
    // In production with Gadget.dev:
    // const filters = type ? { type } : {};
    // const result = await client.connections.list(filters);
    // return { 
    //   success: true, 
    //   connections: result.map(conn => ({
    //     id: conn.id,
    //     type: conn.type as ConnectionType,
    //     name: conn.name,
    //     status: conn.status,
    //     createdAt: new Date(conn.createdAt)
    //   }))
    // };
    
    // Development mock
    const mockConnections = [
      {
        id: 'shopify_1234',
        type: 'shopify' as ConnectionType,
        name: 'My Shopify Store',
        status: 'active' as const,
        createdAt: new Date()
      }
    ];
    
    // Filter by type if specified
    const filteredConnections = type 
      ? mockConnections.filter(conn => conn.type === type)
      : mockConnections;
    
    return { 
      success: true, 
      connections: filteredConnections 
    };
  } catch (error) {
    logError('Error listing connections', { error, type }, 'connections');
    
    return { 
      success: false, 
      connections: [] 
    };
  }
};

/**
 * Delete a connection
 * @param connectionId ID of the connection to delete
 * @returns Promise resolving to success status
 */
export const deleteGadgetConnection = async (
  connectionId: string
): Promise<{ success: boolean }> => {
  try {
    logInfo('Deleting connection', { connectionId }, 'connections');
    
    // Get Gadget client
    const client = initGadgetClient();
    if (!client) {
      throw new Error('Gadget client not initialized');
    }
    
    // For development, return mock success
    // In production with Gadget.dev:
    // await client.connections.delete(connectionId);
    
    toast.success("Connection removed", {
      description: "The connection has been successfully removed"
    });
    
    return { success: true };
  } catch (error) {
    logError('Error deleting connection', { error, connectionId }, 'connections');
    
    toast.error("Connection removal failed", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    
    return { success: false };
  }
};

/**
 * Get connection status and details
 * @param connectionId ID of the connection to check
 * @returns Promise resolving to connection details
 */
export const getGadgetConnectionStatus = async (
  connectionId: string
): Promise<{ 
  success: boolean; 
  status?: 'active' | 'error' | 'pending';
  details?: Record<string, any>;
}> => {
  try {
    logInfo('Getting connection status', { connectionId }, 'connections');
    
    // Get Gadget client
    const client = initGadgetClient();
    if (!client) {
      throw new Error('Gadget client not initialized');
    }
    
    // For development, return mock data
    // In production with Gadget.dev:
    // const connection = await client.connections.get(connectionId);
    // return { 
    //   success: true, 
    //   status: connection.status,
    //   details: connection.details
    // };
    
    // Development mock
    return { 
      success: true, 
      status: 'active',
      details: {
        lastSyncedAt: new Date().toISOString(),
        scope: ['read_products', 'write_products']
      }
    };
  } catch (error) {
    logError('Error getting connection status', { error, connectionId }, 'connections');
    
    return { success: false };
  }
};
