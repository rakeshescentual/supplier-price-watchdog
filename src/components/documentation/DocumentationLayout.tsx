
import React, { useState } from "react";
import { DocumentationHeader } from "./DocumentationHeader";
import { DocumentationTabs } from "./DocumentationTabs";
import { GadgetStatusBar } from "@/components/gadget/GadgetStatusBar";
import { useGadgetStatus } from "@/hooks/useGadgetStatus";
import { DocumentationGrid } from "./DocumentationGrid";
import { technicalDoc, gadgetFAQ, faqItems } from "./mockData";
import { useDocumentSection } from "@/hooks/useDocumentSection";

interface DocumentationLayoutProps {
  children?: React.ReactNode;
}

export const DocumentationLayout: React.FC<DocumentationLayoutProps> = ({ 
  children 
}) => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [quickRefOpen, setQuickRefOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("technical");
  const { activeSection, handleSectionClick } = useDocumentSection();
  const { isInitialized, healthStatus } = useGadgetStatus();
  
  // Get the content based on the active tab
  const getContent = () => {
    return activeTab === "technical" ? technicalDoc : gadgetFAQ;
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {isInitialized && <GadgetStatusBar />}
      
      <div className="container mx-auto py-6 md:py-8 px-4 flex-1">
        <DocumentationHeader 
          onToggleSearch={() => setShowSearch(!showSearch)} 
          onToggleQuickRef={() => setQuickRefOpen(!quickRefOpen)}
          showSearch={showSearch}
        />
        
        {!children && (
          <div className="animate-fade-in">
            <DocumentationTabs 
              showSearch={showSearch} 
              quickRefOpen={quickRefOpen}
              onQuickRefClose={() => setQuickRefOpen(false)}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            
            <DocumentationGrid 
              activeTab={activeTab}
              content={getContent()}
              activeSection={activeSection}
              onSectionClick={handleSectionClick}
              faqItems={faqItems}
            />
          </div>
        )}
        
        {children && (
          <div className="animate-fade-in mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
