
import React from 'react';
import { Button } from '@/components/ui/button';
import { MenuIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Navbar = ({ sidebarOpen, setSidebarOpen }: NavbarProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button 
        variant="ghost" 
        size="icon"
        className="md:hidden" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      <div className="flex items-center gap-2">
        <img 
          src="/placeholder.svg" 
          alt="Escentual Logo" 
          width={32} 
          height={32} 
          className="rounded-md"
        />
        <h1 className="text-lg font-semibold">Escentual Price Watch</h1>
      </div>
      
      <div className="ml-auto flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/documentation')}
        >
          Documentation
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
