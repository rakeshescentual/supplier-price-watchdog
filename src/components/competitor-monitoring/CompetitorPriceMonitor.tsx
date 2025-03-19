
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { CompetitorPriceHistory } from "./CompetitorPriceHistory";
import { 
  Eye, 
  AlertTriangle, 
  RefreshCw, 
  TrendingDown, 
  TrendingUp, 
  Plus, 
  Globe, 
  Search,
  Clock 
} from "lucide-react";
import { toast } from "sonner";
import { CompetitorPriceItem } from "@/types/price";

// Mock data for competitive prices
const mockCompetitors = [
  "Boots", 
  "LookFantastic", 
  "Cult Beauty", 
  "FeelUnique", 
  "Debenhams", 
  "John Lewis"
];

const generateMockPriceData = (count: number): CompetitorPriceItem[] => {
  return Array(count).fill(0).map((_, index) => {
    const ourPrice = Math.round((15 + Math.random() * 85) * 100) / 100;
    
    // Generate competitor prices with some variation
    const competitorPrices: Record<string, number> = {};
    mockCompetitors.forEach(competitor => {
      // 10% chance of not having this item
      if (Math.random() > 0.1) {
        // Competitor price usually between 80% and 120% of our price
        competitorPrices[competitor] = Math.round((ourPrice * (0.8 + Math.random() * 0.4)) * 100) / 100;
      }
    });
    
    return {
      id: `cp-${index + 1}`,
      sku: `SKU-${10000 + index}`,
      name: `Competitor Product ${index + 1}`,
      oldPrice: ourPrice,
      newPrice: ourPrice,
      status: "unchanged",
      difference: 0,
      isMatched: true,
      competitorPrices,
      lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      priceHistory: Array(5).fill(0).map((_, i) => ({
        date: new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000),
        price: Math.round((ourPrice * (0.9 + Math.random() * 0.2)) * 100) / 100
      }))
    };
  });
};

export function CompetitorPriceMonitor() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<CompetitorPriceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>(mockCompetitors);
  const [isAddCompetitorOpen, setIsAddCompetitorOpen] = useState(false);
  const [newCompetitorName, setNewCompetitorName] = useState("");
  const [newCompetitorUrl, setNewCompetitorUrl] = useState("");
  const [selectedItem, setSelectedItem] = useState<CompetitorPriceItem | null>(null);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setItems(generateMockPriceData(50));
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getPriceStatus = (price: number, competitorPrice: number) => {
    const diff = ((competitorPrice - price) / price) * 100;
    
    if (diff <= -10) return "much-lower";
    if (diff < 0) return "lower";
    if (diff === 0) return "equal";
    if (diff <= 10) return "higher";
    return "much-higher";
  };
  
  const getPriceStatusBadge = (status: string) => {
    switch(status) {
      case "much-lower":
        return <Badge variant="destructive" className="flex items-center gap-1"><TrendingDown className="h-3 w-3" /> Much Lower</Badge>;
      case "lower":
        return <Badge variant="destructive" className="flex items-center gap-1"><TrendingDown className="h-3 w-3" /> Lower</Badge>;
      case "equal":
        return <Badge variant="outline">Equal</Badge>;
      case "higher":
        return <Badge variant="success" className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Higher</Badge>;
      case "much-higher":
        return <Badge variant="success" className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Much Higher</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const handleAddCompetitor = () => {
    if (!newCompetitorName.trim()) {
      toast.error("Competitor name is required");
      return;
    }
    
    // Add the new competitor
    setSelectedCompetitors([...selectedCompetitors, newCompetitorName]);
    
    toast.success("Competitor added", {
      description: `${newCompetitorName} has been added to your competitor list.`
    });
    
    // Reset form and close dialog
    setNewCompetitorName("");
    setNewCompetitorUrl("");
    setIsAddCompetitorOpen(false);
  };
  
  const refreshData = () => {
    setIsLoading(true);
    
    // Simulate refreshing data
    setTimeout(() => {
      setItems(generateMockPriceData(50));
      setIsLoading(false);
      
      toast.success("Data refreshed", {
        description: "Latest competitor prices have been loaded."
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Competitor Price Monitor</CardTitle>
              <CardDescription>
                Track and analyze competitor pricing for your products
              </CardDescription>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAddCompetitorOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Competitor
              </Button>
              
              <Button 
                variant="default" 
                size="sm" 
                onClick={refreshData}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? "Refreshing..." : "Refresh Prices"}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6 flex items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product name or SKU..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="border rounded-md">
            <Tabs defaultValue="table">
              <TabsList className="p-1 mx-1 mt-1">
                <TabsTrigger value="table">Price Table</TabsTrigger>
                <TabsTrigger value="history" disabled={!selectedItem}>
                  Price History
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="table" className="p-0">
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow>
                        <TableHead className="w-[250px]">Product</TableHead>
                        <TableHead className="text-right">Our Price</TableHead>
                        {selectedCompetitors.map(competitor => (
                          <TableHead key={competitor} className="text-right">
                            {competitor}
                          </TableHead>
                        ))}
                        <TableHead className="text-right">Last Updated</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    
                    <TableBody>
                      {isLoading ? (
                        Array(10).fill(0).map((_, index) => (
                          <TableRow key={`skeleton-${index}`}>
                            <TableCell>
                              <Skeleton className="h-5 w-40" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Skeleton className="h-5 w-16 ml-auto" />
                            </TableCell>
                            {selectedCompetitors.map((competitor, i) => (
                              <TableCell key={`${competitor}-${index}`} className="text-right">
                                <Skeleton className="h-5 w-20 ml-auto" />
                              </TableCell>
                            ))}
                            <TableCell className="text-right">
                              <Skeleton className="h-5 w-24 ml-auto" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.sku}</div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              £{item.newPrice.toFixed(2)}
                            </TableCell>
                            {selectedCompetitors.map(competitor => {
                              const price = item.competitorPrices?.[competitor];
                              return (
                                <TableCell key={`${item.id}-${competitor}`} className="text-right">
                                  {price !== undefined ? (
                                    <div>
                                      <div>£{price.toFixed(2)}</div>
                                      <div className="mt-1">
                                        {getPriceStatusBadge(getPriceStatus(item.newPrice, price))}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground text-sm">N/A</span>
                                  )}
                                </TableCell>
                              );
                            })}
                            <TableCell className="text-right text-muted-foreground text-sm">
                              <div className="flex items-center justify-end gap-1">
                                <Clock className="h-3 w-3" />
                                {item.lastUpdated?.toLocaleDateString() || "Unknown"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="rounded-full p-0 h-8 w-8"
                                onClick={() => setSelectedItem(item)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3 + selectedCompetitors.length} className="text-center py-8">
                            <div className="flex items-center justify-center flex-col">
                              <SearchIcon className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">No matching products found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="history">
                {selectedItem && (
                  <CompetitorPriceHistory item={selectedItem} competitors={selectedCompetitors} />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredItems.length} of {items.length} products
          </div>
          
          <div className="text-sm">
            <span className="font-medium">Selected Competitors:</span>{" "}
            {selectedCompetitors.length}
          </div>
        </CardFooter>
      </Card>
      
      <AlertDialog open={isAddCompetitorOpen} onOpenChange={setIsAddCompetitorOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Competitor</AlertDialogTitle>
            <AlertDialogDescription>
              Add a new competitor to track prices across your products.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="competitor-name" className="text-sm font-medium">
                Competitor Name
              </label>
              <Input
                id="competitor-name"
                placeholder="e.g., Competitor, Inc."
                value={newCompetitorName}
                onChange={(e) => setNewCompetitorName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="competitor-url" className="text-sm font-medium">
                Website URL (Optional)
              </label>
              <div className="flex">
                <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="competitor-url"
                  className="rounded-l-none"
                  placeholder="www.competitor.com"
                  value={newCompetitorUrl}
                  onChange={(e) => setNewCompetitorUrl(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddCompetitor}>
              Add Competitor
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Placeholder icons for elements not from lucide-react
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
