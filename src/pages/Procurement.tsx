import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ShoppingCart, Eye } from 'lucide-react';
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
  rejectionReason?: string;
}

const Procurement = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ProcurementOrder | null>(null);

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
      notes: 'Need for weekend special menu'
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
      notes: 'Weekly vegetable order'
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
      rejectionReason: 'Budget constraints'
    }
  ]);

  const [newOrder, setNewOrder] = useState({
    itemName: '',
    quantity: 0,
    unit: '',
    supplier: '',
    priority: 'Medium' as const,
    notes: ''
  });

  const suppliers = [
    'Ocean Fresh Supplies',
    'Green Valley Farms',
    'Premium Wine Co.',
    'City Meat Market',
    'Dairy Fresh Inc.'
  ];

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

  const handleAddOrder = () => {
    if (!newOrder.itemName || !newOrder.quantity || !newOrder.unit || !newOrder.supplier) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const order: ProcurementOrder = {
      id: Date.now().toString(),
      ...newOrder,
      status: 'Pending',
      dateRequested: new Date().toISOString().split('T')[0]
    };

    setOrders([...orders, order]);
    setNewOrder({
      itemName: '',
      quantity: 0,
      unit: '',
      supplier: '',
      priority: 'Medium',
      notes: ''
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Procurement order submitted successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Procurement Orders</h1>
          <p className="text-muted-foreground mt-2">
            Submit and track procurement requests
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Procurement Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  value={newOrder.itemName}
                  onChange={(e) => setNewOrder({ ...newOrder, itemName: e.target.value })}
                  placeholder="Enter item name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newOrder.quantity}
                    onChange={(e) => setNewOrder({ ...newOrder, quantity: parseInt(e.target.value) || 0 })}
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={newOrder.unit}
                    onChange={(e) => setNewOrder({ ...newOrder, unit: e.target.value })}
                    placeholder="kg, liters, pieces"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Select value={newOrder.supplier} onValueChange={(value) => setNewOrder({ ...newOrder, supplier: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newOrder.priority} onValueChange={(value: any) => setNewOrder({ ...newOrder, priority: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                  placeholder="Additional notes or requirements"
                  rows={3}
                />
              </div>

              <Button onClick={handleAddOrder} className="w-full">
                Submit Order
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Orders
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
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.itemName}</TableCell>
                  <TableCell>{order.quantity} {order.unit}</TableCell>
                  <TableCell>{order.supplier}</TableCell>
                  <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.dateRequested}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Order Details</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Order ID</Label>
                                <p className="text-sm font-medium">{selectedOrder.id}</p>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                              </div>
                            </div>
                            <div>
                              <Label>Item</Label>
                              <p className="text-sm font-medium">{selectedOrder.itemName}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Quantity</Label>
                                <p className="text-sm font-medium">{selectedOrder.quantity} {selectedOrder.unit}</p>
                              </div>
                              <div>
                                <Label>Priority</Label>
                                <div className="mt-1">{getPriorityBadge(selectedOrder.priority)}</div>
                              </div>
                            </div>
                            <div>
                              <Label>Supplier</Label>
                              <p className="text-sm font-medium">{selectedOrder.supplier}</p>
                            </div>
                            <div>
                              <Label>Notes</Label>
                              <p className="text-sm">{selectedOrder.notes || 'No notes provided'}</p>
                            </div>
                            {selectedOrder.rejectionReason && (
                              <div>
                                <Label>Rejection Reason</Label>
                                <p className="text-sm text-destructive">{selectedOrder.rejectionReason}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
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

export default Procurement;