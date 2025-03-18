
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentationContent } from "./DocumentationContent";
import { DocumentationFAQ } from "./DocumentationFAQ";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Lightbulb } from "lucide-react";

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
    <div className="relative">
      <div className="flex items-center mb-4 gap-2">
        <h2 className="text-xl font-semibold text-gray-800">
          {activeTab === "technical" ? "Technical Documentation" : "Gadget Integration Guide"}
        </h2>
        {activeTab === "gadget" && (
          <Badge variant="outline" className="text-xs font-normal">
            <BookOpen className="h-3 w-3 mr-1" />
            Integration Guide
          </Badge>
        )}
      </div>
      
      <ScrollArea className="h-[calc(100vh-280px)] pr-4">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-slate max-w-none">
            <DocumentationContent 
              content={content}
              type={activeTab as 'technical' | 'gadget'}
            />
            
            {activeTab === "gadget" && (
              <>
                <Separator className="my-8" />
                <div className="bg-amber-50 p-4 rounded-md border border-amber-100 mb-6">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-medium text-amber-800 mb-2">Integration Tips</h3>
                      <p className="text-sm text-amber-700 mb-0">
                        For best results with Gadget integration, ensure your API keys have the correct permissions
                        and test your connection before performing large batch operations.
                      </p>
                    </div>
                  </div>
                </div>
                <DocumentationFAQ items={faqItems} />
              </>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
