
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info, Check, ArrowLeft, Zap, Download, Copy } from 'lucide-react';

const GadgetMigration = () => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch('/src/assets/docs/GadgetMigrationGuide.md');
        if (!response.ok) {
          throw new Error(`Failed to load migration guide: ${response.status}`);
        }
        
        const content = await response.text();
        setMarkdownContent(content);
      } catch (err) {
        console.error('Error loading migration guide:', err);
        setError('Failed to load the migration guide. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarkdown();
  }, []);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdownContent)
      .then(() => {
        alert('Migration guide copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard. Please try again.');
      });
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <Button onClick={() => navigate(-1)} variant="outline" className="mr-2">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="flex space-x-2">
          <Button onClick={copyToClipboard} variant="outline">
            <Copy className="w-4 h-4 mr-2" /> Copy Guide
          </Button>
          <Button 
            variant="default" 
            className="bg-gradient-to-r from-purple-600 to-blue-600"
            onClick={() => window.open('https://app.gadget.dev/signup', '_blank')}
          >
            <Zap className="w-4 h-4 mr-2" /> Create Gadget App
          </Button>
        </div>
      </div>
      
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4" />
        <AlertTitle>About this guide</AlertTitle>
        <AlertDescription>
          This document provides detailed steps for migrating this application from GitHub to Gadget.dev. Follow the steps below to ensure a smooth transition.
        </AlertDescription>
      </Alert>
      
      <div className="prose prose-blue max-w-none pb-8 border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </div>
      
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Check className="text-green-500 mr-2 h-5 w-5" /> 
          Ready to start migrating?
        </h3>
        <p className="mb-4 text-gray-700">
          You've got everything you need to successfully migrate this application to Gadget.dev. Start by creating your Gadget account and following the step-by-step guide above.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => navigate('/gadget-settings')}
            variant="outline"
            className="bg-white"
          >
            Configure Gadget Connection
          </Button>
          <Button 
            onClick={() => navigate('/gadget-documentation')}
            variant="outline"
            className="bg-white"
          >
            View Integration Docs
          </Button>
          <Button 
            variant="default" 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => window.open('https://app.gadget.dev/signup', '_blank')}
          >
            <Zap className="w-4 h-4 mr-2" /> Sign up for Gadget
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GadgetMigration;
