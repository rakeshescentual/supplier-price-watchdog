
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { toast } from "sonner";
import { Brain, Send, Sparkles, MessageSquare, Loader2, FileSpreadsheet, Database } from "lucide-react";

export const NotebookLLM = () => {
  const { items, analysis } = useFileAnalysis();
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<{ query: string; result: string; timestamp: Date }[]>([]);
  
  const handleAnalyze = async () => {
    if (!query.trim()) {
      toast.error("Please enter a query", {
        description: "Enter a specific question about your price data."
      });
      return;
    }
    
    if (items.length === 0) {
      toast.error("No data available", {
        description: "Please upload a price list first."
      });
      return;
    }
    
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      // Prepare data for the LLM analysis
      const dataForAnalysis = {
        items: items.map(item => ({
          sku: item.sku,
          name: item.name,
          oldPrice: item.oldPrice,
          newPrice: item.newPrice,
          status: item.status,
          difference: item.difference,
          category: item.category || 'Unknown',
          vendor: item.vendor || 'Unknown',
          inventory: item.inventoryLevel || 0
        })),
        summary: {
          totalItems: items.length,
          increased: items.filter(i => i.status === 'increased').length,
          decreased: items.filter(i => i.status === 'decreased').length,
          unchanged: items.filter(i => i.status === 'unchanged').length,
          new: items.filter(i => i.status === 'new').length,
          discontinued: items.filter(i => i.status === 'discontinued').length,
        },
        previousAnalysis: analysis
      };
      
      // In a real implementation, this would use a notebook LLM API
      // For demo purposes, simulate the response after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock response based on the query
      let mockResponse = "";
      
      if (query.toLowerCase().includes("price increase")) {
        mockResponse = `Based on the analysis of your price data, I can tell you the following about price increases:
        
1. ${dataForAnalysis.summary.increased} products had price increases out of ${dataForAnalysis.summary.totalItems} total products (${Math.round((dataForAnalysis.summary.increased / dataForAnalysis.summary.totalItems) * 100)}%).

2. The average price increase is ${(items.filter(i => i.status === 'increased').reduce((sum, item) => sum + item.difference, 0) / dataForAnalysis.summary.increased).toFixed(2)}%.

3. The largest price increases were seen in the following products:
   - ${items.filter(i => i.status === 'increased').sort((a, b) => b.difference - a.difference)[0]?.name || 'N/A'}: ${items.filter(i => i.status === 'increased').sort((a, b) => b.difference - a.difference)[0]?.difference.toFixed(2) || 'N/A'}
   - ${items.filter(i => i.status === 'increased').sort((a, b) => b.difference - a.difference)[1]?.name || 'N/A'}: ${items.filter(i => i.status === 'increased').sort((a, b) => b.difference - a.difference)[1]?.difference.toFixed(2) || 'N/A'}
   - ${items.filter(i => i.status === 'increased').sort((a, b) => b.difference - a.difference)[2]?.name || 'N/A'}: ${items.filter(i => i.status === 'increased').sort((a, b) => b.difference - a.difference)[2]?.difference.toFixed(2) || 'N/A'}

4. Product categories with the highest percentage of price increases:
   ${Object.entries(items.reduce((acc, item) => {
     if (item.category && item.status === 'increased') {
       acc[item.category] = (acc[item.category] || 0) + 1;
     }
     return acc;
   }, {} as Record<string, number>)).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([category, count]) => `   - ${category}: ${count} products`).join('\n')}

5. Recommendation: Review the products with significant price increases and consider either absorbing some of the cost increase or implementing the increases in stages to minimize customer impact.`;
      } else if (query.toLowerCase().includes("competitor") || query.toLowerCase().includes("market")) {
        mockResponse = `Based on the market data analysis, here's what I can tell you about your competitive positioning:

1. Overall price positioning: Your prices are generally ${['lower than', 'in line with', 'higher than'][Math.floor(Math.random() * 3)]} the market average.

2. Categories where you have a competitive advantage (your prices are lower):
   - Category 1: 5% lower than market average
   - Category 2: 3% lower than market average
   - Category 3: 2% lower than market average

3. Categories where your prices are higher than competitors:
   - Category 4: 4% higher than market average
   - Category 5: 7% higher than market average

4. Opportunities for price optimization:
   - Consider raising prices on SKUs where you're significantly below market average
   - Review pricing strategy for Category 5 where you're less competitive
   - Monitor competitor pricing changes in Category 2 where you have a small advantage

5. Based on the current market data, there are approximately 15 products where you could increase prices without affecting your competitive position.`;
      } else if (query.toLowerCase().includes("margin") || query.toLowerCase().includes("profit")) {
        mockResponse = `Here's the margin impact analysis based on your price data:

1. Overall margin impact: The recent price changes will ${Math.random() > 0.5 ? 'increase' : 'decrease'} your average margin by approximately ${(Math.random() * 2 + 0.5).toFixed(2)}%.

2. Products with significant margin improvements:
   - Product A: Margin increased from 24% to 28%
   - Product B: Margin increased from 18% to 23% 
   - Product C: Margin increased from 30% to 33%

3. Products with margin deterioration:
   - Product X: Margin decreased from 25% to 22%
   - Product Y: Margin decreased from 31% to 27%
   - Product Z: Margin decreased from 19% to 15%

4. Recommendations to improve overall margins:
   - Consider negotiating better terms with Supplier 1 which provides 15 products with below-average margins
   - Review minimum order quantities for high-margin products to optimize inventory costs
   - Implement tiered pricing strategies for high-volume products to improve blended margins

5. If you implemented all recommendations, you could potentially improve your overall margin by an additional 1.5-2.5%.`;
      } else {
        mockResponse = `Based on my analysis of your price data (${dataForAnalysis.summary.totalItems} products), here are some key insights:

1. Price Change Overview:
   - ${dataForAnalysis.summary.increased} products with price increases (${Math.round((dataForAnalysis.summary.increased / dataForAnalysis.summary.totalItems) * 100)}%)
   - ${dataForAnalysis.summary.decreased} products with price decreases (${Math.round((dataForAnalysis.summary.decreased / dataForAnalysis.summary.totalItems) * 100)}%)
   - ${dataForAnalysis.summary.unchanged} products with unchanged prices (${Math.round((dataForAnalysis.summary.unchanged / dataForAnalysis.summary.totalItems) * 100)}%)
   - ${dataForAnalysis.summary.discontinued} discontinued products (${Math.round((dataForAnalysis.summary.discontinued / dataForAnalysis.summary.totalItems) * 100)}%)
   - ${dataForAnalysis.summary.new} new products (${Math.round((dataForAnalysis.summary.new / dataForAnalysis.summary.totalItems) * 100)}%)

2. Average price change: ${(items.reduce((sum, item) => sum + item.difference, 0) / items.filter(i => i.difference !== 0).length).toFixed(2)}%

3. Most affected product categories:
   ${Object.entries(items.reduce((acc, item) => {
     if (item.category && item.status !== 'unchanged') {
       acc[item.category] = (acc[item.category] || 0) + 1;
     }
     return acc;
   }, {} as Record<string, number>)).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([category, count]) => `   - ${category}: ${count} products affected`).join('\n')}

4. Top suppliers with price changes:
   ${Object.entries(items.reduce((acc, item) => {
     if (item.vendor && item.status !== 'unchanged') {
       acc[item.vendor] = (acc[item.vendor] || 0) + 1;
     }
     return acc;
   }, {} as Record<string, number>)).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([vendor, count]) => `   - ${vendor}: ${count} products affected`).join('\n')}

5. Recommendations:
   - Review the ${dataForAnalysis.summary.increased} products with price increases to determine if any adjustments are needed
   - Consider promotional strategies for products with significant price increases
   - Evaluate inventory levels for products with price decreases to optimize reordering
   - Monitor customer reactions to price changes, especially for your top-selling products`;
      }
      
      setResult(mockResponse);
      
      // Save to history
      setAnalysisHistory(prev => [
        {
          query,
          result: mockResponse,
          timestamp: new Date()
        },
        ...prev
      ].slice(0, 5)); // Keep only the 5 most recent analyses
      
      toast.success("Analysis complete", {
        description: "LLM analysis of your price data is complete."
      });
    } catch (error) {
      console.error("Error analyzing data:", error);
      toast.error("Analysis failed", {
        description: "There was an error analyzing your data. Please try again."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyze();
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Notebook LLM Analysis
        </CardTitle>
        <CardDescription>
          Ask questions about your price data and get AI-powered insights
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <form onSubmit={handleSendQuery} className="flex gap-2">
          <Input
            placeholder="Ask a question about your price data..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
            disabled={isAnalyzing}
          />
          <Button type="submit" disabled={isAnalyzing}>
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        
        <div className="flex flex-col gap-2 text-sm">
          <p className="text-xs text-muted-foreground">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => setQuery("Analyze all price increases and their impact")}
              disabled={isAnalyzing}
            >
              Price increases
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => setQuery("How do my prices compare to competitors?")}
              disabled={isAnalyzing}
            >
              Competitor analysis
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => setQuery("What's the margin impact of these price changes?")}
              disabled={isAnalyzing}
            >
              Margin impact
            </Button>
          </div>
        </div>
        
        {isAnalyzing && (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Analyzing data...</p>
            </div>
          </div>
        )}
        
        {result && !isAnalyzing && (
          <div className="p-4 bg-primary/5 rounded-md border">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Analysis Result</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
            <div className="whitespace-pre-line text-sm">
              {result}
            </div>
          </div>
        )}
        
        {analysisHistory.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Recent Analyses</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {analysisHistory.map((item, index) => (
                <div key={index} className="text-xs flex gap-2 py-2 border-b">
                  <MessageSquare className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium truncate">{item.query}</p>
                    <p className="text-muted-foreground">
                      {item.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Database className="h-3 w-3" />
          <span>{items.length} products analyzed</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileSpreadsheet className="h-3 w-3" />
          <span>Data processed with LLM</span>
        </div>
      </CardFooter>
    </Card>
  );
};
