
import { Info, FileUp, Brain, RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useShopify } from "@/contexts/shopify";
import { RecentAnalysesList } from "./RecentAnalysesList";

interface HowItWorksProps {
  savedAnalyses: Array<{
    id: string;
    date: string;
    fileName: string;
    itemCount: number;
    summary: { increasedItems: number; decreasedItems: number }
  }>;
}

export const HowItWorks = ({ savedAnalyses }: HowItWorksProps) => {
  const { isShopifyConnected, isGadgetInitialized } = useShopify();

  return (
    <div className="text-center mt-12 p-8 border rounded-lg bg-muted/30 shadow-sm animate-fade-in">
      <Info className="h-12 w-12 text-primary mx-auto mb-4 opacity-80" />
      <h3 className="text-2xl font-medium mb-4">How it works</h3>
      <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
        Upload your supplier price list (Excel or PDF) to compare old vs new prices. 
        Supplier Price Watch will analyze price changes, identify anomalies, and calculate the potential impact on your business.
        {isShopifyConnected && " It also integrates with your Shopify store to provide tailored insights."}
        {isGadgetInitialized && " Gadget.dev integration enhances PDF processing and data enrichment capabilities."}
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
        <div className="bg-background rounded-lg p-6 shadow-sm hover:shadow transition-all">
          <div className="bg-primary/10 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <FileUp className="h-8 w-8 text-primary" />
          </div>
          <h4 className="font-medium mb-2">Upload file</h4>
          <p className="text-sm text-muted-foreground">
            Upload your Excel or PDF price lists to start the analysis process
          </p>
        </div>
        
        <div className="bg-background rounded-lg p-6 shadow-sm hover:shadow transition-all">
          <div className="bg-primary/10 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h4 className="font-medium mb-2">AI Analysis</h4>
          <p className="text-sm text-muted-foreground">
            Our system automatically analyzes price changes and provides insights
          </p>
        </div>
        
        <div className="bg-background rounded-lg p-6 shadow-sm hover:shadow transition-all">
          <div className="bg-primary/10 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <RefreshCw className="h-8 w-8 text-primary" />
          </div>
          <h4 className="font-medium mb-2">Sync to Shopify</h4>
          <p className="text-sm text-muted-foreground">
            Easily sync price updates directly to your Shopify store
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center mt-6 gap-3">
        <Button variant="outline" size="lg" asChild className="font-medium">
          <Link to="/documentation" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            View Documentation
          </Link>
        </Button>
        
        {isGadgetInitialized && (
          <Button 
            variant="outline" 
            size="lg"
            className="border-blue-200 text-blue-700 hover:bg-blue-50 font-medium" 
            asChild
          >
            <Link to="/gadget-documentation" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Gadget Integration
            </Link>
          </Button>
        )}
      </div>
      
      {savedAnalyses.length > 0 && (
        <div className="mt-12">
          <RecentAnalysesList savedAnalyses={savedAnalyses} />
        </div>
      )}
    </div>
  );
};
