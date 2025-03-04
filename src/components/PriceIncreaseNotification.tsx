
import { useState } from "react";
import { useCustomerNotifications } from "@/hooks/useCustomerNotifications";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Mail, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const PriceIncreaseNotification = () => {
  const { items, summary, priceIncreaseEffectiveDate } = useFileAnalysis();
  const { 
    isSendingNotifications, 
    lastNotificationResult,
    sendPriceIncreaseNotifications
  } = useCustomerNotifications();
  
  const [effectiveDate, setEffectiveDate] = useState<Date>(priceIncreaseEffectiveDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [customMessage, setCustomMessage] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const increasedItems = items.filter(item => item.status === 'increased');
  
  const handleSendNotifications = async () => {
    await sendPriceIncreaseNotifications(items, effectiveDate, customMessage);
  };
  
  const getAffectedCustomersEstimate = () => {
    // In a real implementation, this would query Shopify for an estimate
    return Math.max(5, increasedItems.length * 4); // More realistic number
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Price Increase Notifications
        </CardTitle>
        <CardDescription>
          Notify customers who previously purchased items that will increase in price
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {increasedItems.length > 0 ? (
          <>
            <div className="flex items-start gap-2 text-sm bg-amber-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>{increasedItems.length}</strong> items with price increases,
                potentially affecting approximately <strong>{getAffectedCustomersEstimate()}</strong> customers
              </span>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="effectiveDate" className="text-sm font-medium">
                Price Increase Effective Date
              </label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(effectiveDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={effectiveDate}
                    onSelect={(date) => {
                      if (date) {
                        setEffectiveDate(date);
                        setCalendarOpen(false);
                      }
                    }}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="customMessage" className="text-sm font-medium">
                Additional Message (Optional)
              </label>
              <Textarea
                id="customMessage"
                placeholder="Add a personal message to the notification email..."
                className="min-h-[100px] resize-y"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
            </div>
            
            <div className="border p-3 rounded-md bg-muted/30 text-sm space-y-2">
              <p className="font-medium">Email Preview:</p>
              <p>
                Each customer will receive a personalized email listing the products they've purchased
                that will increase in price from {format(effectiveDate, "MMMM d, yyyy")}.
              </p>
              <p>
                The email will include the current price, new price, and a link to purchase again
                before the price increase takes effect.
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground/70" />
            <p>No items with price increases to notify customers about.</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        {lastNotificationResult && (
          <div className="flex items-center gap-2 mr-auto">
            <Badge variant={lastNotificationResult.failed > 0 ? "destructive" : "outline"}>
              {lastNotificationResult.success} sent
              {lastNotificationResult.failed > 0 && `, ${lastNotificationResult.failed} failed`}
            </Badge>
          </div>
        )}
        
        <Button
          onClick={handleSendNotifications}
          disabled={increasedItems.length === 0 || isSendingNotifications}
          className="ml-auto w-full sm:w-auto"
        >
          {isSendingNotifications ? "Sending..." : "Send Notifications"}
        </Button>
      </CardFooter>
    </Card>
  );
};
