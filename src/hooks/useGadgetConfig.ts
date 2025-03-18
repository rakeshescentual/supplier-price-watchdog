
import { useState } from "react";
import { toast } from "sonner";
import { GadgetConfig } from "@/utils/gadget/types";
import { getGadgetConfig, saveGadgetConfig } from "@/utils/gadget/config";
import { testGadgetConnection } from "@/utils/gadget/connection";

export function useGadgetConfig() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  // Load existing config
  const existingConfig = getGadgetConfig();

  const handleSaveConfig = async (config: GadgetConfig) => {
    setIsSubmitting(true);
    
    try {
      // Save the configuration
      saveGadgetConfig(config);
      
      // Test the connection
      const result = await testGadgetConnection(config);
      
      if (result.success) {
        toast.success('Connection successful', {
          description: result.message,
        });
      } else {
        toast.warning('Configuration saved, but connection failed', {
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error saving Gadget configuration:", error);
      toast.error('Error saving configuration', {
        description: 'Please check your configuration and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestConnection = async (config: GadgetConfig) => {
    setIsTesting(true);
    
    try {
      // Save config before testing
      saveGadgetConfig(config);
      
      const result = await testGadgetConnection(config);
      
      if (result.success) {
        toast.success('Connection successful', {
          description: result.message,
        });
      } else {
        toast.error('Connection failed', {
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error testing Gadget connection:", error);
      toast.error('Error testing connection', {
        description: 'Please check your configuration and try again.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return {
    existingConfig,
    isSubmitting,
    isTesting,
    handleSaveConfig,
    handleTestConnection
  };
}
