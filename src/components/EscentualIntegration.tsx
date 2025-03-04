
import { useState } from "react";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { downloadPriceIncreaseSnippets } from "@/lib/escentualIntegration";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Download } from "lucide-react";
import { toast } from "sonner";

export const EscentualIntegration = () => {
  const { items, priceIncreaseEffectiveDate } = useFileAnalysis();
  const [isExporting, setIsExporting] = useState(false);
  
  const increasedItems = items.filter(item => item.status === 'increased');
  
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
      
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm">
            Generate HTML snippets to add price increase notices to Escentual.com product pages. 
            These notices will inform customers of upcoming price changes and create urgency to purchase.
          </p>
          
          <div className="p-3 border rounded-md bg-muted/30 text-sm">
            <p className="font-medium mb-2">The HTML snippets will include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The effective date of the price increase</li>
              <li>The current and new prices</li>
              <li>Formatted with Escentual.com styling</li>
            </ul>
          </div>
          
          {increasedItems.length > 0 ? (
            <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">
              Ready to export <strong>{increasedItems.length}</strong> product notices with 
              effective date <strong>{priceIncreaseEffectiveDate.toLocaleDateString()}</strong>.
            </div>
          ) : (
            <div className="bg-amber-50 text-amber-700 p-3 rounded-md text-sm">
              No products with price increases to export.
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={handleExportSnippets}
          disabled={increasedItems.length === 0 || isExporting}
          className="ml-auto w-full sm:w-auto"
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : "Export HTML Snippets"}
        </Button>
      </CardFooter>
    </Card>
  );
};
