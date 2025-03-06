
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useGadgetConnection } from '@/hooks/useGadgetConnection';

export const GadgetStatusIndicator = () => {
  const gadgetConnection = useGadgetConnection();
  const { isConfigured, isConnected, isInitialized, lastConnectionTest, config } = gadgetConnection;

  if (!isConfigured) {
    return null;
  }

  const getStatusIcon = () => {
    if (isConnected) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (!isInitialized) {
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    if (isConnected) {
      return "Connected";
    } else if (!isInitialized) {
      return "Not Initialized";
    } else {
      return "Connection Failed";
    }
  };

  const getStatusColor = () => {
    if (isConnected) {
      return "bg-green-50 text-green-700 border-green-200";
    } else if (!isInitialized) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    } else {
      return "bg-red-50 text-red-700 border-red-200";
    }
  };

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <h3 className="font-medium">Gadget.dev Connection</h3>
              <p className="text-sm text-muted-foreground">
                {config?.appId ? `App: ${config.appId}` : 'Not configured'}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={`${getStatusColor()} ml-auto`}>
            {getStatusText()}
          </Badge>
        </div>
        {lastConnectionTest && (
          <p className="text-xs text-muted-foreground mt-2">
            Last tested: {lastConnectionTest.toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default GadgetStatusIndicator;
