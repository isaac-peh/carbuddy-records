import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO, isAfter, isBefore, startOfDay } from "date-fns";
import { toast } from "sonner";
import {
  FileText, Search, Plus, DollarSign, Clock,
  CheckCircle2, XCircle, MoreHorizontal, Eye, Send,
  Printer, Pencil, Trash2, CalendarIcon, X, FileSearch, Ban,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { mockInvoices as initialInvoices, type Invoice } from "@/data/invoicesData";

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string }> = {
  Paid: { icon: CheckCircle2, color: "bg-success/10 text-success border-success/20" },
  Pending: { icon: Clock, color: "bg-accent/10 text-accent border-accent/20" },
  Overdue: { icon: XCircle, color: "bg-destructive/10 text-destructive border-destructive/20" },
  Draft: { icon: FileText, color: "bg-muted text-muted-foreground border-muted" },
  Voided: { icon: Ban, color: "bg-muted text-muted-foreground/60 border-muted line-through" },
};

const tabs = ["All", "Paid", "Pending", "Overdue", "Draft"] as const;

export default function Invoices() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  // Delete dialogs
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  // Filtering
  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        inv.number.toLowerCase().includes(search.toLowerCase()) ||
        inv.customer.toLowerCase().includes(search.toLowerCase()) ||
        inv.vehicle.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeTab === "All" || inv.status === activeTab;
      const invDate = startOfDay(parseISO(inv.date));
      const matchesFrom = dateFrom ? !isBefore(invDate, startOfDay(dateFrom)) : true;
      const matchesTo = dateTo ? !isAfter(invDate, startOfDay(dateTo)) : true;
      return matchesSearch && matchesTab && matchesFrom && matchesTo;
    });
  }, [invoices, search, activeTab, dateFrom, dateTo]);

  const totalPaid = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter((i) => i.status === "Pending").reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);

  // Selection helpers
  const allVisibleSelected = filtered.length > 0 && filtered.every((inv) => selected.has(inv.id));
  const toggleAll = () => {
    if (allVisibleSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((inv) => inv.id)));
    }
  };
  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Actions
  const markAsPaid = (id: string) => {
    setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, status: "Paid" as const } : inv));
    toast.success("Invoice marked as paid");
  };

  const voidInvoice = (id: string) => {
    setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, status: "Voided" as const } : inv));
    toast.success("Invoice voided");
  };

  const bulkMarkAsPaid = () => {
    setInvoices((prev) => prev.map((inv) => selected.has(inv.id) ? { ...inv, status: "Paid" as const } : inv));
    toast.success(`${selected.size} invoice(s) marked as paid`);
    setSelected(new Set());
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    setSelected((prev) => { const next = new Set(prev); next.delete(id); return next; });
    toast.success("Invoice deleted");
  };

  const bulkDelete = () => {
    setInvoices((prev) => prev.filter((inv) => !selected.has(inv.id)));
    setSelected(new Set());
    toast.success("Selected invoices deleted");
  };

  const hasDateFilter = dateFrom || dateTo;
  const hasActiveFilters = activeTab !== "All" || hasDateFilter;

  const clearFilters = () => {
    setActiveTab("All");
    setDateFrom(undefined);
    setDateTo(undefined);
    setSearch("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage service invoices for your customers
          </p>
        </div>
        <Button className="gap-2 shadow-soft" onClick={() => navigate("/workshop/invoices/new")}>
          <Plus className="w-4 h-4" />
          New Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">${totalPaid.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Collected</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">${totalPending.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-destructive" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">${totalOverdue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary/60 border-0 shadow-soft h-8"
            />
          </div>

        {/* Date Range — single popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "text-xs h-8 gap-1.5 shrink-0",
                hasDateFilter && "text-accent border-accent/30"
              )}
            >
              <CalendarIcon className="w-3 h-3" />
              {dateFrom && dateTo
                ? `${format(dateFrom, "dd MMM")} – ${format(dateTo, "dd MMM")}`
                : dateFrom
                  ? `From ${format(dateFrom, "dd MMM")}`
                  : dateTo
                    ? `Until ${format(dateTo, "dd MMM")}`
                    : "Date Range"}
              {hasDateFilter && (
                <span
                  role="button"
                  className="ml-auto sm:ml-1 rounded-full hover:bg-accent/20 p-0.5 -mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDateFrom(undefined);
                    setDateTo(undefined);
                  }}
                >
                  <X className="w-3 h-3" />
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex flex-col sm:flex-row">
              <div className="p-3 border-b sm:border-b-0 sm:border-r border-border">
                <p className="text-[10px] font-medium text-muted-foreground mb-1 px-1">From</p>
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  disabled={(d) => dateTo ? isAfter(startOfDay(d), startOfDay(dateTo)) : false}
                  initialFocus
                  className="p-0 pointer-events-auto"
                />
              </div>
              <div className="p-3">
                <p className="text-[10px] font-medium text-muted-foreground mb-1 px-1">To</p>
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  disabled={(d) => dateFrom ? isBefore(startOfDay(d), startOfDay(dateFrom)) : false}
                  initialFocus
                  className="p-0 pointer-events-auto"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              size="sm"
              className="text-xs h-8"
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab !== "All" && (
                <span className="ml-1.5 text-[10px] opacity-70">
                  {invoices.filter((i) => i.status === tab).length}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/5 px-4 py-2.5">
          <span className="text-sm font-medium text-foreground">
            {selected.size} invoice{selected.size !== 1 ? "s" : ""} selected
          </span>
          <Separator orientation="vertical" className="h-5" />
          <Button size="sm" variant="outline" className="text-xs h-7 gap-1.5" onClick={bulkMarkAsPaid}>
            <CheckCircle2 className="w-3 h-3" /> Mark as Paid
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={() => setBulkDeleteOpen(true)}
          >
            <Trash2 className="w-3 h-3" /> Delete Selected
          </Button>
          <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setSelected(new Set())}>
            Clear
          </Button>
        </div>
      )}

      {/* Table */}
      <Card className="shadow-soft border-border/50 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileSearch className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">No invoices found</h3>
            <p className="text-xs text-muted-foreground mb-4">Try adjusting your search or filters</p>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="text-xs" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30">
                  <TableHead className="w-10">
                    <Checkbox
                      checked={allVisibleSelected}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead className="text-xs font-medium">Invoice</TableHead>
                  <TableHead className="text-xs font-medium">Customer</TableHead>
                  <TableHead className="text-xs font-medium hidden md:table-cell">Vehicle</TableHead>
                  <TableHead className="text-xs font-medium hidden lg:table-cell">Plate</TableHead>
                  <TableHead className="text-xs font-medium hidden lg:table-cell">VIN</TableHead>
                  <TableHead className="text-xs font-medium text-right">Amount</TableHead>
                  <TableHead className="text-xs font-medium">Status</TableHead>
                  <TableHead className="text-xs font-medium hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-xs font-medium hidden sm:table-cell">Due Date</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((inv) => {
                  const config = statusConfig[inv.status];
                  return (
                    <TableRow
                      key={inv.id}
                      className="hover:bg-secondary/20 cursor-pointer"
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest("[data-no-row-click]") || target.closest("button") || target.closest("[role='menuitem']")) return;
                        navigate(`/workshop/invoices/${inv.id}`);
                      }}
                    >
                      <TableCell data-no-row-click>
                        <Checkbox
                          checked={selected.has(inv.id)}
                          onCheckedChange={() => toggleOne(inv.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs font-medium text-accent">{inv.number}</TableCell>
                      <TableCell className="text-sm font-medium">{inv.customer}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{inv.vehicle}</TableCell>
                      <TableCell className="hidden lg:table-cell text-xs font-mono text-muted-foreground">{inv.plateNumber}</TableCell>
                      <TableCell className="hidden lg:table-cell text-xs font-mono text-muted-foreground max-w-[180px] truncate">{inv.vin}</TableCell>
                      <TableCell className="text-right text-sm font-semibold">${inv.amount}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[11px] ${config.color}`}>
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{inv.date}</TableCell>
                      <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                        {inv.dueDate === "-" ? "—" : inv.dueDate}
                      </TableCell>
                      <TableCell data-no-row-click>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => navigate(`/workshop/invoices/${inv.id}`)}>
                              <Eye className="w-3.5 h-3.5 mr-2" /> View
                            </DropdownMenuItem>
                            {inv.status === "Draft" && (
                              <DropdownMenuItem onClick={() => navigate(`/workshop/invoices/${inv.id}/edit`)}>
                                <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
                              </DropdownMenuItem>
                            )}
                            {inv.status !== "Paid" && (
                              <DropdownMenuItem onClick={() => markAsPaid(inv.id)}>
                                <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> Mark as Paid
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => navigate(`/workshop/invoices/${inv.id}`)}>
                              <Printer className="w-3.5 h-3.5 mr-2" /> Print PDF
                            </DropdownMenuItem>
                            {inv.status !== "Draft" && (
                              <DropdownMenuItem onClick={() => toast.success("Invoice sent")}>
                                <Send className="w-3.5 h-3.5 mr-2" /> Send to Customer
                              </DropdownMenuItem>
                            )}
                            {inv.status === "Pending" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => voidInvoice(inv.id)}
                                >
                                  <Ban className="w-3.5 h-3.5 mr-2" /> Void Invoice
                                </DropdownMenuItem>
                              </>
                            )}
                            {inv.status === "Draft" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setDeleteId(inv.id)}
                                >
                                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Single Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this invoice? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { if (deleteId) deleteInvoice(deleteId); setDeleteId(null); }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selected.size} Invoice{selected.size !== 1 ? "s" : ""}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the selected invoices? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { bulkDelete(); setBulkDeleteOpen(false); }}
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
