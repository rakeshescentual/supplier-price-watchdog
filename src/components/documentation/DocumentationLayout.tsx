
import React, { useState, useEffect } from "react";
import { DocumentationHeader } from "./DocumentationHeader";
import { DocumentationTabs } from "./DocumentationTabs";
import { GadgetStatusBar } from "@/components/gadget/GadgetStatusBar";
import { useGadgetStatus } from "@/hooks/useGadgetStatus";
import { TableOfContents } from "./TableOfContents";
import { DocumentationContent } from "./DocumentationContent";
import { DocumentationFAQ } from "./DocumentationFAQ";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Mock content - in a real app, this would come from a content management system
import technicalDoc from "@/assets/docs/TechnicalDocumentation.md";
import gadgetFAQ from "@/assets/docs/Gadget_FAQ.md";

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

  // Sample FAQ items
  const faqItems = [
    {
      question: "Is Gadget integration required to use this application?",
      answer: "No, Gadget integration is completely optional. The core functionality works without it, but certain advanced features are enhanced when Gadget is connected."
    },
    {
      question: "How do I get started with Gadget integration?",
      answer: "You can start by visiting the Settings page and navigating to the Integrations tab. From there, you'll find options to configure your Gadget connection with your API key and application ID."
    },
    {
      question: "What features are enhanced by Gadget?",
      answer: "Gadget enhances PDF processing capabilities, enables background jobs for resource-intensive operations, provides a managed database for historical pricing analysis, and offers API connections with various services."
    }
  ];
  
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
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with Table of Contents */}
          <div className="hidden lg:block">
            <TableOfContents 
              content={getContent()} 
              activeSection={activeSection}
              onSectionClick={handleSectionClick}
            />
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-3">
            <ScrollArea className="h-[calc(100vh-250px)]">
              <DocumentationContent 
                content={getContent()}
                type={activeTab as 'technical' | 'gadget'}
              />
              
              {activeTab === "gadget" && (
                <>
                  <Separator className="my-8" />
                  <DocumentationFAQ items={faqItems} />
                </>
              )}
            </ScrollArea>
          </div>
        </div>
        
        {children}
      </div>
    </div>
  );
};
