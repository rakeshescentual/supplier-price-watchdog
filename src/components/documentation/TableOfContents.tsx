
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TableOfContentsProps {
  content: string;
  activeSection?: string;
  onSectionClick: (sectionId: string) => void;
}

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  content,
  activeSection,
  onSectionClick
}) => {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  
  // Parse the content to extract headings
  useEffect(() => {
    if (!content) return;
    
    const headingRegex = /^(#{1,3}) (.*?)$/gm;
    const items: TOCItem[] = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2];
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      items.push({
        id,
        title,
        level
      });
    }
    
    setTocItems(items);
  }, [content]);
  
  if (tocItems.length === 0) return null;
  
  return (
    <div className="p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-4 px-2">Table of Contents</h3>
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-1">
          {tocItems.map(item => (
            <button
              key={item.id}
              className={cn(
                'w-full text-left py-1.5 text-sm rounded-md block transition-colors',
                {
                  'pl-2': item.level === 1,
                  'pl-4': item.level === 2,
                  'pl-6': item.level === 3,
                  'font-medium text-purple-700 bg-purple-50': activeSection === item.id,
                  'text-gray-600 hover:text-gray-900 hover:bg-gray-50': activeSection !== item.id,
                }
              )}
              onClick={() => onSectionClick(item.id)}
            >
              {item.title}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
