
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import type { PriceItem } from "@/types/price";

interface PriceTableProps {
  items: PriceItem[];
}

export const PriceTable = ({ items }: PriceTableProps) => {
  const getStatusIcon = (status: PriceItem['status']) => {
    switch (status) {
      case 'increased':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'decreased':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      case 'discontinued':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Old Price</TableHead>
            <TableHead>New Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Difference</TableHead>
            <TableHead>Potential Impact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.sku}>
              <TableCell>{item.sku}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>${item.oldPrice.toFixed(2)}</TableCell>
              <TableCell>${item.newPrice.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <span className="capitalize">{item.status}</span>
                </div>
              </TableCell>
              <TableCell className={item.difference > 0 ? 'text-red-500' : 'text-green-500'}>
                {item.difference > 0 ? '+' : ''}{item.difference.toFixed(2)}%
              </TableCell>
              <TableCell>
                {item.potentialImpact ? (
                  <span className={item.potentialImpact > 0 ? 'text-red-500' : 'text-green-500'}>
                    ${Math.abs(item.potentialImpact).toLocaleString()}
                  </span>
                ) : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
