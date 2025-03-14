
import React, { useState } from "react";
import { DocumentationHeader } from "./DocumentationHeader";
import { DocumentationTabs } from "./DocumentationTabs";

interface DocumentationLayoutProps {
  children?: React.ReactNode;
}

export const DocumentationLayout: React.FC<DocumentationLayoutProps> = ({ 
  children 
}) => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [quickRefOpen, setQuickRefOpen] = useState<boolean>(false);
  
  return (
    <div className="container mx-auto py-8 px-4">
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
  );
};
