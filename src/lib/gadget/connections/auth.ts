
/**
 * Authentication utilities for Gadget connections
 */
import { logInfo, logError } from '../logging';

export interface OAuthConfig {
  provider: string;
  clientId: string;
  scope: string;
  redirectUri: string;
}

export interface ApiKeyConfig {
  provider: string;
  apiKey: string;
  apiSecret?: string;
}

// Define the AuthMethod type that was missing
export interface AuthMethod {
  type: 'oauth' | 'api_key' | 'basic';
  label: string;
  description: string;
}

/**
 * Initiate OAuth flow
 */
export const initiateOAuthFlow = (config: OAuthConfig): string => {
  try {
    logInfo('Initiating OAuth flow', { provider: config.provider }, 'auth');
    
    // Generate mock authorization URL
    const authUrl = `https://mock-oauth.example.com/authorize?client_id=${config.clientId}&scope=${encodeURIComponent(config.scope)}&redirect_uri=${encodeURIComponent(config.redirectUri)}`;
    
    return authUrl;
  } catch (error) {
    logError('Failed to initiate OAuth flow', { error }, 'auth');
    throw error;
  }
};

/**
 * Handle OAuth callback
 */
export const handleOAuthCallback = async (
  code: string,
  state?: string
): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}> => {
  try {
    logInfo('Handling OAuth callback', { codeLength: code.length }, 'auth');
    
    // Mock successful authentication
    return {
      accessToken: `mock-access-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
      expiresAt: Date.now() + 3600 * 1000 // 1 hour
    };
  } catch (error) {
    logError('Failed to handle OAuth callback', { error }, 'auth');
    throw error;
  }
};

/**
 * Authenticate with API key
 */
export const authenticateWithApiKey = async (
  config: ApiKeyConfig
): Promise<{
  authenticated: boolean;
  message?: string;
}> => {
  try {
    logInfo('Authenticating with API key', { provider: config.provider }, 'auth');
    
    // Mock successful authentication
    return {
      authenticated: true
    };
  } catch (error) {
    logError('Failed to authenticate with API key', { error }, 'auth');
    return {
      authenticated: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Revoke authentication
 */
export const revokeAuthentication = async (
  connectionId: string
): Promise<boolean> => {
  try {
    logInfo('Revoking authentication', { connectionId }, 'auth');
    
    // Mock successful revocation
    return true;
  } catch (error) {
    logError('Failed to revoke authentication', { error }, 'auth');
    return false;
  }
};

/**
 * Get available authentication methods for a provider
 */
export const getAuthenticationMethods = async (
  provider: string
): Promise<AuthMethod[]> => {
  try {
    logInfo('Getting authentication methods', { provider }, 'auth');
    
    // Mock authentication methods
    if (provider === 'shopify') {
      return [
        {
          type: 'oauth',
          label: 'OAuth 2.0',
          description: 'Connect via Shopify OAuth'
        },
        {
          type: 'api_key',
          label: 'API Key',
          description: 'Use Shopify Admin API key'
        }
      ];
    }
    
    return [
      {
        type: 'api_key',
        label: 'API Key',
        description: 'Use API key authentication'
      }
    ];
  } catch (error) {
    logError('Failed to get authentication methods', { error }, 'auth');
    return [];
  }
};
