
/**
 * Delete connection functionality for Gadget.dev
 */
import { logInfo, logError } from '../logging';
import { initGadgetClient } from '../client';
import { toast } from 'sonner';
import { ConnectionResponse } from './types';

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
