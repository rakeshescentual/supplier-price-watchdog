
import { UploadIcon } from "./UploadIcon";

interface UploadContentProps {
  uploadProgress: number;
  uploadComplete: boolean;
  fileType: "excel" | "pdf" | null;
  fileName: string | null;
  shopifyFileUrl: string | null;
  isShopifyConnected: boolean;
  isShopifyHealthy: boolean;
}

export const UploadContent = ({
  uploadProgress,
  uploadComplete,
  fileType,
  fileName,
  shopifyFileUrl,
  isShopifyConnected,
  isShopifyHealthy
}: UploadContentProps) => {
  const isShopifyConnectedButUnhealthy = isShopifyConnected && !isShopifyHealthy;
  
  return (
    <>
      <div className={`p-4 rounded-full ${uploadComplete ? "bg-green-100" : "bg-primary/10"}`}>
        <UploadIcon 
          progress={uploadProgress} 
          uploadComplete={uploadComplete} 
          fileType={fileType} 
        />
      </div>
      <div className="text-center">
        {uploadComplete && fileName ? (
          <>
            <h3 className="text-lg font-semibold">Upload complete</h3>
            <p className="text-sm text-muted-foreground">{fileName}</p>
            {shopifyFileUrl && (
              <p className="text-xs text-green-600 mt-1">Saved to Shopify</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">Click or drag to upload another file</p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold">Drop your supplier price list here</h3>
            <p className="text-sm text-muted-foreground">
              or click to select file (.xlsx, .xls, .pdf)
            </p>
            {isShopifyConnected && (
              <p className="text-xs text-green-600 mt-1">
                Files will be saved to your Shopify store
                {isShopifyConnectedButUnhealthy && " when connection is restored"}
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
};
