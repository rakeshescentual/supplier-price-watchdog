
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { testGadgetConnection } from '@/utils/gadget/connection';
import { saveGadgetConfig, getGadgetConfig } from '@/utils/gadget/config';
import { Key, RefreshCw, Database, Lock, Cpu } from 'lucide-react';

// Define the form schema
const gadgetConfigSchema = z.object({
  apiKey: z.string().min(10, {
    message: 'API Key must be at least 10 characters.',
  }),
  appId: z.string().min(3, {
    message: 'App ID is required.',
  }),
  environment: z.enum(['development', 'production']),
  featureFlags: z.object({
    enableAdvancedAnalytics: z.boolean().default(true),
    enablePdfProcessing: z.boolean().default(true),
    enableMarketData: z.boolean().default(true),
  }),
});

type GadgetConfigValues = z.infer<typeof gadgetConfigSchema>;

export function GadgetConfigForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  // Initialize form with saved values or defaults
  const savedConfig = getGadgetConfig();
  
  const form = useForm<GadgetConfigValues>({
    resolver: zodResolver(gadgetConfigSchema),
    defaultValues: savedConfig || {
      apiKey: '',
      appId: '',
      environment: 'development',
      featureFlags: {
        enableAdvancedAnalytics: true,
        enablePdfProcessing: true,
        enableMarketData: true,
      },
    },
  });

  async function onSubmit(values: GadgetConfigValues) {
    setIsSubmitting(true);
    
    try {
      // Save the configuration
      saveGadgetConfig(values);
      
      toast.success('Configuration saved', {
        description: 'Gadget configuration has been updated successfully.',
      });
      
    } catch (error) {
      console.error('Error saving Gadget configuration:', error);
      
      toast.error('Configuration error', {
        description: 'There was an error saving your Gadget configuration.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const testConnection = async () => {
    setIsTesting(true);
    
    try {
      const values = form.getValues();
      
      // Temporarily save the config for testing
      saveGadgetConfig(values);
      
      // Test the connection
      const result = await testGadgetConnection();
      
      if (result.success) {
        toast.success('Connection successful', {
          description: `Connected to Gadget API (${result.latency}ms)`,
        });
      } else {
        toast.error('Connection failed', {
          description: result.message || 'Could not connect to Gadget API',
        });
      }
    } catch (error) {
      console.error('Error testing Gadget connection:', error);
      
      toast.error('Connection test failed', {
        description: 'There was an error testing the Gadget connection.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Gadget.dev Configuration
        </CardTitle>
        <CardDescription>
          Configure your Gadget.dev integration for enhanced functionality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="credentials" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="credentials">Credentials</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>
              
              <TabsContent value="credentials" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Key className="h-3.5 w-3.5" />
                          API Key
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your Gadget API key"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Your Gadget.dev API key for authentication
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="appId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Cpu className="h-3.5 w-3.5" />
                          App ID
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your Gadget app ID"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The ID of your Gadget.dev application
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="environment"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Environment</FormLabel>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="development"
                            value="development"
                            checked={field.value === 'development'}
                            onChange={() => field.onChange('development')}
                            className="h-4 w-4"
                          />
                          <label htmlFor="development" className="text-sm cursor-pointer">
                            Development
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="production"
                            value="production"
                            checked={field.value === 'production'}
                            onChange={() => field.onChange('production')}
                            className="h-4 w-4"
                          />
                          <label htmlFor="production" className="text-sm cursor-pointer">
                            Production
                          </label>
                        </div>
                      </div>
                      <FormDescription>
                        Select your Gadget.dev environment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 flex items-start gap-2">
                  <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Secure Storage</p>
                    <p className="text-blue-700 text-xs mt-1">
                      Your API credentials are stored securely in your browser's local storage and are not transmitted to our servers.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="pt-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="featureFlags.enableAdvancedAnalytics"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Advanced Analytics</FormLabel>
                          <FormDescription>
                            Enable AI-powered analytics for deeper insights into supplier pricing
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="featureFlags.enablePdfProcessing"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>PDF Processing</FormLabel>
                          <FormDescription>
                            Process PDF price lists through Gadget.dev for enhanced accuracy
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="featureFlags.enableMarketData"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Market Data Enrichment</FormLabel>
                          <FormDescription>
                            Enrich your pricing data with market intelligence from Gadget.dev
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={testConnection}
                disabled={isTesting || isSubmitting}
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Configuration'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">
          <a 
            href="https://gadget.dev/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Gadget.dev Documentation
          </a>
        </p>
        <p className="text-xs text-muted-foreground">
          Version: {savedConfig ? '1.3.0' : 'Not Configured'}
        </p>
      </CardFooter>
    </Card>
  );
}

export default GadgetConfigForm;
