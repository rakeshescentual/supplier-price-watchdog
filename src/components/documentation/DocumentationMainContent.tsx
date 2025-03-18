
import React from 'react';
import { DocumentationContent } from './DocumentationContent';
import { DocumentationFAQ } from './DocumentationFAQ';

interface DocumentationMainContentProps {
  activeTab: string;
  content: string;
  faqItems: Array<{ question: string; answer: string }>;
}

export const DocumentationMainContent: React.FC<DocumentationMainContentProps> = ({
  activeTab,
  content,
  faqItems
}) => {
  const processMarkdownLinks = (content: string) => {
    // Convert relative links to absolute paths
    return content.replace(
      /\[([^\]]+)\]\(\.\/([^)]+)\)/g,
      '[[$1]](/src/assets/docs/$2)'
    );
  };

  const processedContent = processMarkdownLinks(content);

  if (activeTab === 'faq') {
    return <DocumentationFAQ items={faqItems} />;
  }

  return (
    <DocumentationContent 
      content={processedContent}
      type={activeTab === 'gadget' ? 'gadget' : 'technical'}
    />
  );
};
