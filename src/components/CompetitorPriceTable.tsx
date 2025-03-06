import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, ArrowUpDown, Tag, RefreshCw } from "lucide-react";
import { CompetitorPriceItem } from "@/types/price";
import { toast } from "sonner";

interface CompetitorPriceTableProps {
  isLoading: boolean;
  data: CompetitorPriceItem[];
}

export const CompetitorPriceTable = ({ isLoading, data }: CompetitorPriceTableProps) => {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CompetitorPriceItem;
    direction: 'ascending' | 'descending';
  } | null>(null);

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    
    if (sortConfig) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    if (search) {
      const searchTerm = search.toLowerCase();
      sortableData = sortableData.filter(item => 
        item.sku.toLowerCase().includes(searchTerm) || 
        item.name.toLowerCase().includes(searchTerm)
      );
    }
    
    return sortableData;
  }, [data, sortConfig, search]);

  const requestSort = (key: keyof CompetitorPriceItem) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    }
    
    setSortConfig({ key, direction });
  };

  const handleRefresh = () => {
    toast.info("Refreshing competitor prices", {
      description: "This may take a few moments"
    });
    // In a real implementation, this would trigger a fresh scrape
    setTimeout(() => {
      toast.success("Competitor prices refreshed", {
        description: "Data is now up to date"
      });
    }, 2000);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading competitor data...</div>;
  }

  const calculatePriceDifferenceClass = (diff: number) => {
    if (diff > 5) return "text-red-500";
    if (diff < -5) return "text-green-500";
    return "text-yellow-500";
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div className="relative w-full sm:w-auto">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 w-full sm:w-64"
          />
          <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        
        <Button onClick={handleRefresh} variant="outline" className="flex gap-2 items-center">
          <RefreshCw className="h-4 w-4" />
          Refresh Prices
        </Button>
      </div>
      
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button variant="ghost" className="p-0 font-semibold" onClick={() => requestSort('sku')}>
                  SKU <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-semibold" onClick={() => requestSort('name')}>
                  Product <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-semibold" onClick={() => requestSort('retailPrice')}>
                  Our Price <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Boots</TableHead>
              <TableHead>Harrods</TableHead>
              <TableHead>Harvey Nichols</TableHead>
              <TableHead>Frasers</TableHead>
              <TableHead>Fenwick</TableHead>
              <TableHead>Selfridges</TableHead>
              <TableHead>The Fragrance Shop</TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-semibold" onClick={() => requestSort('averageDiff')}>
                  Avg Diff <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((item) => (
                <TableRow key={item.sku}>
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>${item.retailPrice.toFixed(2)}</TableCell>
                  
                  {/* Competitor prices */}
                  {Object.entries(item.competitorPrices).map(([competitor, price]) => (
                    <TableCell key={competitor} className="whitespace-nowrap">
                      {price ? (
                        <div className="flex flex-col">
                          <span>${price.toFixed(2)}</span>
                          <span className={calculatePriceDifferenceClass(item.competitorDiffs[competitor])}>
                            {item.competitorDiffs[competitor] > 0 ? '+' : ''}
                            {item.competitorDiffs[competitor].toFixed(1)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                  ))}
                  
                  <TableCell className={calculatePriceDifferenceClass(item.averageDiff)}>
                    {item.averageDiff > 0 ? '+' : ''}
                    {item.averageDiff.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={13} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    {search ? "No products match your search" : "No competitor data available"}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-2 text-sm text-muted-foreground">
        Showing {sortedData.length} of {data.length} products
      </div>
    </div>
  );
};
