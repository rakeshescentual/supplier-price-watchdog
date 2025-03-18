
import React from "react";
import { TableOfContents } from "./TableOfContents";
import { DocumentationMainContent } from "./DocumentationMainContent";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface DocumentationGridProps {
  activeTab: string;
  content: string;
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  faqItems: Array<{
    question: string;
    answer: string;
  }>;
}

export const DocumentationGrid: React.FC<DocumentationGridProps> = ({
  activeTab,
  content,
  activeSection,
  onSectionClick,
  faqItems
}) => {
  return (
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Mobile Table of Contents */}
      <div className="lg:hidden mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex justify-between items-center">
              <span>Table of Contents</span>
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[350px]">
            <div className="h-[calc(100vh-80px)] overflow-y-auto py-6">
              <TableOfContents 
                content={content} 
                activeSection={activeSection}
                onSectionClick={onSectionClick}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Desktop Sidebar with Table of Contents */}
      <div className="hidden lg:block lg:col-span-1">
        <Card className="sticky top-6 border shadow-sm h-[calc(100vh-220px)] overflow-hidden rounded-md">
          <div className="h-full overflow-y-auto p-4">
            <TableOfContents 
              content={content} 
              activeSection={activeSection}
              onSectionClick={onSectionClick}
            />
          </div>
        </Card>
      </div>
      
      {/* Main content area */}
      <div className="lg:col-span-4">
        <Card className="border shadow-sm p-5 md:p-6 rounded-md bg-white">
          <DocumentationMainContent 
            activeTab={activeTab}
            content={content}
            faqItems={faqItems}
          />
        </Card>
      </div>
    </div>
  );
};
