export interface CompetitorPriceItem {
  id: string;
  sku: string;
  name: string;
  retailPrice: number;
  competitorPrices: {
    [key: string]: number | null; // e.g., "Boots": 19.99, "Harrods": null (not available)
  };
  competitorDiffs: {
    [key: string]: number; // percentage difference vs. our price
  };
  averageDiff: number; // average percentage difference across all competitors
  lastUpdated: string;
  crawlId?: string;
  category?: string;
  priceHistory?: {
    date: Date;
    price: number;
  }[];
}
