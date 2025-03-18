import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { saveFileToShopify } from '@/lib/shopifyApi';
import type { ShopifyFileUploadResult } from '@/types/price';

export interface FileUploadState {
  isLoading: boolean;
  progress: number;
  error: Error | null;
  fileUrl: string | null;
  isDragging: boolean;
  fileType: string | null;
  uploadComplete: boolean;
  fileName: string | null;
  shopifyFileUrl: string | null;
  shopifyUploadError: string | null;
  isUploading: boolean;
  isShopifyConnectedButUnhealthy: boolean;
}

export interface FileUploadActions {
  handleDrop: (files: File[]) => void;
  setIsDragging: (isDragging: boolean) => void;
  handleShare: () => void;
  handleUpload: (file: File) => Promise<void>;
}

export function useFileUpload(onFileAccepted: (file: File) => void) {
  const [state, setState] = useState<FileUploadState>({
    isLoading: false,
    progress: 0,
    error: null,
    fileUrl: null,
    isDragging: false,
    fileType: null,
    uploadComplete: false,
    fileName: null,
    shopifyFileUrl: null,
    shopifyUploadError: null,
    isUploading: false,
    isShopifyConnectedButUnhealthy: false
  });

  // Simulate upload progress
  const simulateProgress = (percent: number) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        setState(prev => ({ ...prev, progress: percent }));
        resolve();
      }, 100);
    });
  };

  // Fix the incorrect parameter type in saveFileToShopify
  // This is a mock implementation - you'll need to update with actual logic
  const saveToShopify = async (file: File) => {
    try {
      // Create a mock shopify context just for this function
      const mockContext = {
        shop: 'example-shop.myshopify.com',
        accessToken: 'example-token'
      };
      
      // Now call saveFileToShopify with the correct parameters
      const result = await saveFileToShopify(mockContext, file);
      return result;
    } catch (error) {
      console.error("Error saving file to Shopify:", error);
      throw error;
    }
  };

  const handleUpload = useCallback(async (file: File) => {
    setState(prev => ({ ...prev, isLoading: true, progress: 0, error: null }));
    
    try {
      const result: ShopifyFileUploadResult = await saveFileToShopify(mockShopifyContext, file);
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          fileUrl: result.fileUrl || null,
          uploadComplete: true,
          progress: 100 
        }));
        
        toast({
          title: "Upload successful",
          description: "File saved to Shopify successfully.",
        });
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown upload error');
      setState(prev => ({ ...prev, error }));
      
      toast({
        title: "Upload error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const actions: FileUploadActions = {
    handleDrop: (files) => {
      if (files.length) {
        onFileAccepted(files[0]);
      }
    },
    setIsDragging: (isDragging) => setState(prev => ({ ...prev, isDragging })),
    handleShare: () => {
      // Implement your share functionality here
      toast({
        title: "Share",
        description: "Share functionality is not implemented yet.",
      });
    },
    handleUpload
  };

  return {
    state,
    actions,
    shopify: {
      isShopifyConnected: true, // This should come from your Shopify context
      isShopifyHealthy: true // This should come from your Shopify context
    }
  };
}
