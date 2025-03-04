
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseFileDownloadOptions {
  filename?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Custom hook for handling file downloads with proper cleanup and error handling
 */
export const useFileDownload = (options: UseFileDownloadOptions = {}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const downloadFile = useCallback((blob: Blob, filename?: string) => {
    setIsDownloading(true);
    
    try {
      // Create download URL
      const url = URL.createObjectURL(blob);
      
      // Create temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || options.filename || 'download.xlsx';
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsDownloading(false);
        options.onSuccess?.();
      }, 100);
    } catch (error) {
      setIsDownloading(false);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Download error: ${errorMessage}`, error);
      toast.error("Download failed", {
        description: "Could not download file. Please try again.",
      });
      options.onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }, [options]);

  return {
    downloadFile,
    isDownloading
  };
};
