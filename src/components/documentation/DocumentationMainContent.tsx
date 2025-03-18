
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentationContent } from "./DocumentationContent";
import { DocumentationFAQ } from "./DocumentationFAQ";
import { Separator } from "@/components/ui/separator";

interface DocumentationMainContentProps {
  activeTab: string;
  content: string;
  faqItems: Array<{
    question: string;
    answer: string;
  }>;
}

export const DocumentationMainContent: React.FC<DocumentationMainContentProps> = ({
  activeTab,
  content,
  faqItems
}) => {
  return (
    <div className="lg:col-span-3">
      <ScrollArea className="h-[calc(100vh-250px)]">
        <DocumentationContent 
          content={content}
          type={activeTab as 'technical' | 'gadget'}
        />
        
        {activeTab === "gadget" && (
          <>
            <Separator className="my-8" />
            <DocumentationFAQ items={faqItems} />
          </>
        )}
      </ScrollArea>
    </div>
  );
};
