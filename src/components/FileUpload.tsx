
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Share } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useFileUpload } from "./file-upload/useFileUpload";
import { UploadProgress } from "./file-upload/UploadProgress";
import { UploadContent } from "./file-upload/UploadContent";
import { ShopifyAlerts } from "./file-upload/ShopifyAlerts";

export const FileUpload = ({ 
  onFileAccepted,
  allowedFileTypes = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/pdf': ['.pdf']
  }
}: { 
  onFileAccepted: (file: File) => void;
  allowedFileTypes?: Record<string, string[]>;
}) => {
  const { 
    state, 
    actions,
    shopify
  } = useFileUpload(onFileAccepted);

  const { 
    uploadProgress, 
    isDragging, 
    fileType,
    uploadComplete,
    fileName,
    shopifyFileUrl,
    shopifyUploadError,
    isUploading,
    isShopifyConnectedButUnhealthy
  } = state;

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop: actions.handleDrop,
    accept: allowedFileTypes,
    multiple: false,
    onDragEnter: () => actions.setIsDragging(true),
    onDragLeave: () => actions.setIsDragging(false),
    onDropAccepted: () => actions.setIsDragging(false),
    disabled: isUploading,
  });

  return (
    <Card
      className={`p-8 transition-all duration-300 ${
        isDragging || isDragActive
          ? "border-primary border-2 bg-accent/50"
          : uploadComplete 
            ? "border-green-500 border-2" 
            : "border-dashed border-2 hover:border-primary/50"
      }`}
    >
      <div className="flex justify-end mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-foreground"
          onClick={actions.handleShare}
        >
          <Share className="w-4 h-4 mr-1" /> Share
        </Button>
      </div>
      
      <ShopifyAlerts 
        isShopifyConnectedButUnhealthy={isShopifyConnectedButUnhealthy} 
        shopifyUploadError={shopifyUploadError} 
      />
      
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center gap-4 cursor-pointer ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        
        <UploadContent 
          uploadProgress={uploadProgress}
          uploadComplete={uploadComplete}
          fileType={fileType}
          fileName={fileName}
          shopifyFileUrl={shopifyFileUrl}
          isShopifyConnected={shopify.isShopifyConnected}
          isShopifyHealthy={shopify.isShopifyHealthy}
        />
        
        <UploadProgress 
          progress={uploadProgress}
          fileName={fileName}
          isShopifyConnected={shopify.isShopifyConnected}
          shopifyUploadError={shopifyUploadError}
        />
      </div>
      
      <div className="flex justify-center mt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={open}
          className="text-sm"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Select file"}
        </Button>
      </div>
    </Card>
  );
};
