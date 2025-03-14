
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { useGadgetConnection } from '@/hooks/useGadgetConnection';
import { useGadgetConnectionTests } from '@/hooks/useGadgetConnectionTests';
import { GadgetNotConfigured } from './GadgetNotConfigured';
import { GadgetTestResults } from './GadgetTestResults';
import { GadgetTestProgress } from './GadgetTestProgress';

export function GadgetConnectionTest() {
  const gadgetConnection = useGadgetConnection();
  const { 
    isRunningTests, 
    testProgress, 
    testResults, 
    runTests 
  } = useGadgetConnectionTests(gadgetConnection);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gadget Connection Test</CardTitle>
        <CardDescription>
          Verify your Gadget.dev integration is working correctly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!gadgetConnection.isConfigured ? (
          <GadgetNotConfigured />
        ) : (
          <>
            <GadgetTestResults results={testResults} />
            <GadgetTestProgress progress={testProgress} isRunning={isRunningTests} />
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={runTests} 
          disabled={isRunningTests || !gadgetConnection.isConfigured}
          className="w-full"
        >
          {isRunningTests ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            'Run Connection Tests'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
