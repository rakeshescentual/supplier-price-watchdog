
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LightbulbIcon, RefreshCw } from "lucide-react";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { toast } from "sonner";

export const PriceSuggestions = () => {
  const { items, setItems } = useFileAnalysis();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateSuggestions = async () => {
    if (items.length === 0) {
      toast.error("No items to analyze", {
        description: "Please upload a price list first."
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // In a real implementation, this would call an AI service or backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock suggestions
      const updatedItems = items.map(item => {
        // Only suggest changes for items with potential issues
        if (item.status === 'anomaly' || (item.marketData?.pricePosition === 'high' && item.status === 'increased')) {
          const suggestedPrice = item.marketData?.averagePrice || item.newPrice * 0.95;
          
          return {
            ...item,
            suggestedPrice: parseFloat(suggestedPrice.toFixed(2)),
            suggestionReason: item.status === 'anomaly' 
              ? 'Anomaly detected - price may not be optimal'
              : 'Price is higher than market average - may impact sales'
          };
        }
        return item;
      });
      
      setItems(updatedItems);
      
      const suggestionsCount = updatedItems.filter(item => item.suggestedPrice).length;
      toast.success("Suggestions generated", {
        description: `Generated ${suggestionsCount} price optimization suggestions.`
      });
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast.error("Failed to generate suggestions", {
        description: "Please try again later."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestedItems = items.filter(item => item.suggestedPrice);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5" />
          Price Suggestions
        </CardTitle>
        <CardDescription>
          AI-powered price optimization recommendations
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {suggestedItems.length > 0 ? (
            <ul className="divide-y">
              {suggestedItems.slice(0, 5).map((item, index) => (
                <li key={index} className="py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.sku}</p>
                    </div>
                    <Badge variant={item.status === 'anomaly' ? 'destructive' : 'outline'}>
                      {item.status}
                    </Badge>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Current</p>
                        <p className="font-medium">${item.newPrice.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Suggested</p>
                        <p className="font-medium text-green-600">${item.suggestedPrice?.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <Button size="sm" variant="outline">Apply</Button>
                  </div>
                  
                  <p className="mt-2 text-xs text-muted-foreground">
                    {item.suggestionReason}
                  </p>
                </li>
              ))}
              
              {suggestedItems.length > 5 && (
                <p className="text-sm text-center mt-2 text-muted-foreground">
                  +{suggestedItems.length - 5} more suggestions
                </p>
              )}
            </ul>
          ) : (
            <div className="bg-muted rounded-md p-4 text-center">
              <p className="text-muted-foreground">
                No suggestions available. Generate suggestions to get price optimization recommendations.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={generateSuggestions} 
          disabled={isGenerating || items.length === 0}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating suggestions...
            </>
          ) : (
            'Generate Suggestions'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
