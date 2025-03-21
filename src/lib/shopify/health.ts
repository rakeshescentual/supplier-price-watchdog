
import { toast } from 'sonner';
import { gadgetAnalytics } from '../gadget/analytics';

export interface ShopifyHealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  message: string;
  timestamp: Date;
  services: {
    admin: boolean;
    storefront: boolean;
    checkout: boolean;
    inventory: boolean;
    partners: boolean;
  };
  latency: {
    admin: number | null;
    storefront: number | null;
  };
  issues: string[];
}

/**
 * Check the health status of the Shopify integration
 */
export const checkShopifyHealth = async (): Promise<ShopifyHealthStatus> => {
  // In a real implementation, this would make actual API calls
  // to test various Shopify endpoints and services
  
  // Simulated health check for demonstration
  try {
    console.log('Checking Shopify health status...');
    
    // Simulate API delays
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock health data (in a real implementation, these would be based on actual tests)
    const adminLatency = Math.random() * 300 + 100; // Between 100-400ms
    const storefrontLatency = Math.random() * 200 + 50; // Between 50-250ms
    
    // Occasionally simulate degraded performance
    const isHealthy = Math.random() > 0.1;
    const isDegraded = !isHealthy && Math.random() > 0.5;
    
    // Generate health status
    const status: ShopifyHealthStatus = {
      status: isHealthy ? 'healthy' : (isDegraded ? 'degraded' : 'unhealthy'),
      message: isHealthy 
        ? 'All Shopify services operating normally' 
        : (isDegraded ? 'Some Shopify services experiencing delays' : 'Shopify service disruptions detected'),
      timestamp: new Date(),
      services: {
        admin: isHealthy || isDegraded,
        storefront: isHealthy,
        checkout: isHealthy,
        inventory: isHealthy || isDegraded,
        partners: isHealthy
      },
      latency: {
        admin: adminLatency,
        storefront: storefrontLatency
      },
      issues: isHealthy ? [] : [
        isDegraded ? 'Higher than normal API latency' : 'API connectivity issues',
        ...(!isHealthy && !isDegraded ? ['Rate limit errors detected'] : []),
      ]
    };
    
    // Track health metrics
    gadgetAnalytics.trackBusinessMetric('shopify_health', 
      status.status === 'healthy' ? 1 : (status.status === 'degraded' ? 0.5 : 0),
      {
        status: status.status,
        adminLatency,
        storefrontLatency,
        issueCount: status.issues.length
      }
    );
    
    // Show toast for unhealthy status
    if (status.status === 'unhealthy') {
      toast.error('Shopify Service Issues', {
        description: status.message
      });
    } else if (status.status === 'degraded') {
      toast.warning('Shopify Service Degraded', {
        description: status.message
      });
    }
    
    return status;
  } catch (error) {
    console.error('Error checking Shopify health:', error);
    
    // Track error
    gadgetAnalytics.trackError(error instanceof Error ? error : String(error), {
      function: 'checkShopifyHealth'
    });
    
    // Return unhealthy status
    return {
      status: 'unhealthy',
      message: 'Error checking Shopify health',
      timestamp: new Date(),
      services: {
        admin: false,
        storefront: false,
        checkout: false,
        inventory: false,
        partners: false
      },
      latency: {
        admin: null,
        storefront: null
      },
      issues: ['Failed to check health status']
    };
  }
};

/**
 * Monitor Shopify health on a schedule
 */
export const startShopifyHealthMonitoring = (
  intervalMinutes = 15,
  onStatusChange?: (status: ShopifyHealthStatus) => void
): (() => void) => {
  let lastStatus: ShopifyHealthStatus['status'] | null = null;
  
  const checkHealth = async () => {
    const health = await checkShopifyHealth();
    
    // If the status changed, call the callback
    if (lastStatus !== null && lastStatus !== health.status) {
      if (onStatusChange) {
        onStatusChange(health);
      }
      
      // Notify of status changes
      if (health.status === 'healthy' && lastStatus !== 'healthy') {
        toast.success('Shopify Services Recovered', {
          description: 'All Shopify services are now operating normally'
        });
      }
    }
    
    lastStatus = health.status;
  };
  
  // Run an initial check
  checkHealth();
  
  // Schedule regular checks
  const intervalId = setInterval(checkHealth, intervalMinutes * 60 * 1000);
  
  // Return function to stop monitoring
  return () => clearInterval(intervalId);
};

/**
 * Display user-friendly health status message
 */
export const getHealthStatusMessage = (status: ShopifyHealthStatus): string => {
  switch (status.status) {
    case 'healthy':
      return 'All Shopify services are operating normally';
    case 'degraded':
      return `Shopify services are experiencing some delays (Admin API: ${status.latency.admin?.toFixed(0) || 'unknown'}ms)`;
    case 'unhealthy':
      return `Shopify service disruption detected: ${status.issues.join(', ')}`;
    default:
      return 'Unknown Shopify health status';
  }
};
