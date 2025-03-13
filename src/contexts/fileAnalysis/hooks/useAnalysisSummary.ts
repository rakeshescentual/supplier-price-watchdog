
import { useMemo } from "react";
import type { PriceItem } from "@/types/price";
import type { AnalysisSummary } from "../types";

const defaultSummary: AnalysisSummary = {
  totalItems: 0,
  increasedItems: 0,
  decreasedItems: 0,
  discontinuedItems: 0,
  newItems: 0,
  anomalyItems: 0,
  unchangedItems: 0,
  potentialSavings: 0,
  potentialLoss: 0
};

export const useAnalysisSummary = (items: PriceItem[]): AnalysisSummary => {
  return useMemo(() => {
    if (items.length === 0) return defaultSummary;
    
    const increased = items.filter(item => item.status === 'increased');
    const decreased = items.filter(item => item.status === 'decreased');
    const discontinued = items.filter(item => item.status === 'discontinued');
    const newItems = items.filter(item => item.status === 'new');
    const anomalies = items.filter(item => item.status === 'anomaly');
    const unchanged = items.filter(item => item.status === 'unchanged');

    return {
      totalItems: items.length,
      increasedItems: increased.length,
      decreasedItems: decreased.length,
      discontinuedItems: discontinued.length,
      newItems: newItems.length,
      anomalyItems: anomalies.length,
      unchangedItems: unchanged.length,
      potentialSavings: Math.abs(decreased.reduce((acc, item) => acc + (item.potentialImpact || 0), 0)),
      potentialLoss: Math.abs(increased.reduce((acc, item) => acc + (item.potentialImpact || 0), 0)),
    };
  }, [items]);
};
