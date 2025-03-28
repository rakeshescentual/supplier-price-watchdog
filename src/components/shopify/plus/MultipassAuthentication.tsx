
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { KeyRound, Lock, AlertTriangle, RefreshCw, Copy, CheckCircle2 } from "lucide-react";
import { useShopify } from '@/contexts/shopify';
import { createShopifyFeatureTracker } from '@/lib/gadget/analytics/shopifyMetrics';
import { toast } from 'sonner';

// Create analytics tracker
const multipassTracker = createShopifyFeatureTracker('multipass');

export function MultipassAuthentication() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [activeTab, setActiveTab] = useState('overview');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [multipassToken, setMultipassToken] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Track tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    multipassTracker.trackView(value);
  };
  
  // Handle token generation
  const handleGenerateToken = async () => {
    if (!customerEmail) {
      toast.error('Customer email is required');
      return;
    }
    
    setIsGenerating(true);
    multipassTracker.trackUse('generate_token', { hasName: !!customerName });
    
    try {
      // In a real app, this would call an API to generate a token
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock token generation
      const mockToken = `${btoa(customerEmail)}--${Date.now()}--${Math.random().toString(36).substring(2, 15)}`;
      setMultipassToken(mockToken);
      
      toast.success('Multipass token generated');
      multipassTracker.trackSuccess('generate_token');
    } catch (error) {
      console.error('Error generating multipass token:', error);
      toast.error('Failed to generate token');
      
      if (error instanceof Error) {
        multipassTracker.trackError(error);
      } else {
        multipassTracker.trackError('Unknown error generating token');
      }
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle copying token to clipboard
  const handleCopyToken = () => {
    if (!multipassToken) return;
    
    navigator.clipboard.writeText(multipassToken);
    setIsCopied(true);
    toast.success('Token copied to clipboard');
    
    multipassTracker.trackUse('copy_token');
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  
  // Check if store is Shopify Plus
  const isShopifyPlus = shopifyContext?.shopPlan?.toLowerCase().includes('plus') || false;
  
  if (!isShopifyConnected) {
    return (
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Connect to Shopify</AlertTitle>
        <AlertDescription>
          Multipass authentication requires a connection to Shopify Plus
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!isShopifyPlus) {
    return (
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Shopify Plus Required</AlertTitle>
        <AlertDescription>
          Multipass authentication is only available on Shopify Plus plans
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-purple-500" />
            <div>
              <CardTitle>Multipass Authentication</CardTitle>
              <CardDescription>
                Securely authenticate customers with Shopify Multipass
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="px-2 py-1">
            Shopify Plus
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="generate">Generate Token</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Multipass is a secure authentication method that lets you log customers into your Shopify store
                from a third-party system like your custom website or app.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Single Sign-On</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to sign in with existing accounts from your main website
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Secure Tokens</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Uses AES encryption and HMAC authentication to ensure security
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertTitle>Secure Implementation</AlertTitle>
                <AlertDescription>
                  Multipass should always be implemented server-side to protect your secret key
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          
          <TabsContent value="generate">
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Generate a test Multipass token to authenticate a customer. In production, this should be done server-side.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Customer Email (required)</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="customer@example.com" 
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Customer Name (optional)</Label>
                  <Input 
                    id="name" 
                    placeholder="John Smith" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={handleGenerateToken} 
                  disabled={!customerEmail || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Token'
                  )}
                </Button>
              </div>
              
              {multipassToken && (
                <div className="mt-4 space-y-2">
                  <Label htmlFor="token">Generated Token</Label>
                  <div className="relative">
                    <Input 
                      id="token" 
                      value={multipassToken} 
                      readOnly
                      className="pr-10 font-mono text-xs"
                    />
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="absolute right-0 top-0" 
                      onClick={handleCopyToken}
                    >
                      {isCopied ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use this token in your test environment to authenticate the user
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="implementation">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Follow these steps to implement Multipass authentication in your application:
              </p>
              
              <div className="space-y-4">
                <div className="border rounded-md p-3">
                  <h3 className="font-medium mb-2">1. Get your Multipass Secret</h3>
                  <p className="text-sm text-muted-foreground">
                    Get your Multipass secret from Shopify Admin &gt; Settings &gt; Checkout &gt; Customer accounts
                  </p>
                </div>
                
                <div className="border rounded-md p-3">
                  <h3 className="font-medium mb-2">2. Create Customer Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Prepare a JSON object with customer details like email, first_name, last_name, etc.
                  </p>
                </div>
                
                <div className="border rounded-md p-3">
                  <h3 className="font-medium mb-2">3. Generate Token Server-Side</h3>
                  <p className="text-sm text-muted-foreground">
                    Use a server-side language (Node.js, PHP, Ruby, etc.) to encrypt the customer data
                  </p>
                </div>
                
                <div className="border rounded-md p-3">
                  <h3 className="font-medium mb-2">4. Redirect With Token</h3>
                  <p className="text-sm text-muted-foreground">
                    Redirect the customer to: https://your-store.myshopify.com/account/login/multipass/{multipassToken}
                  </p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-sm">
                <h3 className="font-medium mb-2">Documentation Resources</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <a 
                      href="https://shopify.dev/docs/api/multipass" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                      onClick={() => multipassTracker.trackUse('view_docs')}
                    >
                      Shopify Multipass Documentation
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://github.com/Shopify/multipass" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                      onClick={() => multipassTracker.trackUse('view_github')}
                    >
                      Shopify Multipass Reference Implementation
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground border-t pt-4">
        <div className="flex items-center">
          <Lock className="h-3 w-3 mr-1" />
          Multipass tokens are encrypted and should be generated server-side in production
        </div>
      </CardFooter>
    </Card>
  );
}
