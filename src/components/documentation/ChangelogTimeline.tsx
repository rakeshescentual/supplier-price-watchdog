
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Clock, 
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
}

interface ChangelogTimelineProps {
  items: ChangelogItem[];
  activeVersion?: string;
  onVersionSelect: (version: string) => void;
}

export const ChangelogTimeline: React.FC<ChangelogTimelineProps> = ({
  items,
  activeVersion,
  onVersionSelect
}) => {
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
    <Card className="h-full">
      <CardContent className="p-4">
        <h3 className="font-medium mb-4 flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Version History
        </h3>
        <ScrollArea className="h-[calc(100vh-310px)] pr-4">
          <div className="space-y-4">
            {items.map((item) => (
              <button
                key={item.version}
                className={`w-full text-left p-3 rounded-md border transition-colors hover:bg-accent ${
                  activeVersion === item.version ? "bg-muted border-primary" : "bg-card"
                }`}
                onClick={() => onVersionSelect(item.version)}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <Tag className="h-3.5 w-3.5 mr-1.5" />
                    <span className="font-medium text-sm">{item.version}</span>
                  </div>
                  <Badge variant="outline" className="text-xs font-normal">
                    {item.date}
                  </Badge>
                </div>
                <div className="flex items-center mt-2">
                  <Badge variant={getTypeBadgeVariant(item.type) as any} className="flex items-center text-xs">
                    {getTypeIcon(item.type)}
                    <span className="ml-1 capitalize">{item.type}</span>
                  </Badge>
                </div>
                <p className="text-sm mt-2 text-muted-foreground line-clamp-2">{item.title}</p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
