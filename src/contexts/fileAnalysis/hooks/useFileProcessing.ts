
import { useState, useCallback } from "react";
import { processFile } from "@/lib/excel";
import { toast } from "sonner";
import type { PriceItem } from "@/types/price";
import { useShopify } from "@/contexts/shopify";
import type { FileProcessingState } from "../types";

export const useFileProcessing = (): FileProcessingState => {
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<PriceItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { isShopifyConnected, loadShopifyData } = useShopify();

  const handleFileAccepted = async (acceptedFile: File) => {
    setFile(acceptedFile);
    setIsProcessing(true);
    
    try {
      const processedItems = await processFile(acceptedFile);
      
      if (isShopifyConnected) {
        try {
          const shopifyProducts = await loadShopifyData();
          const mergedItems = mergeWithShopifyData(processedItems, shopifyProducts);
          setItems(mergedItems);
          
          const fileType = acceptedFile.type === 'application/pdf' ? 'PDF' : 'Excel';
          toast.success(`${fileType} analysis complete`, {
            description: "Price changes have been processed and merged with Shopify data.",
          });
        } catch (shopifyError) {
          console.error("Shopify data loading error:", shopifyError);
          toast.error("Error loading Shopify data", {
            description: "Using uploaded data only for analysis.",
          });
          setItems(processedItems);
        }
      } else {
        setItems(processedItems);
        
        const fileType = acceptedFile.type === 'application/pdf' ? 'PDF' : 'Excel';
        toast.success(`${fileType} analysis complete`, {
          description: "Price changes have been processed successfully.",
        });
      }
    } catch (error) {
      console.error("File processing error:", error);
      toast.error("Error processing file", {
        description: "Please check the file format and try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to merge processed items with Shopify data
  const mergeWithShopifyData = (processedItems: PriceItem[], shopifyProducts: any[]): PriceItem[] => {
    // Import here to avoid circular dependencies
    const { mergeWithShopifyData } = require("@/lib/excel");
    return mergeWithShopifyData(processedItems, shopifyProducts);
  };

  return {
    file,
    items,
    isProcessing,
    setItems,
    handleFileAccepted
  };
};
