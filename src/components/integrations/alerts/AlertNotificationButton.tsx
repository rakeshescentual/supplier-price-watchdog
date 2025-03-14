
import { Button } from "@/components/ui/button";
import { BellRing } from "lucide-react";

interface AlertNotificationButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export const AlertNotificationButton = ({ 
  onClick, 
  disabled, 
  isLoading 
}: AlertNotificationButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full"
    >
      {isLoading ? (
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
  );
};
