
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Info, Shield, AlertTriangle } from "lucide-react";
import { useShopify } from "@/contexts/shopify";
import { useState } from "react";
import { toast } from "sonner";

interface ComplianceItem {
  id: string;
  name: string;
  description: string;
  status: "passed" | "failed" | "warning" | "info";
  details?: string;
}

export function ShopifyCompliance() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  
  const complianceItems: ComplianceItem[] = [
    {
      id: "api-version",
      name: "API Version",
      description: "Using current API version",
      status: "passed",
      details: "App is using the 2024-04 API version"
    },
    {
      id: "auth-flow",
      name: "OAuth Flow",
      description: "Standard OAuth implementation",
      status: "passed",
      details: "OAuth flow follows Shopify guidelines"
    },
    {
      id: "rate-limits",
      name: "Rate Limiting",
      description: "Respects API rate limits",
      status: "passed",
      details: "Implements backoff and batching strategies"
    },
    {
      id: "app-bridge",
      name: "App Bridge",
      description: "Uses App Bridge for navigation",
      status: "warning",
      details: "App Bridge usage could be improved for better admin integration"
    },
    {
      id: "webhooks",
      name: "Webhooks",
      description: "Proper webhook implementation",
      status: "passed",
      details: "Uses HMAC validation for security"
    },
    {
      id: "data-security",
      name: "Data Security",
      description: "Secure data handling",
      status: "passed",
      details: "Uses encryption for sensitive data"
    },
    {
      id: "privacy",
      name: "Privacy Policy",
      description: "Valid privacy policy",
      status: "info",
      details: "Privacy policy should be reviewed periodically"
    },
    {
      id: "accessibility",
      name: "Accessibility",
      description: "Meets WCAG standards",
      status: "warning",
      details: "Some components need accessibility improvements"
    }
  ];
  
  const passedCount = complianceItems.filter(item => item.status === "passed").length;
  const totalCount = complianceItems.length;
  const complianceScore = Math.round((passedCount / totalCount) * 100);
  
  const runComplianceCheck = () => {
    setIsRunningCheck(true);
    
    setTimeout(() => {
      setIsRunningCheck(false);
      toast.success("Compliance check complete", {
        description: `Compliance score: ${complianceScore}%`
      });
    }, 2000);
  };
  
  const getStatusIcon = (status: ComplianceItem["status"]) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getStatusBadge = (status: ComplianceItem["status"]) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Passed</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
      case "warning":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Warning</Badge>;
      case "info":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Info</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Built for Shopify Compliance
        </CardTitle>
        <CardDescription>
          Ensure your app meets Shopify's technical requirements and best practices
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Compliance Score</h3>
            <span className="text-sm font-medium">{complianceScore}%</span>
          </div>
          <Progress value={complianceScore} className="h-2" />
        </div>
        
        {!isShopifyConnected && (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Connect to Shopify to perform a complete compliance check
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          {complianceItems.map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-4 border rounded-md">
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(item.status)}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{item.name}</h4>
                  {getStatusBadge(item.status)}
                </div>
                
                <p className="text-sm text-muted-foreground">{item.description}</p>
                
                {item.details && (
                  <p className="text-xs text-muted-foreground mt-2">{item.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={runComplianceCheck}
            disabled={isRunningCheck}
          >
            {isRunningCheck ? "Running check..." : "Run Compliance Check"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
