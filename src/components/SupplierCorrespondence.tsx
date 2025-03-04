
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
import { 
  Mail, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar, 
  Send, 
  HelpCircle, 
  PlusCircle,
  Link2,
  Copy,
  CheckCircle2,
  FileText,
  Users
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  queryItems?: QueryItem[];
  tags?: string[];
}

interface QueryItem {
  id: number;
  sku: string;
  productName: string;
  queryType: 'price' | 'pack' | 'barcode' | 'tpr' | 'other';
  status: 'pending' | 'resolved';
  question: string;
  response?: string;
}

export function SupplierCorrespondence() {
  const [correspondence, setCorrespondence] = useState<Correspondence[]>([]);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [newEmailDialogOpen, setNewEmailDialogOpen] = useState(false);
  const [queryDialogOpen, setQueryDialogOpen] = useState(false);
  const [selectedCorrespondence, setSelectedCorrespondence] = useState<Correspondence | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newRecipient, setNewRecipient] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedQueryItems, setSelectedQueryItems] = useState<QueryItem[]>([]);
  const [newQuery, setNewQuery] = useState<QueryItem>({
    id: 0,
    sku: '',
    productName: '',
    queryType: 'price',
    status: 'pending',
    question: '',
  });

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

  const handleNewEmail = () => {
    setNewSubject("");
    setNewRecipient("");
    setNewMessage("");
    setNewEmailDialogOpen(true);
  };

  const handleAddQuery = (correspondenceId: number) => {
    const item = correspondence.find(c => c.id === correspondenceId);
    if (item) {
      setSelectedCorrespondence(item);
      setSelectedQueryItems(item.queryItems || []);
      setNewQuery({
        id: Date.now(),
        sku: '',
        productName: '',
        queryType: 'price',
        status: 'pending',
        question: '',
      });
      setQueryDialogOpen(true);
    }
  };

  const handleSaveQuery = () => {
    if (!selectedCorrespondence) return;
    
    const updatedQueryItems = [...(selectedQueryItems || []), newQuery];
    
    const updatedCorrespondence = correspondence.map(item => 
      item.id === selectedCorrespondence.id
        ? { ...item, queryItems: updatedQueryItems }
        : item
    );
    
    setCorrespondence(updatedCorrespondence);
    localStorage.setItem('supplierCorrespondence', JSON.stringify(updatedCorrespondence));
    
    toast.success("Query saved", {
      description: "The product query has been added to this correspondence",
    });
    
    setSelectedQueryItems(updatedQueryItems);
    setNewQuery({
      id: Date.now(),
      sku: '',
      productName: '',
      queryType: 'price',
      status: 'pending',
      question: '',
    });
  };

  const handleResolveQuery = (queryId: number) => {
    if (!selectedCorrespondence) return;
    
    const updatedQueryItems = selectedQueryItems.map(query => 
      query.id === queryId ? { ...query, status: 'resolved' } : query
    );
    
    const updatedCorrespondence = correspondence.map(item => 
      item.id === selectedCorrespondence.id
        ? { ...item, queryItems: updatedQueryItems }
        : item
    );
    
    setCorrespondence(updatedCorrespondence);
    localStorage.setItem('supplierCorrespondence', JSON.stringify(updatedCorrespondence));
    
    setSelectedQueryItems(updatedQueryItems);
    
    toast.success("Query resolved", {
      description: "The product query has been marked as resolved",
    });
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
        date: new Date().toISOString(),
        queryItems: []
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

  const handleSendNewEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSending(true);
    
    try {
      // In a real app, this would be a call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newEmail: Correspondence = {
        id: Date.now(),
        type: 'outbound',
        recipient: newRecipient,
        subject: newSubject,
        message: newMessage,
        date: new Date().toISOString(),
        queryItems: []
      };
      
      const updatedCorrespondence = [...correspondence, newEmail];
      setCorrespondence(updatedCorrespondence);
      localStorage.setItem('supplierCorrespondence', JSON.stringify(updatedCorrespondence));
      
      toast.success("Email sent", {
        description: "Your email to the supplier has been sent and logged",
      });
      
      setNewEmailDialogOpen(false);
      setNewSubject("");
      setNewRecipient("");
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  const getQueryTypeBadge = (type: string) => {
    switch (type) {
      case 'price':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Price</Badge>;
      case 'pack':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Pack Size</Badge>;
      case 'barcode':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Barcode</Badge>;
      case 'tpr':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800">TPR</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Other</Badge>;
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
            <p className="text-muted-foreground mb-6">
              No correspondence yet. Send a query to your supplier using the New Email button.
            </p>
            <Button onClick={handleNewEmail}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Email
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Supplier Communication</CardTitle>
          <CardDescription>
            Track email correspondence with suppliers
          </CardDescription>
        </div>
        <Button onClick={handleNewEmail}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Email
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
              
              <ScrollArea className="max-h-[200px] w-full rounded-md">
                <div className="p-1">
                  <p className="text-sm whitespace-pre-wrap">{item.message}</p>
                </div>
              </ScrollArea>
              
              {item.fileStats && (
                <div className="mt-2 text-xs text-muted-foreground bg-muted p-2 rounded">
                  <FileText className="h-3 w-3 inline-block mr-1" />
                  Analysis shared: {item.fileStats.totalItems} items ({item.fileStats.increasedItems} increases, {item.fileStats.decreasedItems} decreases)
                </div>
              )}

              {item.queryItems && item.queryItems.length > 0 && (
                <div className="mt-2 p-2 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="h-4 w-4 text-amber-500" />
                    <h4 className="text-sm font-medium">Product Queries</h4>
                  </div>
                  <div className="space-y-2">
                    {item.queryItems.map(query => (
                      <div 
                        key={query.id}
                        className={`text-xs p-2 rounded ${
                          query.status === 'resolved' 
                            ? 'bg-green-50 border border-green-100' 
                            : 'bg-amber-50 border border-amber-100'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-medium">{query.productName}</span> ({query.sku})
                            <div className="flex gap-1 mt-1">
                              {getQueryTypeBadge(query.queryType)}
                              <Badge variant={query.status === 'resolved' ? 'default' : 'outline'} className={
                                query.status === 'resolved' 
                                  ? 'bg-green-500' 
                                  : 'border-amber-500 text-amber-500'
                              }>
                                {query.status === 'resolved' ? 'Resolved' : 'Pending'}
                              </Badge>
                            </div>
                          </div>
                          {query.status === 'pending' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-xs bg-white"
                              onClick={() => {
                                setSelectedCorrespondence(item);
                                setSelectedQueryItems(item.queryItems || []);
                                handleResolveQuery(query.id);
                              }}
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Resolve
                            </Button>
                          )}
                        </div>
                        <p className="mt-1">{query.question}</p>
                        {query.response && (
                          <p className="mt-1 border-t border-green-200 pt-1">
                            <span className="font-medium">Response:</span> {query.response}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 mt-3">
                {item.type === 'outbound' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => handleRecordReply(item)}
                  >
                    <ArrowDownLeft className="mr-1 h-3 w-3 text-green-600" />
                    Record Reply
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => handleAddQuery(item.id)}
                >
                  <HelpCircle className="mr-1 h-3 w-3 text-amber-500" />
                  Add Query
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="max-w-lg">
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
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="reply-message">Reply Message</Label>
                <Textarea 
                  id="reply-message"
                  rows={6}
                  autoGrow
                  maxHeight={300}
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

      <Dialog open={newEmailDialogOpen} onOpenChange={setNewEmailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Email to Supplier</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSendNewEmail}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="new-recipient">Recipient</Label>
                <Input 
                  id="new-recipient"
                  type="email"
                  placeholder="supplier@example.com"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="new-subject">Subject</Label>
                <Input 
                  id="new-subject"
                  placeholder="Price list analysis..."
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="new-message">Message</Label>
                <Textarea 
                  id="new-message"
                  rows={6}
                  autoGrow
                  maxHeight={300}
                  placeholder="Enter your message to the supplier..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
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
                {isSending ? "Sending..." : "Send Email"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={queryDialogOpen} onOpenChange={setQueryDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Product Query</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="query-sku">SKU</Label>
                <Input 
                  id="query-sku"
                  placeholder="e.g. 10000684"
                  value={newQuery.sku}
                  onChange={(e) => setNewQuery({...newQuery, sku: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="query-product">Product Name</Label>
                <Input 
                  id="query-product"
                  placeholder="e.g. Hugo Boss Deodorant"
                  value={newQuery.productName}
                  onChange={(e) => setNewQuery({...newQuery, productName: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Query Type</Label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  type="button" 
                  variant={newQuery.queryType === 'price' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewQuery({...newQuery, queryType: 'price'})}
                >
                  Price
                </Button>
                <Button 
                  type="button" 
                  variant={newQuery.queryType === 'pack' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewQuery({...newQuery, queryType: 'pack'})}
                >
                  Pack Size
                </Button>
                <Button 
                  type="button" 
                  variant={newQuery.queryType === 'barcode' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewQuery({...newQuery, queryType: 'barcode'})}
                >
                  Barcode
                </Button>
                <Button 
                  type="button" 
                  variant={newQuery.queryType === 'tpr' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewQuery({...newQuery, queryType: 'tpr'})}
                >
                  TPR
                </Button>
                <Button 
                  type="button" 
                  variant={newQuery.queryType === 'other' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewQuery({...newQuery, queryType: 'other'})}
                >
                  Other
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="query-question">Question</Label>
              <Textarea 
                id="query-question"
                rows={3}
                autoGrow
                maxHeight={200}
                placeholder="Enter your question about this product..."
                value={newQuery.question}
                onChange={(e) => setNewQuery({...newQuery, question: e.target.value})}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveQuery}>
              <Plus className="mr-2 h-4 w-4" />
              Add Query
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
