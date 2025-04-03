
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

interface PriceUpdateOperationFormProps {
  operationType: string;
  setOperationType: (value: string) => void;
  dryRun: boolean;
  setDryRun: (value: boolean) => void;
  notifyCustomers: boolean;
  setNotifyCustomers: (value: boolean) => void;
  isPlusStore: boolean;
}

export function PriceUpdateOperationForm({
  operationType,
  setOperationType,
  dryRun,
  setDryRun,
  notifyCustomers,
  setNotifyCustomers,
  isPlusStore,
}: PriceUpdateOperationFormProps) {
  return (
    <div className="space-y-6">
      {!isPlusStore && (
        <div className="flex items-start p-4 border rounded-md bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-amber-800">Shopify Plus Recommended</h4>
            <p className="text-sm text-amber-700">
              Bulk operations work best with Shopify Plus. Some features may be limited with your current plan.
            </p>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="operation-type">Operation Type</Label>
          <Select value={operationType} onValueChange={setOperationType}>
            <SelectTrigger id="operation-type" className="w-full">
              <SelectValue placeholder="Select operation type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Available Operations</SelectLabel>
                <SelectItem value="price-update">Price Update</SelectItem>
                <SelectItem value="inventory-update" disabled>Inventory Update</SelectItem>
                <SelectItem value="metafield-update" disabled>Metafield Update</SelectItem>
                <SelectItem value="tag-update" disabled>Tag Update</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dry-run">Dry Run</Label>
            <p className="text-xs text-muted-foreground">
              Test the operation without making changes
            </p>
          </div>
          <Switch 
            id="dry-run" 
            checked={dryRun} 
            onCheckedChange={setDryRun} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notify-customers">Notify Customers</Label>
            <p className="text-xs text-muted-foreground">
              Send notifications for price changes
            </p>
          </div>
          <Switch 
            id="notify-customers" 
            checked={notifyCustomers} 
            onCheckedChange={setNotifyCustomers} 
            disabled={dryRun || !isPlusStore}
          />
        </div>
      </div>
    </div>
  );
}
