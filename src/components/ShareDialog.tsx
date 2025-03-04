
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share, Copy, Download, Mail, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface ShareDialogProps {
  fileStats?: {
    totalItems: number;
    increasedItems: number;
    decreasedItems: number;
  };
  onExport?: () => void;
}

export const ShareDialog = ({ fileStats, onExport }: ShareDialogProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("link");
  const [emailRecipient, setEmailRecipient] = useState("");
  const [emailSubject, setEmailSubject] = useState("Price Analysis from Supplier Price Watch");
  const [emailMessage, setEmailMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const appUrl = window.location.href;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl)
      .then(() => toast.success("Link copied to clipboard"))
      .catch(() => toast.error("Failed to copy link"));
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Supplier Price Watch',
        text: `Check out this price analysis tool${fileStats ? ` - analyzing ${fileStats.totalItems} products with ${fileStats.increasedItems} price increases and ${fileStats.decreasedItems} decreases` : ''}!`,
        url: appUrl,
      })
      .then(() => {
        toast.success("Shared successfully");
        setOpen(false);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          toast.error("Error sharing", { description: error.message });
        }
      });
    } else {
      handleCopyLink();
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRecipient) {
      toast.error("Please enter recipient email");
      return;
    }

    setIsSending(true);
    
    try {
      // In a real app, this would be a call to your backend
      // For demo purposes, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log the correspondence to local storage for now
      const correspondence = JSON.parse(localStorage.getItem('supplierCorrespondence') || '[]');
      correspondence.push({
        id: Date.now(),
        type: 'outbound',
        recipient: emailRecipient,
        subject: emailSubject,
        message: emailMessage,
        date: new Date().toISOString(),
        fileStats: fileStats
      });
      localStorage.setItem('supplierCorrespondence', JSON.stringify(correspondence));

      toast.success("Email sent successfully", {
        description: `Sent to ${emailRecipient}`,
      });
      
      // Reset form
      setEmailRecipient("");
      setEmailMessage("");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to send email", {
        description: "Please try again later",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Supplier Price Watch</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="link" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Share Link</TabsTrigger>
            <TabsTrigger value="email">Email Supplier</TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">Link</Label>
                <Input
                  id="link"
                  readOnly
                  value={appUrl}
                  className="h-9"
                />
              </div>
              <Button size="sm" variant="secondary" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleShare} className="gap-2">
                <MessageSquare className="h-4 w-4" />
                {navigator.share ? "Share" : "Copy Link"}
              </Button>
              {onExport && (
                <Button onClick={() => { onExport(); setOpen(false); }} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4">
            <form onSubmit={handleSendEmail}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Recipient Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="supplier@example.com"
                    value={emailRecipient}
                    onChange={(e) => setEmailRecipient(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message"
                    rows={4}
                    placeholder="Enter your message to the supplier..."
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                  />
                </div>
                
                <div>
                  {fileStats && (
                    <div className="p-3 bg-muted rounded-md text-sm mb-4">
                      <p className="text-muted-foreground">
                        Sharing analysis of {fileStats.totalItems} products, including {fileStats.increasedItems} price increases and {fileStats.decreasedItems} decreases.
                      </p>
                    </div>
                  )}
                </div>
                
                <Button type="submit" disabled={isSending} className="gap-2">
                  <Mail className="h-4 w-4" />
                  {isSending ? "Sending..." : "Send Email"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
        
        {activeTab === "link" && fileStats && (
          <div className="mt-4 p-3 bg-muted rounded-md text-sm">
            <p className="text-muted-foreground">
              Sharing analysis of {fileStats.totalItems} products, including {fileStats.increasedItems} price increases and {fileStats.decreasedItems} decreases.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
