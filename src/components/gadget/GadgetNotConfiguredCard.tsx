
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface GadgetNotConfiguredCardProps {
  reason?: string;
  onRetry: () => void;
  isChecking: boolean;
}

export const GadgetNotConfiguredCard = ({ reason, onRetry, isChecking }: GadgetNotConfiguredCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Gadget Health Status
        </CardTitle>
        <CardDescription>
          Monitor your Gadget.dev service health
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">Gadget Not Configured</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {reason || "Gadget is not properly configured."}
            </p>
            <Button
              variant="outline"
              onClick={onRetry}
              disabled={isChecking}
            >
              {isChecking ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                "Try Again"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
