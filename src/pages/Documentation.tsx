import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { FileText, Book, Search, BookOpen, AlertTriangle, Info, HelpCircle, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Documentation = () => {
  // Replace useRouter with useNavigate and useLocation
  const navigate = useNavigate();
  const location = useLocation();
  const { docId } = useParams();

  const [markdownContent, setMarkdownContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDocs, setFilteredDocs] = useState([
    { title: 'Quick Start Guide', path: '/docs/QuickStartGuide' },
    { title: 'User Guide', path: '/docs/UserGuide' },
    { title: 'Shopify Integration', path: '/docs/ShopifyIntegration' },
    { title: 'Integrations Guide', path: '/docs/IntegrationsGuide' },
    { title: 'FAQ', path: '/docs/FAQ' },
  ]);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch(`/${docId || 'docs/QuickStartGuide'}.md`);
        if (!response.ok) {
          console.log('Failed to fetch default doc, trying UserGuide');
          const defaultResponse = await fetch('/docs/UserGuide.md');
          if (!defaultResponse.ok) {
            throw new Error('Failed to fetch default documentation');
          }
          const defaultMarkdown = await defaultResponse.text();
          setMarkdownContent(defaultMarkdown);
          navigate('/documentation/docs/UserGuide');
          return;
        }
        const markdown = await response.text();
        setMarkdownContent(markdown);
      } catch (error) {
        console.error('Error fetching documentation:', error);
        setMarkdownContent('# Error Loading Documentation');
      }
    };

    fetchMarkdown();
  }, [docId, navigate]);

  useEffect(() => {
    const allDocs = [
      { title: 'Quick Start Guide', path: '/docs/QuickStartGuide' },
      { title: 'User Guide', path: '/docs/UserGuide' },
      { title: 'Shopify Integration', path: '/docs/ShopifyIntegration' },
      { title: 'Integrations Guide', path: '/docs/IntegrationsGuide' },
      { title: 'FAQ', path: '/docs/FAQ' },
    ];

    if (searchTerm) {
      const results = allDocs.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDocs(results);
    } else {
      setFilteredDocs(allDocs);
    }
  }, [searchTerm]);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Documentation
          </CardTitle>
          <CardDescription>
            Explore our comprehensive documentation to learn more about the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documentation..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs defaultValue="content" className="space-y-4">
            <TabsList>
              <TabsTrigger value="content">
                <BookOpen className="h-4 w-4 mr-2" />
                Documentation Content
              </TabsTrigger>
              <TabsTrigger value="links">
                <Book className="h-4 w-4 mr-2" />
                Quick Links
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <ScrollArea className="h-[calc(65vh)] w-full">
                <ReactMarkdown className="prose dark:prose-invert max-w-none">
                  {markdownContent}
                </ReactMarkdown>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="links">
              {filteredDocs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocs.map((doc, index) => (
                    <Card key={index} className="hover:bg-secondary cursor-pointer" onClick={() => navigate(`/documentation${doc.path}`)}>
                      <CardContent className="flex items-center space-x-4">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <h3 className="text-sm font-medium">{doc.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {doc.path}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert variant="info">
                  <Info className="h-4 w-4" />
                  <AlertTitle>No results found</AlertTitle>
                  <AlertDescription>
                    No documentation found matching your search.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documentation;
