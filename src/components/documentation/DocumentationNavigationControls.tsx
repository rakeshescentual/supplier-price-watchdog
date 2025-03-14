
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Bookmark } from "lucide-react";

interface DocumentationNavigationControlsProps {
  onBookmark: (section: string) => void;
  activeTab: string;
}

export const DocumentationNavigationControls: React.FC<DocumentationNavigationControlsProps> = ({
  onBookmark,
  activeTab,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <Button variant="outline" size="sm">
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous Section
      </Button>
      <Button variant="outline" size="sm" onClick={() => onBookmark(activeTab)}>
        <Bookmark className="h-4 w-4 mr-2" />
        Bookmark
      </Button>
      <Button variant="outline" size="sm">
        Next Section
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};
