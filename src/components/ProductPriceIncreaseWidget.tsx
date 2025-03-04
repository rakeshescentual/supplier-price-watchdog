
import { PriceItem } from "@/types/price";

interface ProductPriceIncreaseWidgetProps {
  item: PriceItem;
  effectiveDate: Date;
}

export const ProductPriceIncreaseWidget = ({ 
  item, 
  effectiveDate 
}: ProductPriceIncreaseWidgetProps) => {
  if (item.status !== 'increased') {
    return null;
  }
  
  const formattedDate = effectiveDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  });

  return (
    <div className="text-sm border border-amber-200 bg-amber-50 p-3 rounded-md my-2">
      <p className="font-medium text-amber-800">
        Price increase coming soon
      </p>
      <p className="text-amber-700">
        From <span className="font-medium">{formattedDate}</span>, 
        the price of {item.name} will increase from 
        <span className="font-medium"> £{item.oldPrice.toFixed(2)}</span> to
        <span className="font-medium"> £{item.newPrice.toFixed(2)}</span>.
      </p>
    </div>
  );
};
