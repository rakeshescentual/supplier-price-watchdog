
/**
 * Gadget Live Query functionality
 * This implements Gadget's real-time data subscription capabilities with improved error handling
 */
import { logInfo, logError } from './logging';
import { initGadgetClient } from './client';
import { toast } from 'sonner';

/**
 * Options for creating a live query
 */
export interface LiveQueryOptions<T> {
  /**
   * The model to query
   */
  model: string;
  
  /**
   * Filter conditions
   */
  filter?: Record<string, any>;
  
  /**
   * Fields to select
   */
  select?: string[];
  
  /**
   * Sort order
   */
  sort?: Array<{field: string, direction: 'asc' | 'desc'}>;
  
  /**
   * Number of items to fetch
   */
  limit?: number;
  
  /**
   * Callback for data updates
   */
  onData: (data: T[]) => void;
  
  /**
   * Callback for errors
   */
  onError?: (error: any) => void;
  
  /**
   * Show toast notifications for updates
   */
  showNotifications?: boolean;
  
  /**
   * Custom notification messages
   */
  notifications?: {
    connected?: string;
    updated?: string;
    error?: string;
  };
}

/**
 * Live query subscription
 */
export interface LiveQuerySubscription {
  /**
   * Unique identifier for the subscription
   */
  id: string;
  
  /**
   * Unsubscribe from the live query
   */
  unsubscribe: () => void;
  
  /**
   * Refresh the data
   */
  refresh: () => Promise<void>;
  
  /**
   * Current status
   */
  status: 'connected' | 'disconnected' | 'error';
  
  /**
   * Last update timestamp
   */
  lastUpdated?: Date;
  
  /**
   * Pause subscription
   */
  pause: () => void;
  
  /**
   * Resume subscription
   */
  resume: () => void;
}

// Store active subscriptions
const activeSubscriptions = new Map<string, any>();

/**
 * Create a live query subscription to Gadget data
 * Uses Gadget's real-time subscription capabilities with enhanced error handling
 */
export function createLiveQuery<T>(
  options: LiveQueryOptions<T>
): LiveQuerySubscription {
  const client = initGadgetClient();
  if (!client) {
    throw new Error('Gadget client not initialized');
  }
  
  const subscriptionId = `${options.model}-${Date.now()}`;
  let isPaused = false;
  let lastUpdated: Date | undefined = undefined;
  
  try {
    logInfo(`Creating live query for ${options.model}`, {
      filter: options.filter,
      limit: options.limit
    }, 'liveQuery');
    
    // Show connection toast if enabled
    if (options.showNotifications && options.notifications?.connected) {
      toast.success('Connected', {
        description: options.notifications.connected
      });
    }
    
    // In production with actual Gadget SDK:
    //
    // const subscription = client.liveQuery({
    //   model: options.model,
    //   filter: options.filter,
    //   select: options.select,
    //   sort: options.sort,
    //   limit: options.limit
    // }).subscribe({
    //   next: (data) => {
    //     if (!isPaused) {
    //       lastUpdated = new Date();
    //       options.onData(data);
    //       
    //       // Show update toast if enabled
    //       if (options.showNotifications && options.notifications?.updated) {
    //         toast.info('Updated', {
    //           description: options.notifications.updated
    //         });
    //       }
    //     }
    //   },
    //   error: (error) => {
    //     logError(`Live query error for ${options.model}`, { error }, 'liveQuery');
    //     
    //     // Show error toast if enabled
    //     if (options.showNotifications && options.notifications?.error) {
    //       toast.error('Error', {
    //         description: options.notifications.error
    //       });
    //     }
    //     
    //     if (options.onError) {
    //       options.onError(error);
    //     }
    //   }
    // });
    //
    // activeSubscriptions.set(subscriptionId, subscription);
    //
    // return {
    //   id: subscriptionId,
    //   unsubscribe: () => {
    //     subscription.unsubscribe();
    //     activeSubscriptions.delete(subscriptionId);
    //   },
    //   refresh: async () => {
    //     await subscription.refresh();
    //   },
    //   status: 'connected',
    //   lastUpdated,
    //   pause: () => { isPaused = true; },
    //   resume: () => { isPaused = false; }
    // };
    
    // Mock for development
    // Simulate initial data load
    setTimeout(() => {
      if (!isPaused) {
        lastUpdated = new Date();
        options.onData([] as unknown as T[]);
      }
    }, 100);
    
    // Store mock subscription
    activeSubscriptions.set(subscriptionId, {
      status: 'connected',
      isPaused: false
    });
    
    // Return mock subscription interface
    return {
      id: subscriptionId,
      unsubscribe: () => {
        activeSubscriptions.delete(subscriptionId);
      },
      refresh: async () => {
        // Simulate refresh
        if (!isPaused) {
          lastUpdated = new Date();
          options.onData([] as unknown as T[]);
          
          // Show update toast if enabled
          if (options.showNotifications && options.notifications?.updated) {
            toast.info('Updated', {
              description: options.notifications.updated
            });
          }
        }
      },
      status: 'connected',
      lastUpdated,
      pause: () => { isPaused = true; },
      resume: () => { isPaused = false; }
    };
  } catch (error) {
    logError(`Error creating live query for ${options.model}`, { error }, 'liveQuery');
    
    // Show error toast if enabled
    if (options.showNotifications && options.notifications?.error) {
      toast.error('Error', {
        description: options.notifications.error
      });
    }
    
    if (options.onError) {
      options.onError(error);
    }
    
    // Return stub subscription in error state
    return {
      id: subscriptionId,
      unsubscribe: () => {},
      refresh: async () => {},
      status: 'error',
      pause: () => {},
      resume: () => {}
    };
  }
}

/**
 * Clean up all active subscriptions
 */
export function cleanupAllLiveQueries(): void {
  logInfo(`Cleaning up ${activeSubscriptions.size} live queries`, {}, 'liveQuery');
  
  for (const [id, subscription] of activeSubscriptions.entries()) {
    try {
      // In production with actual Gadget SDK:
      // subscription.unsubscribe();
      
      activeSubscriptions.delete(id);
    } catch (error) {
      logError(`Error cleaning up live query ${id}`, { error }, 'liveQuery');
    }
  }
}

/**
 * Get the count of active subscriptions
 */
export function getActiveSubscriptionCount(): number {
  return activeSubscriptions.size;
}
