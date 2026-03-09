import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Users, MoreHorizontal, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { mockCustomers, Customer } from "@/data/customersData";

export default function Customers() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [nameError, setNameError] = useState(false);

  // Delete state
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);

  const returningCustomers = customers.filter(c => c.totalVisits > 1).length;
  const outstandingBalanceTotal = customers.reduce((sum, c) => sum + c.outstandingBalance, 0);

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.phone.includes(search) || 
                          (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
                          c.vehicles.some(v => v.plate.toLowerCase().includes(search.toLowerCase()));
    if (!matchesSearch) return false;
    if (filter === "Has Outstanding Balance") return c.outstandingBalance > 0;
    if (filter === "Regular") return c.loyaltyStatus === "Regular" || c.loyaltyStatus === "VIP";
    if (filter === "New") return c.loyaltyStatus === "New";
    return true;
  });

  const openAddSheet = () => {
    setEditingCustomer(null);
    setFormName("");
    setFormPhone("");
    setFormEmail("");
    setFormNotes("");
    setNameError(false);
    setSheetOpen(true);
  };

  const openEditSheet = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormName(customer.name);
    setFormPhone(customer.phone);
    setFormEmail(customer.email);
    setFormNotes(customer.notes || "");
    setNameError(false);
    setSheetOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      setNameError(true);
      return;
    }
    if (editingCustomer) {
      setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? { ...c, name: formName.trim(), phone: formPhone.trim(), email: formEmail.trim(), notes: formNotes.trim() || undefined } : c));
      toast({ title: "Customer updated", description: `${formName.trim()} has been updated.` });
    } else {
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        name: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        notes: formNotes.trim() || undefined,
        totalVisits: 0,
        totalSpent: 0,
        outstandingBalance: 0,
        firstVisitDate: new Date().toISOString().split('T')[0],
        lastVisitDate: new Date().toISOString().split('T')[0],
        vehicles: [],
        invoiceHistory: [],
        loyaltyStatus: 'New',
      };
      setCustomers(prev => [newCustomer, ...prev]);
      toast({ title: "Customer added", description: `${formName.trim()} has been added.` });
    }
    setSheetOpen(false);
  };

  const handleDelete = () => {
    if (!deleteCustomerId) return;
    const c = customers.find(c => c.id === deleteCustomerId);
    setCustomers(prev => prev.filter(c => c.id !== deleteCustomerId));
    toast({ title: "Customer deleted", description: `${c?.name || "Customer"} has been removed.` });
    setDeleteCustomerId(null);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your customer directory and visit history</p>
        </div>
        <Button onClick={openAddSheet}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground mb-1">Total Customers</p>
            <p className="text-2xl font-bold">{customers.length}</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground mb-1">Returning Customers</p>
            <p className="text-2xl font-bold">{returningCustomers}</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground mb-1">Outstanding Balance</p>
            <p className={`text-2xl font-bold ${outstandingBalanceTotal > 0 ? "text-warning" : ""}`}>
              ${outstandingBalanceTotal.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, phone, email, or plate..." 
            className="pl-9 bg-background"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="bg-background">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Customers</SelectItem>
              <SelectItem value="Has Outstanding Balance">Has Outstanding</SelectItem>
              <SelectItem value="Regular">Regulars & VIPs</SelectItem>
              <SelectItem value="New">New Customers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card className="shadow-soft border-border/50">
        <CardContent className="p-0">
          {filteredCustomers.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No customers found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Customers appear automatically when you create invoices. Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/50 text-muted-foreground text-xs uppercase whitespace-nowrap">
                  <tr>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Phone</th>
                    <th className="px-5 py-3 font-medium">Vehicles</th>
                    <th className="px-5 py-3 font-medium">Visits</th>
                    <th className="px-5 py-3 font-medium">Total Spent</th>
                    <th className="px-5 py-3 font-medium">Outstanding</th>
                    <th className="px-5 py-3 font-medium">Last Visit</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredCustomers.map((c) => (
                    <tr 
                      key={c.id} 
                      className="hover:bg-secondary/20 transition-colors cursor-pointer"
                      onClick={() => navigate(`/workshop/customers/${c.id}`)}
                    >
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xs shrink-0">
                            {c.name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-foreground">{c.name}</div>
                            {c.email && <div className="text-[11px] text-muted-foreground">{c.email}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">{c.phone}</td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex gap-1">
                          {c.vehicles.slice(0,2).map(v => (
                            <Badge key={v.plate} variant="outline" className="font-mono text-[10px] bg-background">{v.plate}</Badge>
                          ))}
                          {c.vehicles.length > 2 && (
                            <Badge variant="secondary" className="text-[10px]">+{c.vehicles.length - 2}</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <Badge variant="secondary">{c.totalVisits}</Badge>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap font-medium">${c.totalSpent.toLocaleString()}</td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        {c.outstandingBalance > 0 ? (
                          <span className="text-warning font-medium">${c.outstandingBalance.toLocaleString()}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">{c.lastVisitDate}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-right" onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/workshop/customers/${c.id}`)}>
                              <Eye className="w-4 h-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditSheet(c)}>
                              <Edit className="w-4 h-4 mr-2" /> Edit Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => setDeleteCustomerId(c.id)}>
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Customer Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editingCustomer ? "Edit Customer" : "Add Customer"}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-6">
            <div>
              <Label htmlFor="cust-name">Full Name <span className="text-destructive">*</span></Label>
              <Input id="cust-name" value={formName} onChange={e => { setFormName(e.target.value); setNameError(false); }} placeholder="Full name" className="mt-1.5" />
              {nameError && <p className="text-destructive text-xs mt-1">Name is required</p>}
            </div>
            <div>
              <Label htmlFor="cust-phone">Phone</Label>
              <Input id="cust-phone" value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="+60 12-345 6789" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="cust-email">Email</Label>
              <Input id="cust-email" type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="email@example.com" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="cust-notes">Notes</Label>
              <Textarea id="cust-notes" value={formNotes} onChange={e => setFormNotes(e.target.value)} placeholder="Internal notes about this customer..." rows={3} className="mt-1.5 resize-none" />
            </div>
          </div>
          <SheetFooter className="flex flex-row gap-2 sm:justify-end">
            <Button variant="ghost" onClick={() => setSheetOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Customer AlertDialog */}
      <AlertDialog open={deleteCustomerId !== null} onOpenChange={open => { if (!open) setDeleteCustomerId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the customer from your directory. Their invoice history will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}