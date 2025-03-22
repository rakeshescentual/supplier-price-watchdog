
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useShopify } from '@/contexts/shopify';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ComplianceItem {
  id: string;
  name: string;
  description: string;
  required: boolean;
  status: 'completed' | 'in-progress' | 'not-started' | 'not-applicable';
  category: 'api' | 'security' | 'webhooks' | 'ui' | 'performance' | 'plus';
  docUrl?: string;
}

export function ShopifyComplianceChecklist() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [complianceItems, setComplianceItems] = React.useState<ComplianceItem[]>([]);
  
  const isShopifyPlus = shopifyContext?.shopPlan === 'plus';
  
  React.useEffect(() => {
    // This would typically load compliance data from an API
    // For now, we'll just use mock data
    const items: ComplianceItem[] = [
      {
        id: 'api-versioning',
        name: 'API Versioning',
        description: 'Uses current Shopify API version',
        required: true,
        status: 'completed',
        category: 'api',
        docUrl: 'https://shopify.dev/docs/api/usage/versioning'
      },
      {
        id: 'graphql-usage',
        name: 'GraphQL Best Practices',
        description: 'Uses GraphQL for supported endpoints',
        required: false,
        status: 'in-progress',
        category: 'api',
        docUrl: 'https://shopify.dev/docs/api/usage/best-practices'
      },
      {
        id: 'rate-limiting',
        name: 'Rate Limiting',
        description: 'Handles API rate limits appropriately',
        required: true,
        status: 'completed',
        category: 'api'
      },
      {
        id: 'webhook-security',
        name: 'Webhook Security',
        description: 'Validates webhook signatures',
        required: true,
        status: 'completed',
        category: 'webhooks',
        docUrl: 'https://shopify.dev/docs/apps/webhooks/configuration/https#step-5-verify-the-webhook'
      },
      {
        id: 'essential-webhooks',
        name: 'Essential Webhooks',
        description: 'Implements required webhooks',
        required: true,
        status: 'in-progress',
        category: 'webhooks'
      },
      {
        id: 'oauth-flow',
        name: 'OAuth Implementation',
        description: 'Uses standard OAuth flow',
        required: true,
        status: 'completed',
        category: 'security'
      },
      {
        id: 'data-protection',
        name: 'Data Protection',
        description: 'Securely stores customer data',
        required: true,
        status: 'completed',
        category: 'security'
      },
      {
        id: 'polaris-design',
        name: 'Polaris Design System',
        description: 'Follows Shopify Polaris guidelines',
        required: false,
        status: 'not-started',
        category: 'ui',
        docUrl: 'https://polaris.shopify.com/'
      },
      // Shopify Plus specific items
      {
        id: 'multi-location',
        name: 'Multi-Location Support',
        description: 'Supports multiple inventory locations',
        required: true,
        status: isShopifyPlus ? 'completed' : 'not-applicable',
        category: 'plus'
      },
      {
        id: 'b2b',
        name: 'B2B Functionality',
        description: 'Supports B2B customer pricing',
        required: false,
        status: isShopifyPlus ? 'in-progress' : 'not-applicable',
        category: 'plus'
      },
      {
        id: 'scripts',
        name: 'Shopify Scripts',
        description: 'Creates and manages Shopify Scripts',
        required: false,
        status: isShopifyPlus ? 'not-started' : 'not-applicable',
        category: 'plus'
      },
      {
        id: 'flow-integration',
        name: 'Flow Integration',
        description: 'Integrates with Shopify Flow',
        required: false,
        status: isShopifyPlus ? 'not-started' : 'not-applicable',
        category: 'plus'
      }
    ];
    
    setComplianceItems(items);
  }, [isShopifyPlus]);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'not-started':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      case 'not-applicable':
        return <Circle className="h-4 w-4 text-gray-300" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };
  
  const getCompliancePercentage = () => {
    if (complianceItems.length === 0) return 0;
    
    // Only include required items that are applicable
    const applicableRequiredItems = complianceItems.filter(
      item => item.required && item.status !== 'not-applicable'
    );
    
    if (applicableRequiredItems.length === 0) return 100;
    
    const completedRequiredItems = applicableRequiredItems.filter(
      item => item.status === 'completed'
    );
    
    return Math.round((completedRequiredItems.length / applicableRequiredItems.length) * 100);
  };
  
  const compliancePercentage = getCompliancePercentage();
  
  // Group items by category
  const itemsByCategory = complianceItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ComplianceItem[]>);
  
  const categoryLabels = {
    api: 'API Requirements',
    security: 'Security Requirements',
    webhooks: 'Webhook Requirements',
    ui: 'UI Requirements',
    performance: 'Performance Requirements',
    plus: 'Shopify Plus Requirements'
  };
  
  if (!isShopifyConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shopify Compliance</CardTitle>
          <CardDescription>
            Connect to Shopify to check compliance status
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shopify Compliance Checklist</CardTitle>
        <CardDescription>
          Track progress towards Shopify compliance requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between mb-1 items-center">
            <span className="text-sm font-medium">Required Compliance:</span>
            <span className="text-sm">{compliancePercentage}%</span>
          </div>
          <Progress value={compliancePercentage} className="h-2" />
          
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant={compliancePercentage === 100 ? "success" : "outline"}>
              {compliancePercentage === 100 ? "Fully Compliant" : "In Progress"}
            </Badge>
            
            {isShopifyPlus && (
              <Badge variant="secondary">Shopify Plus</Badge>
            )}
          </div>
        </div>
        
        <Separator />
        
        {Object.keys(itemsByCategory).map(category => {
          const items = itemsByCategory[category];
          
          // Skip categories with only not-applicable items
          if (items.every(item => item.status === 'not-applicable')) {
            return null;
          }
          
          return (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-semibold">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h3>
              
              <ul className="space-y-2">
                {items.map(item => {
                  if (item.status === 'not-applicable') {
                    return null;
                  }
                  
                  return (
                    <li key={item.id} className="flex items-start gap-2 text-sm">
                      <div className="mt-0.5">{getStatusIcon(item.status)}</div>
                      <div className="flex-1">
                        <div className="font-medium flex items-center gap-1">
                          {item.name}
                          {item.required && (
                            <span className="text-xs text-red-500">*</span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-xs">{item.description}</p>
                        {item.docUrl && (
                          <a 
                            href={item.docUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Documentation
                          </a>
                        )}
                      </div>
                      
                      {item.status === 'not-started' && (
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          Implement
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
        
        <Separator />
        
        <div className="text-xs text-muted-foreground">
          * Required for Shopify App Store approval
        </div>
      </CardContent>
    </Card>
  );
}
