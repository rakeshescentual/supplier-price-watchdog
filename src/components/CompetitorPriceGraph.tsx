
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { HistoricalPriceData } from "@/types/price";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CompetitorPriceGraphProps {
  isLoading: boolean;
  historicalData: HistoricalPriceData[];
}

export const CompetitorPriceGraph = ({ isLoading, historicalData }: CompetitorPriceGraphProps) => {
  const [selectedProduct, setSelectedProduct] = useState<string>(
    historicalData.length > 0 ? historicalData[0].id : ""
  );
  
  const [timeRange, setTimeRange] = useState<string>("30");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Get the selected product data
  const productData = historicalData.find(p => p.id === selectedProduct);
  const competitorNames = productData 
    ? Object.keys(productData.prices[0]).filter(key => key !== 'date' && key !== 'our_price')
    : [];

  // Filter data by time range (in days)
  const filteredData = productData?.prices
    ? productData.prices
        .slice(-parseInt(timeRange))
        .map(item => ({
          ...item,
          date: new Date(item.date).toLocaleDateString()
        }))
    : [];

  // Generate unique colors for each competitor
  const generateLineColor = (index: number) => {
    const colors = [
      "#8884d8", // purple
      "#82ca9d", // green
      "#ffc658", // yellow
      "#ff7300", // orange
      "#0088fe", // blue
      "#00C49F", // teal
      "#FF8042", // coral
      "#FFBB28", // amber
      "#FF00FF", // magenta
      "#00C5CD", // turquoise
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {historicalData.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="365">1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {productData ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{productData.name}</CardTitle>
            <CardDescription>
              Price history compared to {competitorNames.length} competitors over the past {timeRange} days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={filteredData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, ""]} />
                  <Legend />
                  
                  {/* Our price line - always highlighted */}
                  <Line
                    type="monotone"
                    dataKey="our_price"
                    name="Our Price"
                    stroke="#ff0000"
                    strokeWidth={2}
                    dot={{ r: 1 }}
                    activeDot={{ r: 6 }}
                  />
                  
                  {/* Competitor price lines */}
                  {competitorNames.map((competitor, index) => (
                    <Line
                      key={competitor}
                      type="monotone"
                      dataKey={competitor}
                      name={competitor}
                      stroke={generateLineColor(index)}
                      dot={{ r: 0 }}
                      activeDot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Historical Data</CardTitle>
            <CardDescription>
              We don't have enough historical data to display a graph yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Price history will appear once we've collected multiple days of data.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
