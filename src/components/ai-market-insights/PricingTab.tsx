
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw } from "lucide-react";

interface PricingTabProps {
  priceOptimizations: any[] | null;
}

export function PricingTab({ priceOptimizations }: PricingTabProps) {
  if (!priceOptimizations) {
    return (
      <div className="flex items-center justify-center p-6 h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-10 w-10 text-gray-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium mb-2">Optimizing Prices</h3>
          <p className="text-muted-foreground">
            AI is analyzing market data to suggest optimal price points...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">AI Price Recommendations</h3>
        <Button variant="outline" size="sm">
          <Download className="h-3.5 w-3.5 mr-2" />
          Export
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Suggested Price</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {priceOptimizations.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500">{item.sku}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  £{item.currentPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  £{item.recommendedPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <span className={`${
                    item.change > 0 ? 'text-green-600' : 
                    item.change < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {item.change > 0 ? '+' : ''}{item.change}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={
                    item.confidence === 'high' ? 'success' : 
                    item.confidence === 'low' ? 'outline' : 'secondary'
                  }>
                    {item.confidence}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="text-xs text-muted-foreground mt-4">
        <p>AI recommendations are based on competitor prices, market positioning, and historical sales data.</p>
      </div>
    </div>
  );
}
