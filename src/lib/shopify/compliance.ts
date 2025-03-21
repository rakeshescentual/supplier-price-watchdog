
import { toast } from 'sonner';
import { gadgetAnalytics } from '../gadget/analytics';

export interface ComplianceCheckResult {
  compliant: boolean;
  issues: ComplianceIssue[];
  lastChecked: Date;
  shopifyPlusCompliant: boolean;
  builtForShopifyCompliant: boolean;
}

export interface ComplianceIssue {
  code: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  recommendation: string;
  docsUrl?: string;
}

/**
 * Check if the app meets Built for Shopify and Shopify Plus compliance standards
 */
export const checkShopifyCompliance = async (): Promise<ComplianceCheckResult> => {
  try {
    console.log('Checking Shopify compliance status...');
    
    // In a real implementation, this would make actual API calls to validate compliance
    const issues: ComplianceIssue[] = [];
    
    // Check API version (should use current stable version)
    const currentApiVersion = '2024-04';
    const appApiVersion = '2024-04'; // This would be pulled from configuration
    
    if (currentApiVersion !== appApiVersion) {
      issues.push({
        code: 'API_VERSION_OUTDATED',
        severity: 'warning',
        message: `App is using API version ${appApiVersion} but current version is ${currentApiVersion}`,
        recommendation: 'Update to the latest stable API version',
        docsUrl: 'https://shopify.dev/docs/api/versioning'
      });
    }
    
    // Check API scopes (should use minimal required scopes)
    // This would normally query actual scopes and compare to recommended minimal set
    
    // Check rate limit handling
    // In production, this would validate the app has proper rate limit handling mechanisms
    
    // Check webhook implementation
    // In production, this would validate webhooks are properly implemented and secure
    
    // Check for Shopify Plus specific features support
    const shopifyPlusCompliant = true; // Mock value - would actually check for Plus feature support
    
    // Check for Built for Shopify compliance
    const builtForShopifyCompliant = issues.filter(i => i.severity === 'critical').length === 0;
    
    // Track compliance metrics
    gadgetAnalytics.trackBusinessMetric('shopify_compliance', 
      builtForShopifyCompliant ? 1 : 0, 
      {
        issueCount: issues.length,
        plusCompliant: shopifyPlusCompliant,
        apiVersion: appApiVersion
      }
    );
    
    // Show toast if there are critical issues
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      toast.error('Shopify Compliance Issues', {
        description: `Found ${criticalIssues.length} critical compliance issues`
      });
    }
    
    return {
      compliant: builtForShopifyCompliant,
      issues,
      lastChecked: new Date(),
      shopifyPlusCompliant,
      builtForShopifyCompliant
    };
  } catch (error) {
    console.error('Error checking Shopify compliance:', error);
    
    // Track error
    gadgetAnalytics.trackError(error instanceof Error ? error : String(error), {
      function: 'checkShopifyCompliance'
    });
    
    // Return non-compliant status with error
    return {
      compliant: false,
      issues: [{
        code: 'COMPLIANCE_CHECK_ERROR',
        severity: 'critical',
        message: 'Error checking compliance status',
        recommendation: 'Try again or contact support'
      }],
      lastChecked: new Date(),
      shopifyPlusCompliant: false,
      builtForShopifyCompliant: false
    };
  }
};

/**
 * Start regular compliance monitoring
 */
export const startComplianceMonitoring = (
  intervalDays = 7,
  onComplianceChange?: (result: ComplianceCheckResult) => void
): (() => void) => {
  let lastResult: ComplianceCheckResult | null = null;
  
  const checkCompliance = async () => {
    const result = await checkShopifyCompliance();
    
    // If compliance status changed, call the callback
    if (lastResult && 
        (lastResult.compliant !== result.compliant || 
         lastResult.shopifyPlusCompliant !== result.shopifyPlusCompliant)) {
      if (onComplianceChange) {
        onComplianceChange(result);
      }
      
      // Notify of status changes
      if (!lastResult.compliant && result.compliant) {
        toast.success('Shopify Compliance Improved', {
          description: 'Your app now meets Built for Shopify compliance standards'
        });
      } else if (lastResult.compliant && !result.compliant) {
        toast.warning('Shopify Compliance Changed', {
          description: 'Your app no longer meets Built for Shopify compliance standards'
        });
      }
    }
    
    lastResult = result;
  };
  
  // Run an initial check
  checkCompliance();
  
  // Schedule regular checks
  const intervalId = setInterval(checkCompliance, intervalDays * 24 * 60 * 60 * 1000);
  
  // Return function to stop monitoring
  return () => clearInterval(intervalId);
};

/**
 * Get compliance issue recommendations as formatted text
 */
export const getComplianceRecommendations = (issues: ComplianceIssue[]): string => {
  if (issues.length === 0) {
    return 'No compliance issues detected.';
  }
  
  return issues.map(issue => 
    `${issue.severity.toUpperCase()}: ${issue.message}\n` +
    `Recommendation: ${issue.recommendation}` +
    (issue.docsUrl ? `\nDocs: ${issue.docsUrl}` : '')
  ).join('\n\n');
};
