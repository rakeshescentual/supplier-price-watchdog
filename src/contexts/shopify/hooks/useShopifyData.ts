
import { useState, useEffect } from 'react';
import type { PriceItem } from '@/types/price';

const mockData: PriceItem[] = [
  {
    sku: 'SKU001',
    name: 'Product 1',
    oldPrice: 19.99,
    newPrice: 24.99,
    status: 'unchanged',
    difference: 5,
    isMatched: true,
    category: 'Category 1',
    vendor: 'Supplier A'
  }
];

export const useShopifyData = () => {
  const [data, setData] = useState<PriceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate fetching data from an API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(mockData);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch data');
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return {
    data,
    isLoading,
    error
  };
};
