
import React from "react";
import { FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { GadgetConfigFormValues } from "./types";

interface EnvironmentSelectorProps {
  form: UseFormReturn<GadgetConfigFormValues>;
}

export function EnvironmentSelector({ form }: EnvironmentSelectorProps) {
  return (
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
  );
}
