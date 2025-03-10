
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CorrespondenceItem, Correspondence } from '../CorrespondenceItem';
import { AddCorrespondenceForm } from './AddCorrespondenceForm';

interface CorrespondencePanelProps {
  correspondence: Correspondence[];
  selectedCorrespondence: Correspondence | null;
  onSelectCorrespondence: (item: Correspondence) => void;
  onAddCorrespondence: (data: {
    supplier: string;
    subject: string;
    emailContent: string;
  }) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const CorrespondencePanel: React.FC<CorrespondencePanelProps> = ({
  correspondence,
  selectedCorrespondence,
  onSelectCorrespondence,
  onAddCorrespondence,
  activeTab,
  onTabChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supplier Correspondence</CardTitle>
        <CardDescription>
          Track and manage supplier communications
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="w-full">
            <TabsTrigger value="correspondence" className="flex-1">Correspondence</TabsTrigger>
            <TabsTrigger value="add" className="flex-1">Add New</TabsTrigger>
          </TabsList>
          
          <TabsContent value="correspondence">
            <div className="p-4">
              <ScrollArea className="h-[50vh]">
                <div className="space-y-3">
                  {correspondence.map(item => (
                    <CorrespondenceItem
                      key={item.id}
                      correspondence={item}
                      isSelected={selectedCorrespondence?.id === item.id}
                      onClick={() => onSelectCorrespondence(item)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="add">
            <div className="p-4">
              <AddCorrespondenceForm onSubmit={onAddCorrespondence} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
