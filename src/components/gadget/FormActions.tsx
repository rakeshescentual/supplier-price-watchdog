
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Shield } from "lucide-react";

interface FormActionsProps {
  isSubmitting: boolean;
  isTesting: boolean;
  onTestConnection: () => Promise<void>;
}

export function FormActions({
  isSubmitting,
  isTesting,
  onTestConnection,
}: FormActionsProps) {
  return (
    <div className="flex gap-3">
      <Button 
        type="button" 
        variant="outline" 
        className="flex-1"
        onClick={onTestConnection}
        disabled={isTesting}
      >
        {isTesting ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Testing...
          </>
        ) : (
          <>
            <Shield className="h-4 w-4 mr-2" />
            Test Connection
          </>
        )}
      </Button>
      <Button 
        type="submit" 
        className="flex-1"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Configuration"
        )}
      </Button>
    </div>
  );
}
