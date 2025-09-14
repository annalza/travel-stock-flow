import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: string;
  item: string;
  quantity: number;
  unit: string;
  expiry: string;
  location: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const Inventory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      item: 'Tomatoes',
      quantity: 50,
      unit: 'kg',
      expiry: '2024-01-15',
      location: 'Cold Storage A',
      status: 'In Stock'
    },
    {
      id: '2',
      item: 'Chicken Breast',
      quantity: 25,
      unit: 'kg',
      expiry: '2024-01-10',
      location: 'Freezer B',
      status: 'In Stock'
    },
    {
      id: '3',
      item: 'Olive Oil',
      quantity: 5,
      unit: 'liters',
      expiry: '2025-06-30',
      location: 'Pantry',
      status: 'Low Stock'
    },
    {
      id: '4',
      item: 'Rice',
      quantity: 100,
      unit: 'kg',
      expiry: '2024-12-31',
      location: 'Dry Storage',
      status: 'In Stock'
    }
  ]);

  const [newItem, setNewItem] = useState({
    item: '',
    quantity: 0,
    unit: '',
    expiry: '',
    location: ''
  });

  const filteredInventory = inventory.filter(item =>
    item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Stock':
        return <Badge className="bg-success text-success-foreground">{status}</Badge>;
      case 'Low Stock':
        return <Badge className="bg-warning text-warning-foreground">{status}</Badge>;
      case 'Out of Stock':
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleAddItem = () => {
    if (!newItem.item || !newItem.quantity || !newItem.unit) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const status = newItem.quantity > 20 ? 'In Stock' : newItem.quantity > 0 ? 'Low Stock' : 'Out of Stock';
    
    const item: InventoryItem = {
      id: Date.now().toString(),
      ...newItem,
      status
    };

    setInventory([...inventory, item]);
    setNewItem({ item: '', quantity: 0, unit: '', expiry: '', location: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Item added to inventory successfully."
    });
  };

  const handleDeleteItem = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
    toast({
      title: "Success",
      description: "Item deleted from inventory."
    });
  };

  const handleStockAdjustment = (id: string, type: 'add' | 'remove') => {
    const amount = prompt(`Enter ${type === 'add' ? 'amount to add' : 'amount to remove'}:`);
    if (!amount || isNaN(Number(amount))) return;
    
    const adjustment = type === 'add' ? Number(amount) : -Number(amount);
    
    setInventory(inventory.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + adjustment);
        const status = newQuantity > 20 ? 'In Stock' : newQuantity > 0 ? 'Low Stock' : 'Out of Stock';
        return { ...item, quantity: newQuantity, status };
      }
      return item;
    }));
    
    toast({
      title: "Success",
      description: `Stock ${adjustment > 0 ? 'added' : 'reduced'} successfully.`
    });
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setNewItem({
      item: item.item,
      quantity: item.quantity,
      unit: item.unit,
      expiry: item.expiry,
      location: item.location
    });
  };

  const handleUpdateItem = () => {
    if (!editingItem || !newItem.item || !newItem.quantity || !newItem.unit) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const status = newItem.quantity > 20 ? 'In Stock' : newItem.quantity > 0 ? 'Low Stock' : 'Out of Stock';
    
    setInventory(inventory.map(item => 
      item.id === editingItem.id 
        ? { ...editingItem, ...newItem, status }
        : item
    ));
    
    setEditingItem(null);
    setNewItem({ item: '', quantity: 0, unit: '', expiry: '', location: '' });
    
    toast({
      title: "Success",
      description: "Item updated successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage your restaurant inventory
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="item">Item Name</Label>
                <Input
                  id="item"
                  value={newItem.item}
                  onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
                  placeholder="Enter item name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    placeholder="kg, liters, pieces"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  type="date"
                  value={newItem.expiry}
                  onChange={(e) => setNewItem({ ...newItem, expiry: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  placeholder="Storage location"
                />
              </div>
              <Button onClick={editingItem ? handleUpdateItem : handleAddItem} className="w-full">
                {editingItem ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Inventory Items
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.item}</TableCell>
                  <TableCell>{item.quantity} {item.unit}</TableCell>
                  <TableCell>{item.expiry}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStockAdjustment(item.id, 'add')}
                      >
                        Add Stock
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStockAdjustment(item.id, 'remove')}
                      >
                        Remove Stock
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          handleEditItem(item);
                          setIsAddDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

export default Inventory;