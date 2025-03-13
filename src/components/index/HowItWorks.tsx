
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
    <div className="text-center mt-12 p-8 border rounded-lg bg-muted/30">
      <Info className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-xl font-medium mb-2">How it works</h3>
      <p className="text-muted-foreground max-w-xl mx-auto">
        Upload your supplier price list (Excel or PDF) to compare old vs new prices. 
        Supplier Price Watch will analyze price changes, identify anomalies, and calculate the potential impact on your business.
        {isShopifyConnected && " It also integrates with your Shopify store to provide tailored insights."}
        {isGadgetInitialized && " Gadget.dev integration enhances PDF processing and data enrichment capabilities."}
      </p>
      <div className="flex flex-wrap gap-4 justify-center mt-6">
        <div className="text-center">
          <div className="bg-primary/10 rounded-full p-3 mx-auto mb-2 w-12 h-12 flex items-center justify-center">
            <FileUp className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-medium">Upload file</p>
        </div>
        <div className="text-center">
          <div className="bg-primary/10 rounded-full p-3 mx-auto mb-2 w-12 h-12 flex items-center justify-center">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-medium">AI Analysis</p>
        </div>
        <div className="text-center">
          <div className="bg-primary/10 rounded-full p-3 mx-auto mb-2 w-12 h-12 flex items-center justify-center">
            <RefreshCw className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-medium">Sync to Shopify</p>
        </div>
      </div>
      
      <div className="flex justify-center mt-6 gap-3">
        <Button variant="outline" asChild>
          <Link to="/documentation" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            View Documentation
          </Link>
        </Button>
        
        {isGadgetInitialized && (
          <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50" asChild>
            <Link to="/gadget-documentation" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Gadget Integration
            </Link>
          </Button>
        )}
      </div>
      
      {savedAnalyses.length > 0 && <RecentAnalysesList savedAnalyses={savedAnalyses} />}
    </div>
  );
};
