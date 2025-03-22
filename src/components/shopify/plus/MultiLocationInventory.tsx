
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info, MapPin, Plus, RefreshCw, Store, AlertTriangle } from "lucide-react";
import { toast } from 'sonner';
import { useShopify } from '@/contexts/shopify';

// Mock data for demonstration
const MOCK_LOCATIONS = [
  { id: 'loc1', name: 'Main Warehouse', address: 'London, UK', isActive: true },
  { id: 'loc2', name: 'Cardiff Store', address: 'Cardiff, UK', isActive: true },
  { id: 'loc3', name: 'Manchester Store', address: 'Manchester, UK', isActive: true },
  { id: 'loc4', name: 'Temporary Popup', address: 'Birmingham, UK', isActive: false }
];

const MOCK_INVENTORY = [
  { id: 'inv1', locationId: 'loc1', productId: 'prod1', sku: 'ESC001', name: 'Chanel No. 5', available: 24, onOrder: 10 },
  { id: 'inv2', locationId: 'loc1', productId: 'prod2', sku: 'ESC002', name: 'Dior Sauvage', available: 35, onOrder: 0 },
  { id: 'inv3', locationId: 'loc2', productId: 'prod1', sku: 'ESC001', name: 'Chanel No. 5', available: 5, onOrder: 0 },
  { id: 'inv4', locationId: 'loc2', productId: 'prod2', sku: 'ESC002', name: 'Dior Sauvage', available: 7, onOrder: 5 },
  { id: 'inv5', locationId: 'loc3', productId: 'prod1', sku: 'ESC001', name: 'Chanel No. 5', available: 12, onOrder: 0 },
  { id: 'inv6', locationId: 'loc4', productId: 'prod3', sku: 'ESC003', name: 'Tom Ford Tobacco Vanille', available: 3, onOrder: 0 }
];

export function MultiLocationInventory() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [locations, setLocations] = useState(MOCK_LOCATIONS);
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory');
  
  // Check if the user has Shopify Plus
  const isShopifyPlus = shopifyContext?.shopPlan === 'plus';
  
  const refreshInventory = async () => {
    if (!isShopifyConnected) {
      toast.error('Not connected to Shopify');
      return;
    }
    
    setIsLoading(true);
    try {
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Inventory refreshed', {
        description: 'The latest inventory data has been loaded'
      });
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast.error('Failed to refresh inventory');
    } finally {
      setIsLoading(false);
    }
  };
  
  const addLocation = () => {
    toast.info('Add Location', {
      description: 'This would open a form to add a new location in a real implementation'
    });
  };
  
  // Generate inventory by location
  const getInventoryByLocation = (locationId: string) => {
    return inventory.filter(item => item.locationId === locationId);
  };
  
  // Get inventory summary counts
  const getInventorySummary = () => {
    const totalProducts = inventory.length;
    const lowStock = inventory.filter(item => item.available < 5).length;
    const outOfStock = inventory.filter(item => item.available === 0).length;
    
    return { totalProducts, lowStock, outOfStock };
  };
  
  const summary = getInventorySummary();
  
  if (!isShopifyConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Multi-Location Inventory
          </CardTitle>
          <CardDescription>
            Manage inventory across all your Shopify locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Connect to Shopify to manage multi-location inventory
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  if (!isShopifyPlus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Multi-Location Inventory
          </CardTitle>
          <CardDescription>
            Manage inventory across all your Shopify locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Multi-location inventory management is a Shopify Plus feature. Upgrade your Shopify plan to access these features.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Multi-Location Inventory
            </CardTitle>
            <CardDescription>
              Manage inventory across all your Shopify locations
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refreshInventory} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button size="sm" onClick={addLocation}>
              <Plus className="h-4 w-4 mr-1" />
              Add Location
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-100 rounded-md p-4">
            <div className="text-sm font-medium text-green-600 mb-1">Total Inventory Items</div>
            <div className="text-2xl font-bold">{summary.totalProducts}</div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-md p-4">
            <div className="text-sm font-medium text-amber-600 mb-1">Low Stock Items</div>
            <div className="text-2xl font-bold">{summary.lowStock}</div>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-md p-4">
            <div className="text-sm font-medium text-red-600 mb-1">Out of Stock Items</div>
            <div className="text-2xl font-bold">{summary.outOfStock}</div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inventory">
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>On Order</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map(item => {
                    const location = locations.find(loc => loc.id === item.locationId);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Store className="h-3 w-3" />
                            {location?.name || 'Unknown'}
                          </div>
                        </TableCell>
                        <TableCell>{item.available}</TableCell>
                        <TableCell>{item.onOrder}</TableCell>
                        <TableCell>
                          {item.available === 0 ? (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Out of Stock
                            </Badge>
                          ) : item.available < 5 ? (
                            <Badge variant="warning" className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge variant="success">In Stock</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="locations">
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Inventory Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locations.map(location => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">{location.name}</TableCell>
                      <TableCell>{location.address}</TableCell>
                      <TableCell>
                        {location.isActive ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {getInventoryByLocation(location.id).length} items
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-4">
        <div>
          <Info className="h-4 w-4 inline-block mr-1" />
          Inventory data last updated {new Date().toLocaleString()}
        </div>
        <div>
          Powered by Shopify Plus Multi-Location Inventory
        </div>
      </CardFooter>
    </Card>
  );
}
