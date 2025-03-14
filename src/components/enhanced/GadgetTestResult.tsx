
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertTriangle, RefreshCw } from 'lucide-react';

export interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
}

interface GadgetTestResultProps {
  result: TestResult;
}

export function GadgetTestResult({ result }: GadgetTestResultProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-md border">
      {result.status === 'success' && (
        <Check className="h-5 w-5 text-green-500 mt-0.5" />
      )}
      {result.status === 'warning' && (
        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
      )}
      {result.status === 'error' && (
        <X className="h-5 w-5 text-red-500 mt-0.5" />
      )}
      {result.status === 'pending' && (
        <RefreshCw className="h-5 w-5 text-blue-500 animate-spin mt-0.5" />
      )}
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{result.name}</h4>
          <Badge 
            variant={
              result.status === 'success' ? 'default' : 
              result.status === 'warning' ? 'outline' : 'destructive'
            }
          >
            {result.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
      </div>
    </div>
  );
}
