import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { checkShopifyConnection } from '@/lib/shopifyApi';

// Mock ShopifyContext for connection functions
const mockShopifyContext = {
  shop: 'example-shop.myshopify.com',
  accessToken: 'example-token'
};

export function ShopifyConnectionStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'connected' | 'error'>('idle');
  const [message, setMessage] = useState('Checking connection...');
  
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        const result = await checkShopifyConnection(mockShopifyContext);
        
        if ('success' in result) {
          setIsConnected(result.success);
          setStatus(result.success ? 'connected' : 'error');
          setMessage(result.message || 'Connection checked');
        } else {
          setIsConnected(false);
          setStatus('error');
          setMessage('Invalid response from server');
        }
      } catch (error) {
        setIsConnected(false);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Unknown error');
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
          <p className="text-sm">{message}</p>
          {status === 'connected' && (
            <Badge variant="outline">Connected</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
