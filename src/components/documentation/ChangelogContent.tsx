
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Tag, 
  FileCheck, 
  AlertCircle, 
  Rocket, 
  Zap,
  CheckCircle2
} from "lucide-react";

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
}

export const ChangelogContent: React.FC<ChangelogContentProps> = ({ item }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "feature":
        return <Rocket className="h-4 w-4" />;
      case "improvement":
        return <Zap className="h-4 w-4" />;
      case "bugfix":
        return <CheckCircle2 className="h-4 w-4" />;
      case "breaking":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileCheck className="h-4 w-4" />;
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "feature":
        return "default";
      case "improvement":
        return "secondary";
      case "bugfix":
        return "success";
      case "breaking":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-250px)]">
      <div className="p-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            <h2 className="text-2xl font-bold">{item.version}</h2>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-sm text-muted-foreground">{item.date}</span>
          </div>
        </div>

        <Badge variant={getTypeBadgeVariant(item.type) as any} className="mb-4 flex items-center w-fit">
          {getTypeIcon(item.type)}
          <span className="ml-1 capitalize">{item.type}</span>
        </Badge>

        <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
        <p className="mb-4 text-muted-foreground">{item.description}</p>

        {item.details && item.details.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">Details</h4>
            <ul className="list-disc pl-5 space-y-1">
              {item.details.map((detail, idx) => (
                <li key={idx} className="text-sm">{detail}</li>
              ))}
            </ul>
          </div>
        )}

        {item.technicalNotes && (
          <>
            <Separator className="my-4" />
            <div className="bg-muted p-4 rounded-md">
              <h4 className="text-sm font-medium mb-2">Technical Notes</h4>
              <p className="text-xs text-muted-foreground whitespace-pre-wrap">{item.technicalNotes}</p>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
};
