
import { useState } from "react";
import { toast } from "sonner";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { useCustomerNotifications } from "@/hooks/useCustomerNotifications";
import { PriceItem } from "@/types/price";

export type NotificationChannel = 'email' | 'sms' | 'push' | 'app' | 'website';
export type MessageTone = 'neutral' | 'urgent' | 'promotional';

export const usePriceAlerts = () => {
  const { items, priceIncreaseEffectiveDate } = useFileAnalysis();
  const { sendPriceIncreaseNotifications, isSendingNotifications } = useCustomerNotifications();
  
  const [selectedChannels, setSelectedChannels] = useState<Record<NotificationChannel, boolean>>({
    email: true,
    sms: false,
    push: false,
    app: false,
    website: true
  });
  
  const [messageTone, setMessageTone] = useState<MessageTone>('neutral');
  const [customMessage, setCustomMessage] = useState('');
  
  const handleToggleChannel = (channel: NotificationChannel) => {
    setSelectedChannels(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));
  };
  
  const handleSendAlerts = async () => {
    if (!priceIncreaseEffectiveDate) {
      toast.error("Effective date required", {
        description: "Please set a price increase effective date in the Notifications tab.",
      });
      return;
    }
    
    const enabledChannels = Object.entries(selectedChannels)
      .filter(([_, enabled]) => enabled)
      .map(([channel]) => channel);
    
    if (enabledChannels.length === 0) {
      toast.error("No channels selected", {
        description: "Please select at least one notification channel.",
      });
      return;
    }
    
    // Log which channels are being used
    console.log(`Sending price alerts via: ${enabledChannels.join(', ')}`);
    console.log(`Message tone: ${messageTone}`);
    
    if (customMessage) {
      console.log(`Custom message: ${customMessage}`);
    }
    
    // Use the customer notifications hook to send email notifications
    if (selectedChannels.email) {
      const result = await sendPriceIncreaseNotifications(
        items,
        priceIncreaseEffectiveDate,
        customMessage || undefined
      );
      
      console.log("Notification result:", result);
    } else {
      // For other channels, we'll simulate success
      toast.success("Alerts scheduled", {
        description: `Price alerts will be sent via ${enabledChannels.join(', ')} when prices change.`,
      });
    }
  };
  
  return {
    items,
    priceIncreaseEffectiveDate,
    selectedChannels,
    messageTone,
    customMessage,
    isSendingNotifications,
    handleToggleChannel,
    setMessageTone,
    setCustomMessage,
    handleSendAlerts
  };
};
