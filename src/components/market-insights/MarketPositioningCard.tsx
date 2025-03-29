
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { PriceItem } from "@/types/price";

interface MarketPositioningCardProps {
  items: PriceItem[];
  hasMarketData: boolean;
}

export const MarketPositioningCard = ({ items, hasMarketData }: MarketPositioningCardProps) => {
  if (!hasMarketData) return null;
  
  const positions = ['low', 'average', 'high'] as const;
  
  return (
    <div className="mt-4 space-y-3">
      <h5 className="text-sm font-medium">Price positioning:</h5>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        {positions.map(position => {
          const count = items.filter(
            item => item.marketData?.pricePosition === position
          ).length;
          
          return (
            <TooltipProvider key={position}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`p-2 rounded ${
                    position === 'low' 
                      ? 'bg-green-50 text-green-700' 
                      : position === 'average'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-orange-50 text-orange-700'
                  }`}>
                    <div className="font-medium">{count}</div>
                    <div>{position}</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{count} products positioned at {position} market price</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
};
