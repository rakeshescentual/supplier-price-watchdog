import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Correspondence } from '../CorrespondenceItem';
import { QueryItem } from '../QueryItem';
import { CorrespondencePanel } from './CorrespondencePanel';
import { DetailsPanel } from './DetailsPanel';

// Mock data for supplier correspondence
const mockCorrespondence: Correspondence[] = [
  {
    id: 1,
    supplier: 'DCS Group',
    subject: 'DCS Group | Initial Check Price List | 26th March 2025',
    emails: [
      {
        id: 1,
        from: 'jade@escentual.com',
        to: 'alicia@escentual.com',
        content: `Hi Alicia,

I have completed the DCS Group price list which is due on the 25th March. Please, can you check if everything is correct and import for this date?

Please, see the links below:
Initial Price Check and email below to Insights
Original price list
My original export
Export and price list check (working file)
Export (complete file)
Queries

Due to old or new TPR lines and Escentual funding products, I have created a separate sheet to show what I have done or needs to be done. @Tom Jenkins There are products (row 82-104) that are new TPR lines but we are still selling old stock at full RRP. I need to create sales alerts for these. Can you create a 'start of sale pricing' alert section for me please in the Merchbees app as I can't seem to figure it out or shall I just add them to 'End of sale pricing' and update the text?

If none of the above makes sense, please let me know.

Thanks
Jade`,
        timestamp: new Date('2025-03-04T14:55:00')
      },
      {
        id: 2,
        from: 'tom@escentual.com',
        to: 'jade@escentual.com',
        content: `Hi Jade,

The body products at the top of the list all come in packs of 2-6, explaining the massive increase. Could you please divide the cost by the pack size to get an accurate cost per unit?

Product	SKU	Cost	New Cost	Cost Dif	Increase %
HUGO BOSS HUGO Deodorant Spray 150ml	10000684	12.48	78.71	66.23	530.69%
HUGO BOSS BOSS Bottled Deodorant Spray 150ml	10000655	12.48	77.98	65.50	524.84%
HUGO BOSS BOSS The Scent Deodorant Spray 150ml	bossthescent006	12.48	77.98	65.50	524.84%
Calvin Klein CK One Body Wash 250ml	10000076	8.12	25.88	17.76	218.72%
Calvin Klein Ck One Skin Moisturiser 250ml	10000075	10.15	32.00	21.85	215.27%

Kind Regards, 
Tom`,
        timestamp: new Date('2025-03-04T15:10:00')
      },
      {
        id: 3,
        from: 'jade@escentual.com',
        to: 'tom@escentual.com',
        content: `Hi Tom,

Thanks for the heads up on this and it makes sense why the % was so high. Apologies! Divided the old and new cost and updated the sheet.

DCS CODE	EAN Unit Barcode	Short Description	Units per pack	Current Standard Sell	Current RSP	NEW STANDARD SELL	NEW RSP
CT000251	88300607327	Calvin Klein Showergel CK One | Body Wash - 250ml	3	£8.12	£16.00	£8.63	£17.00
CT000250	88300607464	Calvin Klein  CK One | Body Treat - 250ml	3	£10.15	£20.00	£10.67	£21.00
CT001305	3616302022595	Lancaster Suncare Sun Pro Beauty Silky Milk SPF30 | Milk - 250ml	2	£17.76	£35.00	£17.85	£35.00
CT000049	737052355054	Hugo Boss  Bottled | Deo Spray - 150ml	6	£12.48	£24.00	£13.00	£25.00
CT000032	737052992785	Hugo Boss  The Scent | Deo Spray - 150ml	6	£12.48	£24.00	£13.00	£25.00
CT001832	8005610340784	Hugo Man Deodorant spray | 150ml	6	£12.60	£24.00	£13.12	£25.00

Thanks,
Jade`,
        timestamp: new Date('2025-03-04T15:50:00')
      }
    ],
    timestamp: new Date('2025-03-04T14:55:00'),
    status: 'pending',
    queryItems: [
      {
        id: 1,
        text: 'Need to figure out how to add start of sale pricing alerts for TPR lines (rows 82-104)',
        status: 'pending',
        type: 'tpr',
        createdAt: new Date('2025-03-04T15:00:00')
      },
      {
        id: 2,
        text: 'Units per pack discrepancy - should divide cost by pack size',
        status: 'resolved',
        type: 'pack-size',
        createdAt: new Date('2025-03-04T15:15:00')
      }
    ]
  },
  {
    id: 2,
    supplier: 'L\'Oreal Luxe',
    subject: 'L\'Oreal Luxe | April Price Updates',
    emails: [
      {
        id: 1,
        from: 'supplier@loreal.com',
        to: 'purchasing@escentual.com',
        content: 'Price update notification for April...',
        timestamp: new Date('2025-03-01T10:30:00')
      }
    ],
    timestamp: new Date('2025-03-01T10:30:00'),
    status: 'processed',
    queryItems: []
  }
];

export const SupplierCorrespondenceManager = () => {
  const [correspondence, setCorrespondence] = useState<Correspondence[]>(mockCorrespondence);
  const [selectedCorrespondence, setSelectedCorrespondence] = useState<Correspondence | null>(null);
  const [selectedQueryItems, setSelectedQueryItems] = useState<QueryItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('correspondence');

  const handleSelectCorrespondence = (item: Correspondence) => {
    setSelectedCorrespondence(item);
    setSelectedQueryItems(item.queryItems || []);
  };

  const handleSaveQuery = (query: Omit<QueryItem, 'id' | 'createdAt'>) => {
    if (!selectedCorrespondence) return;
    
    const newQueryItem: QueryItem = {
      ...query,
      id: Date.now(),
      createdAt: new Date()
    };
    
    const updatedQueryItems: QueryItem[] = [...(selectedQueryItems || []), newQueryItem];
    
    const updatedCorrespondence: Correspondence[] = correspondence.map(item => 
      item.id === selectedCorrespondence.id
        ? { ...item, queryItems: updatedQueryItems }
        : item
    );
    
    setCorrespondence(updatedCorrespondence);
    setSelectedQueryItems(updatedQueryItems);
    
    toast.success("Query added", {
      description: "Your query has been added to this correspondence thread.",
    });
  };

  const handleResolveQuery = (queryId: number) => {
    if (!selectedCorrespondence) return;
    
    const updatedQueryItems: QueryItem[] = selectedQueryItems.map(query => 
      query.id === queryId ? { ...query, status: 'resolved' } : query
    );
    
    const updatedCorrespondence: Correspondence[] = correspondence.map(item => 
      item.id === selectedCorrespondence.id
        ? { ...item, queryItems: updatedQueryItems }
        : item
    );
    
    setCorrespondence(updatedCorrespondence);
    setSelectedQueryItems(updatedQueryItems);
    
    toast.success("Query resolved", {
      description: "The query has been marked as resolved.",
    });
  };

  const handleAddCorrespondence = (data: {
    supplier: string;
    subject: string;
    emailContent: string;
  }) => {
    const newItem: Correspondence = {
      id: Date.now(),
      supplier: data.supplier,
      subject: data.subject,
      emails: [
        {
          id: 1,
          from: 'system@escentual.com',
          to: data.supplier,
          content: data.emailContent,
          timestamp: new Date()
        }
      ],
      timestamp: new Date(),
      status: 'pending',
      queryItems: []
    };
    
    setCorrespondence([newItem, ...correspondence]);
    setActiveTab('correspondence');
    
    toast.success("Correspondence added", {
      description: "New supplier correspondence has been added.",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <CorrespondencePanel
          correspondence={correspondence}
          selectedCorrespondence={selectedCorrespondence}
          onSelectCorrespondence={handleSelectCorrespondence}
          onAddCorrespondence={handleAddCorrespondence}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
      
      <div className="md:col-span-2">
        <DetailsPanel
          selectedCorrespondence={selectedCorrespondence}
          selectedQueryItems={selectedQueryItems}
          onSaveQuery={handleSaveQuery}
          onResolveQuery={handleResolveQuery}
        />
      </div>
    </div>
  );
};
