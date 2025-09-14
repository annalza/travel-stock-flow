import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Users, Edit, Trash2, Phone, Mail, MapPin, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  notes: string;
}

const Suppliers = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Ocean Fresh Supplies',
      contactPerson: 'John Smith',
      email: 'john@oceanfresh.com',
      phone: '+1-555-0123',
      address: '123 Harbor Street, Seafood District, City 12345',
      category: 'Seafood',
      notes: 'Premium quality seafood supplier. Reliable delivery schedule.'
    },
    {
      id: '2',
      name: 'Green Valley Farms',
      contactPerson: 'Maria Garcia',
      email: 'maria@greenvalley.com',
      phone: '+1-555-0456',
      address: '456 Farm Road, Agricultural Zone, City 67890',
      category: 'Vegetables & Fruits',
      notes: 'Organic certified. Best prices for bulk orders.'
    },
    {
      id: '3',
      name: 'Premium Wine Co.',
      contactPerson: 'Robert Johnson',
      email: 'robert@premiumwine.com',
      phone: '+1-555-0789',
      address: '789 Wine Street, Downtown, City 11111',
      category: 'Beverages',
      notes: 'Exclusive wine collection. Special event catering available.'
    },
    {
      id: '4',
      name: 'City Meat Market',
      contactPerson: 'David Brown',
      email: 'david@citymeat.com',
      phone: '+1-555-0321',
      address: '321 Butcher Lane, Market District, City 22222',
      category: 'Meat & Poultry',
      notes: 'Fresh daily cuts. Halal certified options available.'
    }
  ]);

  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    notes: ''
  });

  const categories = [
    'Seafood',
    'Vegetables & Fruits',
    'Meat & Poultry',
    'Dairy Products',
    'Beverages',
    'Dry Goods',
    'Spices & Seasonings',
    'Cleaning Supplies',
    'Equipment & Tools'
  ];

  const handleAddSupplier = () => {
    if (!newSupplier.name || !newSupplier.contactPerson || !newSupplier.email || !newSupplier.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const supplier: Supplier = {
      id: Date.now().toString(),
      ...newSupplier
    };

    setSuppliers([...suppliers, supplier]);
    setNewSupplier({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      category: '',
      notes: ''
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Supplier added successfully."
    });
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setNewSupplier({ ...supplier });
    setIsAddDialogOpen(true);
  };

  const handleUpdateSupplier = () => {
    if (!editingSupplier) return;

    setSuppliers(suppliers.map(supplier => 
      supplier.id === editingSupplier.id 
        ? { ...newSupplier, id: editingSupplier.id }
        : supplier
    ));

    setEditingSupplier(null);
    setNewSupplier({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      category: '',
      notes: ''
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Supplier updated successfully."
    });
  };

  const handleDeleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    toast({
      title: "Success",
      description: "Supplier deleted successfully."
    });
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setNewSupplier({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      category: '',
      notes: ''
    });
    setEditingSupplier(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Supplier Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your supplier database and contact information
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={newSupplier.contactPerson}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                    placeholder="Enter contact person name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newSupplier.category}
                  onChange={(e) => setNewSupplier({ ...newSupplier, category: e.target.value })}
                  placeholder="e.g., Seafood, Vegetables, Meat"
                  list="categories"
                />
                <datalist id="categories">
                  {categories.map(category => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  placeholder="Enter full address"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newSupplier.notes}
                  onChange={(e) => setNewSupplier({ ...newSupplier, notes: e.target.value })}
                  placeholder="Additional notes about the supplier"
                  rows={3}
                />
              </div>

              <Button 
                onClick={editingSupplier ? handleUpdateSupplier : handleAddSupplier} 
                className="w-full"
              >
                {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Suppliers ({suppliers.length})
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
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
                <TableHead>Company</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{supplier.name}</div>
                      {supplier.notes && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {supplier.notes.substring(0, 50)}
                          {supplier.notes.length > 50 ? '...' : ''}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{supplier.contactPerson}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-sm">
                      {supplier.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1" />
                        {supplier.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1" />
                        {supplier.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start text-sm">
                      <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{supplier.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditSupplier(supplier)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteSupplier(supplier.id)}
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

export default Suppliers;