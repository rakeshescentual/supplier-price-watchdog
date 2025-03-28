
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import CorrespondenceItem, { Correspondence } from "./CorrespondenceItem";

interface CorrespondenceListProps {
  items: Correspondence[];
  isLoading?: boolean;
  selectedItemId?: string;
  onSelectItem: (item: Correspondence) => void;
}

export const CorrespondenceList: React.FC<CorrespondenceListProps> = ({
  items,
  isLoading = false,
  selectedItemId,
  onSelectItem
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        No correspondence found
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-250px)]">
      <div className="divide-y">
        {items.map((item) => (
          <CorrespondenceItem
            key={item.id}
            item={item}
            isSelected={item.id === selectedItemId}
            onClick={onSelectItem}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
