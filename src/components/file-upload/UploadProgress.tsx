
import { Progress } from "../ui/progress";

interface UploadProgressProps {
  progress: number;
  fileName: string | null;
  isShopifyConnected: boolean;
  shopifyUploadError: string | null;
}

export const UploadProgress = ({ 
  progress, 
  fileName, 
  isShopifyConnected,
  shopifyUploadError
}: UploadProgressProps) => {
  if (progress <= 0 || progress >= 100) return null;
  
  return (
    <div className="w-full max-w-xs">
      <Progress value={progress} className="h-2" />
      <p className="text-xs text-center text-muted-foreground mt-1">
        Uploading{fileName ? ` ${fileName}` : ''}...
        {isShopifyConnected && progress < 90 && !shopifyUploadError && " to Shopify"}
      </p>
    </div>
  );
};
