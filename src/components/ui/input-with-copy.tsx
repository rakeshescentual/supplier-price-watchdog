
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface InputWithCopyProps {
  value: string;
  label?: string;
  className?: string;
  readOnly?: boolean;
}

export function InputWithCopy({ value, label, className, readOnly = true }: InputWithCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard", {
        description: "Text has been copied to your clipboard"
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Copy failed", {
        description: "Failed to copy text to clipboard"
      });
    }
  };

  return (
    <div className="relative">
      {label && <label className="text-sm font-medium mb-1 block">{label}</label>}
      <div className="flex">
        <Input
          value={value}
          readOnly={readOnly}
          className={`pr-10 ${className}`}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
