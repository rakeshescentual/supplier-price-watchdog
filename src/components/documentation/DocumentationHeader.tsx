
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Lightbulb, FileText, Download, BookOpen, Info, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GADGET_VERSION } from "@/utils/gadget";

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
  // Get the current version from Gadget utils
  const currentVersion = GADGET_VERSION;
  
  // Format the last updated date
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  
  return (
    <div className="bg-white border-b pb-4 mb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div className="flex items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 flex items-center">
              Documentation
              <Badge variant="outline" className="ml-3 text-xs font-normal bg-blue-50 text-blue-700 border-blue-200">
                v{currentVersion}
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.open('/docs/TechnicalDocumentation.md', '_blank')}>
                <FileText className="h-4 w-4 mr-2" /> Technical Documentation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open('/docs/Gadget_Integration_Guide.md', '_blank')}>
                <Info className="h-4 w-4 mr-2" /> Gadget Integration Guide
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open('/docs/UserGuide.md', '_blank')}>
                <FileText className="h-4 w-4 mr-2" /> User Guide
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="default"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => window.open('https://docs.gadget.dev/api-reference', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View API Docs
          </Button>
        </div>
      </div>
      
      {/* Last updated info */}
      <div className="flex items-center mt-4">
        <Badge variant="outline" className="text-xs font-normal bg-gray-50 text-gray-600 border-gray-200">
          Last updated: {lastUpdated}
        </Badge>
        
        <div className="text-xs text-gray-500 ml-4 flex items-center">
          <BookOpen className="h-3 w-3 mr-1 inline" />
          <span>Updated with latest Gadget.dev integration patterns</span>
        </div>
      </div>
    </div>
  );
};
