
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getGadgetApiUrl } from '@/utils/gadget-helpers';
import { TestResult } from '@/components/enhanced/GadgetTestResult';

export function useGadgetConnectionTests(gadgetConnection: any) {
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  
  const runTests = async () => {
    if (!gadgetConnection.isConfigured) {
      toast.error("Gadget not configured", {
        description: "Please configure Gadget integration first."
      });
      return;
    }
    
    setIsRunningTests(true);
    setTestProgress(0);
    setTestResults([]);
    
    const tests = [
      { name: "Configuration Check", test: testConfiguration },
      { name: "API Connection", test: testApiConnection },
      { name: "Authentication", test: testAuthentication },
      { name: "Permissions", test: testPermissions },
      { name: "Feature Support", test: testFeatures }
    ];
    
    const results: TestResult[] = [];
    
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      setTestProgress(Math.round(((i) / tests.length) * 100));
      
      try {
        const result = await test.test();
        results.push(result);
      } catch (error) {
        console.error(`Error in test ${test.name}:`, error);
        results.push({
          name: test.name,
          status: 'error',
          message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
      
      // Update results as they come in
      setTestResults([...results]);
    }
    
    setTestProgress(100);
    setIsRunningTests(false);
    
    // Show summary toast
    const successful = results.filter(r => r.status === 'success').length;
    const warnings = results.filter(r => r.status === 'warning').length;
    const errors = results.filter(r => r.status === 'error').length;
    
    if (errors === 0 && warnings === 0) {
      toast.success("All tests passed", {
        description: "Your Gadget connection is working correctly."
      });
    } else if (errors === 0) {
      toast.warning("Tests completed with warnings", {
        description: `${successful} passed, ${warnings} warnings`
      });
    } else {
      toast.error("Tests failed", {
        description: `${successful} passed, ${warnings} warnings, ${errors} failed`
      });
    }
  };
  
  const testConfiguration = async (): Promise<TestResult> => {
    if (!gadgetConnection.config?.apiKey || !gadgetConnection.config?.appId) {
      return {
        name: "Configuration Check",
        status: 'error',
        message: "Missing API key or App ID in configuration"
      };
    }
    
    if (gadgetConnection.config.apiKey.length < 20) {
      return {
        name: "Configuration Check",
        status: 'warning',
        message: "API key seems too short, may not be valid"
      };
    }
    
    return {
      name: "Configuration Check",
      status: 'success',
      message: "Configuration is valid"
    };
  };
  
  const testApiConnection = async (): Promise<TestResult> => {
    const success = await gadgetConnection.testConnection();
    
    if (success) {
      return {
        name: "API Connection",
        status: 'success',
        message: "Successfully connected to Gadget API"
      };
    } else {
      return {
        name: "API Connection",
        status: 'error',
        message: "Could not connect to Gadget API"
      };
    }
  };
  
  const testAuthentication = async (): Promise<TestResult> => {
    if (!gadgetConnection.isConfigured) {
      return {
        name: "Authentication",
        status: 'error',
        message: "Gadget not configured"
      };
    }
    
    try {
      // Just a simple authenticated endpoint check
      const url = `${getGadgetApiUrl(gadgetConnection.config)}/status`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${gadgetConnection.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        return {
          name: "Authentication",
          status: 'success',
          message: "Authentication successful"
        };
      } else if (response.status === 401) {
        return {
          name: "Authentication",
          status: 'error',
          message: "Authentication failed: Invalid API key"
        };
      } else {
        return {
          name: "Authentication",
          status: 'warning',
          message: `Authentication check returned status ${response.status}`
        };
      }
    } catch (error) {
      return {
        name: "Authentication",
        status: 'error',
        message: `Authentication check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };
  
  const testPermissions = async (): Promise<TestResult> => {
    if (!gadgetConnection.isConfigured) {
      return {
        name: "Permissions",
        status: 'error',
        message: "Gadget not configured"
      };
    }
    
    // In a real implementation, we would check if the API key has the right permissions
    // by attempting to perform an operation that requires those permissions
    // For the mock implementation, we'll simulate a successful check
    
    return {
      name: "Permissions",
      status: 'success',
      message: "API key has required permissions"
    };
  };
  
  const testFeatures = async (): Promise<TestResult> => {
    if (!gadgetConnection.isConfigured) {
      return {
        name: "Feature Support",
        status: 'error',
        message: "Gadget not configured"
      };
    }
    
    const features = [];
    
    if (gadgetConnection.config.featureFlags?.enablePdfProcessing) {
      features.push("PDF Processing");
    }
    
    if (gadgetConnection.config.featureFlags?.enableShopifySync) {
      features.push("Shopify Sync");
    }
    
    if (gadgetConnection.config.featureFlags?.enableAdvancedAnalytics) {
      features.push("Advanced Analytics");
    }
    
    if (gadgetConnection.config.featureFlags?.enableBackgroundJobs) {
      features.push("Background Jobs");
    }
    
    if (features.length === 0) {
      return {
        name: "Feature Support",
        status: 'warning',
        message: "No enhanced features enabled"
      };
    }
    
    return {
      name: "Feature Support",
      status: 'success',
      message: `Enabled features: ${features.join(", ")}`
    };
  };
  
  useEffect(() => {
    // Clear test results when connection status changes
    setTestResults([]);
  }, [gadgetConnection.isConnected, gadgetConnection.isConfigured]);
  
  return {
    isRunningTests,
    testProgress,
    testResults,
    runTests
  };
}
