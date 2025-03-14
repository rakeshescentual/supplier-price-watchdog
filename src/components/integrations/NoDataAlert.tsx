
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoDataAlertProps {
  hasItems: boolean;
}

export const NoDataAlert: React.FC<NoDataAlertProps> = ({ hasItems }) => {
  if (hasItems) return null;
  
  return (
    <Alert className="mb-8" variant="default">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>No price data available</AlertTitle>
      <AlertDescription>
        Please upload and analyze a supplier price list first to use these integrations.
        <Button
          variant="link"
          className="p-0 h-auto"
          onClick={() => window.location.href = "/"}
        >
          Go to Price Analysis
        </Button>
      </AlertDescription>
    </Alert>
  );
};
