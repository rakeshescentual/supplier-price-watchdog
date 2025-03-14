
import { ShareDialog } from "@/components/ShareDialog";
import { useShopify } from "@/contexts/shopify";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";

export const Header = () => {
  const { isShopifyConnected, isGadgetInitialized } = useShopify();
  const { file, items, summary } = useFileAnalysis();
  
  const fileStats = items.length > 0 ? {
    totalItems: items.length,
    increasedItems: summary?.increasedItems || 0,
    decreasedItems: summary?.decreasedItems || 0
  } : undefined;
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 animate-fade-up">
      <div className="text-center md:text-left space-y-2 mb-4 md:mb-0">
        <h1 className="text-3xl font-bold tracking-tight">Price Management System</h1>
        <p className="text-lg text-muted-foreground">
          Upload your supplier price list to analyze changes and impacts
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {isShopifyConnected && (
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-100">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Shopify Connected
            </div>
          )}
          {isGadgetInitialized && (
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-100">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              Gadget Enabled
            </div>
          )}
        </div>
        
        <ShareDialog 
          fileStats={fileStats} 
          onExport={items.length > 0 ? () => {} : undefined} 
        />
      </div>
    </div>
  );
};
