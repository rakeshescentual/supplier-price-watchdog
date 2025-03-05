
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { GadgetConfig } from '@/types/price';

interface AdvancedFeaturesTabProps {
  config: GadgetConfig;
  handleFeatureFlagChange: (flag: string, value: boolean) => void;
}

export const AdvancedFeaturesTab = ({ config, handleFeatureFlagChange }: AdvancedFeaturesTabProps) => {
  return (
    <div className="space-y-4 mt-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Advanced Features</AlertTitle>
        <AlertDescription>
          Enable or disable specific Gadget.dev capabilities
        </AlertDescription>
      </Alert>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Shopify Plus Integration</Label>
            <p className="text-sm text-muted-foreground">
              Enable enhanced Shopify Plus features via Gadget
            </p>
          </div>
          <Switch
            checked={config.featureFlags?.enableShopifySync || false}
            onCheckedChange={(checked) => handleFeatureFlagChange('enableShopifySync', checked)}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">PDF Processing</Label>
            <p className="text-sm text-muted-foreground">
              Process supplier PDF price lists with Gadget
            </p>
          </div>
          <Switch
            checked={config.featureFlags?.enablePdfProcessing || false}
            onCheckedChange={(checked) => handleFeatureFlagChange('enablePdfProcessing', checked)}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Advanced Analytics</Label>
            <p className="text-sm text-muted-foreground">
              Enable AI-powered market analysis via Gadget
            </p>
          </div>
          <Switch
            checked={config.featureFlags?.enableAdvancedAnalytics || false}
            onCheckedChange={(checked) => handleFeatureFlagChange('enableAdvancedAnalytics', checked)}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Background Jobs</Label>
            <p className="text-sm text-muted-foreground">
              Process large datasets asynchronously
            </p>
          </div>
          <Switch
            checked={config.featureFlags?.enableBackgroundJobs || false}
            onCheckedChange={(checked) => handleFeatureFlagChange('enableBackgroundJobs', checked)}
          />
        </div>
      </div>
      
      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value="shopify-plus">
          <AccordionTrigger>Shopify Plus Features</AccordionTrigger>
          <AccordionContent className="space-y-3 px-2">
            <Alert variant="default" className="mb-2">
              <AlertDescription className="text-xs">
                These features require Shopify Plus subscription and appropriate Gadget app permissions
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center gap-2">
              <Badge variant="default">Scripts</Badge>
              <p className="text-sm">Manage custom pricing rules via Gadget</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="default">Flows</Badge>
              <p className="text-sm">Automate price change workflows</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="default">Multi-location</Badge>
              <p className="text-sm">Sync inventory across locations</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="default">B2B</Badge>
              <p className="text-sm">Manage wholesale price lists</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="klaviyo">
          <AccordionTrigger>Klaviyo Integration</AccordionTrigger>
          <AccordionContent className="space-y-3 px-2">
            <Alert variant="default" className="mb-2">
              <AlertDescription className="text-xs">
                Gadget.dev enhances Klaviyo integration for better marketing automation
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center gap-2">
              <Badge variant="default">Segments</Badge>
              <p className="text-sm">Advanced customer segmentation for price changes</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="default">Flows</Badge>
              <p className="text-sm">Automated email sequences for price updates</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="default">Events</Badge>
              <p className="text-sm">Track customer interactions with price notifications</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
