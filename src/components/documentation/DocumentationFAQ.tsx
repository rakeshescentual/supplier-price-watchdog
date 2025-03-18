
import React, { useState } from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { HelpCircle, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface FAQItem {
  question: string;
  answer: string;
}

interface DocumentationFAQProps {
  items: FAQItem[];
  title?: string;
  description?: string;
}

export const DocumentationFAQ: React.FC<DocumentationFAQProps> = ({
  items,
  title = "Frequently Asked Questions",
  description = "Common questions and answers about this topic"
}) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="my-6">
      <Alert className="mb-6">
        <HelpCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>

      <Accordion type="single" collapsible className="w-full">
        {items.map((item, index) => {
          const id = `faq-${index}`;
          return (
            <AccordionItem value={id} key={id}>
              <AccordionTrigger className="text-base font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="relative">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{item.answer}</ReactMarkdown>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(item.answer, id)}
                  className="absolute top-0 right-0"
                >
                  {copied === id ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};
