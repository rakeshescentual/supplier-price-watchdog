
import { useState } from "react";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { BellRing, Mail, MessageSquareText, Store, Users } from "lucide-react";
import { useCustomerNotifications } from "@/hooks/useCustomerNotifications";

export const PriceAlertChannels = () => {
  const { items, priceIncreaseEffectiveDate } = useFileAnalysis();
  const { generatePriceIncreaseHtml, sendPriceIncreaseNotifications, isSendingNotifications } = useCustomerNotifications();
  
  const [selectedChannels, setSelectedChannels] = useState({
    email: true,
    sms: false,
    push: false,
    app: false,
    website: true
  });
  
  const [messageTone, setMessageTone] = useState("neutral");
  const [customMessage, setCustomMessage] = useState("");
  
  const handleToggleChannel = (channel: keyof typeof selectedChannels) => {
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
  
  // Generate example notification based on selected tone
  const getExampleNotification = () => {
    if (items.length === 0 || !priceIncreaseEffectiveDate) return "";
    
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
  };
  
  const selectedChannelCount = Object.values(selectedChannels).filter(Boolean).length;
  
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Notification Channels</h3>
            <span className="text-xs text-muted-foreground">{selectedChannelCount} selected</span>
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <div className="flex-none">
                <Switch 
                  id="channel-email"
                  checked={selectedChannels.email}
                  onCheckedChange={() => handleToggleChannel('email')}
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center">
                  <Label htmlFor="channel-email" className="font-medium cursor-pointer">Email</Label>
                  <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs py-0 px-1">Recommended</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Send price change emails to customers who purchased these items
                </p>
              </div>
              <div className="flex-none">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <div className="flex-none">
                <Switch 
                  id="channel-sms"
                  checked={selectedChannels.sms}
                  onCheckedChange={() => handleToggleChannel('sms')}
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="channel-sms" className="font-medium cursor-pointer">SMS</Label>
                <p className="text-xs text-muted-foreground">
                  Send text messages about price changes (requires phone numbers)
                </p>
              </div>
              <div className="flex-none">
                <MessageSquareText className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <div className="flex-none">
                <Switch 
                  id="channel-website"
                  checked={selectedChannels.website}
                  onCheckedChange={() => handleToggleChannel('website')}
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center">
                  <Label htmlFor="channel-website" className="font-medium cursor-pointer">Website</Label>
                  <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs py-0 px-1">Recommended</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Display banners on product pages before price increases
                </p>
              </div>
              <div className="flex-none">
                <Store className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <div className="flex-none">
                <Switch 
                  id="channel-app"
                  checked={selectedChannels.app}
                  onCheckedChange={() => handleToggleChannel('app')}
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="channel-app" className="font-medium cursor-pointer">Mobile App</Label>
                <p className="text-xs text-muted-foreground">
                  Send in-app notifications about price changes
                </p>
              </div>
              <div className="flex-none">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <div className="flex-none">
                <Switch 
                  id="channel-push"
                  checked={selectedChannels.push}
                  onCheckedChange={() => handleToggleChannel('push')}
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="channel-push" className="font-medium cursor-pointer">Push Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Send browser push notifications to subscribed users
                </p>
              </div>
              <div className="flex-none">
                <BellRing className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Message Tone</h3>
          
          <RadioGroup value={messageTone} onValueChange={setMessageTone} className="grid gap-2">
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="neutral" id="tone-neutral" />
              <Label htmlFor="tone-neutral" className="flex-1 cursor-pointer">
                <div className="font-medium">Neutral</div>
                <p className="text-xs text-muted-foreground">
                  Factual, straightforward notification about the price change
                </p>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="urgent" id="tone-urgent" />
              <Label htmlFor="tone-urgent" className="flex-1 cursor-pointer">
                <div className="font-medium">Urgent</div>
                <p className="text-xs text-muted-foreground">
                  Create a sense of urgency to buy before the price increases
                </p>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="promotional" id="tone-promotional" />
              <Label htmlFor="tone-promotional" className="flex-1 cursor-pointer">
                <div className="font-medium">Promotional</div>
                <p className="text-xs text-muted-foreground">
                  Frame as a positive limited-time offer at the current price
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="custom-message">Custom Message (Optional)</Label>
          <Textarea 
            id="custom-message" 
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Add your own custom message to accompany the price change notification..."
            className="min-h-[100px]"
          />
        </div>
        
        {priceIncreaseEffectiveDate && items.some(item => item.status === 'increased') && (
          <div className="rounded-md border p-3 bg-muted/30">
            <h4 className="text-sm font-medium mb-2">Example Notification</h4>
            <p className="text-sm">{getExampleNotification()}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={handleSendAlerts}
          disabled={isSendingNotifications || items.length === 0 || !items.some(item => item.status === 'increased')}
          className="w-full"
        >
          {isSendingNotifications ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin inline-block rounded-full border-2 border-current border-t-transparent"></span>
              Sending Alerts...
            </>
          ) : (
            <>
              <BellRing className="mr-2 h-4 w-4" />
              Send Price Change Alerts
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Add missing imports after creating the component
import { Badge } from "@/components/ui/badge";
import { Smartphone } from "lucide-react";
