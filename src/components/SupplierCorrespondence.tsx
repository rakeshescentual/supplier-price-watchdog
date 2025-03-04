
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, ArrowUpRight, ArrowDownLeft, Calendar, Send } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Correspondence {
  id: number;
  type: 'inbound' | 'outbound';
  recipient?: string;
  sender?: string;
  subject: string;
  message: string;
  date: string;
  fileStats?: {
    totalItems: number;
    increasedItems: number;
    decreasedItems: number;
  };
}

export function SupplierCorrespondence() {
  const [correspondence, setCorrespondence] = useState<Correspondence[]>([]);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedCorrespondence, setSelectedCorrespondence] = useState<Correspondence | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Load correspondence from localStorage
    const savedCorrespondence = localStorage.getItem('supplierCorrespondence');
    if (savedCorrespondence) {
      setCorrespondence(JSON.parse(savedCorrespondence));
    }
  }, []);

  const handleRecordReply = (item: Correspondence) => {
    setSelectedCorrespondence(item);
    setReplySubject(item.subject.startsWith('Re:') ? item.subject : `Re: ${item.subject}`);
    setReplyDialogOpen(true);
  };

  const handleSaveReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCorrespondence) return;
    
    setIsSending(true);
    
    try {
      // In a real app, this would be a call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReply: Correspondence = {
        id: Date.now(),
        type: 'inbound',
        sender: selectedCorrespondence.recipient,
        subject: replySubject,
        message: replyMessage,
        date: new Date().toISOString()
      };
      
      const updatedCorrespondence = [...correspondence, newReply];
      setCorrespondence(updatedCorrespondence);
      localStorage.setItem('supplierCorrespondence', JSON.stringify(updatedCorrespondence));
      
      toast.success("Reply recorded", {
        description: "The supplier's response has been logged",
      });
      
      setReplyDialogOpen(false);
      setReplySubject("");
      setReplyMessage("");
    } catch (error) {
      toast.error("Failed to record reply");
    } finally {
      setIsSending(false);
    }
  };

  if (correspondence.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Supplier Communication</CardTitle>
          <CardDescription>
            Track email correspondence with suppliers
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-6">
          <div className="text-center">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No correspondence yet. Send a query to your supplier using the Share button.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supplier Communication</CardTitle>
        <CardDescription>
          Track email correspondence with suppliers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {correspondence.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {item.type === 'outbound' ? (
                  <div className="bg-blue-100 p-1 rounded-full">
                    <ArrowUpRight className="h-4 w-4 text-blue-600" />
                  </div>
                ) : (
                  <div className="bg-green-100 p-1 rounded-full">
                    <ArrowDownLeft className="h-4 w-4 text-green-600" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{item.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.type === 'outbound' ? `To: ${item.recipient}` : `From: ${item.sender}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
              </div>
            </div>
            
            <p className="text-sm mt-2 whitespace-pre-wrap">{item.message}</p>
            
            {item.fileStats && (
              <div className="mt-2 text-xs text-muted-foreground bg-muted p-2 rounded">
                Analysis shared: {item.fileStats.totalItems} items ({item.fileStats.increasedItems} increases, {item.fileStats.decreasedItems} decreases)
              </div>
            )}
            
            {item.type === 'outbound' && (
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => handleRecordReply(item)}
                >
                  Record Supplier Reply
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
      
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Supplier's Reply</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSaveReply}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="reply-subject">Subject</Label>
                <Input 
                  id="reply-subject"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="reply-message">Reply Message</Label>
                <Textarea 
                  id="reply-message"
                  rows={6}
                  placeholder="Enter the supplier's reply..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSending}>
                <Send className="mr-2 h-4 w-4" />
                {isSending ? "Saving..." : "Save Reply"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
