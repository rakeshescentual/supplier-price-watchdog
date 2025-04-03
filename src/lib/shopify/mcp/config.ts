
/**
 * MCP configuration module
 */
import { toast } from 'sonner';

interface McpConfig {
  endpoint: string;
  apiKey?: string;
  shopDomain?: string;
  development?: boolean;
}

/**
 * Default MCP configuration
 */
const DEFAULT_MCP_CONFIG: McpConfig = {
  endpoint: 'http://localhost:8000/graphql',
  development: true
};

/**
 * Current MCP configuration
 */
let mcpConfig: McpConfig = { ...DEFAULT_MCP_CONFIG };

/**
 * Configure the MCP client
 */
export const configureMcp = (config: Partial<McpConfig>): void => {
  mcpConfig = { ...mcpConfig, ...config };
  
  // Log configuration changes in development mode
  if (mcpConfig.development) {
    console.info('MCP configuration updated:', {
      ...mcpConfig,
      apiKey: mcpConfig.apiKey ? '***' : undefined
    });
  }
};

/**
 * Get the current MCP configuration
 */
export const getMcpConfig = (): McpConfig => {
  return { ...mcpConfig };
};

/**
 * Save MCP configuration to localStorage
 */
export const saveMcpConfigToStorage = (): void => {
  try {
    // Don't save the API key to localStorage unless specifically requested
    const configToSave = {
      ...mcpConfig,
      apiKey: undefined
    };
    
    localStorage.setItem('mcpConfig', JSON.stringify(configToSave));
  } catch (error) {
    console.error('Failed to save MCP config to localStorage:', error);
  }
};

/**
 * Load MCP configuration from localStorage
 */
export const loadMcpConfigFromStorage = (): boolean => {
  try {
    const savedConfig = localStorage.getItem('mcpConfig');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      configureMcp(parsedConfig);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to load MCP config from localStorage:', error);
    return false;
  }
};

/**
 * Reset MCP configuration to defaults
 */
export const resetMcpConfig = (): void => {
  mcpConfig = { ...DEFAULT_MCP_CONFIG };
  localStorage.removeItem('mcpConfig');
  toast.success('MCP configuration reset to defaults');
};
