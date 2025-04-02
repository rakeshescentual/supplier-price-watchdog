import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InputWithCopy } from "@/components/ui/input-with-copy";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { GraphQLMigrationAlert } from "@/components/shopify/GraphQLMigrationAlert";
import { getShopifyApiVersion, setShopifyApiVersion } from "@/lib/shopify/client";
import { 
  isGraphQLOnlyVersion, 
  SUPPORTED_API_VERSIONS, 
  LATEST_API_VERSION,
  getDaysUntilGraphQLOnly,
  API_VERSION_DETAILS
} from "@/lib/shopify/api-version";
import { ArrowRight, CheckCircle, Code, Info, RefreshCw, GitBranch, AlertTriangle, Calendar } from "lucide-react";
import { useShopify } from "@/contexts/shopify";
import { toast } from "sonner";

export function ShopifyApiVersionManager() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const currentApiVersion = getShopifyApiVersion();
  const [activeTab, setActiveTab] = useState('overview');
  const [testQuery, setTestQuery] = useState(`query {
  shop {
    name
    email
    primaryDomain {
      url
      host
    }
  }
}`);
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [isRunningQuery, setIsRunningQuery] = useState(false);

  const isCurrentVersionGraphQLOnly = isGraphQLOnlyVersion(currentApiVersion);
  const daysUntilDeadline = getDaysUntilGraphQLOnly();
  const migrationProgress = isCurrentVersionGraphQLOnly ? 100 : Math.min(80, Math.max(10, 100 - (daysUntilDeadline / 365 * 100)));
  
  const handleRunQuery = async () => {
    if (!isShopifyConnected || !shopifyContext) {
      toast.error("Not connected to Shopify", {
        description: "Connect to Shopify before testing GraphQL queries"
      });
      return;
    }
    
    setIsRunningQuery(true);
    setQueryResult(null);
    
    try {
      // Run the GraphQL query against Shopify
      const result = await fetch('/api/shopify/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: testQuery,
          shop: shopifyContext.shop,
          apiVersion: currentApiVersion
        }),
      });
      
      const data = await result.json();
      setQueryResult(JSON.stringify(data, null, 2));
      
      if (data.errors) {
        toast.error("GraphQL Error", {
          description: data.errors[0]?.message || "Error running GraphQL query"
        });
      } else {
        toast.success("Query executed successfully", {
          description: "GraphQL query returned results"
        });
      }
    } catch (error) {
      console.error("Error running GraphQL query:", error);
      setQueryResult(JSON.stringify({
        error: "Failed to execute query",
        message: error instanceof Error ? error.message : "Unknown error occurred"
      }, null, 2));
      
      toast.error("Query Failed", {
        description: "Error running GraphQL query. See console for details."
      });
    } finally {
      setIsRunningQuery(false);
    }
  };
  
  const handleUpdateVersion = () => {
    const success = setShopifyApiVersion(LATEST_API_VERSION);
    if (success) {
      toast.success("API Version Updated", {
        description: `Updated to Shopify API version ${LATEST_API_VERSION}`
      });
    } else {
      toast.error("Update Failed", {
        description: "Failed to update API version"
      });
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Shopify API Version</CardTitle>
              <CardDescription>
                Manage your Shopify API version and GraphQL compatibility
              </CardDescription>
            </div>
          </div>
          <Badge 
            variant={isCurrentVersionGraphQLOnly ? "success" : "outline"}
            className={isCurrentVersionGraphQLOnly ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
          >
            {currentApiVersion}
            {isCurrentVersionGraphQLOnly && <CheckCircle className="ml-1 h-3 w-3" />}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <GraphQLMigrationAlert 
          currentApiVersion={currentApiVersion} 
          onUpdateVersion={handleUpdateVersion}
        />
        
        <div className="px-6 pb-4">
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-muted-foreground">GraphQL Migration Progress</span>
            <span className="font-medium">{isCurrentVersionGraphQLOnly ? "Complete" : `${Math.round(migrationProgress)}%`}</span>
          </div>
          <Progress value={migrationProgress} className="h-2" />
          <div className="mt-1 flex text-xs text-muted-foreground justify-between">
            <span>Today</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              April 1, 2025
            </span>
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="px-6">
          <TabsList className="mb-4 grid grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="testing">GraphQL Testing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Current Version</h3>
                <div className="flex items-center gap-2">
                  <Badge className="text-base py-1">{currentApiVersion}</Badge>
                  {isCurrentVersionGraphQLOnly ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Recommended Version</h3>
                <Badge variant="outline" className="text-base py-1">{LATEST_API_VERSION}</Badge>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Status</h3>
                <Badge 
                  variant={isCurrentVersionGraphQLOnly ? "success" : "warning"}
                  className="text-base py-1"
                >
                  {isCurrentVersionGraphQLOnly ? "GraphQL Ready" : "GraphQL Migration Required"}
                </Badge>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium mb-2">Supported Versions</h3>
              <div className="flex flex-wrap gap-2">
                {SUPPORTED_API_VERSIONS.map(version => (
                  <Badge 
                    key={version}
                    variant={version === currentApiVersion ? "default" : "outline"}
                    className={`text-sm ${version in API_VERSION_DETAILS && API_VERSION_DETAILS[version].isGraphQLOnly ? "border-green-200" : ""}`}
                  >
                    {version}
                    {isGraphQLOnlyVersion(version) && (
                      <CheckCircle className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Alert className="mt-4 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-700">GraphQL Migration Required by April 2025</AlertTitle>
              <AlertDescription className="text-blue-600">
                Shopify will no longer accept public app submissions using REST API after April 1, 2025.
                Update to API version {LATEST_API_VERSION} or later to ensure your app is compliant.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="testing" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Test GraphQL Query</h3>
              <div className="relative">
                <textarea
                  className="font-mono text-sm w-full h-48 p-3 border rounded-md bg-slate-50"
                  value={testQuery}
                  onChange={(e) => setTestQuery(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleRunQuery} 
                  disabled={isRunningQuery || !isShopifyConnected}
                  className="gap-1"
                >
                  {isRunningQuery ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Code className="h-4 w-4" />
                  )}
                  Run Query
                </Button>
              </div>
            </div>
            
            {queryResult && (
              <div className="space-y-2 mt-4">
                <h3 className="text-sm font-medium">Result</h3>
                <pre className="bg-slate-50 p-3 rounded-md text-xs overflow-auto max-h-60">
                  {queryResult}
                </pre>
              </div>
            )}
            
            {!isShopifyConnected && (
              <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Shopify Connection Required</AlertTitle>
                <AlertDescription>
                  Connect to your Shopify store to test GraphQL queries
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t p-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Info className="h-4 w-4" />
          API version {currentApiVersion} is {isCurrentVersionGraphQLOnly ? "compatible" : "not compatible"} with Shopify's GraphQL-only requirement.
        </div>
      </CardFooter>
    </Card>
  );
}
