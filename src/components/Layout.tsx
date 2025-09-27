import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Package, ChefHat, ShoppingCart, Users, BarChart3, FileText, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const Layout = () => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Recipes', href: '/recipes', icon: ChefHat },
    { name: 'Procurement', href: '/procurement', icon: ShoppingCart },
    { name: 'Suppliers', href: '/suppliers', icon: Users },
    { name: 'Reports', href: '/reports', icon: FileText },
  ];

  const adminNavigation = [
    { name: 'Admin', href: '/admin', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border">
          <div className="flex h-16 items-center px-6 border-b border-border">
            <Package className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-foreground">HospitalityERP</span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )
                  }
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </NavLink>
              ))}
            </div>
            
            <div className="border-t border-border pt-4">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Administration
              </div>
              <div className="space-y-2">
                {adminNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      )
                    }
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;