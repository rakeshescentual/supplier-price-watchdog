
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Key, Lock, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useShopify } from '@/contexts/shopify';

export function ShopifyOAuth() {
  const navigate = useNavigate();
  const { isShopifyConnected, connectToShopify } = useShopify();
  const [shopUrl, setShopUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState('oauth');

  // In a real implementation, this would be your OAuth redirect URI
  const redirectUri = window.location.origin + '/shopify/callback';
  
  // These would typically be environment variables in a real app
  const clientId = 'your-client-id';
  
  // This simulates what would happen in a real OAuth flow
  const initiateOAuth = () => {
    if (!shopUrl) {
      toast.error('Shop URL is required');
      return;
    }
    
    // Store shop URL in session storage to retrieve after redirect
    sessionStorage.setItem('shopify_shop', shopUrl);
    
    // In a real app, this would redirect to Shopify's OAuth page
    toast.info('In a production app, you would now be redirected to Shopify for authorization', {
      description: 'For demo purposes, we\'re simulating this process',
      duration: 5000
    });

    // Simulate OAuth process completion after 2 seconds
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      toast.success('Connected to Shopify via OAuth');
      navigate('/shopify');
    }, 2000);
  };

  // Direct API token connection (not recommended for production)
  const handleDirectConnect = async () => {
    if (!shopUrl || !accessToken) {
      toast.error('Shop URL and access token are required');
      return;
    }
    
    setIsConnecting(true);
    try {
      const success = await connectToShopify(shopUrl, accessToken);
      if (success) {
        setShopUrl('');
        setAccessToken('');
        navigate('/shopify');
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect to Shopify', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  if (isShopifyConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopify Connection
          </CardTitle>
          <CardDescription>
            Your store is connected to Shopify
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              You're currently connected to Shopify. You can manage your connection in the Shopify dashboard.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate('/shopify')}>
            Go to Shopify Dashboard
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Connect to Shopify
        </CardTitle>
        <CardDescription>
          Connect your Escentual store to Shopify
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mx-6">
          <TabsTrigger value="oauth">OAuth (Recommended)</TabsTrigger>
          <TabsTrigger value="direct">Direct API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="oauth">
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                OAuth is the recommended way to connect to Shopify. It's more secure and follows Shopify's best practices.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <label htmlFor="shop-url-oauth" className="text-sm font-medium">
                Shop URL
              </label>
              <Input
                id="shop-url-oauth"
                placeholder="your-store.myshopify.com"
                value={shopUrl}
                onChange={e => setShopUrl(e.target.value)}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <a href="https://shopify.dev/docs/apps/auth/oauth" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                OAuth Docs
              </a>
            </Button>
            
            <Button 
              onClick={initiateOAuth}
              disabled={isConnecting || !shopUrl}
            >
              {isConnecting ? "Connecting..." : "Connect with OAuth"}
            </Button>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="direct">
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription className="text-amber-600">
                <strong>Warning:</strong> This method is only for development purposes. For production, use OAuth.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <label htmlFor="shop-url" className="text-sm font-medium">
                Shop URL
              </label>
              <Input
                id="shop-url"
                placeholder="your-store.myshopify.com"
                value={shopUrl}
                onChange={e => setShopUrl(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="access-token" className="text-sm font-medium">
                Admin API Access Token
              </label>
              <Input
                id="access-token"
                type="password"
                placeholder="shpat_xxxxxxxxxxxxxxxxxxxx"
                value={accessToken}
                onChange={e => setAccessToken(e.target.value)}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <a href="https://shopify.dev/docs/api/admin-rest" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                API Docs
              </a>
            </Button>
            
            <Button 
              onClick={handleDirectConnect}
              disabled={isConnecting || !shopUrl || !accessToken}
            >
              {isConnecting ? "Connecting..." : "Connect with API Token"}
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
