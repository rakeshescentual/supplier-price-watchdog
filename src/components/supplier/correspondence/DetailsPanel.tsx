
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MessageSquare } from 'lucide-react';
import { Correspondence } from '../CorrespondenceItem';
import { QueryItem, QueriesPanel } from '../QueriesPanel';
import { EmailThread } from '../EmailThread';

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
  const [activeTab, setActiveTab] = React.useState('emails');

  if (!selectedCorrespondence) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-[500px] text-muted-foreground">
          Select a correspondence to view details
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{selectedCorrespondence.subject}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>{selectedCorrespondence.supplier}</span>
          <span className="mx-2">•</span>
          <span>{selectedCorrespondence.date}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="emails">
              <Mail className="h-4 w-4 mr-2" />
              Emails
            </TabsTrigger>
            <TabsTrigger value="queries">
              <MessageSquare className="h-4 w-4 mr-2" />
              Queries
            </TabsTrigger>
          </TabsList>
          <TabsContent value="emails">
            <EmailThread emails={selectedCorrespondence.threads || []} />
          </TabsContent>
          <TabsContent value="queries">
            <QueriesPanel 
              queries={selectedQueryItems} 
              onSaveQuery={onSaveQuery}
              onResolveQuery={onResolveQuery}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
