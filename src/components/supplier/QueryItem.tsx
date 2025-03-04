
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export interface QueryItem {
  id: number;
  text: string;
  status: 'pending' | 'resolved';
  type: 'general' | 'tpr' | 'pack-size' | 'discontinued';
  createdAt: Date;
}

interface QueryItemProps {
  query: QueryItem;
  onResolve: (id: number) => void;
}

export const QueryItemComponent: React.FC<QueryItemProps> = ({ query, onResolve }) => {
  const queryTypeColors = {
    'general': 'bg-blue-100 text-blue-800',
    'tpr': 'bg-purple-100 text-purple-800',
    'pack-size': 'bg-orange-100 text-orange-800',
    'discontinued': 'bg-red-100 text-red-800'
  };

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${queryTypeColors[query.type]}`}>
                {query.type === 'tpr' ? 'TPR' : 
                 query.type === 'pack-size' ? 'Pack Size' : 
                 query.type === 'discontinued' ? 'Discontinued' : 'General'}
              </span>
              {query.status === 'resolved' ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Resolved
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Pending
                </Badge>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {formatDistanceToNow(query.createdAt, { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm">{query.text}</p>
          </div>
          
          {query.status === 'pending' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4 mt-1"
              onClick={() => onResolve(query.id)}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Mark Resolved
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
