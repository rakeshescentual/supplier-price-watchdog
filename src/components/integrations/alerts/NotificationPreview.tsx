
import { PriceItem } from "@/types/price";

interface NotificationPreviewProps {
  items: PriceItem[];
  priceIncreaseEffectiveDate: Date | null;
  messageTone: string;
}

export const NotificationPreview = ({ 
  items, 
  priceIncreaseEffectiveDate, 
  messageTone 
}: NotificationPreviewProps) => {
  if (!priceIncreaseEffectiveDate || !items.some(item => item.status === 'increased')) {
    return null;
  }

  return (
    <div className="rounded-md border p-3 bg-muted/30">
      <h4 className="text-sm font-medium mb-2">Example Notification</h4>
      <p className="text-sm">{getExampleNotification(items, priceIncreaseEffectiveDate, messageTone)}</p>
    </div>
  );
};

// Helper function to generate example notification based on selected tone
function getExampleNotification(
  items: PriceItem[], 
  priceIncreaseEffectiveDate: Date,
  messageTone: string
): string {
  const increasedItems = items.filter(item => item.status === 'increased');
  if (increasedItems.length === 0) return "";
  
  const sampleItem = increasedItems[0];
  
  switch (messageTone) {
    case "urgent":
      return `LAST CHANCE: Price increasing on ${sampleItem.name} from £${sampleItem.oldPrice.toFixed(2)} to £${sampleItem.newPrice.toFixed(2)} on ${priceIncreaseEffectiveDate.toLocaleDateString()}. Buy now to save!`;
    
    case "promotional":
      return `Great news! Get ${sampleItem.name} at the current price of £${sampleItem.oldPrice.toFixed(2)} before it increases to £${sampleItem.newPrice.toFixed(2)} on ${priceIncreaseEffectiveDate.toLocaleDateString()}. Limited time offer!`;
    
    case "neutral":
    default:
      return `Price notice: ${sampleItem.name} will increase from £${sampleItem.oldPrice.toFixed(2)} to £${sampleItem.newPrice.toFixed(2)} on ${priceIncreaseEffectiveDate.toLocaleDateString()}.`;
  }
}
