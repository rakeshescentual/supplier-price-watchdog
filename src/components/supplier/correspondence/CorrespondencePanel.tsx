
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Mail, Filter } from 'lucide-react';
import { CorrespondenceList } from '../CorrespondenceList';
import { AddCorrespondenceForm } from '../AddCorrespondenceForm';
import { Correspondence } from '../CorrespondenceItem';

interface CorrespondencePanelProps {
  correspondence: Correspondence[];
  selectedCorrespondence: Correspondence | null;
  onSelectCorrespondence: (item: Correspondence) => void;
  onAddCorrespondence: (data: { supplier: string; subject: string; emailContent: string }) => void;
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
  const [isLoading, setIsLoading] = useState(false);

  const handleCorrespondenceSubmit = (supplier: string, subject: string, emailContent: string) => {
    onAddCorrespondence({
      supplier,
      subject,
      emailContent
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Correspondence</CardTitle>
        <Button 
          size="sm" 
          onClick={() => onTabChange('new')}
          disabled={activeTab === 'new'}
        >
          <Plus className="h-4 w-4 mr-1" />
          New
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="w-full">
            <TabsTrigger value="correspondence" className="flex-1">
              <Mail className="h-4 w-4 mr-2" />
              All
            </TabsTrigger>
            <TabsTrigger value="new" className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              New
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="correspondence" className="mt-0">
            <CorrespondenceList
              items={correspondence}
              isLoading={isLoading}
              selectedItemId={selectedCorrespondence?.id}
              onSelectItem={onSelectCorrespondence}
            />
          </TabsContent>
          
          <TabsContent value="new" className="mt-0">
            <AddCorrespondenceForm 
              onAddCorrespondence={handleCorrespondenceSubmit} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
