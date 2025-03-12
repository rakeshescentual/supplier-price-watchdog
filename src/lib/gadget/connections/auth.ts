
/**
 * Authentication helpers for Gadget.dev connections
 */
import { logInfo, logError } from '../logging';
import { initGadgetClient } from '../client';
import { toast } from 'sonner';

/**
 * OAuth configuration for different services
 */
export interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string[];
  state?: string;
  extraParams?: Record<string, string>;
}

/**
 * API Key configuration
 */
export interface ApiKeyConfig {
  key: string;
  secret?: string;
  additionalHeaders?: Record<string, string>;
}

/**
 * Initialize OAuth flow for a connection
 * @param service Service name (shopify, klaviyo, etc.)
 * @param config OAuth configuration
 * @returns URL to redirect user to for authorization
 */
export const initiateOAuthFlow = async (
  service: string,
  config: OAuthConfig
): Promise<string | null> => {
  const client = initGadgetClient();
  if (!client) {
    logError('Cannot initiate OAuth flow: Gadget client not initialized', {}, 'auth');
    return null;
  }
  
  try {
    logInfo(`Initiating OAuth flow for ${service}`, { config }, 'auth');
    
    // Generate state if not provided
    const state = config.state || generateRandomState();
    
    // In production with Gadget SDK:
    // const result = await client.mutate.initiateOAuth({
    //   service,
    //   clientId: config.clientId,
    //   redirectUri: config.redirectUri,
    //   scope: config.scope.join(' '),
    //   state,
    //   extraParams: config.extraParams
    // });
    // 
    // return result.authorizationUrl;
    
    // For development, return mock URL
    const scopeString = encodeURIComponent(config.scope.join(' '));
    const mockUrl = `https://example.com/oauth/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=${scopeString}&state=${state}`;
    
    // Store state in localStorage for validation
    localStorage.setItem(`oauth-state-${service}`, state);
    
    return mockUrl;
  } catch (error) {
    logError(`Error initiating OAuth flow for ${service}`, { error, config }, 'auth');
    return null;
  }
};

/**
 * Handle OAuth callback and exchange code for tokens
 * @param service Service name
 * @param code Authorization code
 * @param state State parameter for verification
 * @returns Success status and connection ID if successful
 */
export const handleOAuthCallback = async (
  service: string,
  code: string,
  state: string
): Promise<{ success: boolean; connectionId?: string; error?: string }> => {
  // Verify state parameter
  const savedState = localStorage.getItem(`oauth-state-${service}`);
  if (!savedState || savedState !== state) {
    const error = 'Invalid state parameter, possible CSRF attack';
    logError(error, { service, state }, 'auth');
    return { success: false, error };
  }
  
  // Clean up state from localStorage
  localStorage.removeItem(`oauth-state-${service}`);
  
  const client = initGadgetClient();
  if (!client) {
    const error = 'Gadget client not initialized';
    logError(error, { service }, 'auth');
    return { success: false, error };
  }
  
  try {
    logInfo(`Handling OAuth callback for ${service}`, { code }, 'auth');
    
    // In production with Gadget SDK:
    // const result = await client.mutate.completeOAuth({
    //   service,
    //   code,
    //   state
    // });
    // 
    // return { 
    //   success: true, 
    //   connectionId: result.connection.id 
    // };
    
    // For development, return mock success
    toast.success(`${service} connected successfully`, {
      description: "OAuth authentication completed"
    });
    
    return { 
      success: true, 
      connectionId: `${service}_${Date.now()}` 
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logError(`Error completing OAuth flow for ${service}`, { error, code }, 'auth');
    
    toast.error(`${service} connection failed`, {
      description: errorMessage
    });
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

/**
 * Authenticate with API key
 * @param service Service name
 * @param config API key configuration
 * @returns Success status and connection ID if successful
 */
export const authenticateWithApiKey = async (
  service: string,
  config: ApiKeyConfig
): Promise<{ success: boolean; connectionId?: string; error?: string }> => {
  const client = initGadgetClient();
  if (!client) {
    const error = 'Gadget client not initialized';
    logError(error, { service }, 'auth');
    return { success: false, error };
  }
  
  try {
    logInfo(`Authenticating ${service} with API key`, { service }, 'auth');
    
    // In production with Gadget SDK:
    // const result = await client.mutate.createApiKeyConnection({
    //   service,
    //   apiKey: config.key,
    //   apiSecret: config.secret,
    //   additionalHeaders: config.additionalHeaders
    // });
    // 
    // return { 
    //   success: true, 
    //   connectionId: result.connection.id 
    // };
    
    // For development, return mock success
    toast.success(`${service} connected successfully`, {
      description: "API key authentication completed"
    });
    
    return { 
      success: true, 
      connectionId: `${service}_${Date.now()}` 
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logError(`Error authenticating ${service} with API key`, { error, service }, 'auth');
    
    toast.error(`${service} connection failed`, {
      description: errorMessage
    });
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

/**
 * Generate random state for OAuth flow
 * @returns Random state string
 */
const generateRandomState = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Revoke authentication tokens for a connection
 * @param connectionId Connection ID
 * @returns Success status
 */
export const revokeAuthentication = async (
  connectionId: string
): Promise<boolean> => {
  const client = initGadgetClient();
  if (!client) {
    logError('Cannot revoke authentication: Gadget client not initialized', { connectionId }, 'auth');
    return false;
  }
  
  try {
    logInfo(`Revoking authentication for connection ${connectionId}`, {}, 'auth');
    
    // In production with Gadget SDK:
    // await client.mutate.revokeConnection({
    //   connectionId
    // });
    
    toast.success("Connection revoked successfully");
    return true;
  } catch (error) {
    logError('Error revoking authentication', { error, connectionId }, 'auth');
    
    toast.error("Failed to revoke connection", {
      description: error instanceof Error ? error.message : "Unknown error"
    });
    
    return false;
  }
};

/**
 * Get available authentication methods for a service
 * @param service Service name
 * @returns Available authentication methods
 */
export const getAuthenticationMethods = async (
  service: string
): Promise<Array<'oauth' | 'apiKey' | 'password'>> => {
  const client = initGadgetClient();
  if (!client) {
    return [];
  }
  
  try {
    // In production with Gadget SDK:
    // const result = await client.query.getAuthMethods({
    //   service
    // });
    // 
    // return result.methods;
    
    // For development, return mock data
    switch (service) {
      case 'shopify':
        return ['oauth'];
      case 'klaviyo':
        return ['apiKey'];
      default:
        return ['oauth', 'apiKey'];
    }
  } catch (error) {
    logError(`Error getting authentication methods for ${service}`, { error }, 'auth');
    return [];
  }
};
