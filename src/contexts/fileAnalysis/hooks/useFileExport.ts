
import { useCallback } from "react";
import { exportToShopifyFormat } from "@/lib/excel";
import { toast } from "sonner";
import type { PriceItem } from "@/types/price";
import type { ExportState } from "../types";

export const useFileExport = (items: PriceItem[]): ExportState => {
  const exportForShopify = useCallback(() => {
    if (items.length === 0) {
      toast.error("No data to export", {
        description: "Please upload and process a price list first.",
      });
      return;
    }
    
    try {
      const shopifyData = exportToShopifyFormat(items);
      const blob = new Blob([shopifyData], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'shopify_price_update.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up
      
      toast.success("Export complete", {
        description: "Shopify-compatible price list has been downloaded.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Error exporting data", {
        description: "Please try again later.",
      });
    }
  }, [items]);

  return { exportForShopify };
};
