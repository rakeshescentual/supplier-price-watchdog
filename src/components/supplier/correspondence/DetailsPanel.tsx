
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Copy, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Correspondence } from '../CorrespondenceItem';
import { QueryForm } from '../QueryForm';
import { QueryItemComponent, QueryItem } from '../QueryItem';
import { EmailThreadView } from './EmailThreadView';

interface DetailsPanelProps {
  selectedCorrespondence: Correspondence | null;
  selectedQueryItems: QueryItem[];
  onSaveQuery: (query: Omit<QueryItem, 'id' | 'createdAt'>) => void;
  onResolveQuery: (queryId: number) => void;
}

export const DetailsPanel: React.FC<DetailsPanelProps> = ({
  selectedCorrespondence,
  selectedQueryItems,
  onSaveQuery,
  onResolveQuery
}) => {
  if (!selectedCorrespondence) {
    return (
      <div className="flex items-center justify-center h-full p-8 border rounded-lg bg-muted/30">
        <div className="text-center">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No correspondence selected</h3>
          <p className="text-muted-foreground">
            Select a supplier correspondence from the left panel or add a new one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{selectedCorrespondence.subject}</CardTitle>
        <CardDescription>
          {selectedCorrespondence.supplier} · {selectedCorrespondence.timestamp.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="emails">
          <TabsList className="w-full">
            <TabsTrigger value="emails" className="flex-1">Email Thread</TabsTrigger>
            <TabsTrigger value="queries" className="flex-1">
              Queries
              {selectedQueryItems.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-primary/20">
                  {selectedQueryItems.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="emails">
            <div className="p-4">
              <EmailThreadView emails={selectedCorrespondence.emails} />
            </div>
          </TabsContent>
          
          <TabsContent value="queries">
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-3">Add New Query</h3>
                  <QueryForm onSave={onSaveQuery} />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Existing Queries</h3>
                  {selectedQueryItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No queries added yet
                    </div>
                  ) : (
                    <ScrollArea className="h-[50vh]">
                      <div className="space-y-3">
                        {selectedQueryItems.map(query => (
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
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" className="w-full" disabled={true}>
          <Send className="mr-2 h-4 w-4" />
          Send Reply (coming soon)
        </Button>
      </CardFooter>
    </Card>
  );
};
