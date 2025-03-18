
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DocumentationSearch } from "./DocumentationSearch";
import { QuickReferenceGuide } from "./QuickReferenceGuide";
import { GadgetBadge } from "@/components/gadget/GadgetBadge";

interface DocumentationTabsProps {
  showSearch: boolean;
  quickRefOpen: boolean;
  onQuickRefClose: () => void;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const DocumentationTabs: React.FC<DocumentationTabsProps> = ({
  showSearch,
  quickRefOpen,
  onQuickRefClose,
  activeTab,
  onTabChange
}) => {
  const searchResults = {
    technical: 12,
    gadget: 8
  };

  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    // In a real app, you would trigger a search here
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <TabsList className="mb-0">
            <TabsTrigger value="technical">Technical Documentation</TabsTrigger>
            <TabsTrigger value="gadget" className="flex items-center gap-2">
              Gadget Integration
              <GadgetBadge 
                showEnvironment={false} 
                showLastChecked={false}
                className="ml-1"
              />
            </TabsTrigger>
          </TabsList>
          
          {/* Empty TabsContent to satisfy Radix UI requirements */}
          <TabsContent value="technical" className="mt-0">
            {/* Content managed by parent component */}
          </TabsContent>
          <TabsContent value="gadget" className="mt-0">
            {/* Content managed by parent component */}
          </TabsContent>
        </div>
      </Tabs>
      
      {showSearch && (
        <div className="mt-4">
          <DocumentationSearch 
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            searchResults={searchResults}
            activeTab={activeTab}
          />
        </div>
      )}
      
      {quickRefOpen && (
        <div className="mt-4">
          <QuickReferenceGuide 
            activeTab={activeTab}
            onClose={onQuickRefClose}
            onDownload={() => {}}
            technicalDocumentation=""
            gadgetIntegrationGuide=""
          />
        </div>
      )}
    </div>
  );
};
