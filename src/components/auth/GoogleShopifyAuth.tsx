
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useShopify } from "@/contexts/shopify";
import { AlertCircle, LogIn, ShoppingBag, LogOut } from "lucide-react";
import { initGoogleWorkspace, isGoogleSignedIn, signInToGoogle, signOutFromGoogle } from "@/lib/googleWorkspaceApi";

export const GoogleShopifyAuth = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { isShopifyConnected, shopifyContext } = useShopify();
  
  useEffect(() => {
    // Initialize Google Workspace API
    initGoogleWorkspace();
    
    // Check if already signed in
    const googleSignedIn = isGoogleSignedIn();
    setIsSignedIn(googleSignedIn);
    
    if (googleSignedIn) {
      // In a real implementation, this would get the user's email
      // For now, use a mock email
      setUserEmail("user@gmail.com");
    }
    
    // If connected to Shopify, set the store email
    if (isShopifyConnected && shopifyContext) {
      // In a real implementation, this would get the store email from Shopify
      // For now, use the shop domain
      if (!userEmail) {
        const email = `store@${shopifyContext.shop.replace('.myshopify.com', '')}`;
        setUserEmail(email);
      }
    }
  }, [isShopifyConnected, shopifyContext, userEmail]);
  
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    
    try {
      const success = await signInToGoogle();
      
      if (success) {
        setIsSignedIn(true);
        setUserEmail("user@gmail.com");
        
        toast.success("Signed in with Google", {
          description: "You are now signed in with your Google account.",
        });
      } else {
        throw new Error("Google sign-in failed");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Sign-in failed", {
        description: "There was an error signing in with Google. Please try again.",
      });
    } finally {
      setIsSigningIn(false);
    }
  };
  
  const handleShopifySignIn = async () => {
    setIsSigningIn(true);
    
    try {
      if (!isShopifyConnected || !shopifyContext) {
        throw new Error("Shopify not connected");
      }
      
      // In a real implementation, this would authenticate with Shopify OAuth
      console.log("Initiating Shopify sign-in...");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful sign-in
      setIsSignedIn(true);
      const email = `store@${shopifyContext.shop.replace('.myshopify.com', '')}`;
      setUserEmail(email);
      
      toast.success("Signed in with Shopify", {
        description: "You are now signed in with your Shopify account.",
      });
    } catch (error) {
      console.error("Error signing in with Shopify:", error);
      toast.error("Sign-in failed", {
        description: "There was an error signing in with Shopify. Please try again.",
      });
    } finally {
      setIsSigningIn(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOutFromGoogle();
      
      setIsSignedIn(false);
      setUserEmail(null);
      
      toast.success("Signed out", {
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Sign-out failed", {
        description: "There was an error signing out. Please try again.",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Authentication</CardTitle>
        <CardDescription>
          Sign in with your Google or Shopify account
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isSignedIn ? (
          <div className="space-y-4">
            <div className="bg-green-50 p-3 rounded-md text-sm flex items-start gap-2 text-green-700">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Signed in successfully</p>
                <p>You are signed in as {userEmail}</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              You now have access to additional features like sending emails via Gmail and creating Google Calendar events.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-md text-sm flex items-start gap-2 text-blue-700">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                Sign in to enable Google Workspace features including Gmail and Google Calendar integration.
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
              >
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                </svg>
                Sign in with Google
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleShopifySignIn}
                disabled={isSigningIn || !isShopifyConnected}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Sign in with Shopify
                {!isShopifyConnected && " (Connect Shopify first)"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {isSignedIn ? (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        ) : (
          <p className="text-xs text-center text-muted-foreground w-full">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        )}
      </CardFooter>
    </Card>
  );
};
