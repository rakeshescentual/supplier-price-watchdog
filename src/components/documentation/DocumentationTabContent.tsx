
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { DocumentationSearch } from "./DocumentationSearch";
import { QuickReferenceGuide } from "./QuickReferenceGuide";
import { DocumentationNavigationControls } from "./DocumentationNavigationControls";
import { DocumentationBookmarks } from "./DocumentationBookmarks";

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
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
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
      <CardFooter className="flex justify-between">
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
