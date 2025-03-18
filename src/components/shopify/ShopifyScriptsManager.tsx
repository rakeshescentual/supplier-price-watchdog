
import React, { useState } from 'react';
import { useShopify } from '@/contexts/shopify';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

// Sample script templates
const SCRIPT_TEMPLATES = {
  discount: `
# Discount script template
CAMPAIGNS = [
  {
    name: "Volume Discount",
    qualifying_items: Input.cart.line_items.select { |line_item| line_item.variant.product.tagged_with("volume-discount") },
    threshold: 3,
    percent_off: 15
  }
]

CAMPAIGNS.each do |campaign|
  qualifiers = campaign[:qualifying_items]
  next if qualifiers.blank? || qualifiers.sum(&:quantity) < campaign[:threshold]
  
  qualifiers.each do |line_item|
    line_discount = (line_item.line_price * (campaign[:percent_off] / 100.0))
    line_item.change_line_price(line_item.line_price - line_discount, message: campaign[:name])
  end
end

Output.cart = Input.cart
  `.trim(),
  
  shipping: `
# Shipping script template
# Free shipping for orders over $100
if Input.cart.subtotal_price > Money.new(cents: 10000)
  Input.shipping_rates.each do |shipping_rate|
    shipping_rate.change_price(Money.zero, message: "Free shipping on orders over $100")
  end
end

Output.shipping_rates = Input.shipping_rates
  `.trim(),
  
  payment: `
# Payment script template
# Display payment methods based on cart total
if Input.cart.subtotal_price < Money.new(cents: 5000)
  # Hide credit payment method for small orders
  Input.payment_gateways.each do |payment_gateway|
    if payment_gateway.name.include?("credit")
      payment_gateway.hide
    end
  end
end

Output.payment_gateways = Input.payment_gateways
  `.trim()
};

export function ShopifyScriptsManager() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [activeTab, setActiveTab] = useState('discount');
  const [isDeploying, setIsDeploying] = useState(false);
  
  const isPlusStore = shopifyContext?.shopPlan?.toLowerCase().includes('plus');

  const handleDeployScript = async () => {
    if (!isPlusStore) {
      toast.error("Shopify Plus required", {
        description: "Scripts are only available for Shopify Plus stores"
      });
      return;
    }
    
    setIsDeploying(true);
    
    // In a real app, this would call the API to deploy the script
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Script deployed", {
      description: `The ${activeTab} script has been deployed successfully.`
    });
    
    setIsDeploying(false);
  };
  
  if (!isPlusStore && isShopifyConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Shopify Scripts
          </CardTitle>
          <CardDescription>
            Create customized Ruby scripts for checkout customization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Shopify Plus Required</AlertTitle>
            <AlertDescription>
              Shopify Scripts are only available for Shopify Plus stores. Please upgrade your Shopify plan to access this feature.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Shopify Scripts
        </CardTitle>
        <CardDescription>
          Create customized Ruby scripts for checkout customization
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="ml-6">
          <TabsTrigger value="discount">Discount</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>
        
        <CardContent className="mt-4">
          {!isShopifyConnected ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Not Connected</AlertTitle>
              <AlertDescription>
                Connect to Shopify to manage scripts.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Script</h3>
                <Badge variant="outline">{isPlusStore ? "Shopify Plus" : "Not Available"}</Badge>
              </div>
              
              <div className="border rounded-md p-4 bg-muted/30 mb-4">
                <pre className="text-xs overflow-x-auto">
                  <code>{SCRIPT_TEMPLATES[activeTab as keyof typeof SCRIPT_TEMPLATES]}</code>
                </pre>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>These scripts run at checkout time to customize:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><span className="font-medium">Discount scripts</span>: Apply conditional discounts</li>
                  <li><span className="font-medium">Shipping scripts</span>: Customize shipping rates</li>
                  <li><span className="font-medium">Payment scripts</span>: Show/hide payment methods</li>
                </ul>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleDeployScript} 
            disabled={!isShopifyConnected || !isPlusStore || isDeploying}
          >
            {isDeploying ? "Deploying..." : "Deploy Script"}
          </Button>
        </CardFooter>
      </Tabs>
    </Card>
  );
}
