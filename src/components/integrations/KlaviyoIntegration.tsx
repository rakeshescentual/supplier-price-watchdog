import { useState } from "react";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Mail, Users, ShoppingBag, AlertTriangle, Check, 
  RefreshCw, Info, Calendar, PackageMinus, 
  ArrowUp, FileCode, Copy, ExternalLink
} from "lucide-react";
import { KlaviyoEmailTemplate, KlaviyoSegmentSettings } from "@/types/price";

export const KlaviyoIntegration = () => {
  const { items, priceIncreaseEffectiveDate } = useFileAnalysis();
  const [isProcessing, setIsProcessing] = useState(false);
  const [klaviyoApiKey, setKlaviyoApiKey] = useState("");
  const [activeTab, setActiveTab] = useState("price-increase");
  
  // Segment settings
  const [segmentSettings, setSegmentSettings] = useState<{
    priceIncrease: KlaviyoSegmentSettings;
    discontinued: KlaviyoSegmentSettings;
  }>({
    priceIncrease: {
      name: "Price Increase Notification",
      enabled: true,
      minDaysBefore: 14,
      includeInventoryLevels: true,
      urgencyLevel: "medium"
    },
    discontinued: {
      name: "Discontinued Product Alert",
      enabled: true,
      minInventoryThreshold: 5,
      urgencyLevel: "medium",
      includeInventoryLevels: true
    }
  });
  
  // Template settings
  const [emailTemplates, setEmailTemplates] = useState<{
    priceIncrease: KlaviyoEmailTemplate;
    discontinued: KlaviyoEmailTemplate;
  }>({
    priceIncrease: {
      subject: "Price change notice: {{product.title}} price will increase on {{effective_date}}",
      preheader: "Buy now at the current price before it increases",
      templateStyle: "standard",
      urgencyLevel: "medium"
    },
    discontinued: {
      subject: "Last chance: {{product.title}} being discontinued",
      preheader: "Limited stock available, product being discontinued by supplier",
      templateStyle: "urgent",
      urgencyLevel: "high"
    }
  });
  
  const handleUpdateSegmentSetting = (segmentType: 'priceIncrease' | 'discontinued', field: string, value: any) => {
    setSegmentSettings({
      ...segmentSettings,
      [segmentType]: {
        ...segmentSettings[segmentType],
        [field]: value
      }
    });
  };
  
  const handleUpdateTemplate = (templateType: 'priceIncrease' | 'discontinued', field: string, value: any) => {
    setEmailTemplates({
      ...emailTemplates,
      [templateType]: {
        ...emailTemplates[templateType],
        [field]: value
      }
    });
  };
  
  // Count items for each type
  const increasedItems = items.filter(item => item.status === 'increased');
  const discontinuedItems = items.filter(item => item.status === 'discontinued');
  
  // Generate Klaviyo segments
  const generateKlaviyoSegments = async () => {
    if (!klaviyoApiKey) {
      toast.error("API key required", {
        description: "Please enter your Klaviyo API key first.",
      });
      return;
    }
    
    if (!priceIncreaseEffectiveDate && segmentSettings.priceIncrease.enabled) {
      toast.error("Effective date required", {
        description: "Please set a price increase effective date in the Notifications tab.",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate API interaction with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Format the effective date for display
      const formattedDate = priceIncreaseEffectiveDate 
        ? priceIncreaseEffectiveDate.toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : "the upcoming date";
      
      // Success message based on which segments were generated
      let successMessage = "";
      if (segmentSettings.priceIncrease.enabled && increasedItems.length > 0) {
        successMessage += `Price increase segment (${increasedItems.length} products) `;
      }
      
      if (segmentSettings.discontinued.enabled && discontinuedItems.length > 0) {
        successMessage += successMessage ? "and " : "";
        successMessage += `discontinued items segment (${discontinuedItems.length} products) `;
      }
      
      successMessage += "created in Klaviyo";
      
      // Show success toast
      toast.success("Segments generated", {
        description: successMessage,
      });
      
      // Track this in GA4
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'klaviyo_segment_creation', {
          event_category: 'integrations',
          increased_products: increasedItems.length,
          discontinued_products: discontinuedItems.length,
          effective_date: priceIncreaseEffectiveDate?.toISOString()
        });
      }
      
    } catch (error) {
      console.error("Error generating Klaviyo segments:", error);
      toast.error("Failed to generate segments", {
        description: "There was an error connecting to Klaviyo. Please check your API key and try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Get email preview content
  const getEmailPreview = (type: 'priceIncrease' | 'discontinued') => {
    if (items.length === 0) return "";
    
    const sampleItem = type === 'priceIncrease' 
      ? increasedItems[0] 
      : discontinuedItems[0];
    
    if (!sampleItem) return "No applicable products found for this template.";
    
    if (type === 'priceIncrease') {
      const formattedDate = priceIncreaseEffectiveDate 
        ? priceIncreaseEffectiveDate.toLocaleDateString() 
        : "the upcoming date";
      
      return `
Dear valued customer,

We wanted to let you know that the price of ${sampleItem.name} will be increasing from £${sampleItem.oldPrice.toFixed(2)} to £${sampleItem.newPrice.toFixed(2)} on ${formattedDate}.

This change is due to increased costs from our supplier. If you'd like to purchase this item at the current price, we recommend doing so before the price change takes effect.

Thank you for your continued support.

Best regards,
The Escentual Team
      `;
    } else {
      // Discontinued template
      return `
Dear valued customer,

We wanted to inform you that ${sampleItem.name} is being discontinued by the supplier. We currently have only ${sampleItem.inventory || "limited"} units in stock, and we may not be able to restock this item once our current inventory is depleted.

As you've purchased this product in the past, we wanted to give you advance notice so you can purchase it while it's still available.

Thank you for your continued support.

Best regards,
The Escentual Team
      `;
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Klaviyo Email Integration
        </CardTitle>
        <CardDescription>
          Create customer segments and automated emails for price changes
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Klaviyo Connection</h3>
            <Badge variant={klaviyoApiKey ? "success" : "outline"}>
              {klaviyoApiKey ? "Connected" : "Not Connected"}
            </Badge>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="klaviyo-api">Klaviyo Private API Key</Label>
            <div className="flex gap-2">
              <Input
                id="klaviyo-api"
                type="password"
                value={klaviyoApiKey}
                onChange={(e) => setKlaviyoApiKey(e.target.value)}
                placeholder="pk_xxxxxxxxxxxxxxxxxxxxxx"
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon"
                title="Connect to Klaviyo"
                onClick={() => {
                  if (klaviyoApiKey) {
                    toast.success("Connected to Klaviyo", {
                      description: "Your API key has been saved for this session.",
                    });
                  } else {
                    toast.error("API key required", {
                      description: "Please enter your Klaviyo Private API key.",
                    });
                  }
                }}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Find your Private API key in your Klaviyo account settings
            </p>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Customer Segments</h3>
          
          <div className="grid gap-4">
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <div className="flex-none">
                <Switch 
                  id="segment-price-increase"
                  checked={segmentSettings.priceIncrease.enabled}
                  onCheckedChange={(checked) => handleUpdateSegmentSetting('priceIncrease', 'enabled', checked)}
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center">
                  <Label htmlFor="segment-price-increase" className="font-medium cursor-pointer">Price Increase Alert Segment</Label>
                  <Badge className="ml-2" variant="outline">{increasedItems.length}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Customers who previously purchased products with upcoming price increases
                </p>
              </div>
              <div className="flex-none">
                <ArrowUp className="h-5 w-5 text-red-500" />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <div className="flex-none">
                <Switch 
                  id="segment-discontinued"
                  checked={segmentSettings.discontinued.enabled}
                  onCheckedChange={(checked) => handleUpdateSegmentSetting('discontinued', 'enabled', checked)}
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center">
                  <Label htmlFor="segment-discontinued" className="font-medium cursor-pointer">Discontinued Product Segment</Label>
                  <Badge className="ml-2" variant="outline">{discontinuedItems.length}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Customers who previously purchased products being discontinued
                </p>
              </div>
              <div className="flex-none">
                <PackageMinus className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </div>
          
          {((segmentSettings.priceIncrease.enabled && increasedItems.length === 0) || 
            (segmentSettings.discontinued.enabled && discontinuedItems.length === 0)) && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Missing segment data</AlertTitle>
              <AlertDescription>
                {segmentSettings.priceIncrease.enabled && increasedItems.length === 0 && 
                  "There are no products with price increases to create a segment."}
                {segmentSettings.discontinued.enabled && discontinuedItems.length === 0 && 
                  "There are no discontinued products to create a segment."}
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Email Templates</h3>
          
          <Tabs defaultValue="price-increase" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="price-increase" disabled={increasedItems.length === 0}>Price Increase</TabsTrigger>
              <TabsTrigger value="discontinued" disabled={discontinuedItems.length === 0}>Discontinued</TabsTrigger>
            </TabsList>
            
            <TabsContent value="price-increase" className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="price-subject">Email Subject</Label>
                <Input
                  id="price-subject"
                  value={emailTemplates.priceIncrease.subject}
                  onChange={(e) => handleUpdateTemplate('priceIncrease', 'subject', e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="price-preheader">Preheader Text</Label>
                <Input
                  id="price-preheader"
                  value={emailTemplates.priceIncrease.preheader}
                  onChange={(e) => handleUpdateTemplate('priceIncrease', 'preheader', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Preview text that appears in email clients
                </p>
              </div>
              
              <RadioGroup 
                value={emailTemplates.priceIncrease.templateStyle}
                onValueChange={(value) => handleUpdateTemplate('priceIncrease', 'templateStyle', value)}
                className="grid grid-cols-1 sm:grid-cols-3 gap-2"
              >
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="standard" id="template-standard" />
                  <Label htmlFor="template-standard" className="flex-1 cursor-pointer">
                    <div className="font-medium">Standard</div>
                    <p className="text-xs text-muted-foreground">
                      Informative, neutral tone
                    </p>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="promotional" id="template-promotional" />
                  <Label htmlFor="template-promotional" className="flex-1 cursor-pointer">
                    <div className="font-medium">Promotional</div>
                    <p className="text-xs text-muted-foreground">
                      "Buy now" focused message
                    </p>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="detailed" id="template-detailed" />
                  <Label htmlFor="template-detailed" className="flex-1 cursor-pointer">
                    <div className="font-medium">Detailed</div>
                    <p className="text-xs text-muted-foreground">
                      Complete price breakdown
                    </p>
                  </Label>
                </div>
              </RadioGroup>
              
              {increasedItems.length > 0 && priceIncreaseEffectiveDate && (
                <div className="p-4 border rounded-md bg-muted/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Email Preview</h4>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" title="Copy template">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="View HTML">
                        <FileCode className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <pre className="text-xs whitespace-pre-wrap p-3 bg-muted rounded-md">{getEmailPreview('priceIncrease')}</pre>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="discontinued" className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="discontinued-subject">Email Subject</Label>
                <Input
                  id="discontinued-subject"
                  value={emailTemplates.discontinued.subject}
                  onChange={(e) => handleUpdateTemplate('discontinued', 'subject', e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="discontinued-preheader">Preheader Text</Label>
                <Input
                  id="discontinued-preheader"
                  value={emailTemplates.discontinued.preheader}
                  onChange={(e) => handleUpdateTemplate('discontinued', 'preheader', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Preview text that appears in email clients
                </p>
              </div>
              
              <RadioGroup 
                value={segmentSettings.discontinued.urgencyLevel}
                onValueChange={(value) => handleUpdateSegmentSetting('discontinued', 'urgencyLevel', value)}
                className="grid grid-cols-1 sm:grid-cols-3 gap-2"
              >
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="low" id="urgency-low" />
                  <Label htmlFor="urgency-low" className="flex-1 cursor-pointer">
                    <div className="font-medium">Low Urgency</div>
                    <p className="text-xs text-muted-foreground">
                      Informational only
                    </p>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="medium" id="urgency-medium" />
                  <Label htmlFor="urgency-medium" className="flex-1 cursor-pointer">
                    <div className="font-medium">Medium Urgency</div>
                    <p className="text-xs text-muted-foreground">
                      Recommended action
                    </p>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="high" id="urgency-high" />
                  <Label htmlFor="urgency-high" className="flex-1 cursor-pointer">
                    <div className="font-medium">High Urgency</div>
                    <p className="text-xs text-muted-foreground">
                      Last chance messaging
                    </p>
                  </Label>
                </div>
              </RadioGroup>
              
              <div className="grid gap-2">
                <Label htmlFor="inventory-threshold">Inventory Threshold</Label>
                <Input
                  id="inventory-threshold"
                  type="number"
                  min="1"
                  value={segmentSettings.discontinued.minInventoryThreshold}
                  onChange={(e) => handleUpdateSegmentSetting('discontinued', 'minInventoryThreshold', parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Only notify customers when inventory drops below this threshold
                </p>
              </div>
              
              {discontinuedItems.length > 0 && (
                <div className="p-4 border rounded-md bg-muted/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Email Preview</h4>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" title="Copy template">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="View HTML">
                        <FileCode className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <pre className="text-xs whitespace-pre-wrap p-3 bg-muted rounded-md">{getEmailPreview('discontinued')}</pre>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Automation Schedule</h3>
            <Badge variant="outline" className="text-blue-500">Automatic</Badge>
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-sm">Price Increase Notification</p>
                  <p className="text-xs text-muted-foreground">
                    {segmentSettings.priceIncrease.minDaysBefore} days before price change
                  </p>
                </div>
              </div>
              <div>
                <Input
                  type="number"
                  min="1"
                  max="90"
                  className="w-16 text-right"
                  value={segmentSettings.priceIncrease.minDaysBefore}
                  onChange={(e) => handleUpdateSegmentSetting('priceIncrease', 'minDaysBefore', parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium text-sm">Discontinued Items</p>
                  <p className="text-xs text-muted-foreground">
                    Send when inventory falls below {segmentSettings.discontinued.minInventoryThreshold} units
                  </p>
                </div>
              </div>
              <div>
                <Switch 
                  checked={segmentSettings.discontinued.includeInventoryLevels} 
                  onCheckedChange={(checked) => handleUpdateSegmentSetting('discontinued', 'includeInventoryLevels', checked)}
                />
              </div>
            </div>
          </div>
          
          <Alert variant="success" className="bg-blue-50">
            <Info className="h-4 w-4" />
            <AlertTitle>Automatic Scheduling</AlertTitle>
            <AlertDescription>
              Klaviyo email campaigns will be automatically scheduled based on your settings when segments are generated.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4">
        <Button
          onClick={generateKlaviyoSegments}
          disabled={isProcessing || (!segmentSettings.priceIncrease.enabled && !segmentSettings.discontinued.enabled) || 
                     (items.length === 0 || (!increasedItems.length && !discontinuedItems.length))}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Creating Segments...
            </>
          ) : (
            <>
              <Users className="mr-2 h-4 w-4" />
              Generate Klaviyo Segments & Flows
            </>
          )}
        </Button>
        
        <div className="text-sm text-center text-muted-foreground">
          <a 
            href="https://help.klaviyo.com/hc/en-us/articles/115000058374-About-flows-and-Flow-triggers"
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center hover:text-primary"
          >
            <span>Learn more about Klaviyo flows</span>
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};
