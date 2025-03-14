
/**
 * Diagnostics utilities for Gadget integration
 */
import { logInfo, logError } from './logging';
import { 
  initGadgetClient, 
  isGadgetInitialized,
  checkGadgetHealth,
  isHealthy
} from './client';
import { testGadgetConnection } from './client/connection';
import { reportHealthCheck } from './telemetry';

/**
 * Run diagnostics on Gadget integration
 * @param full Whether to run a full diagnostics suite (more time-consuming)
 */
export const runGadgetDiagnostics = async (
  full: boolean = false
): Promise<{
  diagnosticTime: string;
  initialized: boolean;
  connected: boolean;
  health: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    details?: Record<string, any>;
  };
  issues: string[];
  recommendations: string[];
}> => {
  const diagnosticTime = new Date().toISOString();
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Check if client is initialized
  const initialized = isGadgetInitialized();
  if (!initialized) {
    issues.push('Gadget client is not initialized');
    recommendations.push('Initialize the Gadget client before using it');
  }
  
  // Connection test
  let connected = false;
  try {
    if (initialized) {
      connected = await testGadgetConnection();
      if (!connected) {
        issues.push('Failed to connect to Gadget API');
        recommendations.push('Check your API key and network connection');
      }
    }
  } catch (error) {
    logError('Diagnostics connection test failed', { error }, 'diagnostics');
    connected = false;
    issues.push('Connection test threw an exception');
    recommendations.push('Check for network issues or API key validity');
  }
  
  // Health check
  let health = {
    status: 'unhealthy' as 'healthy' | 'degraded' | 'unhealthy',
    details: {} as Record<string, any>
  };
  
  try {
    if (initialized && connected) {
      const healthResult = await checkGadgetHealth();
      health.status = healthResult.status;
      health.details = healthResult.details || {};
      
      // Report health check to telemetry
      await reportHealthCheck(healthResult.status, healthResult.details);
      
      if (!isHealthy(healthResult)) {
        issues.push(`Health check failed: ${healthResult.message || 'No details provided'}`);
        recommendations.push('Check Gadget service status and your API limits');
      }
    }
  } catch (error) {
    logError('Diagnostics health check failed', { error }, 'diagnostics');
    health.status = 'unhealthy';
    health.details = { error: error instanceof Error ? error.message : String(error) };
    issues.push('Health check threw an exception');
    recommendations.push('Verify your Gadget integration is properly configured');
  }
  
  // Additional diagnostics for full mode
  if (full && initialized && connected) {
    // In a real implementation, we would add more extensive tests here
    logInfo('Running full diagnostic suite', {}, 'diagnostics');
    
    // Example additional check
    if (health.status === 'healthy') {
      try {
        // Mock test for API rate limits
        const mockRateLimitCheck = true; // In production, this would be a real check
        
        if (!mockRateLimitCheck) {
          issues.push('You are approaching API rate limits');
          recommendations.push('Consider implementing rate limiting in your application');
        }
      } catch (error) {
        logError('Additional diagnostics failed', { error }, 'diagnostics');
      }
    }
  }
  
  return {
    diagnosticTime,
    initialized,
    connected,
    health,
    issues,
    recommendations
  };
};

/**
 * Get a human-readable summary of Gadget diagnostics results
 */
export const getGadgetDiagnosticsSummary = async (): Promise<string> => {
  const diagnostics = await runGadgetDiagnostics(false);
  
  const statusEmoji = isHealthy({ status: diagnostics.health.status }) ? '✅' : 
                      diagnostics.health.status === 'degraded' ? '⚠️' : '❌';
  
  let summary = [
    `Gadget Diagnostics Summary (${new Date().toLocaleString()})`,
    `Status: ${statusEmoji} ${diagnostics.health.status.toUpperCase()}`,
    `Initialized: ${diagnostics.initialized ? '✅' : '❌'}`,
    `Connected: ${diagnostics.connected ? '✅' : '❌'}`
  ];
  
  if (diagnostics.issues.length > 0) {
    summary.push('\nIssues:');
    diagnostics.issues.forEach(issue => {
      summary.push(`- ${issue}`);
    });
  }
  
  if (diagnostics.recommendations.length > 0) {
    summary.push('\nRecommendations:');
    diagnostics.recommendations.forEach(rec => {
      summary.push(`- ${rec}`);
    });
  }
  
  return summary.join('\n');
};

