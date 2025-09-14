import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserCheck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProcurementOrder {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  supplier: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
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

  const [orders, setOrders] = useState<ProcurementOrder[]>([
    {
      id: '1',
      itemName: 'Fresh Salmon',
      quantity: 20,
      unit: 'kg',
      supplier: 'Ocean Fresh Supplies',
      priority: 'High',
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
      priority: 'Medium',
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
      priority: 'Low',
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
      priority: 'Urgent',
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return <Badge variant="destructive">{priority}</Badge>;
      case 'High':
        return <Badge className="bg-warning text-warning-foreground">{priority}</Badge>;
      case 'Medium':
        return <Badge variant="secondary">{priority}</Badge>;
      case 'Low':
        return <Badge variant="outline">{priority}</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
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

  const pendingOrders = orders.filter(order => order.status === 'Pending');
  const processedOrders = orders.filter(order => order.status !== 'Pending');

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
            <div className="text-2xl font-bold text-foreground">{pendingOrders.length}</div>
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
              Urgent Orders
            </CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {orders.filter(o => o.priority === 'Urgent' && o.status === 'Pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-warning" />
            Pending Orders ({pendingOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.itemName}</TableCell>
                  <TableCell>{order.quantity} {order.unit}</TableCell>
                  <TableCell>{order.supplier}</TableCell>
                  <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                  <TableCell>{order.requestedBy}</TableCell>
                  <TableCell>{order.dateRequested}</TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {pendingOrders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No pending orders to review
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            Processed Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Rejection Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.itemName}</TableCell>
                  <TableCell>{order.quantity} {order.unit}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.requestedBy}</TableCell>
                  <TableCell>{order.dateRequested}</TableCell>
                  <TableCell>
                    {order.rejectionReason || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;