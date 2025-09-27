import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  FileText, 
  Download, 
  Mail, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Calendar,
  Building,
  Package,
  Printer,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface MarketPrice {
  itemName: string;
  currentPrice: number;
  previousPrice: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface ProcurementInvoice {
  id: string;
  invoiceNumber: string;
  itemName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  supplier: string;
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected' | 'Paid';
  dateCreated: string;
  dueDate: string;
  notes: string;
  department: string;
  requestedBy: string;
  marketPrice?: MarketPrice;
  rejectionReason?: string;
}

const Procurement = () => {
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<ProcurementInvoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [emailAddress, setEmailAddress] = useState('');
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  // Mock market prices
  const marketPrices: MarketPrice[] = [
    {
      itemName: 'Fresh Salmon',
      currentPrice: 28.50,
      previousPrice: 26.00,
      trend: 'up',
      lastUpdated: '2024-01-08 09:30'
    },
    {
      itemName: 'Organic Vegetables',
      currentPrice: 4.20,
      previousPrice: 4.50,
      trend: 'down',
      lastUpdated: '2024-01-08 10:15'
    },
    {
      itemName: 'Premium Beef',
      currentPrice: 32.00,
      previousPrice: 32.00,
      trend: 'stable',
      lastUpdated: '2024-01-08 08:45'
    }
  ];

  const [invoices, setInvoices] = useState<ProcurementInvoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-001',
      itemName: 'Fresh Salmon',
      quantity: 20,
      unit: 'kg',
      unitPrice: 28.50,
      totalAmount: 570.00,
      supplier: 'Ocean Fresh Supplies',
      status: 'Sent',
      dateCreated: '2024-01-08',
      dueDate: '2024-01-15',
      notes: 'Premium grade salmon for weekend special',
      department: 'Kitchen',
      requestedBy: 'Chef Manager',
      marketPrice: marketPrices[0]
    },
    {
      id: '2',
      invoiceNumber: 'INV-002',
      itemName: 'Organic Vegetables',
      quantity: 50,
      unit: 'kg',
      unitPrice: 4.20,
      totalAmount: 210.00,
      supplier: 'Green Valley Farms',
      status: 'Approved',
      dateCreated: '2024-01-07',
      dueDate: '2024-01-14',
      notes: 'Weekly fresh vegetable supply',
      department: 'Kitchen',
      requestedBy: 'Kitchen Staff',
      marketPrice: marketPrices[1]
    },
    {
      id: '3',
      invoiceNumber: 'INV-003',
      itemName: 'Premium Beef',
      quantity: 15,
      unit: 'kg',
      unitPrice: 32.00,
      totalAmount: 480.00,
      supplier: 'City Meat Market',
      status: 'Draft',
      dateCreated: '2024-01-09',
      dueDate: '2024-01-16',
      notes: 'High-grade beef for VIP dinner service',
      department: 'Kitchen',
      requestedBy: 'Head Chef',
      marketPrice: marketPrices[2]
    }
  ]);

  const [newInvoice, setNewInvoice] = useState({
    itemName: '',
    quantity: 0,
    unit: '',
    unitPrice: 0,
    supplier: '',
    dueDate: '',
    notes: '',
    department: '',
    requestedBy: ''
  });

  const suppliers = [
    'Ocean Fresh Supplies',
    'Green Valley Farms',
    'Premium Wine Co.',
    'City Meat Market',
    'Dairy Fresh Inc.'
  ];

  const departments = [
    'Kitchen',
    'Bar',
    'Front Office',
    'Housekeeping',
    'Maintenance'
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Draft': { color: 'bg-muted text-muted-foreground', variant: 'secondary' as const },
      'Sent': { color: 'bg-primary text-primary-foreground', variant: 'default' as const },
      'Approved': { color: 'bg-success text-success-foreground', variant: 'default' as const },
      'Rejected': { color: 'bg-destructive text-destructive-foreground', variant: 'destructive' as const },
      'Paid': { color: 'bg-success text-success-foreground', variant: 'default' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Draft;
    return <Badge className={config.color}>{status}</Badge>;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-destructive" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-success" />;
      default:
        return <DollarSign className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getMarketPrice = (itemName: string) => {
    return marketPrices.find(price => price.itemName === itemName);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && invoice.status.toLowerCase() === statusFilter;
  });

  const handleCreateInvoice = () => {
    if (!newInvoice.itemName || !newInvoice.quantity || !newInvoice.unitPrice || !newInvoice.supplier) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const totalAmount = newInvoice.quantity * newInvoice.unitPrice;
    const invoiceNumber = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
    
    const invoice: ProcurementInvoice = {
      id: Date.now().toString(),
      invoiceNumber,
      ...newInvoice,
      totalAmount,
      status: 'Draft',
      dateCreated: new Date().toISOString().split('T')[0],
      marketPrice: getMarketPrice(newInvoice.itemName)
    };

    setInvoices([...invoices, invoice]);
    setNewInvoice({
      itemName: '',
      quantity: 0,
      unit: '',
      unitPrice: 0,
      supplier: '',
      dueDate: '',
      notes: '',
      department: '',
      requestedBy: ''
    });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Invoice ${invoiceNumber} created successfully.`
    });
  };

  const handlePrintInvoice = async (invoice: ProcurementInvoice) => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`${invoice.invoiceNumber}.pdf`);
      
      toast({
        title: "Success",
        description: `Invoice ${invoice.invoiceNumber} exported to PDF.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEmailInvoice = async (invoice: ProcurementInvoice) => {
    if (!emailAddress) {
      toast({
        title: "Error",
        description: "Please enter an email address.",
        variant: "destructive"
      });
      return;
    }

    // Simulate email sending
    setTimeout(() => {
      toast({
        title: "Success",
        description: `Invoice ${invoice.invoiceNumber} sent to ${emailAddress}.`
      });
      setEmailAddress('');
      setIsEmailDialogOpen(false);
    }, 1000);
  };

  const handleStatusChange = (invoiceId: string, newStatus: string) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === invoiceId 
        ? { ...invoice, status: newStatus as ProcurementInvoice['status'] }
        : invoice
    ));
    
    toast({
      title: "Status Updated",
      description: `Invoice status changed to ${newStatus}.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Procurement & Billing</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage procurement invoices with real-time market pricing
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            View Reports
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Procurement Invoice</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="itemName">Item Name *</Label>
                  <Input
                    id="itemName"
                    value={newInvoice.itemName}
                    onChange={(e) => setNewInvoice({ ...newInvoice, itemName: e.target.value })}
                    placeholder="Enter item name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="supplier">Supplier *</Label>
                  <Select value={newInvoice.supplier} onValueChange={(value) => setNewInvoice({ ...newInvoice, supplier: value })}>
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
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newInvoice.quantity}
                    onChange={(e) => setNewInvoice({ ...newInvoice, quantity: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter quantity"
                  />
                </div>

                <div>
                  <Label htmlFor="unit">Unit *</Label>
                  <Input
                    id="unit"
                    value={newInvoice.unit}
                    onChange={(e) => setNewInvoice({ ...newInvoice, unit: e.target.value })}
                    placeholder="kg, liters, pieces"
                  />
                </div>

                <div>
                  <Label htmlFor="unitPrice">Unit Price ($) *</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="0.01"
                    value={newInvoice.unitPrice}
                    onChange={(e) => setNewInvoice({ ...newInvoice, unitPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                  {getMarketPrice(newInvoice.itemName) && (
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      {getTrendIcon(getMarketPrice(newInvoice.itemName)!.trend)}
                      <span className="ml-1">
                        Market: ${getMarketPrice(newInvoice.itemName)!.currentPrice}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={newInvoice.department} onValueChange={(value) => setNewInvoice({ ...newInvoice, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="requestedBy">Requested By</Label>
                  <Input
                    id="requestedBy"
                    value={newInvoice.requestedBy}
                    onChange={(e) => setNewInvoice({ ...newInvoice, requestedBy: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newInvoice.notes}
                    onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                    placeholder="Additional notes or requirements"
                    rows={3}
                  />
                </div>

                <div className="col-span-2">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Total Amount:</span>
                    <span className="text-xl font-bold">
                      ${(newInvoice.quantity * newInvoice.unitPrice || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 flex gap-3">
                  <Button onClick={handleCreateInvoice} className="flex-1">
                    Create Invoice
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Market Prices Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Today's Market Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {marketPrices.map((price) => (
              <div key={price.itemName} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{price.itemName}</p>
                  <p className="text-sm text-muted-foreground">
                    Updated: {price.lastUpdated}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    {getTrendIcon(price.trend)}
                    <span className="font-bold ml-2">${price.currentPrice}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    From ${price.previousPrice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Procurement Invoices ({filteredInvoices.length})
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{invoice.itemName}</p>
                      {invoice.marketPrice && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          {getTrendIcon(invoice.marketPrice.trend)}
                          <span className="ml-1">Market: ${invoice.marketPrice.currentPrice}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{invoice.supplier}</TableCell>
                  <TableCell>{invoice.quantity} {invoice.unit}</TableCell>
                  <TableCell>${invoice.unitPrice.toFixed(2)}</TableCell>
                  <TableCell className="font-medium">${invoice.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedInvoice(invoice)}>
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <div className="space-y-6">
                            {/* Invoice Header */}
                            <div ref={invoiceRef} className="bg-white p-8 rounded-lg">
                              <div className="flex justify-between items-start mb-8">
                                <div>
                                  <h2 className="text-3xl font-bold text-gray-900">INVOICE</h2>
                                  <p className="text-gray-600">{selectedInvoice?.invoiceNumber}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-primary">HospitalityERP</div>
                                  <p className="text-gray-600">Procurement Management</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-8 mb-8">
                                <div>
                                  <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                                  <div className="text-gray-600">
                                    <p className="font-medium">{selectedInvoice?.supplier}</p>
                                    <p>Supplier Address</p>
                                    <p>City, State 12345</p>
                                  </div>
                                </div>
                                <div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-gray-600">Date Created:</p>
                                      <p className="font-medium">{selectedInvoice?.dateCreated}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600">Due Date:</p>
                                      <p className="font-medium">{selectedInvoice?.dueDate}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600">Department:</p>
                                      <p className="font-medium">{selectedInvoice?.department}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600">Requested By:</p>
                                      <p className="font-medium">{selectedInvoice?.requestedBy}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Invoice Items */}
                              <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                                <table className="w-full">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="text-left p-4 font-medium text-gray-900">Item</th>
                                      <th className="text-right p-4 font-medium text-gray-900">Quantity</th>
                                      <th className="text-right p-4 font-medium text-gray-900">Unit Price</th>
                                      <th className="text-right p-4 font-medium text-gray-900">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="border-t border-gray-200">
                                      <td className="p-4">
                                        <div>
                                          <p className="font-medium text-gray-900">{selectedInvoice?.itemName}</p>
                                          {selectedInvoice?.marketPrice && (
                                            <div className="flex items-center text-sm text-gray-500">
                                              {getTrendIcon(selectedInvoice.marketPrice.trend)}
                                              <span className="ml-1">Market Rate: ${selectedInvoice.marketPrice.currentPrice}</span>
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                      <td className="text-right p-4 text-gray-900">
                                        {selectedInvoice?.quantity} {selectedInvoice?.unit}
                                      </td>
                                      <td className="text-right p-4 text-gray-900">
                                        ${selectedInvoice?.unitPrice.toFixed(2)}
                                      </td>
                                      <td className="text-right p-4 font-medium text-gray-900">
                                        ${selectedInvoice?.totalAmount.toFixed(2)}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>

                              {/* Total */}
                              <div className="flex justify-end mb-6">
                                <div className="w-64">
                                  <div className="flex justify-between items-center py-2 border-t border-gray-200">
                                    <span className="font-bold text-gray-900">Total Amount:</span>
                                    <span className="font-bold text-xl text-gray-900">
                                      ${selectedInvoice?.totalAmount.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Notes */}
                              {selectedInvoice?.notes && (
                                <div className="border-t border-gray-200 pt-6">
                                  <h4 className="font-medium text-gray-900 mb-2">Notes:</h4>
                                  <p className="text-gray-600">{selectedInvoice.notes}</p>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => handlePrintInvoice(selectedInvoice!)}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Export PDF
                                </Button>
                                <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button variant="outline">
                                      <Mail className="h-4 w-4 mr-2" />
                                      Send Email
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Send Invoice via Email</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                          id="email"
                                          type="email"
                                          value={emailAddress}
                                          onChange={(e) => setEmailAddress(e.target.value)}
                                          placeholder="supplier@example.com"
                                        />
                                      </div>
                                      <div className="flex gap-2">
                                        <Button onClick={() => handleEmailInvoice(selectedInvoice!)}>
                                          Send Email
                                        </Button>
                                        <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                              
                              <div className="flex gap-2">
                                <Select 
                                  value={selectedInvoice?.status} 
                                  onValueChange={(value) => handleStatusChange(selectedInvoice!.id, value)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Sent">Sent</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                    <SelectItem value="Paid">Paid</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
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
          {filteredInvoices.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No invoices found matching your search criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Procurement;