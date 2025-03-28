
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle } from 'lucide-react';

interface QueryFormProps {
  onSave: (query: { text: string; status: 'pending'; type: string }) => void;
}

export const QueryForm: React.FC<QueryFormProps> = ({ onSave }) => {
  const [queryText, setQueryText] = useState('');
  const [queryType, setQueryType] = useState('price');
  
  const handleSubmit = () => {
    if (!queryText.trim()) return;
    
    onSave({
      text: queryText,
      status: 'pending',
      type: queryType
    });
    
    setQueryText('');
    setQueryType('price');
  };
  
  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Enter your product query..."
        value={queryText}
        onChange={(e) => setQueryText(e.target.value)}
        className="min-h-[100px]"
      />
      
      <div className="flex flex-wrap gap-2">
        <Button 
          type="button" 
          variant={queryType === 'price' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setQueryType('price')}
        >
          Price
        </Button>
        <Button 
          type="button" 
          variant={queryType === 'pack-size' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setQueryType('pack-size')}
        >
          Pack Size
        </Button>
        <Button 
          type="button" 
          variant={queryType === 'barcode' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setQueryType('barcode')}
        >
          Barcode
        </Button>
        <Button 
          type="button" 
          variant={queryType === 'tpr' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setQueryType('tpr')}
        >
          TPR
        </Button>
      </div>
      
      <Button 
        onClick={handleSubmit}
        disabled={!queryText.trim()}
        className="w-full"
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        Add Query
      </Button>
    </div>
  );
};
