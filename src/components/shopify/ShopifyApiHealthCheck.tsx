
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Activity, AlertTriangle, ChevronDown, ChevronUp, HelpCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useShopify } from '@/contexts/shopify';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function ShopifyApiHealthCheck() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [isChecking, setIsChecking] = useState(false);
  const [healthStats, setHealthStats] = useState({
    status: 'unknown',
    adminLatency: 0,
    storefrontLatency: 0,
    graphqlSuccess: false,
    restSuccess: false,
    rateLimitRemaining: 0,
    lastChecked: null as Date | null,
    apiVersion: '',
    scopes: [] as string[]
  });
  const [isOpen, setIsOpen] = useState(false);

  // Helper function to get health status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'unhealthy': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // Helper function to get badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'degraded': return 'warning';
      case 'unhealthy': return 'destructive';
      default: return 'secondary';
    }
  };

  // Helper function to get latency status
  const getLatencyStatus = (ms: number) => {
    if (ms < 300) return 'Excellent';
    if (ms < 800) return 'Good';
    if (ms < 1500) return 'Fair';
    return 'Poor';
  };

  // Helper function to get rate limit status
  const getRateLimitStatus = (remaining: number) => {
    if (remaining > 30) return 'Healthy';
    if (remaining > 10) return 'Moderate';
    return 'Critical';
  };

  const checkHealth = async () => {
    if (!isShopifyConnected || !shopifyContext) {
      toast.error("Shopify not connected", {
        description: "Please connect to Shopify before checking health"
      });
      return;
    }

    setIsChecking(true);
    
    try {
      // Simulate a health check (in a real app, this would call the Shopify API)
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock data (in a real app, this would come from the API)
      const mockHealthData = {
        status: Math.random() > 0.9 ? 'degraded' : 'healthy',
        adminLatency: Math.floor(Math.random() * 600) + 200,
        storefrontLatency: Math.floor(Math.random() * 200) + 50,
        graphqlSuccess: true,
        restSuccess: true,
        rateLimitRemaining: Math.floor(Math.random() * 40) + 10,
        lastChecked: new Date(),
        apiVersion: '2024-04',
        scopes: ['read_products', 'write_products', 'read_inventory', 'write_inventory', 'read_orders']
      };
      
      setHealthStats(mockHealthData);
      
      toast.success("Health check complete", {
        description: `Shopify API is ${mockHealthData.status}`
      });
    } catch (error) {
      console.error("Error checking Shopify health:", error);
      
      toast.error("Health check failed", {
        description: "Could not complete Shopify API health check"
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Initial health check on component mount
  useEffect(() => {
    if (isShopifyConnected && shopifyContext) {
      checkHealth();
    }
  }, [isShopifyConnected, shopifyContext]);

  if (!isShopifyConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Shopify API Health
          </CardTitle>
          <CardDescription>
            Connect to Shopify to view API health metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <AlertTriangle className="h-12 w-12 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Shopify API Health
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Monitors the health and performance of your Shopify API connection, including 
                      response times and rate limits.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>
              Monitor your Shopify API performance and limits
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkHealth}
            disabled={isChecking}
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Checking...' : 'Check Now'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              {isChecking ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <Badge 
                  variant={getStatusBadge(healthStats.status) as any}
                  className="capitalize"
                >
                  {healthStats.status}
                </Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {healthStats.lastChecked ? 
                `Last checked: ${healthStats.lastChecked.toLocaleTimeString()}` : 
                'Not checked yet'}
            </div>
          </div>

          {/* API Latency */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Admin API Latency</span>
              <span className={getLatencyStatus(healthStats.adminLatency) === 'Poor' ? 'text-red-500' : 'text-muted-foreground'}>
                {isChecking ? <Skeleton className="h-4 w-12" /> : `${healthStats.adminLatency}ms`}
              </span>
            </div>
            {isChecking ? (
              <Skeleton className="h-2 w-full" />
            ) : (
              <Progress 
                value={Math.min(100, (healthStats.adminLatency / 2000) * 100)} 
                className="h-2"
                // Use style for the indicator color instead of removed prop
                style={{
                  '--progress-foreground': healthStats.adminLatency > 1500 ? 'rgb(239 68 68)' : 
                                           healthStats.adminLatency > 800 ? 'rgb(234 179 8)' : 
                                           'rgb(34 197 94)'
                } as React.CSSProperties}
              />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Storefront API Latency</span>
              <span className={getLatencyStatus(healthStats.storefrontLatency) === 'Poor' ? 'text-red-500' : 'text-muted-foreground'}>
                {isChecking ? <Skeleton className="h-4 w-12" /> : `${healthStats.storefrontLatency}ms`}
              </span>
            </div>
            {isChecking ? (
              <Skeleton className="h-2 w-full" />
            ) : (
              <Progress 
                value={Math.min(100, (healthStats.storefrontLatency / 1000) * 100)} 
                className="h-2"
                style={{
                  '--progress-foreground': healthStats.storefrontLatency > 800 ? 'rgb(239 68 68)' : 
                                          healthStats.storefrontLatency > 300 ? 'rgb(234 179 8)' : 
                                          'rgb(34 197 94)'
                } as React.CSSProperties}
              />
            )}
          </div>

          {/* Rate Limits */}
          <div className="flex justify-between items-center text-sm">
            <span>API Rate Limit</span>
            <span className={getRateLimitStatus(healthStats.rateLimitRemaining) === 'Critical' ? 'text-red-500' : 'text-muted-foreground'}>
              {isChecking ? 
                <Skeleton className="h-4 w-24" /> : 
                `${healthStats.rateLimitRemaining}/40 remaining`}
            </span>
          </div>

          {/* API Version */}
          <div className="flex justify-between items-center text-sm pt-2">
            <span>API Version</span>
            <span className="text-muted-foreground">
              {isChecking ? 
                <Skeleton className="h-4 w-16" /> : 
                healthStats.apiVersion}
            </span>
          </div>

          {/* Detailed Info */}
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="pt-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full flex justify-between items-center text-sm">
                <span>Detailed Information</span>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 space-y-2">
              {/* Endpoints Status */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className={`h-2 w-2 rounded-full ${healthStats.graphqlSuccess ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>GraphQL Endpoint</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`h-2 w-2 rounded-full ${healthStats.restSuccess ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>REST Endpoint</span>
                </div>
              </div>
              
              {/* API Scopes */}
              <div className="text-sm">
                <span className="font-medium">API Scopes:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {healthStats.scopes.map(scope => (
                    <Badge key={scope} variant="outline" className="text-xs">{scope}</Badge>
                  ))}
                </div>
              </div>
              
              {/* Connected Account */}
              <div className="text-sm pt-1">
                <span className="font-medium">Connected Store:</span>
                <div className="text-muted-foreground mt-1">{shopifyContext?.shop || 'Unknown'}</div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}
