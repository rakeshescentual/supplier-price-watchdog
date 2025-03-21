
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { enhancedFlowService } from "@/services/enhanced-shopify";
import { PlusCircle, Play, Code } from "lucide-react";

export function ShopifyFlowManager() {
  const [isCreating, setIsCreating] = useState(false);
  const [flowType, setFlowType] = useState("price_change");
  const [notificationEmail, setNotificationEmail] = useState("");
  
  const handleCreateFlow = async () => {
    if (!notificationEmail) {
      toast.error("Email required", {
        description: "Please enter a notification email address"
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      const result = await enhancedFlowService.createPriceChangeFlow(notificationEmail);
      
      if (result.success) {
        toast.success("Flow created", {
          description: "Shopify Flow automation created successfully"
        });
      } else {
        toast.error("Failed to create Flow", {
          description: result.message || "An error occurred"
        });
      }
    } catch (error) {
      console.error("Error creating Flow:", error);
      toast.error("Flow creation error", {
        description: "An unexpected error occurred"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Create Shopify Flow</h3>
              <PlusCircle className="h-4 w-4 text-purple-500" />
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="flow-type">Flow Type</Label>
                <Select value={flowType} onValueChange={setFlowType}>
                  <SelectTrigger id="flow-type">
                    <SelectValue placeholder="Select flow type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price_change">Price Change Notification</SelectItem>
                    <SelectItem value="inventory_alert">Inventory Alert</SelectItem>
                    <SelectItem value="product_sync">Product Sync</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="notification-email">Notification Email</Label>
                <Input
                  id="notification-email"
                  type="email"
                  placeholder="Enter email for notifications"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleCreateFlow}
                disabled={isCreating || !notificationEmail}
              >
                {isCreating ? "Creating..." : "Create Flow"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Price Change Notifications</h3>
              <Play className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Automatically notify team members when prices change
            </p>
            <div className="text-xs font-medium mb-1">Flow Trigger:</div>
            <div className="text-xs text-muted-foreground">
              Product update → Price changed
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Sync with ERP</h3>
              <Code className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Send price updates to ERP system via API
            </p>
            <div className="text-xs font-medium mb-1">Flow Trigger:</div>
            <div className="text-xs text-muted-foreground">
              Bulk operation completed → Call webhook
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-md border p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium">Flow History</h3>
          <div className="text-xs text-muted-foreground">
            Last 7 days
          </div>
        </div>
        
        <div className="space-y-2">
          {[1, 2, 3].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
