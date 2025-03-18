
import React, { useState, useEffect } from "react";
import { ChangelogTimeline } from "./ChangelogTimeline";
import { ChangelogContent } from "./ChangelogContent";
import { changelogData } from "./changelogData";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Define the ChangelogItem interface here to ensure consistency
interface ChangelogItem {
  version: string;
  date: string;
  title: string;
  type: "feature" | "improvement" | "bugfix" | "breaking";
  description: string;
  details?: string[];
  technicalNotes?: string;
}

interface ChangelogProps {
  initialVersion?: string;
}

export const Changelog: React.FC<ChangelogProps> = ({ initialVersion }) => {
  const [selectedVersion, setSelectedVersion] = useState<string>(initialVersion || changelogData[0].version);
  const [selectedItem, setSelectedItem] = useState<ChangelogItem>(changelogData[0] as ChangelogItem);
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed');

  useEffect(() => {
    const item = changelogData.find(item => item.version === selectedVersion);
    if (item) {
      setSelectedItem(item as ChangelogItem);
    }
  }, [selectedVersion]);

  const handleVersionSelect = (version: string) => {
    setSelectedVersion(version);
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'feature': return 'bg-green-50 text-green-700 border-green-200';
      case 'improvement': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'bugfix': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'breaking': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="border rounded-lg shadow-sm">
      <div className="border-b p-4 md:p-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Version History & Changelog</h2>
          <p className="text-sm text-gray-500 mt-1">Track all updates and improvements to the application</p>
        </div>
        <Tabs defaultValue="detailed" className="w-[240px]" onValueChange={(value) => setViewMode(value as 'detailed' | 'compact')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="detailed">Detailed</TabsTrigger>
            <TabsTrigger value="compact">Compact</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 p-4 md:p-6">
        <div className="lg:col-span-1">
          <h3 className="text-lg font-medium mb-4 lg:hidden">Version History</h3>
          <div className="bg-gray-50 rounded-md p-4 h-[calc(100vh-300px)] overflow-y-auto">
            <ChangelogTimeline 
              items={changelogData as ChangelogItem[]}
              activeVersion={selectedVersion}
              onVersionSelect={handleVersionSelect}
            />
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{selectedItem.title}</h3>
                <Badge className={`${getTypeColor(selectedItem.type)} border`}>
                  {selectedItem.type}
                </Badge>
              </div>
              <div className="text-sm text-gray-500">
                v{selectedItem.version} • {selectedItem.date}
              </div>
            </div>
            
            <div className="animate-fade-in prose prose-slate max-w-none">
              <ChangelogContent 
                item={selectedItem} 
                viewMode={viewMode}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
