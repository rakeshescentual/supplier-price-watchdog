
import React from "react";
import { Button } from "@/components/ui/button";

interface DocumentationBookmarksProps {
  bookmarks: string[];
}

export const DocumentationBookmarks: React.FC<DocumentationBookmarksProps> = ({
  bookmarks,
}) => {
  if (bookmarks.length === 0) return null;
  
  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm text-muted-foreground">Bookmarks:</span>
      {bookmarks.map((bookmark, index) => (
        <Button key={index} variant="ghost" size="sm">
          {bookmark}
        </Button>
      ))}
    </div>
  );
};
