
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Code, FileText, Info } from "lucide-react";

interface ChangelogItem {
  version: string;
  date: string;
  title: string;
  type: "feature" | "improvement" | "bugfix" | "breaking";
  description: string;
  details?: string[];
  technicalNotes?: string;
}

interface ChangelogContentProps {
  item: ChangelogItem;
  viewMode?: 'detailed' | 'compact';
}

export const ChangelogContent: React.FC<ChangelogContentProps> = ({ 
  item,
  viewMode = 'detailed'
}) => {
  if (!item) return null;
  
  return (
    <div>
      <p className="text-gray-700 mb-6">{item.description}</p>
      
      {item.details && item.details.length > 0 && viewMode === 'detailed' && (
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3">What's New</h4>
          <ul className="space-y-2">
            {item.details.map((detail, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {item.technicalNotes && viewMode === 'detailed' && (
        <>
          <Separator className="my-6" />
          <div className="bg-gray-50 border rounded-md p-4">
            <div className="flex items-start gap-2 mb-2">
              <Code className="h-5 w-5 text-gray-700 mt-0.5" />
              <h4 className="text-lg font-medium">Technical Notes</h4>
            </div>
            <p className="text-gray-700 whitespace-pre-line">{item.technicalNotes}</p>
            
            {item.type === 'breaking' && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded p-3 flex items-start gap-2">
                <Info className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700 m-0">
                  This update includes breaking changes. Please review the technical notes carefully before upgrading.
                </p>
              </div>
            )}
          </div>
        </>
      )}
      
      {item.version && viewMode === 'detailed' && (
        <div className="mt-6 flex items-center justify-end gap-2 text-sm text-gray-500">
          <FileText className="h-4 w-4" />
          <span>Full release notes available in <a href="#" className="text-blue-600 hover:underline">documentation</a></span>
        </div>
      )}
    </div>
  );
};
