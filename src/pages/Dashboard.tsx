import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, AlertTriangle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Items',
      value: '1,234',
      icon: Package,
      trend: '+12%',
      description: 'from last month'
    },
    {
      title: 'Pending Orders',
      value: '23',
      icon: ShoppingCart,
      trend: '-5%',
      description: 'from last week'
    },
    {
      title: 'Low Stock Items',
      value: '8',
      icon: AlertTriangle,
      trend: '+2',
      description: 'items need attention'
    },
    {
      title: 'Revenue Impact',
      value: '$45,231',
      icon: TrendingUp,
      trend: '+18%',
      description: 'from inventory optimization'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your Hospitality ERP system overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success font-medium">{stat.trend}</span> {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New procurement order submitted</p>
                  <p className="text-xs text-muted-foreground">Kitchen supplies - 2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-warning rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Low stock alert</p>
                  <p className="text-xs text-muted-foreground">Tomatoes - 15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-success rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Recipe updated</p>
                  <p className="text-xs text-muted-foreground">Pasta Marinara - 1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors">
                <Package className="h-6 w-6 text-primary mb-2" />
                <p className="text-sm font-medium">Add Inventory</p>
              </button>
              <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors">
                <ShoppingCart className="h-6 w-6 text-primary mb-2" />
                <p className="text-sm font-medium">New Order</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;