
import React, { useState, useEffect } from "react";
import { ChangelogTimeline } from "./ChangelogTimeline";
import { ChangelogContent } from "./ChangelogContent";
import { changelogData } from "./changelogData";

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

  useEffect(() => {
    const item = changelogData.find(item => item.version === selectedVersion);
    if (item) {
      setSelectedItem(item as ChangelogItem);
    }
  }, [selectedVersion]);

  const handleVersionSelect = (version: string) => {
    setSelectedVersion(version);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <ChangelogTimeline 
          items={changelogData as ChangelogItem[]}
          activeVersion={selectedVersion}
          onVersionSelect={handleVersionSelect}
        />
      </div>
      <div className="lg:col-span-3">
        <ChangelogContent item={selectedItem} />
      </div>
    </div>
  );
};
