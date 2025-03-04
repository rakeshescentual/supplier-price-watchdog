
import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, AlertTriangle, FileSearch, PlusCircle } from "lucide-react";

export const AnalysisSummary = ({
  increasedItems = 0,
  decreasedItems = 0,
  discontinuedItems = 0,
  newItems = 0,
  anomalyItems = 0,
  potentialSavings = 0,
  potentialLoss = 0,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up">
      <Card className="p-6 space-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-red-500" />
          <h3 className="font-medium">Price Increases</h3>
        </div>
        <p className="text-2xl font-bold">{increasedItems}</p>
        <p className="text-sm text-muted-foreground">
          Potential impact: ${potentialSavings.toLocaleString()}
        </p>
      </Card>
      
      <Card className="p-6 space-y-2">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-green-500" />
          <h3 className="font-medium">Price Decreases</h3>
        </div>
        <p className="text-2xl font-bold">{decreasedItems}</p>
      </Card>
      
      <Card className="p-6 space-y-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="font-medium">Discontinued Items</h3>
        </div>
        <p className="text-2xl font-bold">{discontinuedItems}</p>
        <p className="text-sm text-muted-foreground">
          Potential revenue loss: ${potentialLoss.toLocaleString()}
        </p>
      </Card>

      <Card className="p-6 space-y-2">
        <div className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-blue-500" />
          <h3 className="font-medium">New Items</h3>
        </div>
        <p className="text-2xl font-bold">{newItems}</p>
      </Card>
      
      <Card className="p-6 space-y-2">
        <div className="flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-purple-500" />
          <h3 className="font-medium">Data Anomalies</h3>
        </div>
        <p className="text-2xl font-bold">{anomalyItems}</p>
        <p className="text-sm text-muted-foreground">
          Require manual review
        </p>
      </Card>
    </div>
  );
};
