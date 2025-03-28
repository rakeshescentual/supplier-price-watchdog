
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { QueryItem } from './QueriesPanel';

interface QueryItemComponentProps {
  query: QueryItem;
  onResolve: (id: number) => void;
}

export const QueryItemComponent: React.FC<QueryItemComponentProps> = ({ query, onResolve }) => {
  return (
    <div 
      className={`text-xs p-2 rounded ${
        query.status === 'resolved' 
          ? 'bg-green-50 border border-green-100' 
          : 'bg-amber-50 border border-amber-100'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="font-medium">{query.text}</span>
          <div className="flex gap-1 mt-1">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {query.type}
            </Badge>
            <Badge variant={query.status === 'resolved' ? 'default' : 'outline'} className={
              query.status === 'resolved' 
                ? 'bg-green-500' 
                : 'border-amber-500 text-amber-500'
            }>
              {query.status === 'resolved' ? 'Resolved' : 'Pending'}
            </Badge>
          </div>
        </div>
        {query.status === 'pending' && (
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 text-xs bg-white"
            onClick={() => onResolve(query.id)}
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Resolve
          </Button>
        )}
      </div>
      
      {query.response && (
        <p className="mt-1 border-t border-green-200 pt-1">
          <span className="font-medium">Response:</span> {query.response}
        </p>
      )}
    </div>
  );
};
