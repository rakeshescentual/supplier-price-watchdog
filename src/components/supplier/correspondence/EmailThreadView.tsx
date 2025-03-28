
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Copy, Forward, Reply, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface Email {
  id: number;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
}

interface EmailThreadViewProps {
  emails: Email[];
  onReply?: (email: Email) => void;
  onForward?: (email: Email) => void;
}

export const EmailThreadView: React.FC<EmailThreadViewProps> = ({ 
  emails, 
  onReply, 
  onForward 
}) => {
  const handleForward = (email: Email) => {
    if (onForward) {
      onForward(email);
    } else {
      // Default forwarding behavior if no handler provided
      navigator.clipboard.writeText(
        `-------- Forwarded Message --------\n` +
        `From: ${email.from}\n` +
        `To: ${email.to}\n` +
        `Date: ${email.timestamp.toLocaleString()}\n\n` +
        `${email.content}`
      );
      toast.success("Email prepared for forwarding", {
        description: "Content copied to clipboard with forwarding format"
      });
    }
  };

  const handleReply = (email: Email) => {
    if (onReply) {
      onReply(email);
    } else {
      // Default reply behavior if no handler provided
      const replyText = `\n\nOn ${email.timestamp.toLocaleString()}, ${email.from} wrote:\n> ${email.content.replace(/\n/g, '\n> ')}`;
      navigator.clipboard.writeText(replyText);
      toast.success("Reply template created", {
        description: "Reply template copied to clipboard"
      });
    }
  };

  return (
    <ScrollArea className="h-[60vh]">
      <div className="space-y-6">
        {emails.map((email) => (
          <div key={email.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">{email.from}</span>
                <span className="text-muted-foreground mx-2">→</span>
                <span>{email.to}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {email.timestamp.toLocaleString()}
              </span>
            </div>
            <div className="bg-muted/30 p-4 rounded-md whitespace-pre-line">
              {email.content}
            </div>
            
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
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
                    Copy
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy email content</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleReply(email)}
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Create reply template</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleForward(email)}
                  >
                    <Forward className="h-3 w-3 mr-1" />
                    Forward
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Forward this email</TooltipContent>
              </Tooltip>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    navigator.clipboard.writeText(`From: ${email.from}\nTo: ${email.to}\nDate: ${email.timestamp.toLocaleString()}\n\n${email.content}`);
                    toast.success("Full email copied");
                  }}>
                    Copy full email
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    navigator.clipboard.writeText(email.from);
                    toast.success("Sender copied");
                  }}>
                    Copy sender
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    const match = email.content.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
                    if (match) {
                      navigator.clipboard.writeText(match[0]);
                      toast.success("Email address copied");
                    } else {
                      toast.error("No email address found in content");
                    }
                  }}>
                    Extract email address
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
