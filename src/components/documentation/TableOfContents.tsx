
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { BookOpen, Code, FileText, Settings, ChevronRight } from 'lucide-react';

interface TableOfContentsProps {
  content: string;
  activeSection?: string;
  onSectionClick: (sectionId: string) => void;
}

interface TOCItem {
  id: string;
  title: string;
  level: number;
  icon?: React.ReactNode;
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
      
      let icon;
      if (title.toLowerCase().includes('api') || title.toLowerCase().includes('endpoint')) {
        icon = <Code className="h-3.5 w-3.5" />;
      } else if (title.toLowerCase().includes('documentation') || title.toLowerCase().includes('guide')) {
        icon = <BookOpen className="h-3.5 w-3.5" />;
      } else if (title.toLowerCase().includes('configuration') || title.toLowerCase().includes('settings')) {
        icon = <Settings className="h-3.5 w-3.5" />;
      } else if (title.toLowerCase().includes('file') || title.toLowerCase().includes('document')) {
        icon = <FileText className="h-3.5 w-3.5" />;
      } else {
        icon = level === 1 ? <ChevronRight className="h-3.5 w-3.5" /> : undefined;
      }
      
      items.push({
        id,
        title,
        level,
        icon
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
                'w-full text-left py-1.5 text-sm rounded-md block transition-colors flex items-center',
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
              {item.icon && (
                <span className={cn(
                  'mr-2',
                  activeSection === item.id ? 'text-purple-700' : 'text-gray-400'
                )}>
                  {item.icon}
                </span>
              )}
              <span className="truncate">{item.title}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
