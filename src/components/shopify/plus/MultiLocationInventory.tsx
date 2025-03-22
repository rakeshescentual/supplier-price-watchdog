
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Package, RotateCcw, Search, Filter, AlertTriangle } from "lucide-react";
import { useShopify } from '@/contexts/shopify';
import { toast } from 'sonner';

interface InventoryLocation {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
  isPrimary: boolean;
}

interface InventoryItem {
  id: string;
  sku: string;
  productTitle: string;
  inventoryLevels: {
    locationId: string;
    available: number;
    incoming: number;
    committed: number;
  }[];
}

export function MultiLocationInventory() {
  const { isShopifyConnected, shopifyContext } = useShopify();
  const [locations, setLocations] = useState<InventoryLocation[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isShopifyPlus, setIsShopifyPlus] = useState(false);
  
  // Check if the user has Shopify Plus
  useEffect(() => {
    if (shopifyContext?.shopPlan === 'plus') {
      setIsShopifyPlus(true);
    }
  }, [shopifyContext]);
  
  // Load mock data for demonstration
  const loadData = async () => {
    if (!isShopifyConnected || !shopifyContext) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would fetch data from Shopify
      // For demonstration, we're using mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock locations
      const mockLocations: InventoryLocation[] = [
        {
          id: 'loc1',
          name: 'Main Warehouse',
          address: '123 Fulfillment St, London, UK',
          isActive: true,
          isPrimary: true
        },
        {
          id: 'loc2',
          name: 'Cardiff Store',
          address: '456 Shop Ave, Cardiff, UK',
          isActive: true,
          isPrimary: false
        },
        {
          id: 'loc3',
          name: 'Manchester Warehouse',
          address: '789 Supply Rd, Manchester, UK',
          isActive: true,
          isPrimary: false
        },
        {
          id: 'loc4',
          name: 'Edinburgh Pop-up',
          address: '101 Seasonal Blvd, Edinburgh, UK',
          isActive: false,
          isPrimary: false
        }
      ];
      
      // Mock inventory items
      const mockItems: InventoryItem[] = [
        {
          id: 'item1',
          sku: 'FRAG-001',
          productTitle: 'Chanel No. 5 Eau de Parfum',
          inventoryLevels: [
            { locationId: 'loc1', available: 25, incoming: 10, committed: 3 },
            { locationId: 'loc2', available: 5, incoming: 0, committed: 1 },
            { locationId: 'loc3', available: 12, incoming: 5, committed: 0 }
          ]
        },
        {
          id: 'item2',
          sku: 'FRAG-002',
          productTitle: 'Dior Sauvage Eau de Toilette',
          inventoryLevels: [
            { locationId: 'loc1', available: 18, incoming: 20, committed: 5 },
            { locationId: 'loc2', available: 7, incoming: 0, committed: 2 },
            { locationId: 'loc3', available: 9, incoming: 0, committed: 1 }
          ]
        },
        {
          id: 'item3',
          sku: 'SKIN-001',
          productTitle: 'La Mer Crème de la Mer Moisturizer',
          inventoryLevels: [
            { locationId: 'loc1', available: 10, incoming: 5, committed: 2 },
            { locationId: 'loc2', available: 3, incoming: 0, committed: 0 },
            { locationId: 'loc3', available: 4, incoming: 0, committed: 1 }
          ]
        },
        {
          id: 'item4',
          sku: 'SKIN-002',
          productTitle: 'Estée Lauder Advanced Night Repair',
          inventoryLevels: [
            { locationId: 'loc1', available: 22, incoming: 0, committed: 7 },
            { locationId: 'loc2', available: 6, incoming: 0, committed: 1 },
            { locationId: 'loc3', available: 8, incoming: 10, committed: 0 }
          ]
        }
      ];
      
      setLocations(mockLocations);
      setInventoryItems(mockItems);
      
      toast.success('Inventory data loaded', {
        description: `Loaded ${mockItems.length} items across ${mockLocations.length} locations`
      });
    } catch (error) {
      console.error('Error loading inventory data:', error);
      toast.error('Failed to load inventory data');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isShopifyConnected && isShopifyPlus) {
      loadData();
    }
  }, [isShopifyConnected, isShopifyPlus]);
  
  // Filter items based on search term
  const filteredItems = inventoryItems.filter(item => 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.productTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get total inventory for an item across all locations
  const getTotalInventory = (item: InventoryItem) => {
    return item.inventoryLevels.reduce((sum, level) => sum + level.available, 0);
  };
  
  // Get inventory level for a specific location
  const getInventoryForLocation = (item: InventoryItem, locationId: string) => {
    return item.inventoryLevels.find(level => level.locationId === locationId)?.available || 0;
  };
  
  // Check if an item has low inventory at any location
  const hasLowInventory = (item: InventoryItem) => {
    return item.inventoryLevels.some(level => level.available < 5);
  };
  
  // Render component
  if (!isShopifyConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Multi-Location Inventory
          </CardTitle>
          <CardDescription>
            Manage inventory across multiple locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6 border rounded-md bg-gray-50">
            <p className="text-muted-foreground text-center">
              Connect to Shopify to manage inventory
            </p>
          </div>
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
            Manage inventory across multiple locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 border rounded-md bg-amber-50">
            <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
            <p className="text-amber-800 text-center font-medium">
              This feature requires Shopify Plus
            </p>
            <p className="text-amber-700 text-center mt-1">
              Upgrade your Shopify plan to access multi-location inventory management
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Multi-Location Inventory
        </CardTitle>
        <CardDescription>
          Manage inventory across multiple locations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
            <p className="ml-2 text-muted-foreground">Loading inventory data...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by SKU or product name"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={loadData}
                  disabled={isLoading}
                >
                  <RotateCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Total Stock</TableHead>
                    {locations
                      .filter(loc => loc.isActive)
                      .map(location => (
                        <TableHead key={location.id} className="text-center">
                          {location.name}
                          {location.isPrimary && (
                            <Badge variant="outline" className="ml-1">Primary</Badge>
                          )}
                        </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3 + locations.filter(loc => loc.isActive).length} className="text-center py-6">
                        No items found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map(item => (
                      <TableRow key={item.id} className={hasLowInventory(item) ? 'bg-amber-50' : ''}>
                        <TableCell className="font-medium">{item.productTitle}</TableCell>
                        <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                        <TableCell className="font-medium">
                          {getTotalInventory(item)}
                          {hasLowInventory(item) && (
                            <Badge variant="warning" className="ml-2">Low Stock</Badge>
                          )}
                        </TableCell>
                        {locations
                          .filter(loc => loc.isActive)
                          .map(location => (
                            <TableCell key={location.id} className="text-center">
                              {getInventoryForLocation(item, location.id)}
                            </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          <Package className="h-4 w-4 inline-block mr-1" />
          Manage inventory across {locations.filter(loc => loc.isActive).length} active locations
        </div>
        <Button size="sm">Transfer Inventory</Button>
      </CardFooter>
    </Card>
  );
}
