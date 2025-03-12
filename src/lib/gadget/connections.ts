
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
  'mailchimp' |
  'facebook' |      // Added new connection types
  'instagram' |     // from Gadget.dev's latest updates
  'twitter' |
  'slack' |
  'hubspot' |
  'zendesk' |
  'intercom';

/**
 * Connection authentication methods
 */
export type AuthMethod = 'oauth' | 'apiKey' | 'jwt' | 'basic';

/**
 * Connection configuration with enhanced options
 */
export interface ConnectionConfig {
  type: ConnectionType;
  name: string;
  credentials?: Record<string, any>;
  scopes?: string[];
  metadata?: Record<string, any>;
  authMethod?: AuthMethod;
  webhookUrl?: string;
  environment?: 'production' | 'development' | 'staging';
  expiresAt?: Date;
  refreshToken?: boolean;
}

/**
 * Standardized connection response
 */
export interface ConnectionResponse {
  success: boolean;
  connectionId?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

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

/**
 * List available connections with enhanced filtering
 * @param filters Optional filters for connections
 * @returns Promise resolving to list of connections
 */
export const listGadgetConnections = async (
  filters?: {
    type?: ConnectionType;
    status?: 'active' | 'error' | 'pending';
    environment?: 'production' | 'development' | 'staging';
    search?: string;
  }
): Promise<{ 
  success: boolean; 
  connections: Array<{
    id: string;
    type: ConnectionType;
    name: string;
    status: 'active' | 'error' | 'pending';
    createdAt: Date;
    environment?: string;
    expiresAt?: Date;
    scopes?: string[];
  }>;
  error?: {
    code: string;
    message: string;
  };
}> => {
  try {
    logInfo('Listing connections', { filters }, 'connections');
    
    // Get Gadget client
    const client = initGadgetClient();
    if (!client) {
      throw new Error('Gadget client not initialized');
    }
    
    // For development, return mock data
    // In production with Gadget.dev:
    // const result = await client.connections.list(filters);
    // return { 
    //   success: true, 
    //   connections: result.map(conn => ({
    //     id: conn.id,
    //     type: conn.type as ConnectionType,
    //     name: conn.name,
    //     status: conn.status,
    //     createdAt: new Date(conn.createdAt),
    //     environment: conn.environment,
    //     expiresAt: conn.expiresAt ? new Date(conn.expiresAt) : undefined,
    //     scopes: conn.scopes
    //   }))
    // };
    
    // Development mock
    const mockConnections = [
      {
        id: 'shopify_1234',
        type: 'shopify' as ConnectionType,
        name: 'My Shopify Store',
        status: 'active' as const,
        createdAt: new Date(),
        environment: 'production',
        scopes: ['read_products', 'write_products']
      }
    ];
    
    // Apply filters if specified
    let filteredConnections = [...mockConnections];
    
    if (filters?.type) {
      filteredConnections = filteredConnections.filter(conn => conn.type === filters.type);
    }
    
    if (filters?.status) {
      filteredConnections = filteredConnections.filter(conn => conn.status === filters.status);
    }
    
    if (filters?.environment) {
      filteredConnections = filteredConnections.filter(conn => conn.environment === filters.environment);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredConnections = filteredConnections.filter(conn => 
        conn.name.toLowerCase().includes(searchLower) || 
        conn.id.toLowerCase().includes(searchLower)
      );
    }
    
    return { 
      success: true, 
      connections: filteredConnections 
    };
  } catch (error) {
    logError('Error listing connections', { error, filters }, 'connections');
    
    return { 
      success: false, 
      connections: [],
      error: {
        code: error instanceof Error ? 'LIST_ERROR' : 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : "Unknown error occurred"
      }
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
): Promise<ConnectionResponse> => {
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
    
    return { 
      success: false,
      error: {
        code: error instanceof Error ? 'DELETE_ERROR' : 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : "Unknown error occurred"
      }
    };
  }
};

/**
 * Get connection status and details with enhanced information
 * @param connectionId ID of the connection to check
 * @returns Promise resolving to connection details
 */
export const getGadgetConnectionStatus = async (
  connectionId: string
): Promise<{ 
  success: boolean; 
  status?: 'active' | 'error' | 'pending';
  details?: {
    lastSyncedAt?: string;
    scopes?: string[];
    expiresAt?: string;
    refreshTokenAt?: string;
    environment?: string;
    rateLimits?: {
      remaining: number;
      limit: number;
      resetAt: string;
    };
    metrics?: {
      requestsToday: number;
      errorsToday: number;
      averageLatency: number;
    };
  };
  error?: {
    code: string;
    message: string;
  };
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
    //   details: {
    //     lastSyncedAt: connection.lastSyncedAt,
    //     scopes: connection.scopes,
    //     expiresAt: connection.expiresAt,
    //     refreshTokenAt: connection.refreshTokenAt,
    //     environment: connection.environment,
    //     rateLimits: connection.rateLimits,
    //     metrics: connection.metrics
    //   }
    // };
    
    // Development mock with enhanced data
    return { 
      success: true, 
      status: 'active',
      details: {
        lastSyncedAt: new Date().toISOString(),
        scopes: ['read_products', 'write_products'],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        refreshTokenAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        environment: 'production',
        rateLimits: {
          remaining: 980,
          limit: 1000,
          resetAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour from now
        },
        metrics: {
          requestsToday: 210,
          errorsToday: 2,
          averageLatency: 145 // ms
        }
      }
    };
  } catch (error) {
    logError('Error getting connection status', { error, connectionId }, 'connections');
    
    return { 
      success: false,
      error: {
        code: error instanceof Error ? 'STATUS_ERROR' : 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : "Unknown error occurred"
      }
    };
  }
};

/**
 * Refresh a connection's authentication tokens
 * @param connectionId ID of the connection to refresh
 * @returns Promise resolving to success status
 */
export const refreshGadgetConnection = async (
  connectionId: string
): Promise<ConnectionResponse> => {
  try {
    logInfo('Refreshing connection', { connectionId }, 'connections');
    
    // Get Gadget client
    const client = initGadgetClient();
    if (!client) {
      throw new Error('Gadget client not initialized');
    }
    
    // For development, return mock success
    // In production with Gadget.dev:
    // await client.connections.refresh(connectionId);
    
    toast.success("Connection refreshed", {
      description: "The connection authentication has been refreshed"
    });
    
    return { success: true };
  } catch (error) {
    logError('Error refreshing connection', { error, connectionId }, 'connections');
    
    toast.error("Connection refresh failed", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    
    return { 
      success: false,
      error: {
        code: error instanceof Error ? 'REFRESH_ERROR' : 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : "Unknown error occurred"
      }
    };
  }
};

/**
 * Test a connection's API access
 * @param connectionId ID of the connection to test
 * @returns Promise resolving to success status and test results
 */
export const testGadgetConnectionAccess = async (
  connectionId: string
): Promise<{
  success: boolean;
  canRead?: boolean;
  canWrite?: boolean;
  latency?: number;
  error?: {
    code: string;
    message: string;
  };
}> => {
  try {
    logInfo('Testing connection access', { connectionId }, 'connections');
    
    // Get Gadget client
    const client = initGadgetClient();
    if (!client) {
      throw new Error('Gadget client not initialized');
    }
    
    // For development, return mock results
    // In production with Gadget.dev:
    // const result = await client.connections.testAccess(connectionId);
    // return { 
    //   success: true, 
    //   canRead: result.canRead,
    //   canWrite: result.canWrite,
    //   latency: result.latency
    // };
    
    // Development mock
    return { 
      success: true, 
      canRead: true,
      canWrite: true,
      latency: 87 // ms
    };
  } catch (error) {
    logError('Error testing connection access', { error, connectionId }, 'connections');
    
    return { 
      success: false,
      error: {
        code: error instanceof Error ? 'TEST_ERROR' : 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : "Unknown error occurred"
      }
    };
  }
};
