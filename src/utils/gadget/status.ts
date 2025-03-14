
/**
 * Gadget.dev status check utilities
 */
import { getGadgetConfig } from '../gadget-helpers';
import { initGadgetClient, checkGadgetHealth, isHealthy } from '@/lib/gadget/client';
import { logError } from '@/lib/gadget/logging';

/**
 * Check if Gadget integration is fully configured and operational
 * @returns Promise resolving to status object
 */
export const checkGadgetReadiness = async (): Promise<{
  configured: boolean;
  operational: boolean;
  message: string;
}> => {
  // Check if configuration exists
  const config = getGadgetConfig();
  
  if (!config) {
    return {
      configured: false,
      operational: false,
      message: "Gadget is not configured. Please set up your Gadget.dev configuration."
    };
  }
  
  try {
    // Check if client can be initialized
    const client = initGadgetClient();
    
    if (!client) {
      return {
        configured: true,
        operational: false,
        message: "Gadget client initialization failed. Please check your configuration."
      };
    }
    
    // Check API health
    const health = await checkGadgetHealth();
    
    if (health.status !== 'healthy') {
      return {
        configured: true,
        operational: false,
        message: health.message || "Gadget service is not operational."
      };
    }
    
    // All checks passed
    return {
      configured: true,
      operational: true,
      message: "Gadget integration is fully operational."
    };
  } catch (error) {
    logError("Error checking Gadget readiness", { error }, 'integration');
    
    return {
      configured: true,
      operational: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
};

/**
 * Verify Gadget connection health
 */
export async function checkGadgetConnectionHealth(): Promise<boolean> {
  try {
    const health = await checkGadgetHealth();
    return isHealthy(health);
  } catch (error) {
    console.error("Failed to check Gadget connection health:", error);
    return false;
  }
}
