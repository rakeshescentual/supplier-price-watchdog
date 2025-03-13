
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { PriceIncreaseNotification } from "@/components/PriceIncreaseNotification";
import { EscentualIntegration } from "@/components/EscentualIntegration";
import { PriceTable } from "@/components/PriceTable";
import { AlertTriangle } from "lucide-react";

export const NotificationsTabContent = () => {
  const { items } = useFileAnalysis();
  const increasedItems = items.filter(item => item.status === 'increased');

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PriceIncreaseNotification />
        <EscentualIntegration />
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground bg-amber-50 p-3 rounded-md">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <p>
          Notify customers about upcoming price increases to create urgency and give them a chance to buy at the current price.
          Export HTML snippets to display notices on your Escentual.com product pages.
        </p>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Products with Price Increases</h3>
        <PriceTable items={increasedItems} />
      </div>
    </>
  );
};
