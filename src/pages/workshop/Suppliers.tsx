import { useState } from "react";
import { Plus, Search, Truck, MoreHorizontal, Filter, Edit, Trash2, Power, PowerOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { mockSuppliers, Supplier } from "@/data/suppliersData";

export default function Suppliers() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [suppliers, setSuppliers] = useState(mockSuppliers);

  // Sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formName, setFormName] = useState("");
  const [formContact, setFormContact] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [nameError, setNameError] = useState(false);

  // Delete state
  const [deleteSupplierIdOpen, setDeleteSupplierIdOpen] = useState<string | null>(null);

  const activeCount = suppliers.filter(s => s.isActive).length;
  const inactiveCount = suppliers.length - activeCount;
  const totalPurchased = suppliers.filter(s => s.isActive).reduce((sum, s) => sum + s.totalPurchased, 0);

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.contactPerson.toLowerCase().includes(search.toLowerCase()) || 
                          s.email.toLowerCase().includes(search.toLowerCase()) ||
                          s.phone.includes(search);
    if (!matchesSearch) return false;
    if (filter === "Active") return s.isActive;
    if (filter === "Inactive") return !s.isActive;
    return true;
  });

  const toggleStatus = (id: string) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === id) {
        const newStatus = !s.isActive;
        toast({ title: "Supplier updated", description: `${s.name} is now ${newStatus ? 'active' : 'inactive'}.` });
        return { ...s, isActive: newStatus };
      }
      return s;
    }));
  };

  const openAddSheet = () => {
    setEditingSupplier(null);
    setFormName("");
    setFormContact("");
    setFormPhone("");
    setFormEmail("");
    setFormAddress("");
    setFormNotes("");
    setFormActive(true);
    setNameError(false);
    setSheetOpen(true);
  };

  const openEditSheet = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormName(supplier.name);
    setFormContact(supplier.contactPerson);
    setFormPhone(supplier.phone);
    setFormEmail(supplier.email);
    setFormAddress(supplier.address);
    setFormNotes(supplier.notes);
    setFormActive(supplier.isActive);
    setNameError(false);
    setSheetOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      setNameError(true);
      return;
    }
    if (editingSupplier) {
      setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? {
        ...s,
        name: formName.trim(),
        contactPerson: formContact.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        address: formAddress.trim(),
        notes: formNotes.trim(),
        isActive: formActive,
      } : s));
      toast({ title: "Supplier updated", description: `${formName.trim()} has been updated.` });
    } else {
      const newSupplier: Supplier = {
        id: `sup-${Date.now()}`,
        name: formName.trim(),
        contactPerson: formContact.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        address: formAddress.trim(),
        notes: formNotes.trim(),
        isActive: formActive,
        linkedItemsCount: 0,
        totalPurchased: 0,
      };
      setSuppliers(prev => [newSupplier, ...prev]);
      toast({ title: "Supplier added", description: `${formName.trim()} has been added.` });
    }
    setSheetOpen(false);
  };

  const handleDelete = () => {
    if (!deleteSupplierIdOpen) return;
    const s = suppliers.find(s => s.id === deleteSupplierIdOpen);
    setSuppliers(prev => prev.filter(s => s.id !== deleteSupplierIdOpen));
    toast({ title: "Supplier deleted", description: `${s?.name || "Supplier"} has been removed.` });
    setDeleteSupplierIdOpen(null);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage vendor relationships and procurement tracking</p>
        </div>
        <Button onClick={openAddSheet}>
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground mb-1">Total Suppliers</p>
            <p className="text-2xl font-bold">{activeCount}</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground mb-1">Inactive Suppliers</p>
            <p className="text-2xl font-bold">{inactiveCount}</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground mb-1">Total Procurement Value</p>
            <p className="text-2xl font-bold text-accent">${totalPurchased.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, contact, email..." 
            className="pl-9 bg-background"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="bg-background">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card className="shadow-soft border-border/50">
        <CardContent className="p-0">
          {filteredSuppliers.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No suppliers found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Add suppliers to track procurement and link them to your inventory items.
              </p>
              <Button className="mt-4" variant="outline" onClick={openAddSheet}>
                <Plus className="w-4 h-4 mr-2" />
                Add Supplier
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/50 text-muted-foreground text-xs uppercase whitespace-nowrap">
                  <tr>
                    <th className="px-5 py-3 font-medium">Supplier</th>
                    <th className="px-5 py-3 font-medium">Contact</th>
                    <th className="px-5 py-3 font-medium hidden lg:table-cell">Address</th>
                    <th className="px-5 py-3 font-medium text-center">Linked Items</th>
                    <th className="px-5 py-3 font-medium">Total Purchased</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredSuppliers.map((s) => (
                    <tr 
                      key={s.id} 
                      className={`hover:bg-secondary/20 transition-colors ${!s.isActive ? 'opacity-60 bg-secondary/10' : ''}`}
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className={`font-bold text-foreground ${!s.isActive ? 'line-through decoration-muted-foreground/50' : ''}`}>
                          {s.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{s.contactPerson}</div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-[13px]">{s.email}</div>
                        <div className="text-[12px] text-muted-foreground">{s.phone}</div>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground hidden lg:table-cell max-w-[200px] truncate">
                        {s.address}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-center">
                        <Badge variant="secondary">{s.linkedItemsCount}</Badge>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-medium">
                        ${s.totalPurchased.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {s.isActive ? (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditSheet(s)}>
                              <Edit className="w-4 h-4 mr-2" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleStatus(s.id)}>
                              {s.isActive ? (
                                <><PowerOff className="w-4 h-4 mr-2" /> Mark Inactive</>
                              ) : (
                                <><Power className="w-4 h-4 mr-2" /> Mark Active</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => setDeleteSupplierIdOpen(s.id)}>
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

      {/* Add/Edit Supplier Dialog */}
      <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="sup-name">Supplier Name <span className="text-destructive">*</span></Label>
              <Input id="sup-name" value={formName} onChange={e => { setFormName(e.target.value); setNameError(false); }} placeholder="Company name" className="mt-1.5" />
              {nameError && <p className="text-destructive text-xs mt-1">Supplier name is required</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="sup-contact">Contact Person</Label>
                <Input id="sup-contact" value={formContact} onChange={e => setFormContact(e.target.value)} placeholder="Full name" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="sup-phone">Phone</Label>
                <Input id="sup-phone" value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="+60 12-345 6789" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="sup-email">Email</Label>
              <Input id="sup-email" type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="email@company.com" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="sup-address">Address</Label>
              <Textarea id="sup-address" value={formAddress} onChange={e => setFormAddress(e.target.value)} placeholder="Full address" rows={2} className="mt-1.5 resize-none" />
            </div>
            <div>
              <Label htmlFor="sup-notes">Notes</Label>
              <Textarea id="sup-notes" value={formNotes} onChange={e => setFormNotes(e.target.value)} placeholder="Payment terms, lead times, delivery notes..." rows={2} className="mt-1.5 resize-none" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <Label htmlFor="sup-active">Active</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Inactive suppliers are hidden from purchase order selection.</p>
              </div>
              <Switch id="sup-active" checked={formActive} onCheckedChange={setFormActive} />
            </div>
          </div>
          <DialogFooter className="flex flex-row gap-2 sm:justify-end">
            <Button variant="ghost" onClick={() => setSheetOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Supplier AlertDialog */}
      <AlertDialog open={deleteSupplierIdOpen !== null} onOpenChange={open => { if (!open) setDeleteSupplierIdOpen(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting this supplier won't affect existing purchase history or linked inventory items.
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