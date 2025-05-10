
import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sparkles, Code2, Lightbulb, Play, RefreshCw, Share2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  generateQuerySuggestions,
  explainQuery,
  optimizeQuery,
  generateTestScenario,
  generateQueryComponent,
  openAiAssistantInMcpExplorer,
  QuerySuggestion
} from "@/lib/shopify/mcp/aiAssistant";
import { openInMcpExplorer } from "@/lib/shopify/mcp/explorer";
import { executeMcpQuery } from "@/lib/shopify/mcp/client";
import { checkMcpServer } from "@/lib/shopify/mcp/client";

/**
 * MCP AI Assistant Component
 * Uses AI to help develop and test Shopify GraphQL queries
 */
export function McpAiAssistant() {
  const [query, setQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('query');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mcpAvailable, setMcpAvailable] = useState<boolean | null>(null);
  const [suggestions, setSuggestions] = useState<QuerySuggestion[]>([]);
  const [explanation, setExplanation] = useState<string>('');
  const [optimizationResult, setOptimizationResult] = useState<{
    optimizedQuery: string;
    explanation: string;
  } | null>(null);
  const [testScenario, setTestScenario] = useState<{
    description: string;
    variables: Record<string, any>;
    assertions: string[];
  } | null>(null);
  const [generatedComponent, setGeneratedComponent] = useState<string>('');
  const [queryResult, setQueryResult] = useState<any>(null);

  // Check if MCP server is available
  const checkMcpAvailability = useCallback(async () => {
    try {
      const available = await checkMcpServer();
      setMcpAvailable(available);
      return available;
    } catch (error) {
      console.error('Error checking MCP server:', error);
      setMcpAvailable(false);
      return false;
    }
  }, []);

  // Run initial check
  React.useEffect(() => {
    checkMcpAvailability();
  }, [checkMcpAvailability]);

  // Generate AI suggestions for the query
  const handleGenerateSuggestions = async () => {
    if (!query.trim()) {
      toast.warning('Empty Query', {
        description: 'Please enter a GraphQL query first'
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateQuerySuggestions(query);
      setSuggestions(result);
      
      if (result.length === 0) {
        toast.info('No Suggestions', {
          description: 'No optimization suggestions found for this query'
        });
      } else {
        toast.success('Suggestions Generated', {
          description: `Generated ${result.length} suggestions for your query`
        });
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to generate suggestions'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Explain the query using AI
  const handleExplainQuery = async () => {
    if (!query.trim()) {
      toast.warning('Empty Query', {
        description: 'Please enter a GraphQL query first'
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await explainQuery(query);
      setExplanation(result);
      setActiveTab('explain');
      toast.success('Query Explained', {
        description: 'Analysis of your GraphQL query is ready'
      });
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to explain query'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Optimize the query using AI
  const handleOptimizeQuery = async () => {
    if (!query.trim()) {
      toast.warning('Empty Query', {
        description: 'Please enter a GraphQL query first'
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await optimizeQuery(query);
      setOptimizationResult(result);
      setActiveTab('optimize');
      toast.success('Query Optimized', {
        description: 'Optimization suggestions are ready'
      });
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to optimize query'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate test scenario using AI
  const handleGenerateTest = async () => {
    if (!query.trim()) {
      toast.warning('Empty Query', {
        description: 'Please enter a GraphQL query first'
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateTestScenario(query);
      setTestScenario(result);
      setActiveTab('test');
      toast.success('Test Generated', {
        description: 'Test scenario generated successfully'
      });
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to generate test'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate React component using AI
  const handleGenerateComponent = async () => {
    if (!query.trim()) {
      toast.warning('Empty Query', {
        description: 'Please enter a GraphQL query first'
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = generateQueryComponent(query);
      setGeneratedComponent(result);
      setActiveTab('component');
      toast.success('Component Generated', {
        description: 'React component generated successfully'
      });
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to generate component'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Execute the query using MCP
  const handleExecuteQuery = async () => {
    if (!query.trim()) {
      toast.warning('Empty Query', {
        description: 'Please enter a GraphQL query first'
      });
      return;
    }

    // Check MCP availability first
    const available = await checkMcpAvailability();
    if (!available) {
      toast.error('MCP Server Not Available', {
        description: 'Please start your local MCP server first'
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await executeMcpQuery(query);
      setQueryResult(result);
      setActiveTab('result');
      toast.success('Query Executed', {
        description: 'Query executed successfully against MCP'
      });
    } catch (error) {
      console.error('Error executing query:', error);
      toast.error('Query Execution Failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <div>
            <CardTitle>Shopify MCP AI Assistant</CardTitle>
            <CardDescription>
              Develop and optimize Shopify GraphQL queries with AI assistance
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      {mcpAvailable === false && (
        <CardContent>
          <Alert variant="warning" className="mb-4">
            <AlertDescription>
              MCP server not available. Please start your local MCP server first.
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={checkMcpAvailability}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Connection
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
      
      <CardContent className="space-y-4">
        <div>
          <label 
            htmlFor="query" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            GraphQL Query
          </label>
          <Textarea
            id="query"
            placeholder="Enter your Shopify GraphQL query here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="font-mono text-sm h-64"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleGenerateSuggestions}
            disabled={isLoading || !query.trim()}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Suggest Improvements
          </Button>
          <Button
            variant="outline"
            onClick={handleExplainQuery}
            disabled={isLoading || !query.trim()}
          >
            <Code2 className="h-4 w-4 mr-2" />
            Explain Query
          </Button>
          <Button
            variant="outline"
            onClick={handleOptimizeQuery}
            disabled={isLoading || !query.trim()}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Optimize
          </Button>
          <Button
            variant="outline"
            onClick={handleGenerateTest}
            disabled={isLoading || !query.trim()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate Test
          </Button>
          <Button
            variant="outline"
            onClick={handleGenerateComponent}
            disabled={isLoading || !query.trim()}
          >
            <Code2 className="h-4 w-4 mr-2" />
            Generate Component
          </Button>
          <Button
            variant="default"
            onClick={handleExecuteQuery}
            disabled={isLoading || !query.trim() || mcpAvailable === false}
          >
            <Play className="h-4 w-4 mr-2" />
            Execute Query
          </Button>
          <Button
            variant="outline"
            onClick={() => openInMcpExplorer(query)}
            disabled={mcpAvailable === false}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Open in Explorer
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="query">Query</TabsTrigger>
            <TabsTrigger value="explain">Explanation</TabsTrigger>
            <TabsTrigger value="optimize">Optimization</TabsTrigger>
            <TabsTrigger value="test">Test</TabsTrigger>
            <TabsTrigger value="component">Component</TabsTrigger>
            <TabsTrigger value="result">Result</TabsTrigger>
          </TabsList>
          
          <TabsContent value="query" className="pt-4">
            {suggestions.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-medium">Suggestions</h3>
                {suggestions.map((suggestion, i) => (
                  <div key={i} className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">{suggestion.description}</h4>
                    <pre className="bg-slate-100 p-3 rounded text-xs overflow-auto">
                      {suggestion.query}
                    </pre>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-2"
                      onClick={() => setQuery(suggestion.query)}
                    >
                      Use This Query
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                    <p>Analyzing your query...</p>
                  </div>
                ) : (
                  <p>
                    Click "Suggest Improvements" to get AI-generated suggestions for your query
                  </p>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="explain" className="pt-4">
            {explanation ? (
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Query Explanation</h3>
                <p>{explanation}</p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                    <p>Analyzing your query...</p>
                  </div>
                ) : (
                  <p>
                    Click "Explain Query" to get an AI-generated explanation of your query
                  </p>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="optimize" className="pt-4">
            {optimizationResult ? (
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Optimization Explanation</h3>
                  <p>{optimizationResult.explanation}</p>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Optimized Query</h3>
                  <pre className="bg-slate-100 p-3 rounded text-xs overflow-auto">
                    {optimizationResult.optimizedQuery}
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setQuery(optimizationResult.optimizedQuery)}
                  >
                    Use This Query
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                    <p>Optimizing your query...</p>
                  </div>
                ) : (
                  <p>
                    Click "Optimize" to get AI-generated optimization suggestions
                  </p>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="test" className="pt-4">
            {testScenario ? (
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Test Description</h3>
                  <p>{testScenario.description}</p>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Test Variables</h3>
                  <pre className="bg-slate-100 p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(testScenario.variables, null, 2)}
                  </pre>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Assertions</h3>
                  <ul className="list-disc list-inside">
                    {testScenario.assertions.map((assertion, i) => (
                      <li key={i} className="font-mono text-xs">{assertion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                    <p>Generating test scenario...</p>
                  </div>
                ) : (
                  <p>
                    Click "Generate Test" to create a test scenario for your query
                  </p>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="component" className="pt-4">
            {generatedComponent ? (
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Generated React Component</h3>
                <pre className="bg-slate-100 p-3 rounded text-xs overflow-auto">
                  {generatedComponent}
                </pre>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedComponent);
                    toast.success('Copied to clipboard');
                  }}
                >
                  Copy Component Code
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                    <p>Generating component...</p>
                  </div>
                ) : (
                  <p>
                    Click "Generate Component" to create a React component for your query
                  </p>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="result" className="pt-4">
            {queryResult ? (
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Query Result</h3>
                <pre className="bg-slate-100 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(queryResult, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                    <p>Executing query against MCP...</p>
                  </div>
                ) : (
                  <p>
                    Click "Execute Query" to run your query against the MCP server
                  </p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t px-6 py-3">
        <p className="text-xs text-muted-foreground">
          Uses local MCP server for testing Shopify GraphQL operations
        </p>
        
        <a 
          href="https://shopify.dev/docs/api/admin-graphql"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
        >
          Shopify Admin API Reference
        </a>
      </CardFooter>
    </Card>
  );
}
