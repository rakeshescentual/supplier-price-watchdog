
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getGadgetStatusSummary } from '@/utils/gadget/status';
import { Button } from '@/components/ui/button';

export const GadgetStatusBar = () => {
  const [status, setStatus] = useState<{
    status: 'ready' | 'partial' | 'degraded' | 'down';
    message: string;
    details?: Record<string, any>;
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Fetch status on mount and periodically
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setIsLoading(true);
        const result = await getGadgetStatusSummary();
        setStatus(result);
      } catch (error) {
        console.error('Error fetching Gadget status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Initial fetch
    fetchStatus();
    
    // Set up periodic refresh (every 5 minutes)
    const intervalId = setInterval(() => {
      fetchStatus();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Get status icon based on status
  const getStatusIcon = () => {
    if (isLoading) {
      return <div className="h-2 w-2 rounded-full bg-gray-300 animate-pulse"></div>;
    }
    
    switch (status?.status) {
      case 'ready':
        return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      case 'partial':
        return <AlertCircle className="h-3 w-3 text-yellow-500" />;
      case 'degraded':
        return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
      case 'down':
        return <AlertTriangle className="h-3 w-3 text-red-500" />;
      default:
        return <AlertCircle className="h-3 w-3 text-gray-500" />;
    }
  };
  
  // Get status color
  const getStatusColor = () => {
    switch (status?.status) {
      case 'ready':
        return 'bg-green-50 border-green-100 text-green-700';
      case 'partial':
      case 'degraded':
        return 'bg-yellow-50 border-yellow-100 text-yellow-700';
      case 'down':
        return 'bg-red-50 border-red-100 text-red-700';
      default:
        return 'bg-gray-50 border-gray-100 text-gray-700';
    }
  };
  
  if (!status && !isLoading) {
    return null;
  }
  
  return (
    <div className={`w-full border-b ${getStatusColor()}`}>
      <div className="container mx-auto px-4 py-1.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {getStatusIcon()}
          <span className="font-medium">Gadget:</span>
          <span>{isLoading ? 'Checking status...' : status?.message}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs font-normal underline-offset-2"
            onClick={() => navigate('/gadget-documentation')}
          >
            Documentation
            <ChevronRight className="h-3 w-3 ml-0.5" />
          </Button>
          
          <Button
            variant="link" 
            size="sm"
            className="h-auto p-0 text-xs font-normal underline-offset-2"
            onClick={() => window.open('https://docs.gadget.dev/status', '_blank')}
          >
            Status Page
            <ExternalLink className="h-3 w-3 ml-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
