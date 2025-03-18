
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GadgetConfigFormValues } from "./types";

interface ApiCredentialsFieldsProps {
  form: UseFormReturn<GadgetConfigFormValues>;
}

export function ApiCredentialsFields({ form }: ApiCredentialsFieldsProps) {
  return (
    <>
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
    </>
  );
}
