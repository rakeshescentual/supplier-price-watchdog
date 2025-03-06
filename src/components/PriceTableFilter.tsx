
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  
  const handleStatusToggle = (status: PriceItem['status']) => {
    setSelectedStatuses(prev => {
      const newStatuses = prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status];
      
      onFilterChange({
        search,
        statuses: newStatuses,
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
    });
  };
  
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
            Filter
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
    </div>
  );
};
