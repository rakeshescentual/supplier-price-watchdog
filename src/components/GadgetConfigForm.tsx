import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { RefreshCw, Server, Shield } from "lucide-react";
import { GadgetConfig } from "@/utils/gadget/types";
import { getGadgetConfig, saveGadgetConfig, testGadgetConnection } from "@/utils/gadget/config";

// Schema for the form
const gadgetConfigSchema = z.object({
  apiKey: z.string().min(10, {
    message: "API key must be at least 10 characters long",
  }),
  appId: z.string().min(3, {
    message: "App ID must be at least 3 characters long",
  }),
  environment: z.enum(["development", "production"]),
  featureFlags: z.object({
    enableAdvancedAnalytics: z.boolean().default(false),
    enablePdfProcessing: z.boolean().default(false),
    enableMarketData: z.boolean().default(false),
  }),
});

export function GadgetConfigForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  // Load existing config
  const existingConfig = getGadgetConfig();

  // Initialize form with existing values or defaults
  const form = useForm<z.infer<typeof gadgetConfigSchema>>({
    resolver: zodResolver(gadgetConfigSchema),
    defaultValues: {
      apiKey: existingConfig?.apiKey || "",
      appId: existingConfig?.appId || "",
      environment: existingConfig?.environment || "development",
      featureFlags: {
        enableAdvancedAnalytics: existingConfig?.featureFlags?.enableAdvancedAnalytics || false,
        enablePdfProcessing: existingConfig?.featureFlags?.enablePdfProcessing || false,
        enableMarketData: existingConfig?.featureFlags?.enableMarketData || false,
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof gadgetConfigSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Make sure we're creating a complete GadgetConfig object with required properties
      const config: GadgetConfig = {
        apiKey: values.apiKey,
        appId: values.appId,
        environment: values.environment,
        featureFlags: values.featureFlags
      };
      
      // Save the configuration
      saveGadgetConfig(config);
      
      // Test the connection
      const result = await testGadgetConnection(config);
      
      if (result.success) {
        toast.success('Connection successful', {
          description: result.message,
        });
      } else {
        toast.warning('Configuration saved, but connection failed', {
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error saving Gadget configuration:", error);
      toast.error('Error saving configuration', {
        description: 'Please check your configuration and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    
    try {
      const values = form.getValues();
      // Create a complete config object for testing
      const config: GadgetConfig = {
        apiKey: values.apiKey,
        appId: values.appId,
        environment: values.environment,
        featureFlags: values.featureFlags
      };
      
      const result = await testGadgetConnection(config);
      
      if (result.success) {
        toast.success('Connection successful', {
          description: result.message,
        });
      } else {
        toast.error('Connection failed', {
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error testing Gadget connection:", error);
      toast.error('Error testing connection', {
        description: 'Please check your configuration and try again.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Gadget.dev Configuration
        </CardTitle>
        <CardDescription>
          Configure your Gadget.dev integration for enhanced data processing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your Gadget API Key" 
                        {...field} 
                        type="password"
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
                    <FormLabel>App ID</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your Gadget App ID" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      The unique identifier for your Gadget.dev application
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="environment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Environment</FormLabel>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={field.value === "development" ? "default" : "outline"}
                        onClick={() => field.onChange("development")}
                        className="flex-1"
                      >
                        Development
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "production" ? "default" : "outline"}
                        onClick={() => field.onChange("production")}
                        className="flex-1"
                      >
                        Production
                      </Button>
                    </div>
                    <FormDescription>
                      Select which environment to connect to
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-3">Feature Flags</h3>
                
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="featureFlags.enableAdvancedAnalytics"
                    render={({ field }) => (
                      <FormItem className="flex justify-between items-center">
                        <div>
                          <FormLabel className="text-base">Advanced Analytics</FormLabel>
                          <FormDescription>
                            Enable extended data analysis and reporting
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="featureFlags.enablePdfProcessing"
                    render={({ field }) => (
                      <FormItem className="flex justify-between items-center">
                        <div>
                          <FormLabel className="text-base">PDF Processing</FormLabel>
                          <FormDescription>
                            Enable PDF file parsing and data extraction
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="featureFlags.enableMarketData"
                    render={({ field }) => (
                      <FormItem className="flex justify-between items-center">
                        <div>
                          <FormLabel className="text-base">Market Data</FormLabel>
                          <FormDescription>
                            Enable competitor and market trend data analysis
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={handleTestConnection}
                disabled={isTesting}
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Configuration"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Gadget.dev provides enhanced data processing capabilities for your application
      </CardFooter>
    </Card>
  );
}

export default GadgetConfigForm;
