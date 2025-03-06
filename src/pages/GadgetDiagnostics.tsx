
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GadgetStatusIndicator } from '@/components/enhanced/GadgetStatusIndicator';
import { GadgetConnectionTest } from '@/components/enhanced/GadgetConnectionTest';
import { ArrowLeft, Info, MoveRight } from 'lucide-react';
import { isGadgetInitialized } from '@/lib/gadgetApi';

export default function GadgetDiagnostics() {
  const [activeTab, setActiveTab] = useState('status');
  const navigate = useNavigate();
  const isConnected = isGadgetInitialized();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gadget Diagnostics</h1>
          <p className="text-muted-foreground">
            Test and troubleshoot your Gadget.dev integration
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={() => navigate('/gadget-settings')}>
            Configure
            <MoveRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {!isConnected && (
        <Alert className="mb-6 bg-amber-50 border-amber-200 text-amber-800">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertTitle>Gadget Not Connected</AlertTitle>
          <AlertDescription>
            Your application is not currently connected to Gadget.dev. 
            Use the diagnostics tools below to troubleshoot or navigate to
            the configuration page to set up your connection.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Diagnostics Tools</CardTitle>
              <CardDescription>
                Test and troubleshoot your Gadget integration
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button 
                variant={activeTab === 'status' ? 'default' : 'ghost'} 
                className="justify-start"
                onClick={() => setActiveTab('status')}
              >
                Connection Status
              </Button>
              <Button 
                variant={activeTab === 'test' ? 'default' : 'ghost'} 
                className="justify-start"
                onClick={() => setActiveTab('test')}
              >
                Connection Test
              </Button>
              <Button 
                variant={activeTab === 'logs' ? 'default' : 'ghost'} 
                className="justify-start"
                onClick={() => setActiveTab('logs')}
              >
                Activity Logs
              </Button>
              <Button 
                variant={activeTab === 'docs' ? 'default' : 'ghost'} 
                className="justify-start"
                onClick={() => setActiveTab('docs')}
              >
                Troubleshooting Guide
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="test">Test</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="docs">Guide</TabsTrigger>
            </TabsList>
            
            <TabsContent value="status" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Gadget Connection Status</CardTitle>
                  <CardDescription>
                    Current status of your Gadget.dev integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GadgetStatusIndicator />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="test" className="mt-0">
              <GadgetConnectionTest />
            </TabsContent>
            
            <TabsContent value="logs" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Logs</CardTitle>
                  <CardDescription>
                    Recent Gadget.dev API calls and events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertTitle>Feature in Development</AlertTitle>
                    <AlertDescription>
                      The activity logs feature is currently in development.
                      Check back soon for detailed API call logging and event tracking.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="docs" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Troubleshooting Guide</CardTitle>
                  <CardDescription>
                    Common issues and solutions for Gadget.dev integration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Connection Issues</h3>
                    
                    <div className="space-y-2 border-l-2 border-blue-200 pl-4">
                      <h4 className="font-medium">API Key Authentication Failures</h4>
                      <p className="text-sm text-muted-foreground">
                        If you're experiencing authentication errors, check that your API key is valid and has not expired.
                        Try regenerating a new API key in your Gadget dashboard.
                      </p>
                      <div className="text-sm font-mono bg-slate-100 p-2 rounded mt-2">
                        Error: Authentication failed: Invalid API key
                      </div>
                    </div>
                    
                    <div className="space-y-2 border-l-2 border-blue-200 pl-4">
                      <h4 className="font-medium">CORS Errors</h4>
                      <p className="text-sm text-muted-foreground">
                        If you see CORS errors in the console, you need to configure your Gadget application to allow
                        requests from your frontend domain.
                      </p>
                      <div className="text-sm font-mono bg-slate-100 p-2 rounded mt-2">
                        Access to fetch at 'https://your-app.gadget.app/api/graphql' from origin 'http://localhost:3000' 
                        has been blocked by CORS policy
                      </div>
                      <p className="text-sm mt-2">
                        <strong>Solution:</strong> Go to your Gadget dashboard → Settings → CORS and add your domain to the allowed origins.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Feature Configuration</h3>
                    
                    <div className="space-y-2 border-l-2 border-green-200 pl-4">
                      <h4 className="font-medium">PDF Processing Not Working</h4>
                      <p className="text-sm text-muted-foreground">
                        Ensure you have enabled the PDF Processing feature flag in your Gadget configuration,
                        and that your Gadget application has the necessary actions implemented.
                      </p>
                    </div>
                    
                    <div className="space-y-2 border-l-2 border-green-200 pl-4">
                      <h4 className="font-medium">Shopify Sync Issues</h4>
                      <p className="text-sm text-muted-foreground">
                        For Shopify sync to work, you need to configure the Shopify connection in your Gadget application
                        and ensure your API key has the necessary permissions.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
                    <h3 className="text-lg font-medium mb-2">Additional Resources</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <MoveRight className="h-4 w-4 text-blue-500" />
                        <a 
                          href="/gadget-documentation"
                          className="text-blue-600 hover:underline"
                        >
                          View Complete Integration Documentation
                        </a>
                      </li>
                      <li className="flex items-center gap-2">
                        <MoveRight className="h-4 w-4 text-blue-500" />
                        <a 
                          href="https://docs.gadget.dev"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Gadget.dev Official Documentation
                        </a>
                      </li>
                      <li className="flex items-center gap-2">
                        <MoveRight className="h-4 w-4 text-blue-500" />
                        <a 
                          href="/gadget-settings"
                          className="text-blue-600 hover:underline"
                        >
                          Update Gadget Configuration
                        </a>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
