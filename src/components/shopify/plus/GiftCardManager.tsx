
import React, { useState } from 'react';
import { useShopify } from '@/contexts/shopify';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Gift, RefreshCw, CreditCard, Copy, AlertTriangle, Check } from 'lucide-react';
import { createShopifyGiftCard } from '@/lib/gadget/shopify-integration';
import { Badge } from '@/components/ui/badge';

export function GiftCardManager() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [giftCardData, setGiftCardData] = useState({
    initialValue: 50,
    currency: 'GBP',
    note: '',
    customerEmail: '',
    expiresOn: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createdGiftCard, setCreatedGiftCard] = useState<{
    code: string;
    initialValue: number;
    balance: number;
    currency: string;
    giftCardId: string;
  } | null>(null);
  
  const isPlusStore = shopifyContext?.shopPlan?.toLowerCase().includes('plus');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'initialValue') {
      // Ensure value is a positive number
      const numericValue = Math.max(0, parseFloat(value) || 0);
      setGiftCardData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setGiftCardData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleCreateGiftCard = async () => {
    if (!isShopifyConnected || !shopifyContext) {
      toast.error("Cannot create gift card", {
        description: "Shopify connection is required."
      });
      return;
    }
    
    if (giftCardData.initialValue <= 0) {
      toast.error("Invalid amount", {
        description: "Gift card amount must be greater than zero."
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      const result = await createShopifyGiftCard(shopifyContext.shop, {
        initialValue: giftCardData.initialValue,
        currency: giftCardData.currency,
        note: giftCardData.note || undefined,
        customerEmail: giftCardData.customerEmail || undefined,
        expiresOn: giftCardData.expiresOn || undefined
      });
      
      if (result.success && result.code) {
        setCreatedGiftCard({
          code: result.code,
          initialValue: result.initialValue,
          balance: result.balance,
          currency: result.currency,
          giftCardId: result.giftCardId
        });
        
        toast.success("Gift card created", {
          description: `Gift card with code ${result.code} created successfully.`
        });
      } else {
        toast.error("Failed to create gift card", {
          description: result.error || "An unknown error occurred."
        });
      }
    } catch (error) {
      console.error('Error creating gift card:', error);
      toast.error("Error creating gift card", {
        description: error instanceof Error ? error.message : "An unknown error occurred."
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleCopyCode = () => {
    if (!createdGiftCard) return;
    
    navigator.clipboard.writeText(createdGiftCard.code)
      .then(() => {
        toast.success("Gift card code copied to clipboard");
      })
      .catch((error) => {
        console.error('Error copying code:', error);
        toast.error("Failed to copy gift card code");
      });
  };
  
  const resetForm = () => {
    setGiftCardData({
      initialValue: 50,
      currency: 'GBP',
      note: '',
      customerEmail: '',
      expiresOn: ''
    });
    setCreatedGiftCard(null);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Gift Card Manager
        </CardTitle>
        <CardDescription>
          Create and manage Shopify gift cards
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isShopifyConnected ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Shopify Not Connected</AlertTitle>
            <AlertDescription>
              Connect to your Shopify store to manage gift cards.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            {createdGiftCard ? (
              <div className="space-y-4">
                <Alert variant="success">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Gift Card Created Successfully</AlertTitle>
                  <AlertDescription>
                    A new gift card has been created with the following details.
                  </AlertDescription>
                </Alert>
                
                <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted/30">
                  <div className="mb-4">
                    <CreditCard className="h-16 w-16 text-muted-foreground/60" />
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <Badge variant="outline" className="px-3 py-1 text-lg font-mono">
                      {createdGiftCard.code}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleCopyCode}
                      className="ml-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-2xl font-bold mb-1">
                    {createdGiftCard.initialValue} {createdGiftCard.currency}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Gift Card ID: {createdGiftCard.giftCardId}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button onClick={resetForm}>
                    Create Another Gift Card
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="initialValue">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {giftCardData.currency}
                      </span>
                      <Input 
                        id="initialValue" 
                        name="initialValue"
                        type="number" 
                        min="0"
                        step="0.01"
                        className="pl-12"
                        value={giftCardData.initialValue}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Input 
                      id="currency" 
                      name="currency"
                      value={giftCardData.currency}
                      onChange={handleInputChange}
                      placeholder="GBP"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="customerEmail">Customer Email (optional)</Label>
                  <Input 
                    id="customerEmail" 
                    name="customerEmail"
                    type="email"
                    placeholder="customer@example.com" 
                    value={giftCardData.customerEmail}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email of the recipient of this gift card
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="expiresOn">Expiry Date (optional)</Label>
                  <Input 
                    id="expiresOn" 
                    name="expiresOn"
                    type="date"
                    value={giftCardData.expiresOn}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="note">Internal Note (optional)</Label>
                  <Textarea 
                    id="note" 
                    name="note"
                    placeholder="Add a note visible to staff only" 
                    value={giftCardData.note}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      {!createdGiftCard && (
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleCreateGiftCard} 
            disabled={!isShopifyConnected || isCreating || giftCardData.initialValue <= 0}
          >
            {isCreating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Gift className="mr-2 h-4 w-4" />
                Create Gift Card
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default GiftCardManager;
