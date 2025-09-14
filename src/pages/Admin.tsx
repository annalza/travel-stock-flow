import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserCheck, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProcurementOrder {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  supplier: string;
  
  status: 'Pending' | 'Approved' | 'Rejected';
  dateRequested: string;
  notes: string;
  requestedBy: string;
  rejectionReason?: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<ProcurementOrder | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [orders, setOrders] = useState<ProcurementOrder[]>([
    {
      id: '1',
      itemName: 'Fresh Salmon',
      quantity: 20,
      unit: 'kg',
      supplier: 'Ocean Fresh Supplies',
      
      status: 'Pending',
      dateRequested: '2024-01-08',
      notes: 'Need for weekend special menu',
      requestedBy: 'Chef Manager'
    },
    {
      id: '2',
      itemName: 'Organic Vegetables',
      quantity: 50,
      unit: 'kg',
      supplier: 'Green Valley Farms',
      
      status: 'Approved',
      dateRequested: '2024-01-07',
      notes: 'Weekly vegetable order',
      requestedBy: 'Kitchen Staff'
    },
    {
      id: '3',
      itemName: 'Wine Bottles',
      quantity: 24,
      unit: 'bottles',
      supplier: 'Premium Wine Co.',
      
      status: 'Rejected',
      dateRequested: '2024-01-06',
      notes: 'For wine tasting event',
      requestedBy: 'Event Manager',
      rejectionReason: 'Budget constraints for this quarter'
    },
    {
      id: '4',
      itemName: 'Premium Beef',
      quantity: 15,
      unit: 'kg',
      supplier: 'City Meat Market',
      
      status: 'Pending',
      dateRequested: '2024-01-09',
      notes: 'Urgent requirement for VIP dinner',
      requestedBy: 'Head Chef'
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-success text-success-foreground">{status}</Badge>;
      case 'Pending':
        return <Badge className="bg-warning text-warning-foreground">{status}</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };


  const handleApproveOrder = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'Approved' as const }
        : order
    ));
    
    toast({
      title: "Order Approved",
      description: `Procurement order ${orderId} has been approved.`,
    });
  };

  const handleRejectOrder = (orderId: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection.",
        variant: "destructive"
      });
      return;
    }

    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'Rejected' as const, rejectionReason }
        : order
    ));
    
    setRejectionReason('');
    setIsRejectDialogOpen(false);
    setSelectedOrder(null);
    
    toast({
      title: "Order Rejected",
      description: `Procurement order ${orderId} has been rejected.`,
      variant: "destructive"
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && order.status.toLowerCase() === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Review and manage procurement orders
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Orders
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{orders.filter(o => o.status === 'Pending').length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {orders.filter(o => o.status === 'Approved').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejected Orders
            </CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {orders.filter(o => o.status === 'Rejected').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {orders.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Orders */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <UserCheck className="h-5 w-5 mr-2" />
              All Orders ({filteredOrders.length})
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.itemName}</TableCell>
                  <TableCell>{order.quantity} {order.unit}</TableCell>
                  <TableCell>{order.supplier}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.requestedBy}</TableCell>
                  <TableCell>{order.dateRequested}</TableCell>
                  <TableCell>
                    {order.status === 'Pending' ? (
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveOrder(order.id)}
                          className="bg-success hover:bg-success/90 text-success-foreground"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        
                        <Dialog open={isRejectDialogOpen && selectedOrder?.id === order.id} 
                               onOpenChange={(open) => {
                                 setIsRejectDialogOpen(open);
                                 if (!open) {
                                   setSelectedOrder(null);
                                   setRejectionReason('');
                                 }
                               }}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsRejectDialogOpen(true);
                              }}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Order</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Order: {order.itemName}</Label>
                                <p className="text-sm text-muted-foreground">
                                  {order.quantity} {order.unit} from {order.supplier}
                                </p>
                              </div>
                              <div>
                                <Label htmlFor="rejectionReason">Reason for Rejection *</Label>
                                <Textarea
                                  id="rejectionReason"
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  placeholder="Please provide a detailed reason for rejecting this order..."
                                  rows={4}
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => handleRejectOrder(order.id)}
                                >
                                  Reject Order
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {order.rejectionReason || 'No actions available'}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No orders found matching your search criteria
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
};

export default Admin;