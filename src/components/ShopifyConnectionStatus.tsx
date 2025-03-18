
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { checkShopifyConnection } from '@/lib/shopifyApi';
import type { ShopifyContext, ShopifyConnectionResult } from '@/types/price';

// Mock ShopifyContext for connection functions
const mockShopifyContext: ShopifyContext = {
  shop: 'example-shop.myshopify.com',
  accessToken: 'example-token'
};

export function ShopifyConnectionStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'connected' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('Checking connection...');
  
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        const result = await checkShopifyConnection(mockShopifyContext);
        
        // Handle both boolean and object returns
        if (typeof result === 'boolean') {
          setIsConnected(result);
          setStatus(result ? 'connected' : 'error');
          setStatusMessage(result ? 'Connected' : 'Connection failed');
        } else {
          setIsConnected(result.success);
          setStatus(result.success ? 'connected' : 'error');
          setStatusMessage(result.message || 'Connection checked');
        }
      } catch (error) {
        setIsConnected(false);
        setStatus('error');
        setStatusMessage(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkConnection();
  }, []);
  
  let statusIcon;
  let statusColor = 'text-gray-500';
  
  if (isLoading) {
    statusIcon = <Loader2 className="h-4 w-4 animate-spin" />;
    statusColor = 'text-blue-500';
  } else if (isConnected) {
    statusIcon = <CheckCircle className="h-4 w-4" />;
    statusColor = 'text-green-500';
  } else {
    statusIcon = <AlertTriangle className="h-4 w-4" />;
    statusColor = 'text-red-500';
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shopify Connection</CardTitle>
        <CardDescription>Status of your Shopify integration</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div className={statusColor}>
            {statusIcon}
          </div>
          <p className="text-sm">{statusMessage}</p>
          {status === 'connected' && (
            <Badge variant="outline">Connected</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
