
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, Line, LineChart, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Activity, PieChart as PieChartIcon, BarChart3 } from "lucide-react";

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  
  // Mock data for charts
  const priceChangeData = [
    { month: 'Jan', increases: 24, decreases: 12 },
    { month: 'Feb', increases: 18, decreases: 22 },
    { month: 'Mar', increases: 29, decreases: 7 },
    { month: 'Apr', increases: 32, decreases: 5 },
    { month: 'May', increases: 12, decreases: 18 },
    { month: 'Jun', increases: 18, decreases: 14 }
  ];
  
  const salesImpactData = [
    { day: '1', revenue: 1200 },
    { day: '5', revenue: 1900 },
    { day: '10', revenue: 1500 },
    { day: '15', revenue: 2100 },
    { day: '20', revenue: 2400 },
    { day: '25', revenue: 2200 },
    { day: '30', revenue: 2800 }
  ];
  
  const categoryDistributionData = [
    { name: 'Skincare', value: 35 },
    { name: 'Fragrance', value: 25 },
    { name: 'Makeup', value: 20 },
    { name: 'Haircare', value: 15 },
    { name: 'Other', value: 5 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const vendorPriceChangeData = [
    { vendor: 'Vendor A', avgChange: 5.2 },
    { vendor: 'Vendor B', avgChange: -2.1 },
    { vendor: 'Vendor C', avgChange: 7.8 },
    { vendor: 'Vendor D', avgChange: 1.2 },
    { vendor: 'Vendor E', avgChange: 3.5 }
  ];
  
  // Summary metrics
  const metrics = [
    { 
      title: 'Avg. Price Increase',
      value: '4.8%',
      trend: 'up',
      change: '0.6%',
      description: 'vs previous period'
    },
    { 
      title: 'Products Updated',
      value: '823',
      trend: 'up',
      change: '12%',
      description: 'last 30 days'
    },
    { 
      title: 'Revenue Impact',
      value: '$12,450',
      trend: 'up',
      change: '8.2%',
      description: 'projected monthly'
    },
    { 
      title: 'Margin Change',
      value: '-0.3%',
      trend: 'down',
      change: '0.5%',
      description: 'average reduction'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of price changes and their impact over time
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Tabs defaultValue="30d" value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="7d">7 days</TabsTrigger>
              <TabsTrigger value="30d">30 days</TabsTrigger>
              <TabsTrigger value="90d">90 days</TabsTrigger>
              <TabsTrigger value="1y">1 year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-3xl font-bold">{metric.value}</p>
                </div>
                <div className={`p-2 rounded-full ${
                  metric.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className={`h-5 w-5 text-green-600`} />
                  ) : (
                    <ArrowDownRight className={`h-5 w-5 text-red-600`} />
                  )}
                </div>
              </div>
              <div className="mt-2">
                <p className={`text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? '+' : ''}{metric.change} <span className="text-muted-foreground">{metric.description}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Price Changes Over Time
            </CardTitle>
            <CardDescription>
              Monthly price increases vs decreases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priceChangeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="increases" name="Price Increases" fill="#ef4444" />
                  <Bar dataKey="decreases" name="Price Decreases" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sales Impact
            </CardTitle>
            <CardDescription>
              Revenue trend after price changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesImpactData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Category Distribution
            </CardTitle>
            <CardDescription>
              Price changes by product category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Vendor Price Changes
            </CardTitle>
            <CardDescription>
              Average price changes by vendor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vendorPriceChangeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="vendor" type="category" />
                  <Tooltip formatter={(value) => [`${value}%`, 'Average Change']} />
                  <Bar 
                    dataKey="avgChange" 
                    name="Average Change %" 
                    fill="#8884d8"
                    barSize={20}
                    background={{ fill: '#eee' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
