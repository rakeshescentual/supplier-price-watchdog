
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CustomMessageInputProps {
  customMessage: string;
  setCustomMessage: (message: string) => void;
}

export const CustomMessageInput = ({ 
  customMessage, 
  setCustomMessage 
}: CustomMessageInputProps) => {
  return (
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
  );
};
