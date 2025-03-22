
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useOfflineDetection() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success('You are back online', {
        description: 'All features are now available'
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast.warning('You are offline', {
        description: 'Some features may be unavailable'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
}
