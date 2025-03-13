
/**
 * Connection testing functionality for Gadget.dev
 */
import { logInfo, logError } from '../logging';
import { initGadgetClient } from '../client';

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
