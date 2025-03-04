
import { useState } from "react";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { downloadPriceIncreaseSnippets, generatePriceIncreaseSnippet } from "@/lib/escentualIntegration";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Download, Calendar as CalendarIcon, CheckCircle, AlertCircle, Eye } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const EscentualIntegration = () => {
  const { items, priceIncreaseEffectiveDate, setPriceIncreaseEffectiveDate } = useFileAnalysis();
  const [isExporting, setIsExporting] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  
  const increasedItems = items.filter(item => item.status === 'increased');
  const previewItem = increasedItems.length > 0 ? increasedItems[0] : null;
  
  const handleExportSnippets = () => {
    if (increasedItems.length === 0) {
      toast.error("No price increases", {
        description: "There are no items with price increases to export.",
      });
      return;
    }
    
    setIsExporting(true);
    
    try {
      downloadPriceIncreaseSnippets(items, priceIncreaseEffectiveDate);
      
      toast.success("Export complete", {
        description: `Generated HTML snippets for ${increasedItems.length} products.`,
      });
    } catch (error) {
      console.error("Error exporting snippets:", error);
      
      toast.error("Export failed", {
        description: "There was an error exporting the HTML snippets.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const avgPriceIncrease = increasedItems.length > 0
    ? (increasedItems.reduce((acc, item) => 
        acc + ((item.newPrice / item.oldPrice - 1) * 100), 0) / increasedItems.length
      ).toFixed(1)
    : "0.0";

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Escentual.com Integration
        </CardTitle>
        <CardDescription>
          Export HTML snippets for displaying price increase notices on product pages
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="preview" disabled={!previewItem}>Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4 mt-2">
            <p className="text-sm">
              Generate HTML snippets to add price increase notices to Escentual.com product pages. 
              These notices will inform customers of upcoming price changes and create urgency to purchase.
            </p>
            
            <div className="bg-blue-50 p-3 rounded-md text-sm space-y-2">
              <h4 className="font-medium text-blue-700 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Price Increase Effective Date
              </h4>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal w-full sm:w-auto",
                        !priceIncreaseEffectiveDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {priceIncreaseEffectiveDate ? (
                        format(priceIncreaseEffectiveDate, "PPP")
                      ) : (
                        "Pick a date"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={priceIncreaseEffectiveDate}
                      onSelect={(date) => {
                        if (date) {
                          setPriceIncreaseEffectiveDate(date);
                          setIsCalendarOpen(false);
                        }
                      }}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-blue-600">
                  This is the date when prices will increase. Customers will see this date in the notification.
                </p>
              </div>
            </div>
            
            <div className="p-3 border rounded-md bg-muted/30 text-sm">
              <p className="font-medium mb-2">The HTML snippets will include:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The effective date of the price increase ({priceIncreaseEffectiveDate ? format(priceIncreaseEffectiveDate, "MMMM d, yyyy") : "Not set"})</li>
                <li>The current and new prices with percentage increase</li>
                <li>A call-to-action encouraging immediate purchase</li>
                <li>Formatted with Escentual.com styling for seamless integration</li>
              </ul>
            </div>
            
            {increasedItems.length > 0 ? (
              <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm flex items-start gap-2">
                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Ready to export</p>
                  <p>
                    {increasedItems.length} product notices with 
                    effective date {priceIncreaseEffectiveDate ? format(priceIncreaseEffectiveDate, "MMMM d, yyyy") : "Not set"}.
                  </p>
                  <p className="mt-1 text-xs">
                    Average price increase: {avgPriceIncrease}%
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 text-amber-700 p-3 rounded-md text-sm flex items-start gap-2">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">No products with price increases</p>
                  <p>Upload a price list with increases to generate HTML snippets.</p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4 mt-2">
            {previewItem && priceIncreaseEffectiveDate && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <h3 className="text-sm font-medium">HTML Snippet Preview</h3>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Previewing {previewItem.sku} - {previewItem.name}
                  </div>
                </div>
                
                <div className="border rounded-md p-4 bg-gray-50">
                  <div className="border-b pb-4 mb-4">
                    <h3 className="font-medium text-lg mb-2">Product Page Preview</h3>
                    <div className="text-sm text-muted-foreground">This is how the notice will appear on product pages</div>
                  </div>
                  
                  <div className="p-4 border rounded-md bg-white">
                    <div 
                      className="preview-snippet" 
                      dangerouslySetInnerHTML={{ 
                        __html: generatePriceIncreaseSnippet(previewItem, priceIncreaseEffectiveDate) 
                      }} 
                    />
                  </div>
                  
                  <div className="mt-4 text-xs text-muted-foreground">
                    The above HTML will be added to the product page, styled to match Escentual.com's design system.
                  </div>
                </div>
                
                <div className="border rounded-md p-4 bg-gray-50">
                  <h3 className="font-medium text-sm mb-2">HTML Source Code</h3>
                  <pre className="text-xs p-3 bg-black text-white rounded-md overflow-x-auto">
                    {generatePriceIncreaseSnippet(previewItem, priceIncreaseEffectiveDate).replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                  </pre>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex gap-2 flex-wrap sm:flex-nowrap">
        <Button
          variant="outline"
          onClick={() => setActiveTab(activeTab === "info" ? "preview" : "info")}
          disabled={!previewItem}
          className="w-full sm:w-auto"
        >
          <Eye className="mr-2 h-4 w-4" />
          {activeTab === "info" ? "View Preview" : "View Information"}
        </Button>
        
        <Button
          onClick={handleExportSnippets}
          disabled={increasedItems.length === 0 || isExporting || !priceIncreaseEffectiveDate}
          className="ml-auto w-full sm:w-auto"
        >
          {isExporting ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin inline-block rounded-full border-2 border-current border-t-transparent"></span>
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export HTML Snippets
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
