
import React, { useEffect } from "react";
import { DocumentationLayout } from "@/components/documentation/DocumentationLayout";
import { useGadgetFeatures } from "@/hooks/useGadgetFeatures";
import { toast } from "sonner";

const Documentation = () => {
  const { isGadgetInitialized } = useGadgetFeatures();
  
  useEffect(() => {
    // Show a welcome toast when the documentation page loads
    toast.info("Documentation Center", {
      description: "Browse technical guides and Gadget integration information."
    });
  }, []);
  
  return (
    <DocumentationLayout />
  );
};

export default Documentation;
