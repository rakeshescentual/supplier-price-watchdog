
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileUp, FileText, Share, Check, AlertCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner";
import { useShopify } from "@/contexts/ShopifyContext";
import { saveFileToShopify } from "@/lib/shopifyApi";

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [fileType, setFileType] = useState<"excel" | "pdf" | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [shopifyFileUrl, setShopifyFileUrl] = useState<string | null>(null);
  const [shopifyUploadError, setShopifyUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { shopifyContext, isShopifyConnected, isShopifyHealthy } = useShopify();

  // Reset upload state when Shopify connection changes
  useEffect(() => {
    if (!isShopifyConnected) {
      setShopifyFileUrl(null);
      setShopifyUploadError(null);
    }
  }, [isShopifyConnected]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadProgress(0);
      setUploadComplete(false);
      setFileName(file.name);
      setShopifyUploadError(null);
      setIsUploading(true);
      
      // Determine file type
      if (file.type === "application/pdf") {
        setFileType("pdf");
      } else {
        setFileType("excel");
      }
      
      // Upload to Shopify if connected
      if (isShopifyConnected && shopifyContext) {
        try {
          // Use the saveFileToShopify function with progress callback
          const fileUrl = await saveFileToShopify(
            shopifyContext, 
            file,
            (progress) => setUploadProgress(progress)
          );
          
          // Update state based on result
          setUploadComplete(true);
          setIsUploading(false);
          
          if (fileUrl) {
            setShopifyFileUrl(fileUrl);
            toast.success("File uploaded to Shopify", {
              description: "The file was successfully saved to your Shopify store.",
            });
          } else {
            setShopifyUploadError("Upload to Shopify failed. Processing locally only.");
            toast.error("Error uploading to Shopify", {
              description: "The file will be processed locally only.",
            });
          }
          
          // Continue with analysis
          onFileAccepted(file);
        } catch (error) {
          console.error("Error uploading file to Shopify:", error);
          setShopifyUploadError("Upload to Shopify failed. Processing locally only.");
          toast.error("Error uploading to Shopify", {
            description: "The file will be processed locally only.",
          });
          
          // Simulate upload progress for local processing
          simulateLocalProgress();
          onFileAccepted(file);
        }
      } else {
        // Not connected to Shopify, process locally only
        simulateLocalProgress();
        onFileAccepted(file);
      }
    }
  }, [onFileAccepted, isShopifyConnected, shopifyContext, isShopifyHealthy]);

  const simulateLocalProgress = () => {
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadComplete(true);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    accept: allowedFileTypes,
    multiple: false,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
    disabled: isUploading,
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Supplier Price Watch',
        text: 'Check out this tool for analyzing supplier price changes!',
        url: window.location.href,
      })
      .then(() => toast.success("Shared successfully"))
      .catch((error) => toast.error("Error sharing", { description: error.message }));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success("Link copied to clipboard"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };

  const isShopifyConnectedButUnhealthy = isShopifyConnected && !isShopifyHealthy;

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
          onClick={handleShare}
        >
          <Share className="w-4 h-4 mr-1" /> Share
        </Button>
      </div>
      
      {isShopifyConnectedButUnhealthy && (
        <Alert variant="warning" className="mb-4">
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
      
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center gap-4 cursor-pointer ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        <div className={`p-4 rounded-full ${uploadComplete ? "bg-green-100" : "bg-primary/10"}`}>
          {uploadProgress === 0 && !uploadComplete ? (
            <Upload className="w-8 h-8 text-primary" />
          ) : uploadComplete ? (
            <Check className="w-8 h-8 text-green-500" />
          ) : fileType === "pdf" ? (
            <FileText className="w-8 h-8 text-primary" />
          ) : (
            <FileUp className="w-8 h-8 text-primary" />
          )}
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
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full max-w-xs">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground mt-1">
              Uploading{fileName ? ` ${fileName}` : ''}...
              {isShopifyConnected && uploadProgress < 90 && !shopifyUploadError && " to Shopify"}
            </p>
          </div>
        )}
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
