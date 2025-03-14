
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface DocumentationSearchProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  searchResults: {
    technical: number;
    gadget: number;
  };
  activeTab: string;
}

export const DocumentationSearch: React.FC<DocumentationSearchProps> = ({
  searchTerm,
  onSearchChange,
  searchResults,
  activeTab,
}) => {
  return (
    <div className="relative flex items-center mb-4">
      <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search documentation..."
        className="pl-8 pr-10"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchTerm && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute right-1 h-7 w-7 p-0"
          onClick={() => onSearchChange("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      {searchTerm && (
        <div className="absolute right-10 text-xs text-muted-foreground">
          {searchResults[activeTab as 'technical' | 'gadget']} results
        </div>
      )}
    </div>
  );
};
