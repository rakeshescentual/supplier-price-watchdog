
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  BarChart, 
  Tags, 
  Workflow, 
  Settings, 
  FileSpreadsheet, 
  ShoppingCart,
  FileText
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 pt-10">
          <div className="flex flex-col h-full">
            <div className="space-y-4">
              <h2 className="text-xl font-bold px-4">Escentual</h2>
              <nav className="space-y-2">
                <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                <NavItem to="/analysis" icon={<BarChart size={18} />} label="Price Analysis" />
                <NavItem to="/pricing" icon={<Tags size={18} />} label="Pricing" />
                <NavItem to="/competitive" icon={<Workflow size={18} />} label="Competitive" />
                <NavItem to="/shopify" icon={<ShoppingCart size={18} />} label="Shopify" />
                <NavItem to="/documentation" icon={<FileText size={18} />} label="Documentation" />
                <NavItem to="/integrations" icon={<FileSpreadsheet size={18} />} label="Integrations" />
                <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
              </nav>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 border-r bg-card h-full">
        <div className="p-6">
          <h2 className="text-xl font-bold">Escentual</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem to="/analysis" icon={<BarChart size={18} />} label="Price Analysis" />
          <NavItem to="/pricing" icon={<Tags size={18} />} label="Pricing" />
          <NavItem to="/competitive" icon={<Workflow size={18} />} label="Competitive" />
          <NavItem to="/shopify" icon={<ShoppingCart size={18} />} label="Shopify" />
          <NavItem to="/documentation" icon={<FileText size={18} />} label="Documentation" />
          <NavItem to="/integrations" icon={<FileSpreadsheet size={18} />} label="Integrations" />
          <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>
      </div>
    </>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-muted'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

export default Sidebar;
