import React from 'react';

export interface Correspondence {
  id: string;
  supplier: string;
  subject: string;
  date: string;
  content?: string;
  read: boolean;
  attachments?: {
    name: string;
    url: string;
    size: string;
  }[];
  lastResponseDate?: string;
  replied?: boolean;
  status?: 'pending' | 'replied' | 'closed';
  tags?: string[];
  threads?: {
    id: string;
    sender: string;
    date: string;
    content: string;
    read: boolean;
  }[];
}

interface CorrespondenceItemProps {
  item: Correspondence;
  isSelected: boolean;
  onClick: (item: Correspondence) => void;
}

const CorrespondenceItem: React.FC<CorrespondenceItemProps> = ({ item, isSelected, onClick }) => {
  return (
    <div 
      className={`p-3 border-b cursor-pointer transition-colors ${
        isSelected ? 'bg-muted' : 'hover:bg-muted/50'
      } ${!item.read ? 'font-medium' : ''}`}
      onClick={() => onClick(item)}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-sm">{item.supplier}</span>
        <span className="text-xs text-muted-foreground">{item.date}</span>
      </div>
      <div className="mb-1 text-sm">{item.subject}</div>
      {item.content && (
        <div className="text-xs text-muted-foreground truncate">
          {item.content}
        </div>
      )}
    </div>
  );
};

export default CorrespondenceItem;
