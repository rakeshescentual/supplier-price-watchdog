
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { GadgetHealth } from "@/utils/gadget/types";
import { getDetailedGadgetStatus, checkGadgetReadiness } from "@/utils/gadget/status";
import { GadgetNotConfiguredCard } from "./GadgetNotConfiguredCard";
import { GadgetComponentsGrid } from "./GadgetComponentsGrid";
import { GadgetStatusIcon } from "./GadgetStatusIndicators";

export function GadgetHealthMonitor() {
  const { toast } = useToast();
  const [status, setStatus] = useState<GadgetHealth>({
    status: 'down',
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
      const readinessStatus = checkGadgetReadiness();
      setReadiness(readinessStatus);
      
      if (readinessStatus.ready) {
        const detailedStatus = await getDetailedGadgetStatus();
        setStatus(detailedStatus);
        
        toast({
          title: detailedStatus.status === 'healthy' 
            ? "Gadget services are operational"
            : "Some Gadget services are degraded",
          description: detailedStatus.status === 'healthy'
            ? "All components are running normally."
            : "Check the component details for more information.",
        });
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
    checkHealth();
    const interval = setInterval(checkHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!readiness.ready) {
    return (
      <GadgetNotConfiguredCard
        reason={readiness.reason && {
          'configuration_missing': "Gadget configuration is missing.",
          'api_key_missing': "Gadget API key is missing.",
          'app_id_missing': "Gadget App ID is missing."
        }[readiness.reason]}
        onRetry={checkHealth}
        isChecking={isChecking}
      />
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
            <GadgetStatusIcon status={status.status} />
            <span className="font-medium">
              {status.status === 'healthy' ? "All systems operational" : "System issues detected"}
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
          <GadgetComponentsGrid components={status.components} />
          
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
