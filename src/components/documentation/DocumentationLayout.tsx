
import React, { useState } from "react";
import { DocumentationHeader } from "./DocumentationHeader";
import { DocumentationTabs } from "./DocumentationTabs";
import { GadgetStatusBar } from "@/components/gadget/GadgetStatusBar";
import { useGadgetStatus } from "@/hooks/useGadgetStatus";

interface DocumentationLayoutProps {
  children?: React.ReactNode;
}

export const DocumentationLayout: React.FC<DocumentationLayoutProps> = ({ 
  children 
}) => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [quickRefOpen, setQuickRefOpen] = useState<boolean>(false);
  const { isInitialized } = useGadgetStatus();
  
  return (
    <div className="flex flex-col min-h-screen">
      {isInitialized && <GadgetStatusBar />}
      
      <div className="container mx-auto py-8 px-4 flex-1">
        <DocumentationHeader 
          onToggleSearch={() => setShowSearch(!showSearch)} 
          onToggleQuickRef={() => setQuickRefOpen(!quickRefOpen)}
          showSearch={showSearch}
        />
        
        <DocumentationTabs 
          showSearch={showSearch} 
          quickRefOpen={quickRefOpen}
          onQuickRefClose={() => setQuickRefOpen(false)}
        />
        
        {children}
      </div>
    </div>
  );
};
