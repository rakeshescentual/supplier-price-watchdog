
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Search, ArrowDown, ArrowUp } from 'lucide-react';
import { toast } from 'sonner';

interface Email {
  id: number;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
}

interface EmailThreadViewProps {
  emails: Email[];
}

export const EmailThreadView: React.FC<EmailThreadViewProps> = ({ emails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter emails based on search term
  const filteredEmails = emails.filter(email => 
    email.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort emails based on timestamp
  const sortedEmails = [...filteredEmails].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a.timestamp.getTime() - b.timestamp.getTime();
    } else {
      return b.timestamp.getTime() - a.timestamp.getTime();
    }
  });

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search emails..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSortDirection}
          title={sortDirection === 'asc' ? 'Oldest first' : 'Newest first'}
        >
          {sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {filteredEmails.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No emails match your search criteria
        </div>
      ) : (
        <ScrollArea className="h-[60vh]">
          <div className="space-y-6">
            {sortedEmails.map((email) => (
              <div key={email.id} className="space-y-2 border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between bg-muted/30 p-2 rounded-t-md">
                  <div>
                    <span className="font-medium">{email.from}</span>
                    <span className="text-muted-foreground mx-2">→</span>
                    <span>{email.to}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {email.timestamp.toLocaleString()}
                  </span>
                </div>
                <div className="bg-muted/20 p-4 rounded-b-md whitespace-pre-line">
                  {email.content}
                </div>
                
                <div className="flex justify-end">
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
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
      
      {filteredEmails.length > 0 && searchTerm && (
        <div className="text-sm text-muted-foreground">
          Found {filteredEmails.length} {filteredEmails.length === 1 ? 'result' : 'results'}
        </div>
      )}
    </div>
  );
};
