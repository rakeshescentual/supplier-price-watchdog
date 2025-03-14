
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface IntegrationsHeaderProps {
  onTestConnections: () => void;
  isTestingAll: boolean;
}

export const IntegrationsHeader: React.FC<IntegrationsHeaderProps> = ({ 
  onTestConnections, 
  isTestingAll 
}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          Integrations & Notifications
        </h1>
        <p className="text-muted-foreground">
          Connect with Shopify Plus, Gadget.dev, Klaviyo, and marketing tools to synchronize price changes
        </p>
      </div>
      
      <div className="flex gap-4 flex-wrap">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
        
        <Button variant="outline" disabled={isTestingAll} onClick={onTestConnections}>
          {isTestingAll ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Test All Connections
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
