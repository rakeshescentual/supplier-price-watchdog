
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useShopify } from "@/contexts/shopify";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Building2, RefreshCw, Upload, Building, AlertCircle, Users, PlusCircle, ChevronDown, Edit, Info, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ShopifyB2BPricing() {
  const { isShopifyConnected, shopifyContext, syncToShopify } = useShopify();
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [uploadingData, setUploadingData] = useState(false);
  
  const [activeTab, setActiveTab] = useState('companies');
  
  // Mock data
  const companyCustomers = [
    { id: 'comp1', name: 'Acme Corp', status: 'active', customerCount: 5, createdAt: '2023-05-15', priceList: 'Wholesale' },
    { id: 'comp2', name: 'TechGiant Inc', status: 'active', customerCount: 12, createdAt: '2023-06-22', priceList: 'Premium' },
    { id: 'comp3', name: 'Global Supplies Ltd', status: 'pending', customerCount: 3, createdAt: '2023-08-04', priceList: 'Standard' },
    { id: 'comp4', name: 'Eastern Distributors', status: 'active', customerCount: 8, createdAt: '2023-09-17', priceList: 'Wholesale' },
  ];
  
  const b2bPriceLists = [
    { id: 'price1', name: 'Wholesale', discount: '20%', productCount: 1250, customerCount: 15, lastUpdated: '2023-10-12' },
    { id: 'price2', name: 'Premium', discount: '15%', productCount: 1250, customerCount: 8, lastUpdated: '2023-11-05' },
    { id: 'price3', name: 'Standard', discount: '10%', productCount: 1250, customerCount: 22, lastUpdated: '2023-09-28' },
  ];
  
  const isPlusStore = shopifyContext?.shopPlan?.toLowerCase().includes('plus');
  
  const syncPriceLists = async () => {
    if (!isShopifyConnected) return;
    
    setIsSyncing(true);
    
    try {
      const mockData = b2bPriceLists.map(list => ({
        id: list.id,
        name: list.name,
        discount: list.discount,
        productCount: list.productCount
      }));
      
      const result = await syncToShopify(mockData);
      
      if (result) {
        toast.success("B2B price lists synchronized", { 
          description: `Successfully synced ${mockData.length} price lists to Shopify`
        });
      } else {
        toast.error("Failed to sync price lists", {
          description: "There was an error syncing price lists to Shopify"
        });
      }
    } catch (error) {
      console.error("Error syncing price lists:", error);
      toast.error("Sync failed", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  const uploadPriceFile = async () => {
    setUploadingData(true);
    
    try {
      // Mock file upload and processing
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      toast.success("Price data uploaded", {
        description: "B2B price data has been processed successfully"
      });
    } catch (error) {
      console.error("Error uploading price data:", error);
      toast.error("Upload failed", {
        description: "Could not process price data file"
      });
    } finally {
      setUploadingData(false);
    }
  };
  
  if (!isShopifyConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            B2B Pricing
          </CardTitle>
          <CardDescription>
            Manage B2B customer price lists and company accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connect to Shopify to access B2B pricing features
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  if (!isPlusStore) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            B2B Pricing
          </CardTitle>
          <CardDescription>
            Manage B2B customer price lists and company accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              B2B pricing features are only available for Shopify Plus stores
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              B2B Pricing Management
            </CardTitle>
            <CardDescription>
              Manage business customer pricing and company accounts
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={syncPriceLists} 
              disabled={isSyncing}
              variant="outline"
              size="sm"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Sync to Shopify
                </>
              )}
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                  Add Price List
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create B2B Price List</DialogTitle>
                  <DialogDescription>
                    Create a new price list for business customers
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Price List Name
                    </label>
                    <Input id="name" placeholder="e.g. Wholesale" />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="discount" className="text-sm font-medium">
                      Discount Percentage
                    </label>
                    <Input id="discount" placeholder="e.g. 15%" />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit">Create Price List</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="companies">
              <Building className="h-4 w-4 mr-1.5" />
              Companies
            </TabsTrigger>
            <TabsTrigger value="price-lists">
              <Users className="h-4 w-4 mr-1.5" />
              Price Lists
            </TabsTrigger>
            <TabsTrigger value="import">
              <Upload className="h-4 w-4 mr-1.5" />
              Import Prices
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="companies">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-sm font-medium">Company Accounts</h3>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                    Add Company
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Company Account</DialogTitle>
                    <DialogDescription>
                      Create a new B2B company account
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="company-name" className="text-sm font-medium">
                        Company Name
                      </label>
                      <Input id="company-name" placeholder="Enter company name" />
                    </div>
                    
                    <div className="grid gap-2">
                      <label htmlFor="price-list" className="text-sm font-medium">
                        Price List
                      </label>
                      <Input id="price-list" placeholder="Select price list" />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">Create Company</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price List</TableHead>
                    <TableHead>Customers</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companyCustomers.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell>
                        <Badge variant={company.status === 'active' ? 'outline' : 'secondary'}>
                          {company.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{company.priceList}</TableCell>
                      <TableCell>{company.customerCount}</TableCell>
                      <TableCell className="text-muted-foreground">{company.createdAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <ChevronDown className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="h-4 w-4 mr-2" />
                              Manage Customers
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="price-lists">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Companies</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {b2bPriceLists.map((list) => (
                    <TableRow key={list.id}>
                      <TableCell className="font-medium">{list.name}</TableCell>
                      <TableCell>{list.discount}</TableCell>
                      <TableCell>{list.productCount}</TableCell>
                      <TableCell>{list.customerCount}</TableCell>
                      <TableCell className="text-muted-foreground">{list.lastUpdated}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4 mr-1.5" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="import">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <h3 className="text-sm font-medium">Import B2B Price Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a CSV or Excel file with your B2B pricing data
                </p>
                
                <div className="flex items-center gap-3">
                  <Input type="file" className="max-w-lg" />
                  <Button 
                    onClick={uploadPriceFile}
                    disabled={uploadingData}
                  >
                    {uploadingData ? "Uploading..." : "Upload File"}
                  </Button>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="rounded-md border p-4 bg-muted/50 flex items-start gap-2">
                <Info className="h-5 w-5 mt-0.5 text-sky-500" />
                <div>
                  <h4 className="text-sm font-medium mb-1">Supported file formats</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                    <li>CSV files (.csv)</li>
                    <li>Excel files (.xlsx, .xls)</li>
                    <li>Required columns: SKU, Price, Company Code (optional)</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Building2 className="h-3.5 w-3.5" />
          B2B pricing features require Shopify Plus
        </div>
      </CardFooter>
    </Card>
  );
}
