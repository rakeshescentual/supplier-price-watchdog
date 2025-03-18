import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useShopify } from "@/contexts/shopify";

export interface FileUploadState {
  uploadProgress: number;
  isDragging: boolean;
  fileType: "excel" | "pdf" | null;
  uploadComplete: boolean;
  fileName: string | null;
  shopifyFileUrl: string | null;
  shopifyUploadError: string | null;
  isUploading: boolean;
  isShopifyConnectedButUnhealthy: boolean;
}

export const useFileUpload = (onFileAccepted: (file: File) => void) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [fileType, setFileType] = useState<"excel" | "pdf" | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [shopifyFileUrl, setShopifyFileUrl] = useState<string | null>(null);
  const [shopifyUploadError, setShopifyUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { shopifyContext, isShopifyConnected, isShopifyHealthy } = useShopify();

  const isShopifyConnectedButUnhealthy = isShopifyConnected && !isShopifyHealthy;

  useEffect(() => {
    if (!isShopifyConnected) {
      setShopifyFileUrl(null);
      setShopifyUploadError(null);
    }
  }, [isShopifyConnected]);

  const simulateLocalProgress = () => {
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

  const handleDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadProgress(0);
      setUploadComplete(false);
      setFileName(file.name);
      setShopifyUploadError(null);
      setIsUploading(true);
      
      if (file.type === "application/pdf") {
        setFileType("pdf");
      } else {
        setFileType("excel");
      }
      
      if (isShopifyConnected && shopifyContext) {
        try {
          const { saveFileToShopify } = await import('@/lib/shopifyApi');
          
          const fileUrl = await saveFileToShopify(file, (progress) => setUploadProgress(progress));
          
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
          
          onFileAccepted(file);
        } catch (error) {
          console.error("Error uploading file to Shopify:", error);
          setShopifyUploadError("Upload to Shopify failed. Processing locally only.");
          toast.error("Error uploading to Shopify", {
            description: "The file will be processed locally only.",
          });
          
          simulateLocalProgress();
          onFileAccepted(file);
        }
      } else {
        simulateLocalProgress();
        onFileAccepted(file);
      }
    }
  }, [onFileAccepted, isShopifyConnected, shopifyContext, isShopifyHealthy]);

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

  return {
    state: {
      uploadProgress,
      isDragging,
      fileType,
      uploadComplete,
      fileName,
      shopifyFileUrl,
      shopifyUploadError,
      isUploading,
      isShopifyConnectedButUnhealthy
    },
    actions: {
      handleDrop,
      handleShare,
      setIsDragging
    },
    shopify: {
      isShopifyConnected,
      isShopifyHealthy
    }
  };
};
