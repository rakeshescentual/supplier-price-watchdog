
import React from "react";
import { FormField, FormItem, FormLabel, FormDescription, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { GadgetConfigFormValues } from "./types";

interface FeatureFlagsSectionProps {
  form: UseFormReturn<GadgetConfigFormValues>;
}

export function FeatureFlagsSection({ form }: FeatureFlagsSectionProps) {
  return (
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
                  Enable market data integration
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
  );
}
