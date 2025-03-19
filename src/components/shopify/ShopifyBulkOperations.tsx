
import React, { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ShopifyBulkOperationsPanel } from "./ShopifyBulkOperationsPanel";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Download, 
  Clock, 
  AlertTriangle 
} from "lucide-react";
import { toast } from "sonner";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";

export function ShopifyBulkOperations() {
  const { items } = useFileAnalysis();
  const [activeTab, setActiveTab] = useState("price-updates");
  
  // Mock operations history
  const [operationsHistory] = useState([
    {
      id: "op-123456",
      type: "price-update",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: "completed",
      itemCount: 245,
      success: 243,
      failed: 2
    },
    {
      id: "op-123455",
      type: "inventory-update",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: "completed",
      itemCount: 120,
      success: 120,
      failed: 0
    },
    {
      id: "op-123450",
      type: "price-update",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: "failed",
      itemCount: 300,
      success: 150,
      failed: 150
    }
  ]);
  
  const handleExportHistory = () => {
    toast.success("History exported", {
      description: "Operations history has been downloaded"
    });
  };

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="price-updates">Price Updates</TabsTrigger>
          <TabsTrigger value="inventory-updates">Inventory Updates</TabsTrigger>
          <TabsTrigger value="history">Operation History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="price-updates" className="pt-6">
          <ShopifyBulkOperationsPanel items={items} />
        </TabsContent>
        
        <TabsContent value="inventory-updates" className="pt-6">
          <div className="flex items-center justify-center p-12 text-center">
            <div>
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Feature Coming Soon</h3>
              <p className="text-muted-foreground max-w-md">
                Bulk inventory updates will be available in an upcoming release.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="pt-6">
          <div className="border rounded-md">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="font-medium">Recent Bulk Operations</h3>
              <Button variant="outline" size="sm" onClick={handleExportHistory}>
                <Download className="h-4 w-4 mr-2" />
                Export History
              </Button>
            </div>
            
            <div className="divide-y">
              {operationsHistory.map(operation => (
                <div key={operation.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{operation.type === "price-update" ? "Price Update" : "Inventory Update"}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        operation.status === "completed" ? "bg-green-100 text-green-800" :
                        operation.status === "failed" ? "bg-red-100 text-red-800" : 
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {operation.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {operation.timestamp.toLocaleDateString()} {operation.timestamp.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-muted-foreground">Total Items</div>
                        <div className="font-medium">{operation.itemCount}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Successful</div>
                        <div className="font-medium text-green-600">{operation.success}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Failed</div>
                        <div className={`font-medium ${operation.failed > 0 ? "text-red-600" : ""}`}>
                          {operation.failed}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
