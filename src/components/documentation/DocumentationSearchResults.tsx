
import React from "react";
import { TabsTrigger } from "@/components/ui/tabs";

interface SearchResultProps {
  searchTerm: string;
  searchResults: {
    technical: number;
    gadget: number;
    systemCore: number;
    fileAnalysis: number;
    gadgetDetails: number;
    googleWorkspace: number;
    applicationWorkflows: number;
    errorHandling: number;
  };
  type: "main" | "secondary";
}

export const DocumentationSearchResults: React.FC<SearchResultProps> = ({ 
  searchTerm, 
  searchResults,
  type
}) => {
  // Tabs to display in the main row
  const mainTabs = [
    { value: "technical", label: "Overview" },
    { value: "systemCore", label: "Core Components" },
    { value: "fileAnalysis", label: "File Analysis" },
    { value: "gadget", label: "Gadget.dev Guide" }
  ];
  
  // Tabs to display in the secondary row
  const secondaryTabs = [
    { value: "gadgetDetails", label: "Gadget Details" },
    { value: "googleWorkspace", label: "Google Workspace" },
    { value: "applicationWorkflows", label: "Workflows" },
    { value: "errorHandling", label: "Error Handling" }
  ];
  
  const tabsToRender = type === "main" ? mainTabs : secondaryTabs;
  
  return (
    <>
      {tabsToRender.map((tab) => (
        <TabsTrigger key={tab.value} value={tab.value}>
          {tab.label}
          {searchTerm && searchResults[tab.value as keyof typeof searchResults] > 0 && (
            <span className="ml-2 text-xs bg-primary/20 text-primary rounded-full px-1.5">
              {searchResults[tab.value as keyof typeof searchResults]}
            </span>
          )}
        </TabsTrigger>
      ))}
    </>
  );
};
