
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

interface AddCorrespondenceFormProps {
  onSubmit: (data: {
    supplier: string;
    subject: string;
    emailContent: string;
  }) => void;
}

export const AddCorrespondenceForm: React.FC<AddCorrespondenceFormProps> = ({
  onSubmit
}) => {
  const [form, setForm] = useState({
    supplier: '',
    subject: '',
    emailContent: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (!form.supplier || !form.subject || !form.emailContent) {
      toast.error("Missing information", {
        description: "Please complete all fields to add a new correspondence.",
      });
      return;
    }
    
    onSubmit(form);
    setForm({ supplier: '', subject: '', emailContent: '' });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="supplier">Supplier Name</Label>
        <Input
          id="supplier"
          placeholder="Enter supplier name"
          value={form.supplier}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          placeholder="Enter email subject"
          value={form.subject}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="emailContent">Email Content</Label>
        <Textarea
          id="emailContent"
          placeholder="Paste the email content here"
          value={form.emailContent}
          onChange={handleChange}
          className="min-h-[200px]"
        />
      </div>
      
      <Button onClick={handleSubmit} className="w-full">
        <Mail className="mr-2 h-4 w-4" />
        Add Correspondence
      </Button>
    </div>
  );
};
