
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Send, AlertCircle } from "lucide-react";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const GmailIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState('price_increase');
  const [customMessage, setCustomMessage] = useState('');
  const { items, summary, priceIncreaseEffectiveDate } = useFileAnalysis();
  
  // Define the available templates
  const templates = {
    price_increase: `Dear Customer,\n\nWe wanted to inform you about upcoming price changes that will take effect on ${priceIncreaseEffectiveDate?.toLocaleDateString() || "[date not set]"}. These changes affect ${summary.increasedItems} products in our catalog.\n\nPlease review the attached document for the complete list of products with updated pricing.\n\nBest regards,\nYour Company`,
    
    discontinued: `Dear Customer,\n\nWe regret to inform you that ${summary.discontinuedItems} products in our catalog will be discontinued. Please review the attached document for details.\n\nWe recommend considering alternative products which we'd be happy to suggest.\n\nBest regards,\nYour Company`,
    
    new_products: `Dear Customer,\n\nWe're excited to announce ${summary.newItems} new products added to our catalog! Please review the attached document for details on these new offerings.\n\nBest regards,\nYour Company`
  };
  
  const handleSendEmails = async () => {
    if (items.length === 0) {
      toast.error("No data available", {
        description: "Please upload a price list before sending emails."
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Emails sent", {
        description: "Test email notification has been sent to your inbox."
      });
    } catch (error) {
      console.error("Email sending error:", error);
      toast.error("Failed to send emails", {
        description: "Please check your Google authentication and try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Gmail Integration
        </CardTitle>
        <CardDescription>
          Send customer notifications about price changes via Gmail
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="compose">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="compose" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Email Template</Label>
                <RadioGroup 
                  defaultValue="price_increase"
                  className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3" 
                  value={emailTemplate}
                  onValueChange={setEmailTemplate}
                >
                  <div className="flex items-center space-x-2 rounded-md border p-2">
                    <RadioGroupItem value="price_increase" id="price_increase" />
                    <Label htmlFor="price_increase" className="flex-1 cursor-pointer">Price Increase</Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-2">
                    <RadioGroupItem value="discontinued" id="discontinued" />
                    <Label htmlFor="discontinued" className="flex-1 cursor-pointer">Discontinued Items</Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-2">
                    <RadioGroupItem value="new_products" id="new_products" />
                    <Label htmlFor="new_products" className="flex-1 cursor-pointer">New Products</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  className="min-h-32 mt-2"
                  value={customMessage || templates[emailTemplate as keyof typeof templates]}
                  onChange={(e) => setCustomMessage(e.target.value)}
                />
              </div>
              
              {!priceIncreaseEffectiveDate && emailTemplate === 'price_increase' && (
                <div className="flex items-center gap-2 text-amber-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>Set a price increase effective date in the Notifications tab for better clarity</span>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 rounded-md bg-muted">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Gmail Connection</p>
                  <p className="text-sm text-muted-foreground">Connect your Gmail account to send notifications</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">
                  Connect
                </Button>
              </div>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sender_name">Sender Name</Label>
                  <input 
                    id="sender_name" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Your Name" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sender_email">Sender Email</Label>
                  <input 
                    id="sender_email" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="your.email@example.com" 
                    type="email"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="ml-auto" 
          onClick={handleSendEmails}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Test Email
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
