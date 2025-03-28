
import React, { useState } from 'react';
import { CorrespondenceList } from './CorrespondenceList';
import { EmailThread } from './EmailThread';
import { QueriesPanel } from './QueriesPanel';
import { AddCorrespondenceForm } from './AddCorrespondenceForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Mail, MessageSquare } from 'lucide-react';
import type { Correspondence } from './CorrespondenceItem';

export function SupplierCorrespondence() {
  const [correspondence, setCorrespondence] = useState<Correspondence[]>([
    {
      id: '1',
      supplier: 'Luxury Fragrances Inc.',
      subject: 'Spring 2024 Collection Price Update',
      date: '2024-03-15',
      content: 'Please find attached our updated price list for the Spring 2024 collection. These prices will be effective starting April 1st.',
      read: true,
      attachments: [
        {
          name: 'Spring2024_PriceList.xlsx',
          url: '#',
          size: '245 KB'
        }
      ],
      status: 'replied',
      tags: ['price update', 'spring collection'],
      threads: [
        {
          id: '1-1',
          sender: 'Luxury Fragrances Inc.',
          date: '2024-03-15',
          content: 'Please find attached our updated price list for the Spring 2024 collection. These prices will be effective starting April 1st. Let me know if you have any questions.',
          read: true
        },
        {
          id: '1-2',
          sender: 'Escentual.com',
          date: '2024-03-16',
          content: 'Thank you for sending the updated price list. We have a few questions about the premium lines. Could you clarify the pricing tiers for orders over 100 units?',
          read: true
        },
        {
          id: '1-3',
          sender: 'Luxury Fragrances Inc.',
          date: '2024-03-17',
          content: 'For orders over 100 units, we offer a 5% discount on the wholesale price. For orders over 250 units, the discount increases to 8%. Let me know if you need any further clarification.',
          read: true
        }
      ]
    },
    {
      id: '2',
      supplier: 'Organic Beauty Co.',
      subject: 'Price Adjustment for Organic Line',
      date: '2024-03-10',
      content: 'Due to increased costs of raw materials, we need to adjust our prices for the organic skincare line by approximately 3-5%.',
      read: false,
      status: 'pending',
      tags: ['price increase', 'organic line'],
      threads: [
        {
          id: '2-1',
          sender: 'Organic Beauty Co.',
          date: '2024-03-10',
          content: 'Due to increased costs of raw materials, we need to adjust our prices for the organic skincare line by approximately 3-5%. This change will take effect on May 1st, 2024.',
          read: false
        }
      ]
    },
    {
      id: '3',
      supplier: 'Global Scents Ltd.',
      subject: 'Exclusive Distribution Agreement',
      date: '2024-03-05',
      content: 'We would like to discuss an exclusive distribution agreement for our new premium fragrance line in the UK market.',
      read: true,
      status: 'pending',
      tags: ['distribution', 'agreement', 'premium'],
      threads: [
        {
          id: '3-1',
          sender: 'Global Scents Ltd.',
          date: '2024-03-05',
          content: 'We would like to discuss an exclusive distribution agreement for our new premium fragrance line in the UK market. Our new collection has been very well received in early market testing.',
          read: true
        },
        {
          id: '3-2',
          sender: 'Escentual.com',
          date: '2024-03-07',
          content: 'We're interested in discussing this opportunity. Could you provide more details about the product range, pricing structure, and your expectations for the exclusive agreement?',
          read: true
        }
      ]
    },
    {
      id: '4',
      supplier: 'Skincare Innovations',
      subject: 'New Product Line Pricing',
      date: '2024-02-28',
      content: 'We're launching our new anti-aging product line next month and wanted to share the wholesale pricing details with you before the general announcement.',
      read: true,
      status: 'closed',
      tags: ['new products', 'pricing'],
      threads: [
        {
          id: '4-1',
          sender: 'Skincare Innovations',
          date: '2024-02-28',
          content: 'We're launching our new anti-aging product line next month and wanted to share the wholesale pricing details with you before the general announcement. As a valued partner, you'll have access to pre-launch ordering starting next week.',
          read: true
        }
      ]
    },
    {
      id: '5',
      supplier: 'Lux Skincare',
      subject: 'Quarterly Price Revisions',
      date: '2024-02-25',
      content: 'As part of our quarterly review, we've made some adjustments to our price list. Most items remain unchanged, but there are increases on imported ingredients.',
      read: false,
      status: 'processed',
      tags: ['quarterly', 'review'],
      threads: [
        {
          id: '5-1',
          sender: 'Lux Skincare',
          date: '2024-02-25',
          content: 'As part of our quarterly review, we've made some adjustments to our price list. Most items remain unchanged, but there are increases on imported ingredients due to higher shipping costs and import duties.',
          read: false
        }
      ]
    }
  ]);

  const [selectedItem, setSelectedItem] = useState<Correspondence | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('emails');

  const handleSelectItem = (item: Correspondence) => {
    // Mark the item as read
    setCorrespondence(prev => 
      prev.map(i => 
        i.id === item.id 
          ? { ...i, read: true, threads: i.threads?.map(t => ({ ...t, read: true })) } 
          : i
      )
    );
    
    setSelectedItem(item);
    setShowAddForm(false);
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    setShowAddForm(true);
  };

  const handleCreateCorrespondence = (data: Partial<Correspondence>) => {
    const newItem: Correspondence = {
      id: `item-${Date.now()}`,
      supplier: data.supplier || '',
      subject: data.subject || '',
      date: new Date().toISOString().split('T')[0],
      content: data.content,
      read: true,
      status: 'pending',
      threads: data.content ? [{
        id: `thread-${Date.now()}`,
        sender: 'Escentual.com',
        date: new Date().toISOString().split('T')[0],
        content: data.content,
        read: true
      }] : []
    };
    
    setCorrespondence(prev => [newItem, ...prev]);
    setSelectedItem(newItem);
    setShowAddForm(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Correspondence</CardTitle>
          <Button size="sm" onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {showAddForm ? (
            <AddCorrespondenceForm onSubmit={handleCreateCorrespondence} onCancel={() => setShowAddForm(false)} />
          ) : (
            <CorrespondenceList
              items={correspondence}
              selectedItemId={selectedItem?.id}
              onSelectItem={handleSelectItem}
            />
          )}
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        {selectedItem ? (
          <>
            <CardHeader className="pb-2">
              <CardTitle>{selectedItem.subject}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{selectedItem.supplier}</span>
                <span className="mx-2">•</span>
                <span>{selectedItem.date}</span>
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
                  <EmailThread threads={selectedItem.threads || []} />
                </TabsContent>
                <TabsContent value="queries">
                  <QueriesPanel correspondence={selectedItem} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex justify-center items-center h-full text-muted-foreground">
            {!showAddForm && "Select a correspondence or create a new one"}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
