
import React, { useState } from "react";
import { DocumentationHeader } from "./DocumentationHeader";
import { DocumentationTabs } from "./DocumentationTabs";
import { GadgetStatusBar } from "@/components/gadget/GadgetStatusBar";
import { useGadgetStatus } from "@/hooks/useGadgetStatus";
import { DocumentationGrid } from "./DocumentationGrid";
import { technicalDoc, gadgetFAQ, faqItems } from "./mockData";

interface DocumentationLayoutProps {
  children?: React.ReactNode;
}

export const DocumentationLayout: React.FC<DocumentationLayoutProps> = ({ 
  children 
}) => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [quickRefOpen, setQuickRefOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("technical");
  const [activeSection, setActiveSection] = useState<string>("");
  const { isInitialized, healthStatus } = useGadgetStatus();
  
  // Get the content based on the active tab
  const getContent = () => {
    return activeTab === "technical" ? technicalDoc : gadgetFAQ;
  };

  // Scroll to a section when clicked in the table of contents
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  
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
        
        {children}
      </div>
    </div>
  );
};
