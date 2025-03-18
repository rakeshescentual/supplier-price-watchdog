
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentationContent } from "./DocumentationContent";
import { DocumentationFAQ } from "./DocumentationFAQ";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Lightbulb, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

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
  const lastUpdated = new Date("2023-10-15").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  
  return (
    <div className="relative">
      <div className="flex items-center mb-4 gap-2 flex-wrap">
        <h2 className="text-xl font-semibold text-gray-800 mr-auto">
          {activeTab === "technical" ? "Technical Documentation" : "Gadget Integration Guide"}
        </h2>
        {activeTab === "gadget" && (
          <Badge variant="outline" className="text-xs font-normal bg-purple-50 text-purple-700 border-purple-200">
            <BookOpen className="h-3 w-3 mr-1" />
            Integration Guide
          </Badge>
        )}
        <Badge variant="outline" className="text-xs font-normal bg-gray-50 text-gray-600 border-gray-200">
          <Clock className="h-3 w-3 mr-1" />
          Updated {lastUpdated}
        </Badge>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card className="p-4 border-amber-100 bg-amber-50">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <Lightbulb className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-amber-800 mb-2">Integration Tips</h3>
                        <p className="text-sm text-amber-700 mb-0">
                          For best results with Gadget integration, ensure your API keys have the correct permissions
                          and test your connection before performing large batch operations.
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4 border-blue-100 bg-blue-50">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <ArrowRight className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-blue-800 mb-2">Next Steps</h3>
                        <p className="text-sm text-blue-700 mb-0">
                          After integrating with Gadget, use the connection test feature to verify your setup
                          is working correctly. Then proceed to the Shopify sync configuration.
                        </p>
                      </div>
                    </div>
                  </Card>
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
