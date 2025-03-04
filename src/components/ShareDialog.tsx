
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share, Copy, Download, MessageSquare } from "lucide-react";
import { toast } from "sonner";

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
        <div className="flex items-center space-x-2 mt-4">
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
        <div className="grid grid-cols-2 gap-2 mt-4">
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
        {fileStats && (
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
