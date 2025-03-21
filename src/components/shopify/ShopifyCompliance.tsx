
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, ClipboardCheck, ExternalLink, RefreshCw } from "lucide-react";
import { useShopify } from "@/contexts/shopify";
import { checkShopifyCompliance, ComplianceIssue } from "@/lib/shopify/compliance";

export function ShopifyCompliance() {
  const { isShopifyConnected } = useShopify();
  const [isChecking, setIsChecking] = useState(false);
  const [checkResults, setCheckResults] = useState<{
    builtForShopifyCompliant: boolean;
    shopifyPlusCompliant: boolean;
    issues: ComplianceIssue[];
    lastChecked: Date | null;
  }>({
    builtForShopifyCompliant: false,
    shopifyPlusCompliant: false,
    issues: [],
    lastChecked: null
  });
  
  const performCheck = async () => {
    if (!isShopifyConnected) return;
    
    setIsChecking(true);
    try {
      const results = await checkShopifyCompliance();
      setCheckResults({
        builtForShopifyCompliant: results.builtForShopifyCompliant,
        shopifyPlusCompliant: results.shopifyPlusCompliant,
        issues: results.issues,
        lastChecked: results.lastChecked
      });
    } catch (error) {
      console.error('Error checking compliance:', error);
    } finally {
      setIsChecking(false);
    }
  };
  
  useEffect(() => {
    if (isShopifyConnected) {
      performCheck();
    }
  }, [isShopifyConnected]);
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500';
      case 'warning':
        return 'text-amber-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-muted-foreground';
    }
  };
  
  const getComplianceBadge = (isCompliant: boolean) => {
    return isCompliant
      ? <Badge variant="success" className="ml-2">Compliant</Badge>
      : <Badge variant="destructive" className="ml-2">Not Compliant</Badge>;
  };
  
  const issuesByType = {
    critical: checkResults.issues.filter(i => i.severity === 'critical'),
    warning: checkResults.issues.filter(i => i.severity === 'warning'),
    info: checkResults.issues.filter(i => i.severity === 'info')
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ClipboardCheck className="h-5 w-5 mr-2 text-green-500" />
            <div>
              <CardTitle>Shopify Compliance</CardTitle>
              <CardDescription>
                Ensure your app meets Shopify's standards
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={performCheck} 
            disabled={isChecking || !isShopifyConnected}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Check Now
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!isShopifyConnected ? (
          <div className="rounded-md bg-slate-50 p-4 text-sm text-center">
            Connect to Shopify to check app compliance
          </div>
        ) : (
          <>
            {isChecking && <Progress value={60} className="h-1 mb-4" />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium flex items-center">
                  Built for Shopify
                  {getComplianceBadge(checkResults.builtForShopifyCompliant)}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  App meets standards for Shopify App Store listing
                </p>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium flex items-center">
                  Shopify Plus Compatibility
                  {getComplianceBadge(checkResults.shopifyPlusCompliant)}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  App supports all Shopify Plus features
                </p>
              </div>
            </div>
            
            {checkResults.issues.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {issuesByType.critical.length > 0 && (
                  <AccordionItem value="critical">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                        Critical Issues ({issuesByType.critical.length})
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-3 text-sm">
                        {issuesByType.critical.map((issue, index) => (
                          <li key={index} className="rounded-md bg-red-50 p-3">
                            <div className="font-medium text-red-800">{issue.message}</div>
                            <div className="mt-1 text-red-700">{issue.recommendation}</div>
                            {issue.docsUrl && (
                              <a 
                                href={issue.docsUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex items-center text-red-800 text-xs mt-2 hover:underline"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Documentation
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}
                
                {issuesByType.warning.length > 0 && (
                  <AccordionItem value="warning">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                        Warnings ({issuesByType.warning.length})
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        {issuesByType.warning.map((issue, index) => (
                          <li key={index} className="rounded-md bg-amber-50 p-3">
                            <div className="font-medium text-amber-800">{issue.message}</div>
                            <div className="mt-1 text-amber-700">{issue.recommendation}</div>
                            {issue.docsUrl && (
                              <a 
                                href={issue.docsUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex items-center text-amber-800 text-xs mt-2 hover:underline"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Documentation
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}
                
                {issuesByType.info.length > 0 && (
                  <AccordionItem value="info">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                        Recommendations ({issuesByType.info.length})
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        {issuesByType.info.map((issue, index) => (
                          <li key={index} className="rounded-md bg-blue-50 p-3">
                            <div className="font-medium text-blue-800">{issue.message}</div>
                            <div className="mt-1 text-blue-700">{issue.recommendation}</div>
                            {issue.docsUrl && (
                              <a 
                                href={issue.docsUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex items-center text-blue-800 text-xs mt-2 hover:underline"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Documentation
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            ) : (
              <div className="rounded-md bg-green-50 p-4 text-center">
                <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-green-800">Fully Compliant</h3>
                <p className="text-xs text-green-700 mt-1">
                  Your app meets all Shopify's standards and best practices
                </p>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                {checkResults.lastChecked 
                  ? `Last checked: ${checkResults.lastChecked.toLocaleString()}` 
                  : 'Not checked yet'}
              </div>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://shopify.dev/docs/apps/launch/built-for-shopify"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs flex items-center"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Compliance Docs
                </a>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
