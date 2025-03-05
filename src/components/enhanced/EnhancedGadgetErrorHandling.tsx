
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, RefreshCw, ExternalLink } from "lucide-react";

interface GadgetErrorProps {
  error: Error | null;
  isLoading: boolean;
  retry: () => void;
  timestamp?: string;
  errorCode?: string;
  onOpenDocs?: () => void;
}

export const EnhancedGadgetErrorHandling: React.FC<GadgetErrorProps> = ({
  error,
  isLoading,
  retry,
  timestamp,
  errorCode,
  onOpenDocs
}) => {
  if (!error) {
    return (
      <Card className="border-green-100 bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-green-700 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Gadget.dev Connection Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-green-600">
            All Gadget.dev services are functioning normally.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Try to extract a meaningful message from the error
  let errorMessage = error.message;
  let solution = "";
  
  if (errorMessage.includes("API key")) {
    solution = "Check your API key in the Gadget configuration form.";
  } else if (errorMessage.includes("network") || errorMessage.includes("CORS")) {
    solution = "Check your network connection and Gadget CORS configuration.";
  } else if (errorMessage.includes("permission") || errorMessage.includes("access")) {
    solution = "Verify your API key has the required permissions.";
  } else if (errorMessage.includes("rate limit")) {
    solution = "You've hit Gadget.dev rate limits. Try again in a few minutes or optimize your batch operations.";
  } else {
    solution = "Check the Gadget.dev dashboard for more details on this error.";
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Gadget.dev Error</AlertTitle>
      <AlertDescription>
        <div className="space-y-2 mt-2">
          <p className="text-sm font-medium">{errorMessage}</p>
          {(timestamp || errorCode) && (
            <div className="flex text-xs text-gray-500 space-x-4">
              {timestamp && <span>Time: {timestamp}</span>}
              {errorCode && <span>Code: {errorCode}</span>}
            </div>
          )}
          <p className="text-sm mt-1">{solution}</p>
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={retry} 
              disabled={isLoading}
              className="text-xs h-8"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Retrying...' : 'Retry Connection'}
            </Button>
            
            {onOpenDocs && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onOpenDocs}
                className="text-xs h-8"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Troubleshooting Guide
              </Button>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
