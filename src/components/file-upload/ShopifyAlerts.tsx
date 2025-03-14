
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

interface ShopifyAlertsProps {
  isShopifyConnectedButUnhealthy: boolean;
  shopifyUploadError: string | null;
}

export const ShopifyAlerts = ({ 
  isShopifyConnectedButUnhealthy, 
  shopifyUploadError 
}: ShopifyAlertsProps) => {
  return (
    <>
      {isShopifyConnectedButUnhealthy && (
        <Alert className="mb-4" variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Shopify connection may be experiencing issues. Files will still be processed locally.
          </AlertDescription>
        </Alert>
      )}
      
      {shopifyUploadError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{shopifyUploadError}</AlertDescription>
        </Alert>
      )}
    </>
  );
};
