
import React from "react";
import { Download, Upload, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BulkOperationHistoryItem } from "@/lib/shopify/bulkOperations";
import { toast } from "sonner";

interface BulkOperationHistoryListProps {
  operationsHistory: BulkOperationHistoryItem[];
  isLoading: boolean;
  onRefresh: () => void;
  onExport: () => void;
  onClear: () => void;
}

export function BulkOperationHistoryList({
  operationsHistory,
  isLoading,
  onRefresh,
  onExport,
  onClear
}: BulkOperationHistoryListProps) {
  return (
    <div className="border rounded-md">
      <div className="p-4 flex justify-between items-center border-b">
        <h3 className="font-medium">Recent Bulk Operations</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {operationsHistory.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClear}
              className="text-red-500 hover:text-red-700"
            >
              Clear History
            </Button>
          )}
        </div>
      </div>
      
      {operationsHistory.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No operation history found
        </div>
      ) : (
        <div className="divide-y">
          {operationsHistory.map(operation => (
            <div key={operation.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">
                    {operation.type === "priceUpdate" ? "Price Update" : 
                     operation.type === "inventoryUpdate" ? "Inventory Update" : 
                     operation.type === "metafieldUpdate" ? "Metafield Update" : 
                     "Bulk Operation"}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    operation.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                    operation.status === "FAILED" ? "bg-red-100 text-red-800" : 
                    operation.status === "CANCELLED" ? "bg-orange-100 text-orange-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {operation.status}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {new Date(operation.createdAt).toLocaleDateString()} {new Date(operation.createdAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                </div>
              </div>
              
              <div className="text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-muted-foreground">Total Items</div>
                    <div className="font-medium">{operation.itemCount}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Completed</div>
                    <div className="font-medium text-green-600">
                      {operation.status === "COMPLETED" ? operation.itemCount : 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Failed</div>
                    <div className={`font-medium ${operation.status === "FAILED" ? "text-red-600" : ""}`}>
                      {operation.status === "FAILED" ? operation.itemCount : 0}
                    </div>
                  </div>
                </div>
                {operation.errorMessage && (
                  <div className="mt-2 p-2 text-xs bg-red-50 text-red-700 rounded">
                    {operation.errorMessage}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
