
/**
 * Display utilities for Gadget status
 */
import { toast } from 'sonner';
import { checkGadgetHealth } from './health';

/**
 * Display Gadget service status to user
 */
export const displayGadgetStatus = async (): Promise<void> => {
  try {
    const health = await checkGadgetHealth();
    
    if (health.healthy) {
      toast.success("Gadget Services", {
        description: "All Gadget services are operational."
      });
    } else {
      toast.warning("Gadget Services", {
        description: health.message || "Some Gadget services may be degraded."
      });
    }
  } catch (error) {
    toast.error("Gadget Status Check Failed", {
      description: "Could not determine Gadget service status."
    });
  }
};

