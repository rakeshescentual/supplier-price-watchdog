
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { PriceItem } from '@/types/price';
import { useShopify } from '@/contexts/shopify';

export const useCustomerNotifications = () => {
  const [isSendingNotifications, setIsSendingNotifications] = useState(false);
  const [lastNotificationResult, setLastNotificationResult] = useState<{
    success: number;
    failed: number;
  } | null>(null);
  
  const { shopifyContext } = useShopify();
  
  const sendPriceIncreaseNotifications = useCallback(async (
    items: PriceItem[], 
    effectiveDate: Date,
    customMessage?: string
  ) => {
    if (!shopifyContext) {
      toast.error("Shopify connection required", {
        description: "Please connect to Shopify to send customer notifications.",
      });
      return { success: 0, failed: 0 };
    }
    
    const increasedItems = items.filter(item => item.status === 'increased');
    if (increasedItems.length === 0) {
      toast.warning("No price increases to notify", {
        description: "There are no items with price increases to notify customers about.",
      });
      return { success: 0, failed: 0 };
    }
    
    setIsSendingNotifications(true);
    setLastNotificationResult(null);
    
    try {
      // In a real implementation, this would call the Shopify API to:
      // 1. Find customers who have previously purchased these items
      // 2. Generate and send personalized emails with the price change information
      
      console.log(`Sending price increase notifications for ${increasedItems.length} items with effective date ${effectiveDate.toLocaleDateString()}`);
      console.log("Custom message:", customMessage || "No custom message provided");
      
      // Simulate API call with delayed response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock result
      const result = {
        success: increasedItems.length,
        failed: 0
      };
      
      setLastNotificationResult(result);
      
      toast.success("Notifications sent", {
        description: `Successfully sent ${result.success} notifications to customers.`,
      });
      
      return result;
    } catch (error) {
      console.error("Error sending price increase notifications:", error);
      
      const errorResult = { success: 0, failed: increasedItems.length };
      setLastNotificationResult(errorResult);
      
      toast.error("Failed to send notifications", {
        description: "There was an error sending price increase notifications. Please try again.",
      });
      
      return errorResult;
    } finally {
      setIsSendingNotifications(false);
    }
  }, [shopifyContext]);
  
  const generatePriceIncreaseHtml = useCallback((
    item: PriceItem, 
    effectiveDate: Date
  ): string => {
    const formattedOldPrice = `£${item.oldPrice.toFixed(2)}`;
    const formattedNewPrice = `£${item.newPrice.toFixed(2)}`;
    const formattedDate = effectiveDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    return `
      <div class="price-increase-notice">
        <p>From <strong>${formattedDate}</strong>, the price of this item will increase from <strong>${formattedOldPrice}</strong> to <strong>${formattedNewPrice}</strong>.</p>
        <a href="https://www.escentual.com/products/${item.sku}" class="buy-now-link">Buy now before the price increase</a>
      </div>
    `;
  }, []);
  
  return {
    isSendingNotifications,
    lastNotificationResult,
    sendPriceIncreaseNotifications,
    generatePriceIncreaseHtml
  };
};
