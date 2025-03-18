
import { z } from "zod";

// Schema for the form
export const gadgetConfigSchema = z.object({
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

export type GadgetConfigFormValues = z.infer<typeof gadgetConfigSchema>;
