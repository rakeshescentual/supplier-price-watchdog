
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
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  ArrowUpDown, 
  Tag, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  ChevronLeft 
} from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Calculate pagination values
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 animate-pulse">
        <div className="space-y-4 w-full max-w-md">
          <div className="h-8 bg-muted rounded w-3/4 mx-auto"></div>
          <div className="h-64 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  const calculatePriceDifferenceClass = (diff: number) => {
    if (diff > 5) return "text-red-500 font-medium";
    if (diff < -5) return "text-green-500 font-medium";
    return "text-yellow-500 font-medium";
  };

  const renderPriceBadge = (diff: number) => {
    if (diff > 5) {
      return <Badge variant="destructive" className="ml-1">High</Badge>;
    }
    if (diff < -5) {
      return <Badge variant="success" className="ml-1 bg-green-500">Low</Badge>;
    }
    return <Badge variant="outline" className="ml-1">Competitive</Badge>;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 w-full sm:w-64"
          />
          <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        
        <Button onClick={handleRefresh} variant="outline" className="flex gap-2 items-center w-full sm:w-auto">
          <RefreshCw className="h-4 w-4" />
          Refresh Prices
        </Button>
      </div>
      
      {/* Mobile card view for small screens */}
      <div className="md:hidden space-y-4">
        {paginatedData.length > 0 ? (
          paginatedData.map((item) => (
            <div key={item.sku} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.sku}</p>
                </div>
                <div className={calculatePriceDifferenceClass(item.averageDiff)}>
                  {item.averageDiff > 0 ? '+' : ''}
                  {item.averageDiff.toFixed(1)}%
                  {renderPriceBadge(item.averageDiff)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="p-2 bg-muted rounded">
                  <p className="text-xs text-muted-foreground">Our Price</p>
                  <p className="font-medium">${item.retailPrice.toFixed(2)}</p>
                </div>

                {Object.entries(item.competitorPrices)
                  .filter(([_, price]) => price !== null)
                  .slice(0, 2)
                  .map(([competitor, price]) => (
                    <div key={competitor} className="p-2 bg-muted rounded">
                      <p className="text-xs text-muted-foreground">{competitor}</p>
                      <p className="font-medium">${price?.toFixed(2)}</p>
                      <span className={calculatePriceDifferenceClass(item.competitorDiffs[competitor])}>
                        {item.competitorDiffs[competitor] > 0 ? '+' : ''}
                        {item.competitorDiffs[competitor].toFixed(1)}%
                      </span>
                    </div>
                  ))
                }
              </div>

              <Button variant="ghost" size="sm" className="w-full mt-2">
                View All Competitors
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <div className="border rounded-lg p-6 text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">
              {search ? "No products match your search" : "No competitor data available"}
            </p>
          </div>
        )}
      </div>
      
      {/* Desktop table view */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
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
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <TableRow key={item.sku} className="hover:bg-accent/30">
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate" title={item.name}>
                      {item.name}
                    </div>
                  </TableCell>
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
                  
                  <TableCell>
                    <div className="flex items-center">
                      <span className={calculatePriceDifferenceClass(item.averageDiff)}>
                        {item.averageDiff > 0 ? '+' : ''}
                        {item.averageDiff.toFixed(1)}%
                      </span>
                      {renderPriceBadge(item.averageDiff)}
                    </div>
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
      
      {/* Pagination controls */}
      {sortedData.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} products
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {sortedData.length === 0 ? null : (
        <div className="text-sm text-muted-foreground mt-2">
          {search ? `Found ${sortedData.length} of ${data.length} products matching "${search}"` : `Showing ${sortedData.length} products`}
        </div>
      )}
    </div>
  );
};
