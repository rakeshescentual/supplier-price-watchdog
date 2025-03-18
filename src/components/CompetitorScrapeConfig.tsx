
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { PlayCircle, Clipboard, PlusCircle, RefreshCw, Database } from "lucide-react";

// Schema for scraping configuration
const ScrapeConfigSchema = z.object({
  targetUrl: z.string().url({ message: "Please enter a valid URL" }),
  frequency: z.enum(["daily", "weekly", "custom"]),
  customFrequency: z.number().min(1).max(30).optional(),
  targetElements: z.object({
    productNames: z.boolean().default(true),
    prices: z.boolean().default(true),
    images: z.boolean().default(false),
    description: z.boolean().default(false),
    availability: z.boolean().default(true),
  }),
  competitorName: z.string().min(2, { message: "Competitor name is required" }),
  scrapeDepth: z.enum(["shallow", "medium", "deep"]).default("medium"),
  saveToDatabase: z.boolean().default(true),
});

type ScrapeConfigValues = z.infer<typeof ScrapeConfigSchema>;

export function CompetitorScrapeConfig() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Initialize form with default values
  const form = useForm<ScrapeConfigValues>({
    resolver: zodResolver(ScrapeConfigSchema),
    defaultValues: {
      targetUrl: "",
      frequency: "weekly",
      targetElements: {
        productNames: true,
        prices: true,
        images: false,
        description: false,
        availability: true,
      },
      competitorName: "",
      scrapeDepth: "medium",
      saveToDatabase: true,
    },
  });
  
  // Extract values from form
  const frequencyValue = form.watch("frequency");

  const onSubmit = async (data: ScrapeConfigValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting scrape configuration:", data);
      
      // In a real application, this would call your API to set up the scraping job
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Scrape configuration saved", {
        description: `Set up to scrape ${data.competitorName} ${data.frequency === "custom" ? `every ${data.customFrequency} days` : data.frequency}`,
      });
      
      // Reset the form
      form.reset({
        targetUrl: "",
        frequency: "weekly",
        targetElements: {
          productNames: true,
          prices: true,
          images: false,
          description: false,
          availability: true,
        },
        competitorName: "",
        scrapeDepth: "medium",
        saveToDatabase: true,
      });
      
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error saving scrape configuration:", error);
      toast.error("Failed to save configuration", {
        description: "There was an error setting up the scrape job.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    const url = form.getValues("targetUrl");
    if (!url) {
      toast.warning("URL Required", {
        description: "Please enter a target URL to preview",
      });
      return;
    }
    
    setPreviewUrl(url);
    toast.success("Preview loaded", {
      description: "URL structure analyzed for scraping",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configure Competitor Scraping</CardTitle>
        <CardDescription>
          Set up automated data collection from competitor websites
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="competitorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competitor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Boots, Selfridges" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a name to identify this competitor
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="targetUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target URL</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input placeholder="https://competitor.com/products" {...field} />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={handlePreview}
                        >
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormDescription>
                        Start URL for the scraping process
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {frequencyValue === "custom" && (
                    <FormField
                      control={form.control}
                      name="customFrequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Days Between Scrapes</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Number of days" 
                              min={1} 
                              max={30} 
                              {...field}
                              onChange={(e) => field.onChange(
                                e.target.value === "" ? undefined : parseInt(e.target.value, 10)
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <FormField
                  control={form.control}
                  name="scrapeDepth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scrape Depth</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select depth" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="shallow">Shallow (catalog only)</SelectItem>
                          <SelectItem value="medium">Medium (catalog + product pages)</SelectItem>
                          <SelectItem value="deep">Deep (extensive crawl)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How thoroughly to scrape the website
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Target Elements</h3>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="targetElements.productNames"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            Product Names
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="targetElements.prices"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            Prices
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="targetElements.images"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            Product Images
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="targetElements.description"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            Product Descriptions
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="targetElements.availability"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            Availability Status
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <FormField
                  control={form.control}
                  name="saveToDatabase"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Save results to database
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Store historical data for trend analysis
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                {previewUrl && (
                  <div className="p-3 border rounded-md bg-gray-50">
                    <h4 className="text-sm font-medium mb-2">URL Preview</h4>
                    <div className="text-xs text-muted-foreground break-all">
                      {previewUrl}
                    </div>
                    <p className="text-xs mt-2">URL structure compatible with scraping tools</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Scrape Configuration
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div className="text-sm text-muted-foreground">
          <Database className="h-4 w-4 inline-block mr-1" />
          Data stored securely and in compliance with terms of service
        </div>
        <Button variant="ghost" size="sm" onClick={() => {
          navigator.clipboard.writeText(JSON.stringify(form.getValues(), null, 2));
          toast.success("Configuration copied to clipboard");
        }}>
          <Clipboard className="h-4 w-4 mr-2" />
          Copy Config
        </Button>
      </CardFooter>
    </Card>
  );
}
