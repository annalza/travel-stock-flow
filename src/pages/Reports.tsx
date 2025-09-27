import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

const Reports = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [reportType, setReportType] = useState('procurement');

  // Mock data for reports
  const procurementSummary = {
    totalInvoices: 156,
    totalAmount: 45650.00,
    approvedAmount: 38920.00,
    pendingAmount: 6730.00,
    avgProcessingTime: '3.2 days'
  };

  const monthlySpending = [
    { month: 'Jan', amount: 12500 },
    { month: 'Feb', amount: 15200 },
    { month: 'Mar', amount: 13800 },
    { month: 'Apr', amount: 16900 },
    { month: 'May', amount: 14300 },
    { month: 'Jun', amount: 18200 }
  ];

  const supplierPerformance = [
    { supplier: 'Ocean Fresh Supplies', orders: 45, onTime: 42, rating: 93 },
    { supplier: 'Green Valley Farms', orders: 38, onTime: 36, rating: 95 },
    { supplier: 'City Meat Market', orders: 32, onTime: 29, rating: 91 },
    { supplier: 'Premium Wine Co.', orders: 25, onTime: 22, rating: 88 },
    { supplier: 'Dairy Fresh Inc.', orders: 16, onTime: 14, rating: 87 }
  ];

  const categorySpending = [
    { name: 'Fresh Produce', value: 18500, color: '#4ade80' },
    { name: 'Meat & Seafood', value: 15200, color: '#f87171' },
    { name: 'Dairy Products', value: 8900, color: '#60a5fa' },
    { name: 'Beverages', value: 6750, color: '#fbbf24' },
    { name: 'Dry Goods', value: 4300, color: '#a78bfa' }
  ];

  const statusDistribution = [
    { name: 'Approved', value: 65, color: '#10b981' },
    { name: 'Pending', value: 20, color: '#f59e0b' },
    { name: 'Rejected', value: 10, color: '#ef4444' },
    { name: 'Draft', value: 5, color: '#6b7280' }
  ];

  const marketTrends = [
    { week: 'Week 1', salmon: 26.5, beef: 31.2, vegetables: 4.8 },
    { week: 'Week 2', salmon: 27.1, beef: 32.0, vegetables: 4.5 },
    { week: 'Week 3', salmon: 28.3, beef: 31.8, vegetables: 4.2 },
    { week: 'Week 4', salmon: 28.5, beef: 32.0, vegetables: 4.2 }
  ];

  const topSuppliers = [
    { name: 'Ocean Fresh Supplies', amount: 15650, orders: 45, trend: 'up' },
    { name: 'Green Valley Farms', amount: 12340, orders: 38, trend: 'down' },
    { name: 'City Meat Market', amount: 10980, orders: 32, trend: 'up' },
    { name: 'Premium Wine Co.', amount: 8750, orders: 25, trend: 'stable' },
    { name: 'Dairy Fresh Inc.', amount: 6200, orders: 16, trend: 'up' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-destructive rotate-180" />;
      default:
        return <DollarSign className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleExportReport = (type: string) => {
    // Simulate report export
    const timestamp = new Date().toISOString().slice(0, 10);
    console.log(`Exporting ${type} report for ${dateRange} - ${timestamp}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive procurement and spending analytics
          </p>
        </div>
        
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExportReport('comprehensive')}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Invoices
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{procurementSummary.totalInvoices}</div>
            <p className="text-xs text-success">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spending
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${procurementSummary.totalAmount.toLocaleString()}
            </div>
            <p className="text-xs text-destructive">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved Amount
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${procurementSummary.approvedAmount.toLocaleString()}
            </div>
            <p className="text-xs text-success">
              {((procurementSummary.approvedAmount / procurementSummary.totalAmount) * 100).toFixed(1)}% approval rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Amount
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${procurementSummary.pendingAmount.toLocaleString()}
            </div>
            <p className="text-xs text-warning">
              {((procurementSummary.pendingAmount / procurementSummary.totalAmount) * 100).toFixed(1)}% pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Processing
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{procurementSummary.avgProcessingTime}</div>
            <p className="text-xs text-success">-0.5 days from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="spending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
          <TabsTrigger value="suppliers">Supplier Performance</TabsTrigger>
          <TabsTrigger value="market">Market Trends</TabsTrigger>
          <TabsTrigger value="categories">Category Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="spending" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Spending Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlySpending}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invoice Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Suppliers by Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSuppliers.map((supplier, index) => (
                  <div key={supplier.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
                      <div>
                        <p className="font-medium">{supplier.name}</p>
                        <p className="text-sm text-muted-foreground">{supplier.orders} orders</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold">${supplier.amount.toLocaleString()}</p>
                        <div className="flex items-center">
                          {getTrendIcon(supplier.trend)}
                          <span className="text-sm text-muted-foreground ml-1">
                            {supplier.trend === 'up' ? '+' : supplier.trend === 'down' ? '-' : ''}
                            {supplier.trend !== 'stable' ? '5%' : '0%'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supplierPerformance.map((supplier) => (
                  <div key={supplier.supplier} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{supplier.supplier}</p>
                      <p className="text-sm text-muted-foreground">{supplier.orders} total orders</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">On-Time Delivery</p>
                      <p className="font-medium">{supplier.onTime}/{supplier.orders}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Performance Rating</p>
                      <div className="flex items-center">
                        <span className="font-medium">{supplier.rating}%</span>
                        <Badge 
                          className={`ml-2 ${
                            supplier.rating >= 95 ? 'bg-success' : 
                            supplier.rating >= 90 ? 'bg-warning' : 'bg-destructive'
                          }`}
                        >
                          {supplier.rating >= 95 ? 'Excellent' : 
                           supplier.rating >= 90 ? 'Good' : 'Needs Improvement'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Price Trends (Last 4 Weeks)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={marketTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Price per unit']} />
                  <Line type="monotone" dataKey="salmon" stroke="#ef4444" strokeWidth={2} name="Salmon" />
                  <Line type="monotone" dataKey="beef" stroke="#10b981" strokeWidth={2} name="Beef" />
                  <Line type="monotone" dataKey="vegetables" stroke="#3b82f6" strokeWidth={2} name="Vegetables" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-destructive" />
                  Price Increases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Fresh Salmon</span>
                    <span className="text-destructive">+9.6%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Premium Beef</span>
                    <span className="text-destructive">+2.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Organic Wine</span>
                    <span className="text-destructive">+1.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-success rotate-180" />
                  Price Decreases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Organic Vegetables</span>
                    <span className="text-success">-6.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dairy Products</span>
                    <span className="text-success">-3.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bread Products</span>
                    <span className="text-success">-1.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
                  Price Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <p className="text-sm font-medium">Salmon prices reached seasonal high</p>
                    <p className="text-xs text-muted-foreground">Consider alternative suppliers</p>
                  </div>
                  <div className="p-3 bg-warning/10 rounded-lg">
                    <p className="text-sm font-medium">Vegetable supply shortage expected</p>
                    <p className="text-xs text-muted-foreground">Stock up within 2 weeks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categorySpending}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                    >
                      {categorySpending.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categorySpending.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {((category.value / categorySpending.reduce((sum, cat) => sum + cat.value, 0)) * 100).toFixed(1)}% of total
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${category.value.toLocaleString()}</p>
                        <Badge variant="outline">
                          {index < 2 ? 'High Priority' : index < 4 ? 'Medium' : 'Low Priority'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;