
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { TrendingUp, AlertTriangle } from "lucide-react";

export function TrendsTab() {
  return (
    <div className="px-6 pb-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-1">Market Trend Analysis</h3>
        <p className="text-sm text-muted-foreground">
          AI-powered analysis of emerging pricing trends in your market
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Category Pricing Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-56 bg-gray-100 rounded-md flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Chart visualization of category pricing trends
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Competitor Strategy Analysis</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-56 bg-gray-100 rounded-md flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Chart visualization of competitor pricing strategies
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-3">Detected Market Trends</h4>
        
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-md">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-blue-500 mr-2" />
              <h5 className="text-sm font-medium text-blue-700">Seasonal Price Increases</h5>
            </div>
            <p className="text-xs mt-1 text-blue-600">
              Competitors are implementing 5-8% seasonal price increases across fragrance lines
            </p>
          </div>
          
          <div className="bg-green-50 p-3 rounded-md">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
              <h5 className="text-sm font-medium text-green-700">Bundle Pricing Strategy</h5>
            </div>
            <p className="text-xs mt-1 text-green-600">
              Increased adoption of product bundling offering 15-20% savings compared to individual purchases
            </p>
          </div>
          
          <div className="bg-amber-50 p-3 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
              <h5 className="text-sm font-medium text-amber-700">Discount Frequency Increasing</h5>
            </div>
            <p className="text-xs mt-1 text-amber-600">
              Competitors are running flash sales more frequently, averaging every 12 days versus 21 days in the previous quarter
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
