
import { useState } from "react";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Send, Mail, AlertCircle, CheckCircle, UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export const GmailIntegration = () => {
  const { items, summary, priceIncreaseEffectiveDate } = useFileAnalysis();
  const [isSending, setIsSending] = useState(false);
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("Price Updates Notification");
  const [messageBody, setMessageBody] = useState("");
  const [messageType, setMessageType] = useState<"customer" | "supplier" | "internal">("customer");
  const [sentEmails, setSentEmails] = useState(0);
  
  const increasedItems = items.filter(item => item.status === 'increased');
  const effectiveDate = priceIncreaseEffectiveDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
  // Generate default message based on type
  const generateDefaultMessage = (type: "customer" | "supplier" | "internal") => {
    const formattedDate = format(effectiveDate, "MMMM d, yyyy");
    
    switch (type) {
      case "customer":
        return `Dear Valued Customer,\n\nWe would like to inform you about upcoming price changes effective ${formattedDate}. Some products you've previously purchased will have price adjustments.\n\nPlease review the attached list for details. Feel free to place your orders before the price changes take effect.\n\nThank you for your continued business.\n\nBest regards,\nYour Company`;
      
      case "supplier":
        return `Dear Supplier,\n\nWe have received and processed your updated price list.\n\nWe have ${increasedItems.length} items with price increases and ${summary.decreasedItems} items with price decreases.\n\nPlease confirm these changes will take effect on ${formattedDate}.\n\nRegards,\nPurchasing Department`;
      
      case "internal":
        return `Team,\n\nWe have processed the latest supplier price update. Effective ${formattedDate}, we will have:\n- ${increasedItems.length} items with price increases\n- ${summary.decreasedItems} items with price decreases\n- ${summary.unchangedItems} items with unchanged prices\n\nPlease review the attached spreadsheet for full details and take appropriate action for inventory planning and marketing announcements.\n\nRegards,\nPricing Team`;
    }
  };
  
  // Update message when type changes
  const handleMessageTypeChange = (type: "customer" | "supplier" | "internal") => {
    setMessageType(type);
    setMessageBody(generateDefaultMessage(type));
    
    // Update subject based on type
    switch (type) {
      case "customer":
        setSubject("Important: Upcoming Price Changes");
        break;
      case "supplier":
        setSubject("Price List Update Confirmation");
        break;
      case "internal":
        setSubject("Supplier Price Update Analysis");
        break;
    }
  };
  
  // Initialize default message on mount
  useState(() => {
    handleMessageTypeChange("customer");
  });
  
  const handleSendEmail = async () => {
    if (!recipients.trim()) {
      toast.error("Recipients required", {
        description: "Please enter at least one email address.",
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // In a real implementation, this would:
      // 1. Connect to Gmail API using OAuth
      // 2. Compose and send the email with attachments
      // 3. Track email delivery status
      
      // For this demo, we'll simulate the API call
      const recipientList = recipients.split(",").map(email => email.trim());
      console.log(`Sending email to ${recipientList.length} recipients with subject: ${subject}`);
      console.log("Message:", messageBody);
      
      // Simulate sending delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSentEmails(prev => prev + recipientList.length);
      
      toast.success("Email sent successfully", {
        description: `Email sent to ${recipientList.length} recipients`,
      });
      
      // Clear recipients after successful send
      setRecipients("");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email", {
        description: "There was an error connecting to Gmail. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const exportPriceList = () => {
    // In a real implementation, this would generate and download an Excel/CSV file
    // with the price changes for attaching to the email
    
    toast.success("Price list exported", {
      description: "The price list has been exported and is ready to attach to your email.",
    });
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Gmail Integration
        </CardTitle>
        <CardDescription>
          Send price update notifications via Gmail
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!items.length ? (
          <div className="flex items-center justify-center py-6 text-center text-muted-foreground">
            <div>
              <AlertCircle className="mx-auto h-8 w-8 mb-2" />
              <p>Upload a price list first to use Gmail integration</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-blue-50 p-3 rounded-md text-sm flex items-start gap-2 text-blue-700">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                To use Gmail integration, you'll need to authorize the app with your Google account.
                This allows sending emails directly from the app.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="message-type">Message Type</Label>
                <Select 
                  value={messageType} 
                  onValueChange={(value) => handleMessageTypeChange(value as any)}
                >
                  <SelectTrigger id="message-type">
                    <SelectValue placeholder="Select message type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer Notification</SelectItem>
                    <SelectItem value="supplier">Supplier Communication</SelectItem>
                    <SelectItem value="internal">Internal Team Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recipients" className="flex items-center justify-between">
                  Recipients
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 gap-1 text-xs"
                    onClick={() => {
                      toast.success("Address book opened", {
                        description: "Select contacts from your Google Contacts.",
                      });
                    }}
                  >
                    <UserPlus className="h-3 w-3" />
                    Add from Contacts
                  </Button>
                </Label>
                <Input
                  id="recipients"
                  placeholder="email@example.com, another@example.com"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple email addresses with commas
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  className="min-h-[200px] resize-y"
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                />
              </div>
              
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={exportPriceList}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Export Price List for Attachment
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {sentEmails > 0 && (
          <Badge variant="outline" className="flex gap-1.5 items-center">
            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
            {sentEmails} email{sentEmails !== 1 ? 's' : ''} sent
          </Badge>
        )}
        
        <Button
          onClick={handleSendEmail}
          disabled={isSending || !items.length || !recipients.trim()}
          className="ml-auto w-full sm:w-auto"
        >
          {isSending ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin inline-block rounded-full border-2 border-current border-t-transparent"></span>
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Email
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
