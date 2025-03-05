
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { useMarketData } from "@/hooks/useMarketData";
import { Separator } from "./ui/separator";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { PriceItem } from "@/types/price";
import { Compass, BarChart3, LineChart as LineChartIcon, PackageOpen, Tags, Info } from "lucide-react";

export const CrossComparisonInsights = () => {
  const { items, analysis } = useFileAnalysis();
  const { crossSupplierTrends } = useMarketData(items, () => {});
  const [activeTab, setActiveTab] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (crossSupplierTrends?.categories?.length > 0 && !selectedCategory) {
      setSelectedCategory(crossSupplierTrends.categories[0]);
    }
  }, [crossSupplierTrends, selectedCategory]);

  // Prepare data for visualizations
  const getCategoryData = () => {
    if (!crossSupplierTrends) return [];
    
    return crossSupplierTrends.categoryComparisons.map(item => ({
      name: item.category,
      value: Object.values(item.suppliers).reduce((sum, supplier) => {
        return sum + (supplier.increases > 0 ? supplier.avgIncrease : 0);
      }, 0) / Math.max(1, Object.values(item.suppliers).filter(s => s.increases > 0).length)
    })).sort((a, b) => b.value - a.value);
  };
  
  const getSupplierData = () => {
    if (!crossSupplierTrends || !selectedCategory) return [];
    
    const categoryData = crossSupplierTrends.categoryComparisons.find(
      c => c.category === selectedCategory
    );
    
    if (!categoryData) return [];
    
    return Object.entries(categoryData.suppliers).map(([supplier, data]) => ({
      name: supplier,
      increases: data.increases,
      avgIncrease: data.avgIncrease.toFixed(1),
      items: data.items,
      increaseRate: ((data.increases / Math.max(1, data.items)) * 100).toFixed(0)
    })).sort((a, b) => parseFloat(b.avgIncrease) - parseFloat(a.avgIncrease));
  };
  
  // Get discontinued items insights by category
  const getDiscontinuedByCategory = () => {
    if (!items || items.length === 0) return [];
    
    const categoryCounts: Record<string, { total: number, discontinued: number }> = {};
    
    items.forEach(item => {
      if (!item.category) return;
      
      if (!categoryCounts[item.category]) {
        categoryCounts[item.category] = { total: 0, discontinued: 0 };
      }
      
      categoryCounts[item.category].total++;
      if (item.status === 'discontinued') {
        categoryCounts[item.category].discontinued++;
      }
    });
    
    return Object.entries(categoryCounts)
      .map(([category, counts]) => ({
        name: category,
        total: counts.total,
        discontinued: counts.discontinued,
        rate: ((counts.discontinued / counts.total) * 100).toFixed(1)
      }))
      .filter(item => item.discontinued > 0)
      .sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate));
  };
  
  // Get packaging trends data
  const getPackagingChanges = () => {
    if (!items || items.length === 0) return [];
    
    const packagingChanges = items.filter(
      item => item.oldPackSize && item.newPackSize && item.oldPackSize !== item.newPackSize
    );
    
    const categoryCounts: Record<string, { smaller: number, larger: number, total: number }> = {};
    
    packagingChanges.forEach(item => {
      if (!item.category) return;
      
      if (!categoryCounts[item.category]) {
        categoryCounts[item.category] = { smaller: 0, larger: 0, total: 0 };
      }
      
      const oldSize = parseFloat(item.oldPackSize?.replace(/[^\d.]/g, '') || '0');
      const newSize = parseFloat(item.newPackSize?.replace(/[^\d.]/g, '') || '0');
      
      if (newSize > oldSize) {
        categoryCounts[item.category].larger++;
      } else if (newSize < oldSize) {
        categoryCounts[item.category].smaller++;
      }
      
      categoryCounts[item.category].total++;
    });
    
    return Object.entries(categoryCounts)
      .map(([category, counts]) => ({
        name: category,
        smaller: counts.smaller,
        larger: counts.larger,
        total: counts.total
      }))
      .filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total);
  };

  const categoryData = getCategoryData();
  const supplierData = getSupplierData();
  const discontinuedData = getDiscontinuedByCategory();
  const packagingData = getPackagingChanges();
  
  if (items.length === 0) {
    return null;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <Card className="animate-fade-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" />
          Cross-Comparison Insights
        </CardTitle>
        <CardDescription>
          Compare price changes across categories, suppliers, and brands
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="categories">
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
            <TabsTrigger value="suppliers">
              <LineChartIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Suppliers</span>
            </TabsTrigger>
            <TabsTrigger value="discontinued">
              <Tags className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Discontinued</span>
            </TabsTrigger>
            <TabsTrigger value="packaging">
              <PackageOpen className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Packaging</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories">
            <div className="text-sm mb-3 text-muted-foreground">
              Average price increases by category:
            </div>
            
            {categoryData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" unit="%" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'Avg. Increase']} 
                      labelFormatter={(value) => `Category: ${value}`}
                    />
                    <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 border rounded-md bg-muted/20">
                <div className="text-center text-muted-foreground">
                  <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No category data available</p>
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Key Insights:</div>
              <ul className="text-sm text-muted-foreground space-y-1 pl-4 list-disc">
                {categoryData.slice(0, 3).map((category, index) => (
                  <li key={index}>
                    <span className="font-medium">{category.name}</span>: 
                    {category.value > 5 
                      ? ` Significant price increases (${category.value.toFixed(1)}%) - potentially a focus area for suppliers` 
                      : ` Moderate price changes (${category.value.toFixed(1)}%) - stable pricing strategy`}
                  </li>
                ))}
                {categoryData.length === 0 && (
                  <li>No significant category trends detected</li>
                )}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="suppliers">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="text-sm mb-3 text-muted-foreground">
                  Select a category to view supplier comparison:
                </div>
                <div className="flex flex-wrap gap-2">
                  {crossSupplierTrends?.categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        selectedCategory === category 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {selectedCategory && (
              <div className="text-sm font-medium">
                Supplier price changes for {selectedCategory}:
              </div>
            )}
            
            {supplierData.length > 0 ? (
              <div className="h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={supplierData} margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" unit="%" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="avgIncrease" name="Avg. Increase %" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="increases" name="# of Increases" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 border rounded-md bg-muted/20 mt-2">
                <div className="text-center text-muted-foreground">
                  <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Select a category to view supplier data</p>
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Supplier Insights:</div>
              <ul className="text-sm text-muted-foreground space-y-1 pl-4 list-disc">
                {supplierData.slice(0, 3).map((supplier, index) => (
                  <li key={index}>
                    <span className="font-medium">{supplier.name}</span>: 
                    {` ${supplier.increases} price increases (${supplier.increaseRate}% of items) with an average of ${supplier.avgIncrease}%`}
                  </li>
                ))}
                {supplierData.length === 0 && selectedCategory && (
                  <li>No supplier data available for {selectedCategory}</li>
                )}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="discontinued">
            <div className="text-sm mb-3 text-muted-foreground">
              Categories with highest discontinuation rates:
            </div>
            
            {discontinuedData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={discontinuedData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" unit="%" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip 
                      formatter={(value: number, name: string) => {
                        if (name === 'rate') return [`${value}%`, 'Discontinuation Rate'];
                        return [value, name === 'discontinued' ? 'Discontinued Items' : 'Total Items'];
                      }}
                      labelFormatter={(value) => `Category: ${value}`}
                    />
                    <Bar dataKey="rate" name="Discontinuation Rate" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 border rounded-md bg-muted/20">
                <div className="text-center text-muted-foreground">
                  <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No discontinued items data available</p>
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Discontinuation Insights:</div>
              <ul className="text-sm text-muted-foreground space-y-1 pl-4 list-disc">
                {discontinuedData.slice(0, 3).map((category, index) => (
                  <li key={index}>
                    <span className="font-medium">{category.name}</span>: 
                    {` ${category.discontinued} items discontinued (${category.rate}% of category) - may indicate product line rationalization`}
                  </li>
                ))}
                {discontinuedData.length === 0 && (
                  <li>No discontinued items detected in the price list</li>
                )}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="packaging">
            <div className="text-sm mb-3 text-muted-foreground">
              Packaging size changes by category:
            </div>
            
            {packagingData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={packagingData} margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="smaller" name="Smaller Packages" stackId="a" fill="#8884d8" />
                    <Bar dataKey="larger" name="Larger Packages" stackId="a" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 border rounded-md bg-muted/20">
                <div className="text-center text-muted-foreground">
                  <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No packaging changes detected</p>
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Packaging Insights:</div>
              <ul className="text-sm text-muted-foreground space-y-1 pl-4 list-disc">
                {packagingData.slice(0, 3).map((category, index) => (
                  <li key={index}>
                    <span className="font-medium">{category.name}</span>: 
                    {` ${category.total} package size changes (${category.smaller} smaller, ${category.larger} larger) - `}
                    {category.smaller > category.larger 
                      ? 'trend toward smaller packages may indicate hidden price increases'
                      : 'trend toward larger packages may indicate value focus'}
                  </li>
                ))}
                {packagingData.length === 0 && (
                  <li>No significant packaging changes detected</li>
                )}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
