
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, ArrowRight, Save } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface AddCorrespondenceFormProps {
  onSubmit: (data: {
    supplier: string;
    subject: string;
    emailContent: string;
  }) => void;
}

const emailTemplates = [
  {
    id: 'price-increase',
    name: 'Price Increase Query',
    subject: 'RE: Recent Price Increase Notification',
    template: `Dear [Supplier Name],

I hope this email finds you well. We recently received your price increase notification dated [Date].

Could you please provide additional context for the following items that have price increases significantly above the average:
- [Product 1]
- [Product 2]

We would appreciate any information on the factors driving these specific increases.

Thank you for your assistance.

Best regards,
[Your Name]`
  },
  {
    id: 'discontinued',
    name: 'Discontinued Products',
    subject: 'Query about Discontinued Products',
    template: `Dear [Supplier Name],

I am writing in reference to your recent notification about product discontinuations.

Could you please confirm if there are any alternative products that could replace:
- [Product 1]
- [Product 2]

Additionally, how long will stock be available for these items?

Thank you for your attention to this matter.

Best regards,
[Your Name]`
  },
  {
    id: 'delivery',
    name: 'Delivery Schedule',
    subject: 'Updated Delivery Schedule Request',
    template: `Dear [Supplier Name],

Following the recent price list update, we would like to request your updated delivery schedule for the coming quarter.

We are particularly interested in lead times for:
- [Product Category 1]
- [Product Category 2]

Could you also confirm if there are any expected supply constraints we should be aware of?

Thank you for your cooperation.

Best regards,
[Your Name]`
  }
];

export const AddCorrespondenceForm: React.FC<AddCorrespondenceFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    supplier: '',
    subject: '',
    emailContent: ''
  });
  const [saved, setSaved] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setSaved(false);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        subject: template.subject,
        emailContent: template.template
      }));
      setSaved(false);
    }
  };

  const saveAsDraft = () => {
    // Save to localStorage
    try {
      const drafts = JSON.parse(localStorage.getItem('emailDrafts') || '[]');
      drafts.push({
        ...formData,
        id: Date.now(),
        savedAt: new Date().toISOString()
      });
      localStorage.setItem('emailDrafts', JSON.stringify(drafts));
      setSaved(true);
      toast.success("Draft saved successfully");
    } catch (error) {
      toast.error("Failed to save draft");
      console.error("Failed to save draft:", error);
    }
  };

  const handleSubmit = () => {
    // Form validation
    if (!formData.supplier.trim()) {
      toast.error("Supplier name is required");
      return;
    }
    if (!formData.subject.trim()) {
      toast.error("Subject is required");
      return;
    }
    if (!formData.emailContent.trim()) {
      toast.error("Email content is required");
      return;
    }

    onSubmit(formData);
    setFormData({
      supplier: '',
      subject: '',
      emailContent: ''
    });
    setSaved(false);
  };

  const isFormValid = 
    formData.supplier.trim() && 
    formData.subject.trim() && 
    formData.emailContent.trim();

  return (
    <div className="space-y-4 border p-4 rounded-md bg-card">
      <h3 className="text-lg font-medium mb-4">New Correspondence</h3>
      
      <div className="space-y-2">
        <Label htmlFor="supplier">Supplier Name</Label>
        <Input
          id="supplier"
          placeholder="Enter supplier name"
          value={formData.supplier}
          onChange={handleChange}
          className="bg-background"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Enter email subject"
            value={formData.subject}
            onChange={handleChange}
            className="bg-background"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Email Template</Label>
          <Select onValueChange={handleTemplateSelect}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {emailTemplates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="emailContent">Email Content</Label>
        <Textarea
          id="emailContent"
          placeholder="Paste the email content here"
          value={formData.emailContent}
          onChange={handleChange}
          className="min-h-[200px] bg-background"
        />
      </div>
      
      <div className="flex justify-between gap-2">
        <Button 
          variant="outline" 
          onClick={saveAsDraft}
          disabled={!formData.supplier && !formData.subject && !formData.emailContent}
        >
          <Save className="mr-2 h-4 w-4" />
          Save as Draft
        </Button>
        
        <Button 
          onClick={handleSubmit} 
          className="w-full md:w-auto"
          disabled={!isFormValid}
        >
          <Mail className="mr-2 h-4 w-4" />
          Add Correspondence
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
