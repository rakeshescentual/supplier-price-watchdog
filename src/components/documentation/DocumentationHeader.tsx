
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Lightbulb, FileText, Download, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
        <div className="flex items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 flex items-center">
              Documentation
              <Badge variant="outline" className="ml-3 text-xs font-normal bg-blue-50 text-blue-700 border-blue-200">
                v1.2.0
              </Badge>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Comprehensive guides and references for using Supplier Price Watch
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onToggleSearch}
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {showSearch ? "Hide Search" : "Search Docs"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search documentation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onToggleQuickRef}
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Quick Reference
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show quick reference guide</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => window.open('/docs/TechnicalDocumentation.md', '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download full documentation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button
            variant="default"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            View API Docs
          </Button>
        </div>
      </div>
    </div>
  );
};
