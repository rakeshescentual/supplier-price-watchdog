
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CorrespondenceItem, Correspondence } from './CorrespondenceItem';

interface CorrespondenceListProps {
  correspondence: Correspondence[];
  selectedCorrespondence: Correspondence | null;
  onSelectCorrespondence: (item: Correspondence) => void;
}

export const CorrespondenceList: React.FC<CorrespondenceListProps> = ({
  correspondence,
  selectedCorrespondence,
  onSelectCorrespondence
}) => {
  return (
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
  );
};
