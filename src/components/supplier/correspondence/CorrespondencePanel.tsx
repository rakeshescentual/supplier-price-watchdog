
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CorrespondenceList } from '../CorrespondenceList';
import { AddCorrespondenceForm } from './AddCorrespondenceForm';
import { Correspondence } from '../CorrespondenceItem';

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
              <CorrespondenceList 
                correspondence={correspondence}
                selectedCorrespondence={selectedCorrespondence}
                onSelectCorrespondence={onSelectCorrespondence}
              />
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
