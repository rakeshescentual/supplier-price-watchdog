
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CorrespondenceList } from '../CorrespondenceList';
import { AddCorrespondenceForm } from './AddCorrespondenceForm';
import { Correspondence } from '../CorrespondenceItem';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArchiveIcon, Loader2, PlusCircle, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

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
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const CorrespondencePanel: React.FC<CorrespondencePanelProps> = ({
  correspondence,
  selectedCorrespondence,
  onSelectCorrespondence,
  onAddCorrespondence,
  activeTab,
  onTabChange,
  onRefresh,
  isLoading = false
}) => {
  const unreadCount = correspondence.filter(item => !item.read).length;
  
  const handleArchiveAll = () => {
    toast.success("Archived all correspondence", {
      description: "All correspondence has been archived"
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Supplier Correspondence</CardTitle>
          <CardDescription>
            Track and manage supplier communications
          </CardDescription>
        </div>
        
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="secondary">
              {unreadCount} unread
            </Badge>
          )}
          
          {onRefresh && (
            <Button 
              variant="outline" 
              size="icon" 
              disabled={isLoading} 
              onClick={onRefresh}
              title="Refresh correspondence"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCw className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="w-full">
            <TabsTrigger value="correspondence" className="flex-1">Correspondence</TabsTrigger>
            <TabsTrigger value="add" className="flex-1">
              <PlusCircle className="h-4 w-4 mr-1" />
              Add New
            </TabsTrigger>
            <TabsTrigger value="archive" className="flex-1">
              <ArchiveIcon className="h-4 w-4 mr-1" />
              Archive
            </TabsTrigger>
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
          
          <TabsContent value="archive">
            <div className="p-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                View and manage archived correspondence. Archived items are not displayed in the main list.
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">0 items in archive</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleArchiveAll}
                >
                  Archive All
                </Button>
              </div>
              
              <div className="py-8 text-center text-muted-foreground text-sm">
                No archived correspondence
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
