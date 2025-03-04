
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, AlertTriangle, AlertCircle, PlusCircle } from "lucide-react";
import type { PriceItem } from "@/types/price";
import { Badge } from "./ui/badge";

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
      case 'new':
        return <PlusCircle className="w-4 h-4 text-blue-500" />;
      case 'anomaly':
        return <AlertCircle className="w-4 h-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const renderAnomalyBadges = (item: PriceItem) => {
    if (!item.anomalyType || item.anomalyType.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {item.anomalyType.includes('name_change') && (
          <Badge variant="outline" className="text-xs bg-purple-50">Name Change</Badge>
        )}
        {item.anomalyType.includes('supplier_code_change') && (
          <Badge variant="outline" className="text-xs bg-blue-50">Code Change</Badge>
        )}
        {item.anomalyType.includes('barcode_change') && (
          <Badge variant="outline" className="text-xs bg-amber-50">Barcode Change</Badge>
        )}
        {item.anomalyType.includes('pack_size_change') && (
          <Badge variant="outline" className="text-xs bg-green-50">Pack Size Change</Badge>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Old Price</TableHead>
              <TableHead>New Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Difference</TableHead>
              <TableHead>Supplier Code</TableHead>
              <TableHead>Pack Size</TableHead>
              <TableHead>Margin</TableHead>
              <TableHead>Potential Impact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow 
                key={item.sku} 
                className={
                  item.status === 'anomaly' 
                    ? 'bg-purple-50 hover:bg-purple-100'
                    : item.status === 'new'
                    ? 'bg-blue-50 hover:bg-blue-100'
                    : undefined
                }
              >
                <TableCell>{item.sku}</TableCell>
                <TableCell>
                  <div className={item.oldTitle !== item.newTitle && item.oldTitle && item.newTitle ? 'relative' : ''}>
                    {item.name}
                    {item.oldTitle !== item.newTitle && item.oldTitle && item.newTitle && (
                      <div className="text-xs text-muted-foreground mt-1">
                        <span className="line-through">{item.oldTitle}</span> → {item.newTitle}
                      </div>
                    )}
                    {renderAnomalyBadges(item)}
                  </div>
                </TableCell>
                <TableCell>${item.oldPrice.toFixed(2)}</TableCell>
                <TableCell>${item.newPrice.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="capitalize">{item.status}</span>
                  </div>
                </TableCell>
                <TableCell className={item.difference > 0 ? 'text-red-500' : item.difference < 0 ? 'text-green-500' : ''}>
                  {item.difference > 0 ? '+' : ''}{item.difference.toFixed(2)}%
                </TableCell>
                <TableCell>
                  {item.oldSupplierCode !== item.newSupplierCode && item.oldSupplierCode && item.newSupplierCode ? (
                    <div>
                      <span className="line-through text-xs text-muted-foreground">{item.oldSupplierCode}</span>
                      <span className="text-xs"> → </span>
                      <span>{item.newSupplierCode}</span>
                    </div>
                  ) : (
                    item.newSupplierCode || item.oldSupplierCode || '-'
                  )}
                </TableCell>
                <TableCell>
                  {item.oldPackSize !== item.newPackSize && item.oldPackSize && item.newPackSize ? (
                    <div>
                      <span className="line-through text-xs text-muted-foreground">{item.oldPackSize}</span>
                      <span className="text-xs"> → </span>
                      <span>{item.newPackSize}</span>
                    </div>
                  ) : (
                    item.newPackSize || item.oldPackSize || '-'
                  )}
                </TableCell>
                <TableCell>
                  {item.oldMargin !== undefined && item.newMargin !== undefined ? (
                    <div>
                      <div className={
                        item.marginChange && item.marginChange < 0 ? 'text-red-500' : 
                        item.marginChange && item.marginChange > 0 ? 'text-green-500' : ''
                      }>
                        {item.newMargin.toFixed(1)}%
                        {item.marginChange ? 
                          <span className="text-xs ml-1">
                            ({item.marginChange > 0 ? '+' : ''}{item.marginChange.toFixed(1)}%)
                          </span> : null
                        }
                      </div>
                    </div>
                  ) : '-'}
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
    </div>
  );
};
