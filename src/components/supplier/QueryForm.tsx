
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { QueryItem } from './QueryItem';

interface QueryFormProps {
  onSave: (query: Omit<QueryItem, 'id' | 'createdAt'>) => void;
}

export const QueryForm: React.FC<QueryFormProps> = ({ onSave }) => {
  const [queryText, setQueryText] = useState('');
  const [queryType, setQueryType] = useState<'general' | 'tpr' | 'pack-size' | 'discontinued'>('general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;
    
    onSave({
      text: queryText,
      status: 'pending',
      type: queryType
    });
    
    setQueryText('');
    setQueryType('general');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="queryText">Query Description</Label>
        <Textarea
          id="queryText"
          placeholder="Describe the issue or query..."
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="queryType">Query Type</Label>
        <Select 
          value={queryType} 
          onValueChange={(value) => setQueryType(value as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select query type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="tpr">TPR (Temporary Price Reduction)</SelectItem>
            <SelectItem value="pack-size">Pack Size Issue</SelectItem>
            <SelectItem value="discontinued">Discontinued Item</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Query
      </Button>
    </form>
  );
};
