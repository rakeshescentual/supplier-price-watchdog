
import { toast } from 'sonner';

/**
 * Formats a date in a relative way (e.g., "5 minutes ago")
 */
export function formatRelativeTime(date: Date | null): string {
  if (!date) return 'Never';
  
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (seconds < 60) {
    return 'Just now';
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

/**
 * Handle connection error with appropriate toasts and logging
 */
export function handleConnectionError(
  error: unknown, 
  serviceName: string, 
  errorMessage: string = "Connection error"
): void {
  console.error(`${serviceName} connection error:`, error);
  
  let description: string;
  if (error instanceof Error) {
    description = error.message;
  } else if (typeof error === 'string') {
    description = error;
  } else {
    description = `Unexpected error connecting to ${serviceName}`;
  }
  
  toast.error(errorMessage, { description: description });
}

/**
 * Safely store connection context in localStorage with error handling
 */
export function saveConnectionContext<T>(
  key: string, 
  context: T, 
  onSuccess?: () => void,
  onError?: (error: unknown) => void
): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(context));
    onSuccess?.();
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    onError?.(error);
    return false;
  }
}

/**
 * Safely load connection context from localStorage with error handling
 */
export function loadConnectionContext<T>(
  key: string, 
  onError?: (error: unknown) => void
): T | null {
  try {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return null;
    return JSON.parse(storedValue) as T;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    onError?.(error);
    return null;
  }
}

/**
 * Create a debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Implements exponential backoff with jitter for more robust retries
 */
export function calculateBackoff(retryCount: number, baseDelay: number = 300): number {
  // Exponential backoff: baseDelay * 2^retryCount
  const exponentialDelay = baseDelay * Math.pow(2, retryCount);
  
  // Add jitter (random value between 0 and 0.3*delay) to prevent thundering herd problem
  const jitter = Math.random() * 0.3 * exponentialDelay;
  
  return Math.min(exponentialDelay + jitter, 30000); // Cap at 30 seconds
}
