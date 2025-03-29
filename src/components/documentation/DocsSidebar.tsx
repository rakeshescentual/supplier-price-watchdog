
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { HelpCircle, X, ChevronRight, Search, BookOpen, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLocation } from 'react-router-dom';

interface DocsSidebarProps {
  open: boolean;
  onClose: () => void;
}

const DocsSidebar: React.FC<DocsSidebarProps> = ({ open, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentRoute, setCurrentRoute] = useState('');
  const location = useLocation();
  
  // Update current route when location changes
  useEffect(() => {
    const path = location.pathname;
    setCurrentRoute(path);
  }, [location]);
  
  // Map routes to documentation links
  const getRelevantDocs = () => {
    if (currentRoute.includes('/shopify')) {
      return {
        main: {
          title: 'Shopify Integration',
          path: '/docs/ShopifyIntegration',
          description: 'Complete guide to connecting and using Shopify features'
        },
        related: [
          {
            title: 'Shopify Bulk Operations',
            path: '/docs/ShopifyIntegration#bulk-operations',
            description: 'Learn about bulk price updates and operations'
          },
          {
            title: 'Webhooks Setup',
            path: '/docs/ShopifyIntegration#webhooks',
            description: 'Configure notifications from your Shopify store'
          },
          {
            title: 'Shopify Plus Features',
            path: '/docs/ShopifyIntegration#shopify-plus-features',
            description: 'Advanced features for Shopify Plus merchants'
          }
        ]
      };
    } else if (currentRoute.includes('/integrations')) {
      return {
        main: {
          title: 'Integrations Guide',
          path: '/docs/IntegrationsGuide',
          description: 'Connect with third-party services and platforms'
        },
        related: [
          {
            title: 'Shopify Integration',
            path: '/docs/ShopifyIntegration',
            description: 'Connect and manage your Shopify store'
          },
          {
            title: 'Gadget.dev Integration',
            path: '/docs/Gadget_Integration_Guide',
            description: 'Enhanced functionality with Gadget.dev'
          },
          {
            title: 'Klaviyo Integration',
            path: '/docs/KlaviyoIntegration',
            description: 'Set up customer email notifications'
          }
        ]
      };
    } else if (currentRoute.includes('/documentation')) {
      return {
        main: {
          title: 'Documentation Guide',
          path: '/docs/UserGuide',
          description: 'Overview of all application documentation'
        },
        related: [
          {
            title: 'Quick Start Guide',
            path: '/docs/QuickStartGuide',
            description: 'Get started in 5 minutes'
          },
          {
            title: 'Video Tutorials',
            path: '/docs/VideoTutorials',
            description: 'Watch step-by-step video guides'
          },
          {
            title: 'FAQ',
            path: '/docs/FAQ',
            description: 'Frequently asked questions'
          }
        ]
      };
    } else {
      // Default for dashboard or unknown routes
      return {
        main: {
          title: 'User Guide',
          path: '/docs/UserGuide',
          description: 'Complete guide to all features and functionality'
        },
        related: [
          {
            title: 'Quick Start Guide',
            path: '/docs/QuickStartGuide',
            description: 'Get started in 5 minutes'
          },
          {
            title: 'Uploading Price Lists',
            path: '/docs/UserGuide#uploading-price-lists',
            description: 'Learn how to upload and analyze supplier price lists'
          },
          {
            title: 'Analyzing Results',
            path: '/docs/UserGuide#analyzing-results',
            description: 'Understand the analysis dashboard'
          }
        ]
      };
    }
  };
  
  const relevantDocs = getRelevantDocs();
  
  // Filter docs based on search term
  const filteredDocs = searchTerm.trim() === '' ? 
    relevantDocs.related : 
    relevantDocs.related.filter(doc => 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  if (!open) return null;
  
  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-950 border-l shadow-lg z-50">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold flex items-center">
          <HelpCircle className="h-4 w-4 mr-2" />
          Help & Documentation
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documentation..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Recommended for this page</h3>
            <Card className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">{relevantDocs.main.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{relevantDocs.main.description}</p>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <a href={relevantDocs.main.path} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </Card>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Related Documentation</h3>
            {filteredDocs.length > 0 ? (
              <div className="space-y-2">
                {filteredDocs.map((doc, index) => (
                  <div 
                    key={index} 
                    className="border rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                    onClick={() => window.open(doc.path, '_blank')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{doc.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{doc.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No documentation found matching your search.</p>
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center"
              asChild
            >
              <a href="/documentation" target="_blank" rel="noopener noreferrer">
                <BookOpen className="h-4 w-4 mr-2" />
                Browse All Documentation
              </a>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DocsSidebar;
