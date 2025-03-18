
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, BookOpen, Bookmark } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { DocumentationSearch } from "./DocumentationSearch";
import { QuickReferenceGuide } from "./QuickReferenceGuide";
import { DocumentationNavigationControls } from "./DocumentationNavigationControls";
import { DocumentationBookmarks } from "./DocumentationBookmarks";
import { GadgetBadge } from "@/components/gadget/GadgetBadge";
import { Badge } from "@/components/ui/badge";

interface DocumentationTabContentProps {
  activeTab: string;
  title: string;
  description: string;
  content: string;
  bookmarks: string[];
  showSearch: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchResults: {
    technical: number;
    gadget: number;
  };
  quickRefOpen: boolean;
  onQuickRefClose: () => void;
  onBookmark: (section: string) => void;
  onDownload: (content: string, filename: string) => void;
  additionalContent?: React.ReactNode;
  otherDocumentation: string;
}

export const DocumentationTabContent: React.FC<DocumentationTabContentProps> = ({
  activeTab,
  title,
  description,
  content,
  bookmarks,
  showSearch,
  searchTerm,
  onSearchChange,
  searchResults,
  quickRefOpen,
  onQuickRefClose,
  onBookmark,
  onDownload,
  additionalContent,
  otherDocumentation,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              {title}
              {activeTab === 'gadget' && (
                <GadgetBadge 
                  className="ml-3" 
                  showEnvironment={false} 
                  showLastChecked={false}
                />
              )}
            </CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          
          {activeTab === 'gadget' && (
            <Badge variant="outline" className="text-xs">
              <BookOpen className="h-3 w-3 mr-1" /> 
              Integration Guide
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showSearch && (
          <DocumentationSearch 
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            searchResults={searchResults}
            activeTab={activeTab}
          />
        )}
        
        {quickRefOpen && (
          <QuickReferenceGuide 
            activeTab={activeTab}
            onClose={onQuickRefClose}
            onDownload={onDownload}
            technicalDocumentation={activeTab === "technical" ? content : otherDocumentation}
            gadgetIntegrationGuide={activeTab === "gadget" ? content : otherDocumentation}
          />
        )}
        
        <DocumentationNavigationControls 
          onBookmark={onBookmark}
          activeTab={activeTab}
        />
        
        <ScrollArea className="h-[70vh] w-full pr-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>
              {content}
            </ReactMarkdown>
            
            {additionalContent}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div>
          <DocumentationBookmarks bookmarks={bookmarks} />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDownload(content, `${title.replace(/\s+/g, '')}.md`)}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Documentation
        </Button>
      </CardFooter>
    </Card>
  );
};
