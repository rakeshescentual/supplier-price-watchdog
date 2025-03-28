
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Paperclip, Clock, CheckCircle } from "lucide-react";
import { QueryItem } from './QueriesPanel';

export interface Attachment {
  name: string;
  url: string;
  size: string;
}

export interface Correspondence {
  id: string;
  supplier: string;
  subject: string;
  date: string;
  content: string;
  read: boolean;
  status: 'pending' | 'replied' | 'closed';
  attachments?: Attachment[];
  tags?: string[];
  threads?: {
    id: string;
    sender: string;
    date: string;
    content: string;
    read: boolean;
  }[];
  queryItems?: QueryItem[];
}

interface CorrespondenceItemProps {
  item: Correspondence;
  isSelected: boolean;
  onClick: (item: Correspondence) => void;
}

const CorrespondenceItem: React.FC<CorrespondenceItemProps> = ({ 
  item, 
  isSelected, 
  onClick 
}) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    replied: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800"
  };
  
  return (
    <div 
      className={`
        p-3 cursor-pointer border-l-2 transition-colors duration-150
        ${isSelected ? 'border-l-primary bg-muted' : 'border-l-transparent hover:bg-muted/50'}
        ${!item.read ? 'font-medium' : ''}
      `}
      onClick={() => onClick(item)}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-sm truncate max-w-[200px]">{item.supplier}</span>
        <span className="text-xs text-muted-foreground whitespace-nowrap">{item.date}</span>
      </div>
      
      <h3 className="font-medium text-sm mb-1 truncate">{item.subject}</h3>
      
      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
        {item.content}
      </p>
      
      <div className="flex flex-wrap gap-1 mt-1">
        <Badge 
          variant="secondary" 
          className={`${statusColors[item.status]} py-0 px-1.5 text-[10px]`}
        >
          {item.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
          {item.status === 'replied' && <CheckCircle className="h-3 w-3 mr-1" />}
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Badge>
        
        {item.attachments && item.attachments.length > 0 && (
          <Badge variant="outline" className="py-0 px-1.5 text-[10px]">
            <Paperclip className="h-3 w-3 mr-1" />
            {item.attachments.length}
          </Badge>
        )}
        
        {item.tags && item.tags.length > 0 && item.tags.slice(0, 1).map(tag => (
          <Badge key={tag} variant="outline" className="py-0 px-1.5 text-[10px]">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default CorrespondenceItem;
