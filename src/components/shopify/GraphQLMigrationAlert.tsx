
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isGraphQLOnlyVersion, getDaysUntilGraphQLOnly, LATEST_API_VERSION } from '@/lib/shopify/api-version';

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
  const daysRemaining = getDaysUntilGraphQLOnly();
  
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
  
  const urgencyClass = daysRemaining < 90 ? "bg-red-50 border-red-200" : 
                       daysRemaining < 180 ? "bg-amber-50 border-amber-200" : 
                       "bg-blue-50 border-blue-200";
                       
  const urgencyColor = daysRemaining < 90 ? "text-red-600" : 
                      daysRemaining < 180 ? "text-amber-600" : 
                      "text-blue-600";
  
  return (
    <Alert variant="warning" className={`mb-6 ${urgencyClass}`}>
      <AlertTriangle className={`h-4 w-4 ${urgencyColor}`} />
      <AlertTitle className={daysRemaining < 90 ? "text-red-800" : daysRemaining < 180 ? "text-amber-800" : "text-blue-800"}>
        API Migration Required - {daysRemaining} Days Remaining
      </AlertTitle>
      <AlertDescription className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <span className={daysRemaining < 90 ? "text-red-700" : daysRemaining < 180 ? "text-amber-700" : "text-blue-700"}>
          After April 1, 2025, Shopify will no longer accept public app submissions that make REST API calls. 
          Update to API version {LATEST_API_VERSION} or later.
        </span>
        <div className="flex flex-wrap gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleViewDocs}
          >
            <Info className="h-4 w-4 mr-2" />
            Migration Guide
          </Button>
          {onUpdateVersion && (
            <Button 
              size="sm" 
              variant="default"
              onClick={onUpdateVersion}
            >
              Update to {LATEST_API_VERSION}
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
