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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CompetitorScrapingService } from "@/services/competitorScraping";
import { ScrapingSchedule, CompetitorSelectors } from "@/types/competitor";
import { 
  PlayCircle, 
  Clipboard, 
  PlusCircle, 
  RefreshCw, 
  Database, 
  Edit, 
  Trash2,
  Globe,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ListChecks,
  ArrowDownUp,
  FileJson
} from "lucide-react";

const ScrapeConfigSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  url: z.string().url("Please enter a valid URL"),
  frequency: z.enum(["daily", "weekly", "bi-weekly", "monthly", "custom"]),
  times: z.array(z.string()).min(1, "At least one time must be specified"),
  active: z.boolean().default(true),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  selectors: z.object({
    productContainer: z.string().optional(),
    productName: z.string().optional(),
    productPrice: z.string().optional(),
    productImage: z.string().optional(),
    productSku: z.string().optional(),
    productBrand: z.string().optional(),
    productCategory: z.string().optional(),
    productAvailability: z.string().optional(),
    pagination: z.string().optional(),
  }).optional(),
});

type ScrapeConfigFormValues = z.infer<typeof ScrapeConfigSchema>;

export function CompetitorScrapeConfig() {
  const [schedules, setSchedules] = useState<ScrapingSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScrapingSchedule | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("schedules");
  const [showJsonEditor, setShowJsonEditor] = useState(false);
  const [jsonContent, setJsonContent] = useState("");

  const form = useForm<ScrapeConfigFormValues>({
    resolver: zodResolver(ScrapeConfigSchema),
    defaultValues: {
      name: "",
      url: "",
      frequency: "daily",
      times: ["09:00", "17:00"],
      active: true,
      priority: "medium",
      selectors: {
        productContainer: "",
        productName: "",
        productPrice: "",
        productImage: "",
      },
    },
  });

  const loadSchedules = async () => {
    setIsLoading(true);
    try {
      const data = await CompetitorScrapingService.getScrapingSchedules();
      setSchedules(data);
    } catch (error) {
      console.error("Error loading scraping schedules:", error);
      toast.error("Failed to load schedules", {
        description: "Could not retrieve scraping schedules.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadSchedules();
  }, []);

  React.useEffect(() => {
    if (editingSchedule) {
      form.reset({
        name: editingSchedule.name,
        url: editingSchedule.url,
        frequency: editingSchedule.frequency || "daily",
        times: editingSchedule.times,
        active: editingSchedule.active,
        priority: editingSchedule.priority || "medium",
        selectors: editingSchedule.selectors || {
          productContainer: "",
          productName: "",
          productPrice: "",
          productImage: "",
        },
      });
      
      setJsonContent(JSON.stringify(editingSchedule.selectors || {}, null, 2));
      setIsEditorOpen(true);
    }
  }, [editingSchedule, form]);

  const onSubmit = async (values: ScrapeConfigFormValues) => {
    try {
      const schedule: Partial<ScrapingSchedule> & { url: string } = {
        id: editingSchedule?.id,
        name: values.name,
        url: values.url,
        frequency: values.frequency,
        times: values.times,
        active: values.active,
        priority: values.priority,
        selectors: showJsonEditor 
          ? JSON.parse(jsonContent) 
          : values.selectors as CompetitorSelectors,
      };

      const savedSchedule = await CompetitorScrapingService.saveScrapingSchedule(schedule);
      
      if (editingSchedule) {
        setSchedules(schedules.map(s => s.id === savedSchedule.id ? savedSchedule : s));
        toast.success("Schedule updated", {
          description: `The schedule for ${savedSchedule.name} has been updated.`,
        });
      } else {
        setSchedules([...schedules, savedSchedule]);
        toast.success("Schedule created", {
          description: `A new schedule for ${savedSchedule.name} has been created.`,
        });
      }
      
      setIsEditorOpen(false);
      setEditingSchedule(null);
      form.reset();
      setShowJsonEditor(false);
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error("Failed to save schedule", {
        description: "There was an error saving the scraping schedule.",
      });
    }
  };

  const handleRunNow = async (scheduleId: string) => {
    try {
      await CompetitorScrapingService.runImmediateScrape(scheduleId);
      toast.success("Scrape started", {
        description: "The scraping job has been initiated.",
      });
    } catch (error) {
      console.error("Error running scrape:", error);
      toast.error("Failed to start scrape", {
        description: "There was an error initiating the scraping job.",
      });
    }
  };

  const handleDelete = async (scheduleId: string) => {
    if (confirm("Are you sure you want to delete this schedule?")) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setSchedules(schedules.filter(s => s.id !== scheduleId));
        toast.success("Schedule deleted", {
          description: "The scraping schedule has been removed.",
        });
      } catch (error) {
        console.error("Error deleting schedule:", error);
        toast.error("Failed to delete schedule", {
          description: "There was an error removing the scraping schedule.",
        });
      }
    }
  };

  const handleEdit = (schedule: ScrapingSchedule) => {
    setEditingSchedule(schedule);
  };

  const toggleJsonEditor = () => {
    if (!showJsonEditor) {
      const selectors = form.getValues().selectors || {};
      setJsonContent(JSON.stringify(selectors, null, 2));
    }
    setShowJsonEditor(!showJsonEditor);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Competitor Scraping</h2>
          <p className="text-muted-foreground">
            Configure and manage automated price scraping from competitor websites
          </p>
        </div>
        <Button onClick={() => {
          setEditingSchedule(null);
          form.reset();
          setShowJsonEditor(false);
          setJsonContent("");
          setIsEditorOpen(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Schedule
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="schedules">
            <Clock className="h-4 w-4 mr-2" />
            Schedules
          </TabsTrigger>
          <TabsTrigger value="selectors">
            <ListChecks className="h-4 w-4 mr-2" />
            Selector Library
          </TabsTrigger>
          <TabsTrigger value="history">
            <Database className="h-4 w-4 mr-2" />
            Job History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedules" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : schedules.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Globe className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Scraping Schedules</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first competitor scraping schedule to start gathering price data.
                </p>
                <Button onClick={() => {
                  setEditingSchedule(null);
                  form.reset();
                  setIsEditorOpen(true);
                }}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Schedule
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Active Scraping Schedules</CardTitle>
                <CardDescription>
                  {schedules.filter(s => s.active).length} active schedules monitoring competitor pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Competitor</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{schedule.name}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {schedule.url}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="capitalize">{schedule.frequency || "Daily"}</span>
                            <span className="text-xs text-muted-foreground">
                              {schedule.times.join(", ")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {schedule.productCount || "Unknown"}
                        </TableCell>
                        <TableCell>
                          {schedule.active ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1 whitespace-nowrap">
                              <CheckCircle2 className="h-3 w-3" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 flex items-center gap-1 whitespace-nowrap">
                              Paused
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={
                              schedule.priority === "high" 
                                ? "bg-red-50 text-red-700" 
                                : schedule.priority === "medium"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-gray-50 text-gray-700"
                            }
                          >
                            {schedule.priority || "Medium"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRunNow(schedule.id)}
                            >
                              <PlayCircle className="h-4 w-4" />
                              <span className="sr-only">Run Now</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(schedule)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(schedule.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-xs text-muted-foreground">
                  Last updated: {new Date().toLocaleString()}
                </div>
                <Button variant="outline" size="sm" onClick={loadSchedules}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="selectors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Selector Templates</CardTitle>
              <CardDescription>
                Pre-configured CSS selectors for popular competitor websites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "Boots", url: "boots.com", selectors: 12 },
                  { name: "Lookfantastic", url: "lookfantastic.com", selectors: 8 },
                  { name: "Feelunique", url: "feelunique.com", selectors: 10 },
                  { name: "Cult Beauty", url: "cultbeauty.co.uk", selectors: 7 },
                  { name: "Space NK", url: "spacenk.com", selectors: 9 },
                  { name: "Sephora UK", url: "sephora.co.uk", selectors: 11 },
                ].map((template, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {template.url}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-muted-foreground">Selectors:</span>
                          <Badge variant="outline">{template.selectors}</Badge>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            toast.info(`${template.name} selectors copied to clipboard`, {
                              description: "Ready to paste into your scraping configuration"
                            });
                          }}
                        >
                          <Clipboard className="h-3 w-3 mr-2" />
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Scraping Jobs</CardTitle>
              <CardDescription>
                History of recently executed scraping jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Competitor</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { 
                      id: "job-1", 
                      competitor: "Boots", 
                      started: new Date(Date.now() - 2 * 60 * 60 * 1000),
                      duration: "18m 43s",
                      products: 143,
                      status: "completed",
                      errors: 0
                    },
                    { 
                      id: "job-2", 
                      competitor: "Feelunique", 
                      started: new Date(Date.now() - 5 * 60 * 60 * 1000),
                      duration: "22m 12s",
                      products: 87,
                      status: "completed",
                      errors: 3
                    },
                    { 
                      id: "job-3", 
                      competitor: "Lookfantastic", 
                      started: new Date(Date.now() - 7 * 60 * 60 * 1000),
                      duration: "43m 55s",
                      products: 204,
                      status: "failed",
                      errors: 12
                    },
                  ].map((job, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {job.competitor}
                      </TableCell>
                      <TableCell>
                        {job.started.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {job.duration}
                      </TableCell>
                      <TableCell>
                        {job.products}
                      </TableCell>
                      <TableCell>
                        {job.status === "completed" ? (
                          <Badge 
                            variant="outline" 
                            className={
                              job.errors === 0
                                ? "bg-green-50 text-green-700 flex items-center gap-1"
                                : "bg-amber-50 text-amber-700 flex items-center gap-1"
                            }
                          >
                            {job.errors === 0 ? (
                              <>
                                <CheckCircle2 className="h-3 w-3" />
                                Completed
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-3 w-3" />
                                Partial ({job.errors} errors)
                              </>
                            )}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Failed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? `Edit Schedule: ${editingSchedule.name}` : "Create New Scraping Schedule"}
            </DialogTitle>
            <DialogDescription>
              Configure when and how to scrape competitor pricing data
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competitor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Boots, Feelunique" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="times"
                render={() => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Scraping Times</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const current = form.getValues().times || [];
                          form.setValue("times", [...current, "12:00"]);
                        }}
                      >
                        <PlusCircle className="h-3 w-3 mr-1" />
                        Add Time
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {form.watch("times")?.map((time, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={time}
                            onChange={(e) => {
                              const newTimes = [...form.getValues().times];
                              newTimes[index] = e.target.value;
                              form.setValue("times", newTimes);
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newTimes = form.getValues().times.filter((_, i) => i !== index);
                              form.setValue("times", newTimes);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Enable this schedule to run automatically
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-medium">CSS Selectors</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={toggleJsonEditor}
                  >
                    {showJsonEditor ? (
                      <>
                        <ListChecks className="h-4 w-4 mr-2" />
                        Form View
                      </>
                    ) : (
                      <>
                        <FileJson className="h-4 w-4 mr-2" />
                        JSON View
                      </>
                    )}
                  </Button>
                </div>
                
                {showJsonEditor ? (
                  <div className="space-y-2">
                    <textarea
                      className="w-full h-[200px] font-mono text-sm p-2 border rounded-md"
                      value={jsonContent}
                      onChange={(e) => setJsonContent(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Edit the JSON structure of CSS selectors directly
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="selectors.productContainer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Container</FormLabel>
                            <FormControl>
                              <Input placeholder=".product-item" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="selectors.productName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input placeholder=".product-title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="selectors.productPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Price</FormLabel>
                            <FormControl>
                              <Input placeholder=".product-price" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="selectors.productImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Image</FormLabel>
                            <FormControl>
                              <Input placeholder=".product-image img" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="selectors.productSku"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product SKU</FormLabel>
                            <FormControl>
                              <Input placeholder=".product-sku" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="selectors.productBrand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Brand</FormLabel>
                            <FormControl>
                              <Input placeholder=".product-brand" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="selectors.productCategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Category</FormLabel>
                            <FormControl>
                              <Input placeholder=".breadcrumb-item" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="selectors.pagination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pagination</FormLabel>
                            <FormControl>
                              <Input placeholder=".pagination a" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditorOpen(false);
                    setEditingSchedule(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import React from 'react';
