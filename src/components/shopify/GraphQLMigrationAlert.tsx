
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isGraphQLOnlyVersion } from '@/lib/shopify/api-version';

interface GraphQLMigrationAlertProps {
  currentApiVersion: string;
  onUpdateVersion?: () => void;
}

export function GraphQLMigrationAlert({ 
  currentApiVersion,
  onUpdateVersion 
}: GraphQLMigrationAlertProps) {
  const navigate = useNavigate();
  const isCompliant = isGraphQLOnlyVersion(currentApiVersion);
  
  const handleViewDocs = () => {
    navigate('/documentation/docs/GraphQLMigrationGuide');
  };
  
  if (isCompliant) {
    return (
      <Alert variant="success" className="mb-6 bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">GraphQL Migration Complete</AlertTitle>
        <AlertDescription className="flex items-center justify-between text-green-700">
          <span>
            You're using API version {currentApiVersion} which is fully compliant with Shopify's GraphQL-only requirement.
          </span>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            Ready for April 2025
          </Badge>
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert variant="warning" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>API Migration Required</AlertTitle>
      <AlertDescription className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <span>
          After April 1, 2025, Shopify will no longer accept public app submissions that make REST API calls. 
          Update to API version 2025-04.
        </span>
        <div className="flex flex-wrap gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleViewDocs}
          >
            <Info className="h-4 w-4 mr-2" />
            View Guide
          </Button>
          {onUpdateVersion && (
            <Button 
              size="sm" 
              variant="default"
              onClick={onUpdateVersion}
            >
              Update to 2025-04
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
