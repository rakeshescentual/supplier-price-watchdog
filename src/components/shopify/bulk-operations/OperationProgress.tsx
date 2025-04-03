
import React from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface OperationProgressProps {
  isProcessing: boolean;
  progress: number;
  itemCount: number;
  operationResult: {
    success?: boolean;
    message?: string;
    updatedCount?: number;
    failedCount?: number;
  } | null;
}

export function OperationProgress({
  isProcessing,
  progress,
  itemCount,
  operationResult
}: OperationProgressProps) {
  return (
    <div className="space-y-4">
      {isProcessing && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-xs text-center text-muted-foreground">
            Processing {itemCount} items ({Math.round(progress)}%)
          </p>
        </div>
      )}
      
      {operationResult && (
        <div className={`p-4 rounded-md ${operationResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-start">
            {operationResult.success ? (
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            )}
            
            <div>
              <h4 className={`font-medium ${operationResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {operationResult.success ? 'Operation Completed' : 'Operation Failed'}
              </h4>
              <p className={`text-sm ${operationResult.success ? 'text-green-700' : 'text-red-700'}`}>
                {operationResult.message}
              </p>
              
              {(operationResult.updatedCount !== undefined || operationResult.failedCount !== undefined) && (
                <div className="mt-2 text-sm">
                  {operationResult.updatedCount !== undefined && (
                    <p>Updated: {operationResult.updatedCount} items</p>
                  )}
                  {operationResult.failedCount !== undefined && operationResult.failedCount > 0 && (
                    <p>Failed: {operationResult.failedCount} items</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
