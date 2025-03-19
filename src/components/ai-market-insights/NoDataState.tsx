
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NoDataState() {
  return (
    <div className="flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Competitor Data</h3>
        <p className="text-muted-foreground mb-4">
          AI insights require competitor price data. Configure competitor scraping to collect data.
        </p>
        <Button variant="outline">Set Up Competitor Scraping</Button>
      </div>
    </div>
  );
}
