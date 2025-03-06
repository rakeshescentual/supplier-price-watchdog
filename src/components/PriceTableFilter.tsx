
import { useState } from "react";
import { Search, Filter, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { PriceItem } from "@/types/price";

interface PriceTableFilterProps {
  onFilterChange: (filters: PriceItemFilters) => void;
}

export interface PriceItemFilters {
  search: string;
  statuses: PriceItem['status'][];
  minDifference?: number;
  maxDifference?: number;
}

export const PriceTableFilter = ({ onFilterChange }: PriceTableFilterProps) => {
  const [search, setSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<PriceItem['status'][]>([
    'increased', 'decreased', 'new', 'discontinued', 'anomaly'
  ]);
  const [minDifference, setMinDifference] = useState<string>("");
  const [maxDifference, setMaxDifference] = useState<string>("");
  
  const handleStatusToggle = (status: PriceItem['status']) => {
    setSelectedStatuses(prev => {
      const newStatuses = prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status];
      
      onFilterChange({
        search,
        statuses: newStatuses,
        minDifference: minDifference ? parseFloat(minDifference) : undefined,
        maxDifference: maxDifference ? parseFloat(maxDifference) : undefined,
      });
      
      return newStatuses;
    });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    onFilterChange({
      search: newSearch,
      statuses: selectedStatuses,
      minDifference: minDifference ? parseFloat(minDifference) : undefined,
      maxDifference: maxDifference ? parseFloat(maxDifference) : undefined,
    });
  };
  
  const handleDifferenceChange = (type: 'min' | 'max', value: string) => {
    if (type === 'min') {
      setMinDifference(value);
    } else {
      setMaxDifference(value);
    }
    
    onFilterChange({
      search,
      statuses: selectedStatuses,
      minDifference: type === 'min' && value ? parseFloat(value) : minDifference ? parseFloat(minDifference) : undefined,
      maxDifference: type === 'max' && value ? parseFloat(value) : maxDifference ? parseFloat(maxDifference) : undefined,
    });
  };
  
  const handleClearDifferenceFilters = () => {
    setMinDifference("");
    setMaxDifference("");
    onFilterChange({
      search,
      statuses: selectedStatuses,
      minDifference: undefined,
      maxDifference: undefined,
    });
  };
  
  const hasDifferenceFilters = !!minDifference || !!maxDifference;
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={handleSearchChange}
          className="pl-9"
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter Status
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={selectedStatuses.includes('increased')}
            onCheckedChange={() => handleStatusToggle('increased')}
          >
            Price Increases
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedStatuses.includes('decreased')}
            onCheckedChange={() => handleStatusToggle('decreased')}
          >
            Price Decreases
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedStatuses.includes('new')}
            onCheckedChange={() => handleStatusToggle('new')}
          >
            New Products
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedStatuses.includes('discontinued')}
            onCheckedChange={() => handleStatusToggle('discontinued')}
          >
            Discontinued
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedStatuses.includes('anomaly')}
            onCheckedChange={() => handleStatusToggle('anomaly')}
          >
            Anomalies
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Sheet>
        <SheetTrigger asChild>
          <Button variant={hasDifferenceFilters ? "default" : "outline"} className="gap-2">
            <Percent className="h-4 w-4" />
            {hasDifferenceFilters ? "Filtered by %" : "Filter by %"}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter by Price Difference %</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="min-difference" className="text-sm font-medium">
                Minimum Difference %
              </label>
              <Input
                id="min-difference"
                type="number"
                placeholder="e.g. -10 for 10% decrease"
                value={minDifference}
                onChange={(e) => handleDifferenceChange('min', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="max-difference" className="text-sm font-medium">
                Maximum Difference %
              </label>
              <Input
                id="max-difference"
                type="number"
                placeholder="e.g. 15 for 15% increase"
                value={maxDifference}
                onChange={(e) => handleDifferenceChange('max', e.target.value)}
              />
            </div>
            
            {hasDifferenceFilters && (
              <Button 
                variant="outline" 
                className="mt-4 w-full"
                onClick={handleClearDifferenceFilters}
              >
                Clear % Filters
              </Button>
            )}
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Negative values filter price decreases</p>
              <p>Positive values filter price increases</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
