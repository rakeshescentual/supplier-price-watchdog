
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { GoogleShopifyAuth } from "@/components/auth/GoogleShopifyAuth";

export function Navigation() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link
            to="/"
            className="mr-6 flex items-center space-x-2 font-semibold"
          >
            <span className="hidden font-bold sm:inline-block">
              Supplier Price Watch
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              className={cn(
                "transition-colors hover:text-foreground/80",
                location.pathname === "/" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className={cn(
                "transition-colors hover:text-foreground/80",
                location.pathname === "/dashboard"
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              Dashboard
            </Link>
            <Link
              to="/documentation"
              className={cn(
                "transition-colors hover:text-foreground/80",
                location.pathname === "/documentation"
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              Documentation
            </Link>
            <Link
              to="/gadget-settings"
              className={cn(
                "transition-colors hover:text-foreground/80",
                location.pathname === "/gadget-settings"
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              Gadget Settings
            </Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <GoogleShopifyAuth />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="mr-2 flex md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate through the application.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 flex flex-col space-y-2">
                <Link to="/" className="block py-2 hover:underline" onClick={() => setOpen(false)}>
                  Home
                </Link>
                <Link to="/dashboard" className="block py-2 hover:underline" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/documentation" className="block py-2 hover:underline" onClick={() => setOpen(false)}>
                  Documentation
                </Link>
                <Link to="/gadget-settings" className="block py-2 hover:underline" onClick={() => setOpen(false)}>
                  Gadget Settings
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
