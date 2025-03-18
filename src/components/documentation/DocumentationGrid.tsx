
import React from "react";
import { TableOfContents } from "./TableOfContents";
import { DocumentationMainContent } from "./DocumentationMainContent";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ArrowLeft, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
  // Calculate reading progress (simplified version)
  const [readingProgress, setReadingProgress] = React.useState(0);
  
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setReadingProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Get sections from content
  const sections = React.useMemo(() => {
    const regex = /^(#{1,6})\s+(.+)$/gm;
    const matches = [...content.matchAll(regex)];
    return matches.map(match => match[2].trim());
  }, [content]);
  
  // Find current section index
  const currentSectionIndex = sections.findIndex(section => section === activeSection);
  
  // Navigation functions
  const navigatePrevious = () => {
    if (currentSectionIndex > 0) {
      onSectionClick(sections[currentSectionIndex - 1]);
    }
  };
  
  const navigateNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      onSectionClick(sections[currentSectionIndex + 1]);
    }
  };

  return (
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Reading progress indicator - visible only on mobile */}
      <div className="lg:hidden w-full mb-2">
        <Progress value={readingProgress} className="h-1" />
      </div>
      
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
          
          {/* Navigation controls */}
          <div className="mt-8 pt-4 border-t flex justify-between">
            <Button 
              variant="outline" 
              onClick={navigatePrevious}
              disabled={currentSectionIndex <= 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <Button 
              variant="outline" 
              onClick={navigateNext}
              disabled={currentSectionIndex >= sections.length - 1}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
