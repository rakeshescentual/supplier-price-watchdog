
/**
 * Connection testing utilities for Gadget.dev API
 */
import { GadgetConfig } from '@/types/price';
import { getGadgetApiUrl } from './urls';
import { createGadgetHeaders } from './auth';

/**
 * Test Gadget connection and configuration
 */
export async function testGadgetConnection(config: GadgetConfig): Promise<boolean> {
  try {
    const url = `${getGadgetApiUrl(config)}status`;
    const response = await fetch(url, {
      method: 'GET',
      headers: createGadgetHeaders(config)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    return data.ready === true;
  } catch (error) {
    console.error("Gadget connection test failed:", error);
    return false;
  }
}
