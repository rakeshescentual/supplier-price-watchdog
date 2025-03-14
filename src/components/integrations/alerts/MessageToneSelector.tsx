
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MessageTone } from "@/hooks/usePriceAlerts";

interface MessageToneSelectorProps {
  messageTone: MessageTone;
  setMessageTone: (tone: MessageTone) => void;
}

export const MessageToneSelector = ({ 
  messageTone, 
  setMessageTone 
}: MessageToneSelectorProps) => {
  return (
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
  );
};
