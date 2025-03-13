
/**
 * List connections functionality for Gadget.dev
 */
import { logInfo, logError } from '../logging';
import { initGadgetClient } from '../client';
import { ConnectionType } from './types';

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
