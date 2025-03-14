
/**
 * Authentication utilities for Gadget connections
 */

// Auth method type
export type AuthMethod = 'oauth' | 'apiKey' | 'jwt' | 'basic';

// OAuth configuration
export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  state?: string;
}

// API key configuration
export interface ApiKeyConfig {
  apiKey: string;
  secretKey?: string;
}

/**
 * Initiate OAuth flow
 */
export const initiateOAuthFlow = async (
  provider: string,
  config: OAuthConfig
): Promise<string> => {
  // Mock implementation
  return `https://oauth.example.com/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}`;
};

/**
 * Handle OAuth callback
 */
export const handleOAuthCallback = async (
  provider: string,
  code: string,
  state?: string
): Promise<{ success: boolean; accessToken?: string; refreshToken?: string }> => {
  // Mock implementation
  return {
    success: true,
    accessToken: `access-${Date.now()}`,
    refreshToken: `refresh-${Date.now()}`
  };
};

/**
 * Authenticate with API key
 */
export const authenticateWithApiKey = async (
  provider: string,
  config: ApiKeyConfig
): Promise<{ success: boolean; message?: string }> => {
  // Mock implementation
  return {
    success: true,
    message: "API key authentication successful"
  };
};

/**
 * Revoke authentication
 */
export const revokeAuthentication = async (
  provider: string,
  token: string
): Promise<boolean> => {
  // Mock implementation
  return true;
};

/**
 * Get authentication methods
 */
export const getAuthenticationMethods = async (
  provider: string
): Promise<AuthMethod[]> => {
  // Mock implementation
  switch (provider) {
    case 'shopify':
      return ['oauth'];
    case 'klaviyo':
      return ['apiKey'];
    case 'google':
      return ['oauth'];
    default:
      return [];
  }
};

/**
 * Initiate Gadget OAuth flow for a third-party service
 * @param service Name of the service to authenticate with
 * @param redirectUri URI to redirect to after authentication
 * @returns Promise resolving to the OAuth URL
 */
export const initiateGadgetOAuth = async (
  service: string, 
  redirectUri: string
): Promise<string | null> => {
  // Mock implementation
  return `https://gadget.dev/oauth/${service}?redirect_uri=${encodeURIComponent(redirectUri)}`;
};

/**
 * Handle OAuth callback from Gadget
 * @param service Name of the service being authenticated
 * @param code OAuth code from callback
 * @param state OAuth state from callback
 * @returns Promise resolving to success status
 */
export const handleGadgetOAuthCallback = async (
  service: string,
  code: string,
  state: string
): Promise<boolean> => {
  // Mock implementation
  return true;
};

/**
 * Create authentication headers for Gadget API requests
 * @param apiKey Gadget API key
 * @returns Headers object with authentication
 */
export const createGadgetAuthHeaders = (apiKey: string): HeadersInit => {
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};
