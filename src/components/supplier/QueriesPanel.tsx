
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QueryForm } from './QueryForm';
import { QueryItemComponent } from './QueryItem';

export interface QueryItem {
  id: number;
  text: string;
  status: 'pending' | 'resolved';
  type: string;
  createdAt: Date;
  response?: string;
}

interface QueriesPanelProps {
  queries: QueryItem[];
  onSaveQuery: (query: Omit<QueryItem, 'id' | 'createdAt'>) => void;
  onResolveQuery: (queryId: number) => void;
}

export const QueriesPanel: React.FC<QueriesPanelProps> = ({
  queries,
  onSaveQuery,
  onResolveQuery
}) => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium mb-3">Add New Query</h3>
          <QueryForm onSave={onSaveQuery} />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-3">Existing Queries</h3>
          {queries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No queries added yet
            </div>
          ) : (
            <ScrollArea className="h-[50vh]">
              <div className="space-y-3">
                {queries.map(query => (
                  <QueryItemComponent 
                    key={query.id} 
                    query={query} 
                    onResolve={onResolveQuery} 
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
};
