
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, BookOpen, Code, Lightbulb } from 'lucide-react';

interface DocumentationContentProps {
  content: string;
  type: 'technical' | 'gadget';
}

export const DocumentationContent: React.FC<DocumentationContentProps> = ({ 
  content,
  type
}) => {
  const getBadgeForSection = (sectionTitle: string) => {
    if (sectionTitle.toLowerCase().includes('api') || sectionTitle.toLowerCase().includes('endpoint')) {
      return (
        <Badge variant="outline" className="ml-2 text-xs font-normal">
          <Code className="h-3 w-3 mr-1" />
          API
        </Badge>
      );
    }
    
    if (sectionTitle.toLowerCase().includes('guide') || sectionTitle.toLowerCase().includes('how to')) {
      return (
        <Badge variant="outline" className="ml-2 text-xs font-normal">
          <BookOpen className="h-3 w-3 mr-1" />
          Guide
        </Badge>
      );
    }
    
    if (sectionTitle.toLowerCase().includes('note') || sectionTitle.toLowerCase().includes('important')) {
      return (
        <Badge variant="outline" className="ml-2 text-xs font-normal">
          <Lightbulb className="h-3 w-3 mr-1" />
          Note
        </Badge>
      );
    }
    
    return null;
  };
  
  // Function to process content and enhance it
  const enhanceContent = (content: string) => {
    // Split content by headers
    const sections = content.split(/(?=^#{1,3} .*$)/m);
    
    return sections.map((section, index) => {
      // Check if this is a header section
      const headerMatch = section.match(/^(#{1,3}) (.*?)$/m);
      
      if (headerMatch) {
        const [fullHeader, hashMarks, title] = headerMatch;
        const level = hashMarks.length;
        const sectionId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        // Replace the header with an enhanced version
        const enhancedHeader = 
          `<div id="${sectionId}" class="scroll-mt-20 ${level === 1 ? 'mb-6 mt-10' : 'mb-4 mt-8'} flex items-center">
            <${level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3'} class="text-${level === 1 ? '2xl' : level === 2 ? 'xl' : 'lg'} font-bold">${title}</${level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3'}>
            ${getBadgeForSection(title) ? `<span>${getBadgeForSection(title)}</span>` : ''}
          </div>`;
        
        return section.replace(fullHeader, enhancedHeader);
      }
      
      return section;
    }).join('');
  };
  
  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <div className="prose prose-sm lg:prose-base max-w-none dark:prose-invert">
          <ReactMarkdown components={{
            // Custom component for code blocks
            code: ({ node, className, children, ...props }) => {
              const isInline = !props.className;
              
              if (isInline) {
                return <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props}>{children}</code>;
              }
              
              return (
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                    <code {...props}>{children}</code>
                  </pre>
                </div>
              );
            },
            // Custom styling for blockquotes
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-primary pl-4 italic" {...props} />
            ),
            // Add icon to file paths
            p: ({ node, children, ...props }) => {
              const childrenArray = React.Children.toArray(children);
              
              // Check if this paragraph looks like a file path
              const filePath = typeof childrenArray[0] === 'string' && childrenArray[0].match(/^(\/[\w-]+)+\.\w+$/);
              
              if (filePath) {
                return (
                  <p className="flex items-center bg-muted/50 p-2 rounded" {...props}>
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    {children}
                  </p>
                );
              }
              
              return <p {...props}>{children}</p>;
            }
          }}>
            {enhanceContent(content)}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
};
