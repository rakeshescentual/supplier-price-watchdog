
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Info, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PriceUpdateOperationFormProps {
  operationType: "update" | "schedule" | "discount";
  setOperationType: (type: "update" | "schedule" | "discount") => void;
  dryRun: boolean;
  setDryRun: (enabled: boolean) => void;
  notifyCustomers: boolean;
  setNotifyCustomers: (enabled: boolean) => void;
  isPlusStore: boolean;
  canUseGadget?: boolean;
}

export function PriceUpdateOperationForm({
  operationType,
  setOperationType,
  dryRun,
  setDryRun,
  notifyCustomers,
  setNotifyCustomers,
  isPlusStore,
  canUseGadget = false
}: PriceUpdateOperationFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Operation Type</h3>
        <RadioGroup 
          value={operationType} 
          onValueChange={(value) => setOperationType(value as "update" | "schedule" | "discount")}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="update" id="update" />
            <Label htmlFor="update" className="flex items-center">
              Update Product Prices
              {canUseGadget && (
                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                  Gadget Enhanced
                </Badge>
              )}
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="schedule" id="schedule" disabled={!isPlusStore} />
            <Label 
              htmlFor="schedule" 
              className={`flex items-center ${!isPlusStore ? 'text-muted-foreground' : ''}`}
            >
              Schedule Price Changes
              <Badge variant="outline" className="ml-2">Shopify Plus</Badge>
              {isPlusStore && canUseGadget && (
                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                  Gadget Enhanced
                </Badge>
              )}
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="discount" id="discount" disabled={!isPlusStore} />
            <Label 
              htmlFor="discount" 
              className={`flex items-center ${!isPlusStore ? 'text-muted-foreground' : ''}`}
            >
              Create Discount Scripts
              <Badge variant="outline" className="ml-2">Shopify Plus</Badge>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium mb-3">Options</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dry-run" className="text-base flex items-center">
              Dry Run Mode
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[220px]">Preview the changes without actually modifying your Shopify store</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <p className="text-sm text-muted-foreground">No actual changes will be made</p>
          </div>
          <Switch 
            id="dry-run" 
            checked={dryRun} 
            onCheckedChange={setDryRun}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notify-customers" className="text-base flex items-center">
              Notify Customers
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[220px]">Send notifications about price changes to customers who have purchased these products</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <p className="text-sm text-muted-foreground">For significant price drops only</p>
          </div>
          <Switch 
            id="notify-customers" 
            checked={notifyCustomers} 
            onCheckedChange={setNotifyCustomers}
          />
        </div>
      </div>
      
      {canUseGadget && (
        <div className="bg-blue-50 p-3 rounded border border-blue-100 flex items-start gap-2">
          <Zap className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-800">Enhanced via Gadget.dev</h4>
            <p className="text-sm text-blue-700">
              Using Gadget.dev for enhanced batch processing and rate limit management
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
