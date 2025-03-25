
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Clipboard, User, SendIcon, AlertTriangle } from "lucide-react";
import { createShopifyMultipassToken } from "@/lib/gadget/shopify-integration";
import { createShopifyFeatureTracker } from "@/lib/gadget/analytics/shopifyMetrics";

// Create feature tracker for multipass
const multipassTracker = createShopifyFeatureTracker('multipass');

interface CustomerFormData {
  email: string;
  firstName: string;
  lastName: string;
  tags: string;
  returnUrl: string;
}

export function MultipassAuthentication() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [multipassToken, setMultipassToken] = useState<string | null>(null);
  const [multipassUrl, setMultipassUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    email: '',
    firstName: '',
    lastName: '',
    tags: '',
    returnUrl: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateMultipass = async () => {
    if (!formData.email) {
      toast.error("Email is required", {
        description: "Please enter a valid email address."
      });
      return;
    }

    try {
      setIsGenerating(true);
      multipassTracker.trackAction('generate');
      
      const result = await createShopifyMultipassToken("example-shop.myshopify.com", {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        tag_string: formData.tags,
        return_to: formData.returnUrl || undefined
      });
      
      if (result.success && result.token && result.url) {
        setMultipassToken(result.token);
        setMultipassUrl(result.url);
        toast.success("Multipass token generated", {
          description: "Customer login token was created successfully."
        });
      } else {
        toast.error("Failed to generate token", {
          description: "An error occurred while generating the Multipass token."
        });
      }
    } catch (error) {
      console.error("Multipass generation error:", error);
      toast.error("Token generation failed", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = (text: string, type: 'token' | 'url') => {
    navigator.clipboard.writeText(text);
    toast.success(`${type === 'token' ? 'Token' : 'URL'} copied`, {
      description: `The ${type} has been copied to your clipboard.`
    });
    multipassTracker.trackAction('copy-' + type);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      tags: '',
      returnUrl: ''
    });
    setMultipassToken(null);
    setMultipassUrl(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Shopify Multipass</CardTitle>
            <CardDescription>
              Generate secure customer login tokens for seamless authentication
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            Shopify Plus
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Token</TabsTrigger>
            <TabsTrigger value="about">About Multipass</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                  <Input 
                    id="email" 
                    name="email"
                    placeholder="customer@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="returnUrl">Return URL</Label>
                  <Input 
                    id="returnUrl" 
                    name="returnUrl"
                    placeholder="/products/featured"
                    value={formData.returnUrl}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Customer Tags (comma separated)</Label>
                <Input 
                  id="tags" 
                  name="tags"
                  placeholder="vip, wholesale, returning"
                  value={formData.tags}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {multipassToken && multipassUrl && (
              <div className="space-y-4 mt-6 p-4 border rounded-md bg-slate-50">
                <h3 className="font-medium">Generated Multipass</h3>
                
                <div className="space-y-2">
                  <Label>Token</Label>
                  <div className="flex">
                    <Input 
                      value={multipassToken} 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="ml-2" 
                      onClick={() => handleCopyToClipboard(multipassToken, 'token')}
                    >
                      <Clipboard className="h-4 w-4" />
                      <span className="sr-only">Copy token</span>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Login URL</Label>
                  <div className="flex">
                    <Input 
                      value={multipassUrl} 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="ml-2" 
                      onClick={() => handleCopyToClipboard(multipassUrl, 'url')}
                    >
                      <Clipboard className="h-4 w-4" />
                      <span className="sr-only">Copy URL</span>
                    </Button>
                  </div>
                </div>
                
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    This token will only work once and expires after 30 minutes.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="about" className="pt-4">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">About Shopify Multipass</h3>
              <p className="text-muted-foreground">
                Multipass lets you securely log customers into your Shopify Plus store by using your own authentication system.
                This enables a seamless experience where customers can authenticate on your external properties 
                and be automatically logged in to your Shopify Plus store.
              </p>
              
              <h4 className="font-medium mt-4">Key Benefits:</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Single sign-on (SSO) across your ecosystem</li>
                <li>Seamless transition for customers between different sites</li>
                <li>Maintain control over your customer authentication</li>
                <li>Pre-populate customer data during registration</li>
              </ul>
              
              <div className="flex items-center justify-center p-4 mt-2">
                <Button variant="outline" onClick={() => window.open("https://shopify.dev/docs/api/multipass", "_blank")}>
                  Shopify Multipass Documentation
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" onClick={resetForm}>
          Reset
        </Button>
        <Button 
          onClick={handleGenerateMultipass} 
          disabled={isGenerating || !formData.email}
        >
          {isGenerating ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
              Generating...
            </>
          ) : (
            <>
              <SendIcon className="mr-2 h-4 w-4" />
              Generate Multipass Token
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
