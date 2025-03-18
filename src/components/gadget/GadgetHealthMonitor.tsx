
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDetailedGadgetStatus, checkGadgetReadiness } from "@/utils/gadget/status";
import { Activity, CheckCircle, RefreshCw, XCircle, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { GadgetHealth } from "@/utils/gadget/types";

export function GadgetHealthMonitor() {
  const { toast } = useToast();
  const [status, setStatus] = useState<GadgetHealth>({
    healthy: false,
    components: {
      api: { status: 'down' },
      database: { status: 'down' },
      storage: { status: 'down' },
      processing: { status: 'down' }
    }
  });
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [readiness, setReadiness] = useState<{ ready: boolean; reason?: string }>({ ready: false });
  
  const checkHealth = async () => {
    setIsChecking(true);
    
    try {
      // First check if Gadget is configured properly
      const readinessStatus = checkGadgetReadiness();
      setReadiness(readinessStatus);
      
      if (readinessStatus.ready) {
        // Get detailed status
        const detailedStatus = await getDetailedGadgetStatus();
        setStatus(detailedStatus);
        
        if (detailedStatus.healthy) {
          toast({
            title: "Gadget services are operational",
            description: "All components are running normally.",
          });
        } else {
          toast({
            title: "Some Gadget services are degraded",
            description: "Check the component details for more information.",
            variant: "warning",
          });
        }
      }
      
      setLastChecked(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error checking Gadget health:", error);
      toast({
        title: "Error checking health status",
        description: "Could not connect to Gadget services.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  useEffect(() => {
    // Check health on component mount
    checkHealth();
    
    // Set up interval to check health every 5 minutes
    const interval = setInterval(checkHealth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getStatusIcon = (status: "healthy" | "degraded" | "down") => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "down":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };
  
  const getStatusBadge = (status: "healthy" | "degraded" | "down") => {
    switch (status) {
      case "healthy":
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Operational</Badge>;
      case "degraded":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">Degraded</Badge>;
      case "down":
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Down</Badge>;
    }
  };
  
  if (!readiness.ready) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Gadget Health Status
          </CardTitle>
          <CardDescription>
            Monitor your Gadget.dev service health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">Gadget Not Configured</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {readiness.reason === 'configuration_missing' && "Gadget configuration is missing."}
                {readiness.reason === 'api_key_missing' && "Gadget API key is missing."}
                {readiness.reason === 'app_id_missing' && "Gadget App ID is missing."}
                {!readiness.reason && "Gadget is not properly configured."}
              </p>
              <Button
                variant="outline"
                onClick={checkHealth}
                disabled={isChecking}
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Try Again"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Gadget Health Status
        </CardTitle>
        <CardDescription>
          Monitor your Gadget.dev service health
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {status.healthy ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            )}
            <span className="font-medium">
              {status.healthy ? "All systems operational" : "System issues detected"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={checkHealth}
            disabled={isChecking}
          >
            {isChecking ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(status.components).map(([name, details]) => (
              <div key={name} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center gap-2">
                  {getStatusIcon(details.status)}
                  <span className="capitalize">{name}</span>
                </div>
                {getStatusBadge(details.status)}
              </div>
            ))}
          </div>
          
          {status.latency && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Clock className="h-4 w-4" />
              <span>API Latency: {status.latency}ms</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        {lastChecked ? (
          <div className="flex items-center gap-1">
            <span>Last checked:</span>
            <time>{lastChecked}</time>
          </div>
        ) : (
          "Checking health status..."
        )}
      </CardFooter>
    </Card>
  );
}
