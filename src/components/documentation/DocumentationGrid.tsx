
import React from "react";
import { TableOfContents } from "./TableOfContents";
import { DocumentationMainContent } from "./DocumentationMainContent";

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
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar with Table of Contents */}
      <div className="hidden lg:block">
        <TableOfContents 
          content={content} 
          activeSection={activeSection}
          onSectionClick={onSectionClick}
        />
      </div>
      
      {/* Main content area */}
      <DocumentationMainContent 
        activeTab={activeTab}
        content={content}
        faqItems={faqItems}
      />
    </div>
  );
};
