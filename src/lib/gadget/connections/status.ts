
/**
 * Connection status functionality for Gadget.dev
 */
import { logInfo, logError } from '../logging';
import { initGadgetClient } from '../client';

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
