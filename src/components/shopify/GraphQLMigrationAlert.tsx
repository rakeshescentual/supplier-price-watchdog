
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { isGraphQLOnlyVersion, LATEST_API_VERSION, getDaysUntilGraphQLOnly } from "@/lib/shopify/api-version";
import { AlertTriangle, ArrowRight } from "lucide-react";

interface GraphQLMigrationAlertProps {
  currentApiVersion: string;
  onUpdateVersion: () => void;
}

export function GraphQLMigrationAlert({ currentApiVersion, onUpdateVersion }: GraphQLMigrationAlertProps) {
  const isGraphQLOnly = isGraphQLOnlyVersion(currentApiVersion);
  const daysUntilDeadline = getDaysUntilGraphQLOnly();
  
  if (isGraphQLOnly) {
    return null; // Don't show alert if already using GraphQL-only version
  }
  
  return (
    <Alert variant="warning" className="mx-6 my-4 bg-amber-50 border-amber-200 text-amber-800">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertTitle>Shopify API Migration Required</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <div>
          <p>
            Shopify is transitioning to GraphQL-only APIs.
            {daysUntilDeadline > 0 ? (
              <span> You have <strong>{daysUntilDeadline} days</strong> to update.</span>
            ) : (
              <span> The deadline has passed!</span>
            )}
          </p>
          <p className="text-sm mt-1">
            Your current API version ({currentApiVersion}) is not GraphQL-only compatible.
          </p>
        </div>
        <Button 
          onClick={onUpdateVersion}
          size="sm" 
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          Update to {LATEST_API_VERSION}
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
