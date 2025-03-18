
/**
 * Connection testing utilities for Gadget.dev API
 */
import { GadgetConfig, GadgetConnectionTestResult } from './types';
import { getGadgetApiUrl } from './urls';
import { createGadgetHeaders } from './auth';

/**
 * Test Gadget connection and configuration
 */
export async function testGadgetConnection(config: GadgetConfig): Promise<GadgetConnectionTestResult> {
  try {
    const url = `${getGadgetApiUrl(config)}status`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: createGadgetHeaders(config)
    });
    
    if (!response.ok) {
      return {
        success: false,
        message: `HTTP Error: ${response.status} ${response.statusText}`
      };
    }
    
    const data = await response.json();
    
    if (data.ready === true) {
      return {
        success: true,
        message: "Connected to Gadget successfully",
        details: {
          apiVersion: data.version || "unknown",
          environment: config.environment
        }
      };
    }
    
    return {
      success: false,
      message: data.message || "Gadget service not ready",
      details: data
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error connecting to Gadget",
      details: { error }
    };
  }
}
