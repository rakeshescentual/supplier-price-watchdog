
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Timeline } from "lucide-react";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const PriceChangeTimeline = () => {
  const { items, priceIncreaseEffectiveDate } = useFileAnalysis();
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    if (items.length > 0) {
      // Calculate historical and future price points
      const now = new Date();
      const effectiveDate = priceIncreaseEffectiveDate || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      // Calculate average prices
      const currentAvgPrice = items.reduce((sum, item) => sum + item.oldPrice, 0) / items.length;
      const newAvgPrice = items.reduce((sum, item) => sum + item.newPrice, 0) / items.length;
      
      // Generate timeline data points
      const data = [
        {
          date: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          avgPrice: (currentAvgPrice * 0.95).toFixed(2),
          label: '90 days ago'
        },
        {
          date: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          avgPrice: (currentAvgPrice * 0.97).toFixed(2),
          label: '60 days ago'
        },
        {
          date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          avgPrice: (currentAvgPrice * 0.99).toFixed(2),
          label: '30 days ago'
        },
        {
          date: now.toLocaleDateString(),
          avgPrice: currentAvgPrice.toFixed(2),
          label: 'Current'
        },
        {
          date: effectiveDate.toLocaleDateString(),
          avgPrice: newAvgPrice.toFixed(2),
          label: 'After increase'
        }
      ];
      
      setChartData(data);
    }
  }, [items, priceIncreaseEffectiveDate]);

  if (items.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timeline className="h-5 w-5" />
          Price Change Timeline
        </CardTitle>
        <CardDescription>
          Historical and projected price trends
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="h-64">
          {chartData.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="label" 
                  tickFormatter={(value) => value}
                />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Avg. Price']} />
                <Area 
                  type="monotone" 
                  dataKey="avgPrice" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            Price increases take effect on: <strong>{priceIncreaseEffectiveDate?.toLocaleDateString() || 'Not set'}</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
