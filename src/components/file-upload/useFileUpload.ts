import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { saveFileToShopify } from '@/lib/shopifyApi';

export function useFileUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  
  const handleUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setProgress(0);
    setError(null);
    setFileUrl(null);
    
    // Simulate upload progress
    const simulateProgress = (percent: number) => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          setProgress(percent);
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
    
    try {
      // Simulate file processing
      await simulateProgress(20);
      
      // Save file to Shopify
      const result = await saveToShopify(file);
      
      if (result?.success) {
        await simulateProgress(70);
        setFileUrl(result.fileUrl || 'https://example.com/mock-file-url.jpg'); // Mock URL
        
        await simulateProgress(100);
        toast({
          title: "Upload successful",
          description: "File saved to Shopify successfully.",
        });
      } else {
        setError(new Error(result?.message || 'Upload failed'));
        toast({
          title: "Upload failed",
          description: result?.message || "Could not save file to Shopify.",
          variant: "destructive",
        });
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown upload error');
      setError(error);
      toast({
        title: "Upload error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return {
    isLoading,
    progress,
    error,
    fileUrl,
    handleUpload
  };
}
