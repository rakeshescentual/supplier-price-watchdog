
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Lightbulb, FileText, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
    <div className="bg-white border-b pb-4 mb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Documentation</h1>
          <p className="text-sm text-gray-500 mt-1">
            Comprehensive guides and references for using Supplier Price Watch
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onToggleSearch}
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Search className="h-4 w-4 mr-2" />
            {showSearch ? "Hide Search" : "Search Docs"}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onToggleQuickRef}
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Quick Reference
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => window.open('docs/TechnicalDocumentation.md', '_blank')}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};
