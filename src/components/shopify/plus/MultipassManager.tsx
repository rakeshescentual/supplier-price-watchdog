import React, { useState } from 'react';
import { useShopify } from '@/contexts/shopify';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from 'sonner';
import { Fingerprint, KeyRound, RefreshCw, CheckCircle, Copy, Link, AlertTriangle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { createShopifyMultipassToken } from '@/lib/gadget/shopify-integration';

export function MultipassManager() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [customerData, setCustomerData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    tag_string: '',
    return_to: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [multipassToken, setMultipassToken] = useState<{
    token: string;
    url: string;
    expiresIn: number;
  } | null>(null);
  
  const isPlusStore = shopifyContext?.shopPlan?.toLowerCase().includes('plus');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleGenerateToken = async () => {
    if (!isShopifyConnected || !shopifyContext || !isPlusStore) {
      toast.error("Cannot generate Multipass token", {
        description: "Shopify Plus is required for Multipass functionality."
      });
      return;
    }
    
    if (!customerData.email) {
      toast.error("Email required", {
        description: "Customer email is required to generate a Multipass token."
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const result = await createShopifyMultipassToken(shopifyContext.shop, customerData);
      
      if (result.success && result.token) {
        setMultipassToken({
          token: result.token,
          url: result.url || `https://${shopifyContext.shop}/account/login/multipass/${result.token}`,
          expiresIn: result.expiresIn || 3600
        });
        
        toast.success("Multipass token generated", {
          description: "Copy and use the token to create a seamless login experience."
        });
      } else {
        toast.error("Failed to generate token", {
          description: result.error || "An unknown error occurred."
        });
      }
    } catch (error) {
      console.error('Error generating Multipass token:', error);
      toast.error("Error generating token", {
        description: error instanceof Error ? error.message : "An unknown error occurred."
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopyToken = () => {
    if (!multipassToken) return;
    
    navigator.clipboard.writeText(multipassToken.token)
      .then(() => {
        toast.success("Token copied to clipboard");
      })
      .catch((error) => {
        console.error('Error copying token:', error);
        toast.error("Failed to copy token");
      });
  };
  
  const handleCopyUrl = () => {
    if (!multipassToken) return;
    
    navigator.clipboard.writeText(multipassToken.url)
      .then(() => {
        toast.success("URL copied to clipboard");
      })
      .catch((error) => {
        console.error('Error copying URL:', error);
        toast.error("Failed to copy URL");
      });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          Shopify Multipass
        </CardTitle>
        <CardDescription>
          Create seamless login experiences with Shopify Multipass tokens
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isShopifyConnected ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Shopify Not Connected</AlertTitle>
            <AlertDescription>
              Connect to your Shopify store to use Multipass functionality.
            </AlertDescription>
          </Alert>
        ) : !isPlusStore ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Shopify Plus Required</AlertTitle>
            <AlertDescription>
              Multipass is a Shopify Plus feature. Upgrade your store to enable this functionality.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email (required)</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="customer@example.com" 
                    value={customerData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="return_to">Return To URL (optional)</Label>
                  <Input 
                    id="return_to" 
                    name="return_to"
                    type="url" 
                    placeholder="https://your-store.myshopify.com/products/some-product" 
                    value={customerData.return_to}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name (optional)</Label>
                  <Input 
                    id="first_name" 
                    name="first_name"
                    placeholder="John" 
                    value={customerData.first_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name (optional)</Label>
                  <Input 
                    id="last_name" 
                    name="last_name"
                    placeholder="Doe" 
                    value={customerData.last_name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="tag_string">Customer Tags (optional)</Label>
                <Input 
                  id="tag_string" 
                  name="tag_string"
                  placeholder="vip, wholesale" 
                  value={customerData.tag_string}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Comma-separated tags to apply to this customer
                </p>
              </div>
            </div>
            
            {multipassToken && (
              <div className="mt-6 space-y-4">
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Multipass Token</Label>
                    <Button variant="ghost" size="icon" onClick={handleCopyToken}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="h-20 w-full rounded-md border p-2 font-mono text-xs">
                    {multipassToken.token}
                  </ScrollArea>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Login URL</Label>
                    <Button variant="ghost" size="icon" onClick={handleCopyUrl}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="h-12 w-full rounded-md border p-2 font-mono text-xs">
                    {multipassToken.url}
                  </ScrollArea>
                </div>
                
                <Alert variant="default" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Multipass requires Shopify Plus and a secure server-to-server implementation.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleGenerateToken} 
          disabled={!isShopifyConnected || !isPlusStore || isGenerating || !customerData.email}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Generate Token
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default MultipassManager;
