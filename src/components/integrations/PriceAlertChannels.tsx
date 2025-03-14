
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BellRing } from "lucide-react";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import { NotificationChannels } from "./alerts/NotificationChannels";
import { MessageToneSelector } from "./alerts/MessageToneSelector";
import { CustomMessageInput } from "./alerts/CustomMessageInput";
import { NotificationPreview } from "./alerts/NotificationPreview";
import { AlertNotificationButton } from "./alerts/AlertNotificationButton";

export const PriceAlertChannels = () => {
  const {
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
  } = usePriceAlerts();
  
  const isDisabled = isSendingNotifications || 
    items.length === 0 || 
    !items.some(item => item.status === 'increased');
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          Price Alert Channels
        </CardTitle>
        <CardDescription>
          Configure how customers are notified about price changes
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <NotificationChannels 
          selectedChannels={selectedChannels}
          onToggleChannel={handleToggleChannel}
        />
        
        <Separator />
        
        <MessageToneSelector 
          messageTone={messageTone}
          setMessageTone={setMessageTone}
        />
        
        <CustomMessageInput 
          customMessage={customMessage}
          setCustomMessage={setCustomMessage}
        />
        
        <NotificationPreview 
          items={items}
          priceIncreaseEffectiveDate={priceIncreaseEffectiveDate}
          messageTone={messageTone}
        />
      </CardContent>
      
      <CardFooter>
        <AlertNotificationButton 
          onClick={handleSendAlerts}
          disabled={isDisabled}
          isLoading={isSendingNotifications}
        />
      </CardFooter>
    </Card>
  );
};
