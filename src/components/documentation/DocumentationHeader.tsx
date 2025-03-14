
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Lightbulb } from "lucide-react";

interface DocumentationHeaderProps {
  onToggleSearch: () => void;
  onToggleQuickRef: () => void;
  showSearch: boolean;
}

export const DocumentationHeader: React.FC<DocumentationHeaderProps> = ({
  onToggleSearch,
  onToggleQuickRef,
  showSearch,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Documentation</h1>
      <div className="space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleSearch}
        >
          <Search className="h-4 w-4 mr-2" />
          {showSearch ? "Hide Search" : "Search Docs"}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleQuickRef}
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Quick Reference
        </Button>
      </div>
    </div>
  );
};
