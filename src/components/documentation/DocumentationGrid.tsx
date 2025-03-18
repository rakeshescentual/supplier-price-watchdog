
import React from "react";
import { TableOfContents } from "./TableOfContents";
import { DocumentationMainContent } from "./DocumentationMainContent";
import { Card } from "@/components/ui/card";

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
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar with Table of Contents */}
      <div className="hidden lg:block">
        <Card className="border shadow-sm h-[calc(100vh-220px)] overflow-hidden">
          <TableOfContents 
            content={content} 
            activeSection={activeSection}
            onSectionClick={onSectionClick}
          />
        </Card>
      </div>
      
      {/* Main content area */}
      <div className="lg:col-span-3">
        <Card className="border shadow-sm p-4 md:p-6">
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
