
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface Email {
  id: string;
  sender: string;
  date: string;
  content: string;
  read: boolean;
}

interface EmailThreadProps {
  emails: Email[];
}

export const EmailThread: React.FC<EmailThreadProps> = ({ emails }) => {
  return (
    <div className="p-4">
      <ScrollArea className="h-[60vh]">
        <div className="space-y-6">
          {emails.map((email) => (
            <div key={email.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{email.sender}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {email.date}
                </span>
              </div>
              <div className="bg-muted/30 p-4 rounded-md whitespace-pre-line">
                {email.content}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => {
                  navigator.clipboard.writeText(email.content);
                  toast.success("Content copied to clipboard");
                }}
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy content
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
