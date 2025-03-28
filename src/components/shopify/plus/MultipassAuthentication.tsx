
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Copy, KeyRound, RefreshCw, ShieldCheck } from "lucide-react";
import { useShopify } from "@/contexts/shopify";
import { toast } from "sonner";
import { gadgetAnalytics } from "@/lib/gadget/analytics";

// Create a feature-specific analytics tracker
const multipassTracker = {
  trackView: (subfeature?: string) => 
    gadgetAnalytics.trackFeatureUsage('multipass', 'viewed', { subfeature }),
  trackCreate: (metadata?: Record<string, any>) => 
    gadgetAnalytics.trackFeatureUsage('multipass', 'used', { action: 'create', ...metadata }),
  trackUpdate: (metadata?: Record<string, any>) => 
    gadgetAnalytics.trackFeatureUsage('multipass', 'used', { action: 'update', ...metadata }),
  trackDelete: (metadata?: Record<string, any>) => 
    gadgetAnalytics.trackFeatureUsage('multipass', 'used', { action: 'delete', ...metadata }),
  trackUse: (action: string, metadata?: Record<string, any>) => 
    gadgetAnalytics.trackFeatureUsage('multipass', 'used', { action, ...metadata })
};

export function MultipassAuthentication() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [customerEmail, setCustomerEmail] = useState("");
  const [token, setToken] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  
  const isPlusStore = shopifyContext?.shopPlan?.toLowerCase().includes('plus');
  
  const generateMultipassToken = async () => {
    if (!customerEmail) {
      toast.error("Customer email is required");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Track this action
      multipassTracker.trackUse('generate_token', { 
        email: customerEmail 
      });
      
      // In a real implementation, this would call Shopify's Multipass API
      // For demo purposes, we'll simulate the token generation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate a mock token
      const mockToken = `mp_${btoa(customerEmail)}_${Date.now().toString(36)}`;
      setToken(mockToken);
      
      toast.success("Multipass token generated", {
        description: "Token is valid for 60 minutes"
      });
    } catch (error) {
      console.error("Error generating Multipass token:", error);
      toast.error("Failed to generate token", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyTokenToClipboard = () => {
    if (!token) return;
    
    navigator.clipboard.writeText(token);
    
    // Track this action
    multipassTracker.trackUse('copy_token', { success: true });
    
    toast.success("Token copied to clipboard");
  };
  
  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
    
    if (!showInstructions) {
      multipassTracker.trackUse('view_instructions');
    }
  };
  
  if (!isShopifyConnected) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Connect to Shopify to use Multipass authentication
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!isPlusStore) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Multipass is only available for Shopify Plus stores
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          Multipass Authentication
        </CardTitle>
        <CardDescription>
          Generate tokens for seamless customer sign-in
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customer-email">Customer Email</Label>
          <Input
            id="customer-email"
            type="email"
            placeholder="customer@example.com"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Enter the email address of the customer you want to authenticate
          </p>
        </div>
        
        <Button 
          onClick={generateMultipassToken} 
          disabled={!customerEmail || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4 mr-2" />
              Generate Multipass Token
            </>
          )}
        </Button>
        
        {token && (
          <div className="pt-4 space-y-2">
            <Label htmlFor="token">Multipass Token</Label>
            <div className="flex space-x-2">
              <Input
                id="token"
                value={token}
                readOnly
                className="font-mono text-xs"
              />
              <Button 
                size="icon" 
                variant="outline" 
                onClick={copyTokenToClipboard}
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This token will expire after 60 minutes
            </p>
          </div>
        )}
        
        <Button
          variant="link"
          onClick={toggleInstructions}
          className="text-xs p-0 h-auto"
        >
          {showInstructions ? "Hide" : "Show"} implementation instructions
        </Button>
        
        {showInstructions && (
          <div className="text-sm space-y-2 p-3 bg-muted/50 rounded-md">
            <p className="font-medium">How to implement Multipass:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Generate a token for your customer</li>
              <li>Redirect the customer to:<br />
                <code className="text-xs bg-muted p-1 rounded">https://your-store.myshopify.com/account/login/multipass/{TOKEN}</code>
              </li>
              <li>Customer will be automatically logged in</li>
            </ol>
            <p className="text-xs pt-2">
              See the <a href="https://shopify.dev/docs/api/multipass" target="_blank" rel="noopener noreferrer" className="underline">Shopify Multipass documentation</a> for more details.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Multipass allows for secure customer authentication from external systems
      </CardFooter>
    </Card>
  );
}
