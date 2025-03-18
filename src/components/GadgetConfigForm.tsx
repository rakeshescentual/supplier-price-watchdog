
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Server } from "lucide-react";
import { GadgetConfig } from "@/utils/gadget/types";
import { useGadgetConfig } from "@/hooks/useGadgetConfig";
import { ApiCredentialsFields } from "@/components/gadget/ApiCredentialsFields";
import { EnvironmentSelector } from "@/components/gadget/EnvironmentSelector";
import { FeatureFlagsSection } from "@/components/gadget/FeatureFlagsSection";
import { FormActions } from "@/components/gadget/FormActions";
import { gadgetConfigSchema, GadgetConfigFormValues } from "@/components/gadget/types";

export function GadgetConfigForm() {
  const {
    existingConfig,
    isSubmitting,
    isTesting,
    handleSaveConfig,
    handleTestConnection
  } = useGadgetConfig();

  // Initialize form with existing values or defaults
  const form = useForm<GadgetConfigFormValues>({
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

  const onSubmit = async (values: GadgetConfigFormValues) => {
    // Make sure we're creating a complete GadgetConfig object with required properties
    const config: GadgetConfig = {
      apiKey: values.apiKey,
      appId: values.appId,
      environment: values.environment,
      featureFlags: values.featureFlags
    };
    
    await handleSaveConfig(config);
  };

  const onTestConnection = async () => {
    const values = form.getValues();
    // Create a complete config object for testing
    const config: GadgetConfig = {
      apiKey: values.apiKey,
      appId: values.appId,
      environment: values.environment,
      featureFlags: values.featureFlags
    };
    
    await handleTestConnection(config);
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
              <ApiCredentialsFields form={form} />
              <EnvironmentSelector form={form} />
              <FeatureFlagsSection form={form} />
            </div>
            
            <FormActions 
              isSubmitting={isSubmitting} 
              isTesting={isTesting} 
              onTestConnection={onTestConnection} 
            />
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
