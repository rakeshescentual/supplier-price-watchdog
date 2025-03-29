import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DocumentationLayout } from '@/components/documentation/DocumentationLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, FileText, Search, Info, Download, ExternalLink, ChevronRight, Bookmark, Clock, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'react-router-dom';

type DocumentItem = {
  id: string;
  title: string;
  description: string;
  path: string;
  tags: string[];
  category: string;
  essential?: boolean;
  lastUpdated: string;
  icon?: React.ReactNode;
};

const Documentation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDocs, setFilteredDocs] = useState<DocumentItem[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<DocumentItem[]>([]);
  const router = useRouter();
  
  const documents: DocumentItem[] = [
    {
      id: 'quick-start',
      title: 'Quick Start Guide',
      description: 'Get started with Supplier Price Watch in 5 minutes',
      path: '/docs/QuickStartGuide',
      tags: ['essential', 'beginner', 'setup'],
      category: 'user-guides',
      essential: true,
      lastUpdated: '2025-03-25',
      icon: <BookOpen className="h-5 w-5 text-primary" />
    },
    {
      id: 'user-guide',
      title: 'User Manual',
      description: 'Complete guide to all features and functionality',
      path: '/docs/UserGuide',
      tags: ['comprehensive', 'features', 'all'],
      category: 'user-guides',
      essential: true,
      lastUpdated: '2025-03-28',
      icon: <FileText className="h-5 w-5 text-primary" />
    },
    {
      id: 'shopify-integration',
      title: 'Shopify Integration',
      description: 'Connect and manage your Shopify store',
      path: '/docs/ShopifyIntegration',
      tags: ['shopify', 'integration', 'e-commerce'],
      category: 'integrations',
      lastUpdated: '2025-03-27',
      icon: <ExternalLink className="h-5 w-5 text-primary" />
    },
    {
      id: 'gadget-integration',
      title: 'Gadget.dev Integration',
      description: 'Enhanced functionality with Gadget.dev',
      path: '/docs/Gadget_Integration_Guide',
      tags: ['gadget', 'integration', 'pdf', 'processing'],
      category: 'integrations',
      lastUpdated: '2025-03-22',
      icon: <ExternalLink className="h-5 w-5 text-primary" />
    },
    {
      id: 'technical-doc',
      title: 'Technical Documentation',
      description: 'System architecture and technical details',
      path: '/docs/TechnicalDocumentation',
      tags: ['technical', 'architecture', 'developers'],
      category: 'technical',
      lastUpdated: '2025-03-20',
      icon: <FileText className="h-5 w-5 text-primary" />
    },
    {
      id: 'developer-workflows',
      title: 'Developer Workflows',
      description: 'Guide for developers working with the application',
      path: '/docs/DeveloperWorkflows',
      tags: ['development', 'workflows', 'coding'],
      category: 'technical',
      lastUpdated: '2025-03-18',
      icon: <FileText className="h-5 w-5 text-primary" />
    }
  ];
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDocs(documents);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = documents.filter(doc => 
        doc.title.toLowerCase().includes(term) ||
        doc.description.toLowerCase().includes(term) ||
        doc.tags.some(tag => tag.toLowerCase().includes(term))
      );
      setFilteredDocs(filtered);
    }
  }, [searchTerm]);
  
  useEffect(() => {
    setFilteredDocs(documents);
    
    const savedRecent = localStorage.getItem('recentlyViewedDocs');
    if (savedRecent) {
      try {
        const parsed = JSON.parse(savedRecent);
        const validRecent = parsed.filter((recentId: string) => 
          documents.some(doc => doc.id === recentId)
        ).map((recentId: string) => 
          documents.find(doc => doc.id === recentId)
        ).filter(Boolean);
        
        setRecentlyViewed(validRecent);
      } catch (e) {
        console.error("Error loading recently viewed docs:", e);
      }
    }
  }, []);
  
  const handleViewDocument = (doc: DocumentItem) => {
    const updatedRecent = [doc, ...recentlyViewed.filter(item => item.id !== doc.id)].slice(0, 5);
    setRecentlyViewed(updatedRecent);
    
    const recentIds = updatedRecent.map(item => item.id);
    localStorage.setItem('recentlyViewedDocs', JSON.stringify(recentIds));
    
    router.navigate(doc.path);
  };
  
  const handleDownload = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;
    
    console.log(`Downloading ${doc.title}`);
  };

  return (
    <DocumentationLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <BookOpen className="h-6 w-6 mr-2 text-primary" />
              Documentation
            </h1>
            <p className="text-muted-foreground">
              Comprehensive guides for Supplier Price Watch features and functionality
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documentation..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Alert className="mb-6 bg-blue-50 border-blue-100 text-blue-800">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription>
            New to Supplier Price Watch? We recommend starting with our <button onClick={() => handleViewDocument(documents.find(d => d.id === 'quick-start')!)} className="text-blue-600 font-medium hover:underline">Quick Start Guide</button>.
          </AlertDescription>
        </Alert>

        {recentlyViewed.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-3 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              Recently Viewed
            </h2>
            <div className="flex flex-wrap gap-2">
              {recentlyViewed.map(doc => (
                <Button 
                  key={doc.id} 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center"
                  onClick={() => handleViewDocument(doc)}
                >
                  {doc.icon || <FileText className="h-3.5 w-3.5 mr-1.5" />}
                  {doc.title}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 grid grid-cols-5 md:flex md:flex-wrap">
            <TabsTrigger value="all" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              All Documentation
            </TabsTrigger>
            <TabsTrigger value="user-guides" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              User Guides
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center">
              <ExternalLink className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Technical
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Tutorials
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[calc(100vh-320px)]">
            <TabsContent value="all" className="space-y-4">
              {filteredDocs.length > 0 ? (
                filteredDocs.map(doc => (
                  <Card key={doc.id} id={doc.id} className="transition-all hover:border-primary cursor-pointer" onClick={() => handleViewDocument(doc)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center">
                            {doc.icon || <FileText className="h-5 w-5 mr-2" />}
                            {doc.title}
                            {doc.essential && (
                              <Badge variant="outline" className="ml-2 text-xs">Essential</Badge>
                            )}
                          </CardTitle>
                          <CardDescription>
                            {doc.description}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(doc.id);
                          }}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="prose max-w-none dark:prose-invert">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Updated: {new Date(doc.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Info className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <h3 className="text-lg font-medium">No matching documents</h3>
                  <p className="text-muted-foreground">Try adjusting your search terms</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="user-guides" className="space-y-4">
              {filteredDocs.filter(doc => doc.category === 'user-guides').map(doc => (
                <Card key={doc.id} id={doc.id} className="transition-all hover:border-primary cursor-pointer" onClick={() => handleViewDocument(doc)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          {doc.icon || <FileText className="h-5 w-5 mr-2" />}
                          {doc.title}
                          {doc.essential && (
                            <Badge variant="outline" className="ml-2 text-xs">Essential</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {doc.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(doc.id);
                        }}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="prose max-w-none dark:prose-invert">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Updated: {new Date(doc.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="integrations" className="space-y-4">
              {filteredDocs.filter(doc => doc.category === 'integrations').map(doc => (
                <Card key={doc.id} id={doc.id} className="transition-all hover:border-primary cursor-pointer" onClick={() => handleViewDocument(doc)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          {doc.icon || <FileText className="h-5 w-5 mr-2" />}
                          {doc.title}
                          {doc.essential && (
                            <Badge variant="outline" className="ml-2 text-xs">Essential</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {doc.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(doc.id);
                        }}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="prose max-w-none dark:prose-invert">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Updated: {new Date(doc.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-4">
              {filteredDocs.filter(doc => doc.category === 'technical').map(doc => (
                <Card key={doc.id} id={doc.id} className="transition-all hover:border-primary cursor-pointer" onClick={() => handleViewDocument(doc)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          {doc.icon || <FileText className="h-5 w-5 mr-2" />}
                          {doc.title}
                          {doc.essential && (
                            <Badge variant="outline" className="ml-2 text-xs">Essential</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {doc.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(doc.id);
                        }}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="prose max-w-none dark:prose-invert">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Updated: {new Date(doc.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="tutorials" id="tutorials" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Video Tutorials</CardTitle>
                  <CardDescription>
                    Step-by-step video guides for common tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Our video tutorials provide visual step-by-step instructions for all major features.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                      <h3 className="font-medium mb-1">Uploading Your First Price List</h3>
                      <p className="text-sm text-muted-foreground mb-2">3:45 min</p>
                      <Button variant="outline" size="sm" className="w-full">Watch Tutorial</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                      <h3 className="font-medium mb-1">Connecting to Shopify</h3>
                      <p className="text-sm text-muted-foreground mb-2">4:20 min</p>
                      <Button variant="outline" size="sm" className="w-full">Watch Tutorial</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                      <h3 className="font-medium mb-1">Market Insights Analysis</h3>
                      <p className="text-sm text-muted-foreground mb-2">5:15 min</p>
                      <Button variant="outline" size="sm" className="w-full">Watch Tutorial</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                      <h3 className="font-medium mb-1">Customer Notifications</h3>
                      <p className="text-sm text-muted-foreground mb-2">3:30 min</p>
                      <Button variant="outline" size="sm" className="w-full">Watch Tutorial</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </DocumentationLayout>
  );
};

export default Documentation;
