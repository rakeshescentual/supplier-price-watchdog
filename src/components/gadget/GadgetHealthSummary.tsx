
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCw, 
  ExternalLink,
  Shield,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  checkGadgetConnectionHealth,
  getDetailedGadgetStatus
} from '@/utils/gadget/status';
import { useNavigate } from 'react-router-dom';

export const GadgetHealthSummary = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [healthScore, setHealthScore] = useState(0);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const navigate = useNavigate();
  
  // Fetch status on mount
  useEffect(() => {
    checkConnection();
  }, []);
  
  // Function to check connection
  const checkConnection = async () => {
    try {
      setIsLoading(true);
      setIsChecking(true);
      
      // Get basic connection health
      const connected = await checkGadgetConnectionHealth();
      setIsConnected(connected);
      
      // Get detailed status for health score
      if (connected) {
        const detailedStatus = await getDetailedGadgetStatus();
        
        // Calculate health score based on components
        const componentCount = Object.keys(detailedStatus.components).length;
        const healthyCount = Object.values(detailedStatus.components)
          .filter(status => status.status === 'healthy').length;
        
        const calculatedScore = Math.floor((healthyCount / componentCount) * 100);
        setHealthScore(calculatedScore);
      } else {
        setHealthScore(0);
      }
      
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error checking Gadget connection:', error);
      setIsConnected(false);
      setHealthScore(0);
      toast.error('Failed to check Gadget health', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
      setIsChecking(false);
    }
  };
  
  // Get health score color
  const getHealthScoreColor = () => {
    if (healthScore >= 90) return 'text-green-600';
    if (healthScore >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Get health score background
  const getHealthScoreBackground = () => {
    if (healthScore >= 90) return 'bg-green-100';
    if (healthScore >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };
  
  // Get progress color
  const getProgressColor = () => {
    if (healthScore >= 90) return 'bg-green-600';
    if (healthScore >= 70) return 'bg-yellow-600';
    return 'bg-red-600';
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            Gadget Integration Health
          </span>
          
          <Button 
            size="sm" 
            variant="ghost"
            onClick={checkConnection}
            disabled={isChecking}
            className="h-8 gap-1 text-xs"
          >
            {isChecking ? (
              <RotateCw className="h-3 w-3 animate-spin" />
            ) : (
              <RotateCw className="h-3 w-3" />
            )}
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[120px] animate-pulse">
            <Activity className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-sm text-muted-foreground">Checking integration health...</p>
          </div>
        ) : isConnected ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-1.5">
                  {healthScore >= 70 ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  )}
                  <span className="font-medium text-sm">
                    Gadget is {healthScore >= 90 ? 'fully operational' : 'partially operational'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Integration is active and ready to process data
                </p>
              </div>
              
              <div className={`text-2xl font-bold ${getHealthScoreColor()} px-3 py-1 rounded-md ${getHealthScoreBackground()}`}>
                {healthScore}%
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Health Score</span>
                <span className={healthScore >= 70 ? 'text-green-600' : 'text-yellow-600'}>
                  {healthScore >= 90 ? 'Excellent' : healthScore >= 70 ? 'Good' : 'Poor'}
                </span>
              </div>
              <Progress value={healthScore} className={getProgressColor()} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[120px]">
            <XCircle className="h-12 w-12 text-red-500 mb-3" />
            <p className="text-sm font-medium text-center mb-1">Integration Offline</p>
            <p className="text-xs text-center text-muted-foreground">
              The Gadget integration is currently not connected
            </p>
          </div>
        )}
      </CardContent>
      
      <Separator />
      
      <CardFooter className="pt-3 pb-2 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString()}` : 'Not checked yet'}
        </span>
        
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-xs"
          onClick={() => navigate('/gadget-settings')}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Configure
        </Button>
      </CardFooter>
    </Card>
  );
};
