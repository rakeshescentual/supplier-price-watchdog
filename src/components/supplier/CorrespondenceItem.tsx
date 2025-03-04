
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Copy, CheckCircle2, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { QueryItem } from './QueryItem';

export interface Correspondence {
  id: number;
  supplier: string;
  subject: string;
  emails: {
    id: number;
    from: string;
    to: string;
    content: string;
    timestamp: Date;
  }[];
  timestamp: Date;
  status: 'processed' | 'pending';
  queryItems?: QueryItem[];
}

interface CorrespondenceItemProps {
  correspondence: Correspondence;
  isSelected: boolean;
  onClick: () => void;
}

export const CorrespondenceItem: React.FC<CorrespondenceItemProps> = ({ 
  correspondence, 
  isSelected, 
  onClick 
}) => {
  const handleCopyToClipboard = (event: React.MouseEvent, content: string) => {
    event.stopPropagation();
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  return (
    <div 
      className={`p-4 border rounded-md cursor-pointer transition-colors ${
        isSelected ? 'bg-muted border-primary' : 'hover:bg-muted/50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 rounded-full bg-primary/10">
          <Mail className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium">{correspondence.subject}</h3>
          <p className="text-xs text-muted-foreground">{correspondence.supplier}</p>
        </div>
        <div className="flex items-center gap-1">
          {correspondence.status === 'processed' ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Processed
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Pending
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
        <span>{formatDistanceToNow(correspondence.timestamp, { addSuffix: true })}</span>
        <div className="flex items-center gap-2">
          <span className="flex items-center">
            <FileText className="h-3 w-3 mr-1" />
            {correspondence.emails.length} emails
          </span>
          <span className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            {new Set(correspondence.emails.map(email => email.from)).size} participants
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => handleCopyToClipboard(e, correspondence.emails[0].content)}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
