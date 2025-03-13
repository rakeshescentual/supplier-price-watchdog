
/**
 * Connection type definitions for Gadget.dev integration
 */

/**
 * Connection types supported by Gadget
 */
export type ConnectionType = 
  'shopify' | 
  'stripe' | 
  'klaviyo' | 
  'googleAnalytics' | 
  'googleCloud' |
  'aws' |
  'salesforce' |
  'mailchimp' |
  'facebook' |     
  'instagram' |    
  'twitter' |
  'slack' |
  'hubspot' |
  'zendesk' |
  'intercom';

/**
 * Connection authentication methods
 */
export type AuthMethod = 'oauth' | 'apiKey' | 'jwt' | 'basic';

/**
 * Connection configuration with enhanced options
 */
export interface ConnectionConfig {
  type: ConnectionType;
  name: string;
  credentials?: Record<string, any>;
  scopes?: string[];
  metadata?: Record<string, any>;
  authMethod?: AuthMethod;
  webhookUrl?: string;
  environment?: 'production' | 'development' | 'staging';
  expiresAt?: Date;
  refreshToken?: boolean;
}

/**
 * Standardized connection response
 */
export interface ConnectionResponse {
  success: boolean;
  connectionId?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}
