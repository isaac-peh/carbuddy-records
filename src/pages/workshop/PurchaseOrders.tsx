import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ShoppingCart, Search, MoreHorizontal, Plus, AlertTriangle,
  Truck, Eye, Send, PackageCheck, XCircle, Trash2,
  ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight,
  X, DollarSign,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { mockPurchaseOrders, type PurchaseOrder, type POStatus } from "@/data/purchaseOrdersData";

const STATUS_CONFIG: Record<POStatus, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-muted text-muted-foreground border-muted" },
  ORDERED: { label: "Ordered", className: "bg-accent/10 text-accent border-accent/20" },
  PARTIALLY_RECEIVED: { label: "Partial", className: "bg-warning/10 text-warning border-warning/20" },
  RECEIVED: { label: "Received", className: "bg-success/10 text-success border-success/20" },
  CANCELLED: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const STATUS_TABS: { value: string; label: string; filter: (po: PurchaseOrder) => boolean }[] = [
  { value: "All", label: "All", filter: () => true },
  { value: "DRAFT", label: "Draft", filter: po => po.status === "DRAFT" },
  { value: "ORDERED", label: "Ordered", filter: po => po.status === "ORDERED" },
  { value: "PARTIALLY_RECEIVED", label: "Partial", filter: po => po.status === "PARTIALLY_RECEIVED" },
  { value: "RECEIVED", label: "Received", filter: po => po.status === "RECEIVED" },
  { value: "CANCELLED", label: "Cancelled", filter: po => po.status === "CANCELLED" },
];

type SortKey = "poNumber" | "supplierName" | "totalAmount" | "status" | "orderDate" | "expectedDeliveryDate";
type SortDir = "asc" | "desc";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function SortableHead({ label, sortKey, currentSort, currentDir, onSort, className }: {
  label: string;
  sortKey: SortKey;
  currentSort: SortKey | null;
  currentDir: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const active = currentSort === sortKey;
  return (
    <TableHead className={`text-xs font-medium ${className ?? ""}`}>
      <button
        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
        onClick={() => onSort(sortKey)}
      >
        {label}
        {active
          ? (currentDir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)
          : <ArrowUpDown className="w-3 h-3 opacity-40" />}
      </button>
    </TableHead>
  );
}

function isOverdue(po: PurchaseOrder) {
  if (po.status !== "ORDERED" && po.status !== "PARTIALLY_RECEIVED") return false;
  if (!po.expectedDeliveryDate) return false;
  return new Date(po.expectedDeliveryDate) < new Date();
}

export default function PurchaseOrders() {
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState(mockPurchaseOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Dialog states
  const [submitPOId, setSubmitPOId] = useState<string | null>(null);
  const [cancelPOId, setCancelPOId] = useState<string | null>(null);
  const [deletePOId, setDeletePOId] = useState<string | null>(null);
  const [receivePO, setReceivePO] = useState<PurchaseOrder | null>(null);
  const [receiveQtys, setReceiveQtys] = useState<Record<string, number>>({});

  // KPIs (derived from full list, not filtered view)
  const nonCancelledCount = purchaseOrders.filter(po => po.status !== "CANCELLED").length;
  const pendingDeliveryCount = purchaseOrders.filter(po => po.status === "ORDERED" || po.status === "PARTIALLY_RECEIVED").length;
  const overdueCount = purchaseOrders.filter(isOverdue).length;
  const openValue = purchaseOrders
    .filter(po => po.status === "ORDERED" || po.status === "PARTIALLY_RECEIVED")
    .reduce((s, po) => s + po.totalAmount, 0);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    STATUS_TABS.forEach(t => { counts[t.value] = purchaseOrders.filter(t.filter).length; });
    return counts;
  }, [purchaseOrders]);

  const filtered = useMemo(() => {
    const tab = STATUS_TABS.find(t => t.value === statusFilter)!;
    return purchaseOrders.filter(po => {
      if (!tab.filter(po)) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return po.poNumber.toLowerCase().includes(q) ||
        (po.supplierName || "").toLowerCase().includes(q) ||
        po.lines.some(l => l.name.toLowerCase().includes(q));
    });
  }, [purchaseOrders, search, statusFilter]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number")
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      const aStr = aVal == null ? "" : String(aVal);
      const bStr = bVal == null ? "" : String(bVal);
      return sortDir === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [filtered, sortKey, sortDir]);

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedPOs = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSubmitOrder = () => {
    if (!submitPOId) return;
    setPurchaseOrders(prev => prev.map(po =>
      po.id === submitPOId ? { ...po, status: "ORDERED" as POStatus, orderDate: new Date().toISOString().slice(0, 10) } : po
    ));
    toast.success("Order submitted");
    setSubmitPOId(null);
  };

  const handleCancel = () => {
    if (!cancelPOId) return;
    setPurchaseOrders(prev => prev.map(po =>
      po.id === cancelPOId ? { ...po, status: "CANCELLED" as POStatus } : po
    ));
    toast.success("Purchase order cancelled");
    setCancelPOId(null);
  };

  const handleDelete = () => {
    if (!deletePOId) return;
    setPurchaseOrders(prev => prev.filter(po => po.id !== deletePOId));
    toast.success("Purchase order deleted");
    setDeletePOId(null);
  };

  const openReceiveDialog = (po: PurchaseOrder) => {
    setReceivePO(po);
    const qtys: Record<string, number> = {};
    po.lines.forEach(l => { qtys[l.id] = Math.max(0, l.quantityOrdered - l.quantityReceived); });
    setReceiveQtys(qtys);
  };

  const hasOverReceipt = receivePO?.lines.some(l => {
    const receiving = receiveQtys[l.id] || 0;
    return l.quantityReceived + receiving > l.quantityOrdered;
  });

  const handleConfirmReceipt = () => {
    if (!receivePO) return;
    setPurchaseOrders(prev => prev.map(po => {
      if (po.id !== receivePO.id) return po;
      const updatedLines = po.lines.map(l => ({
        ...l,
        quantityReceived: l.quantityReceived + (receiveQtys[l.id] || 0),
      }));
      const allReceived = updatedLines.every(l => l.quantityReceived >= l.quantityOrdered);
      const someReceived = updatedLines.some(l => l.quantityReceived > 0);
      let newStatus: POStatus = po.status;
      if (allReceived) newStatus = "RECEIVED";
      else if (someReceived) newStatus = "PARTIALLY_RECEIVED";
      return {
        ...po,
        lines: updatedLines,
        status: newStatus,
        receivedDate: allReceived ? new Date().toISOString().slice(0, 10) : po.receivedDate,
      };
    }));
    const allDone = receivePO.lines.every(l => (l.quantityReceived + (receiveQtys[l.id] || 0)) >= l.quantityOrdered);
    toast.success(allDone ? "Goods received. Stock levels updated." : "Partial receipt recorded.");
    setReceivePO(null);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Purchase Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Track procurement and supplier orders</p>
        </div>
        <Button onClick={() => navigate("/workshop/purchase-orders/new")}>
          <Plus className="w-4 h-4 mr-2" /> New Purchase Order
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <ShoppingCart className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{nonCancelledCount}</p>
              <p className="text-xs text-muted-foreground">Total POs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", pendingDeliveryCount > 0 ? "bg-warning/10" : "bg-secondary")}>
              <Truck className={cn("w-4 h-4", pendingDeliveryCount > 0 ? "text-warning" : "text-muted-foreground")} />
            </div>
            <div>
              <p className={cn("text-xl font-bold", pendingDeliveryCount > 0 ? "text-warning" : "text-foreground")}>{pendingDeliveryCount}</p>
              <p className="text-xs text-muted-foreground">Pending Delivery</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", overdueCount > 0 ? "bg-destructive/10" : "bg-secondary")}>
              <AlertTriangle className={cn("w-4 h-4", overdueCount > 0 ? "text-destructive" : "text-muted-foreground")} />
            </div>
            <div>
              <p className={cn("text-xl font-bold", overdueCount > 0 ? "text-destructive" : "text-foreground")}>{overdueCount}</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xl font-bold text-accent">${openValue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Open Value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:max-w-sm flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search PO number, supplier, item..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className={`pl-9 bg-secondary/60 border-0 shadow-soft ${search ? "pr-8" : ""}`}
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setCurrentPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_TABS.map(tab => (
            <Button
              key={tab.value}
              variant="outline"
              size="sm"
              className={cn(
                "text-sm gap-1.5 px-4",
                statusFilter === tab.value
                  ? "bg-accent text-accent-foreground border-accent hover:bg-accent/90 hover:text-accent-foreground"
                  : "hover:bg-secondary hover:text-foreground"
              )}
              onClick={() => { setStatusFilter(tab.value); setCurrentPage(1); }}
            >
              {tab.label}
              <Badge variant="secondary" className="ml-1 text-[10px] h-5 px-1.5">{statusCounts[tab.value]}</Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="shadow-soft border-border/50 overflow-hidden">
        {sorted.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
              <ShoppingCart className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">
              {search ? "No purchase orders found" : "No purchase orders yet"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {search
                ? `No results for "${search}". Try a different search.`
                : "Create a PO to start tracking procurement."}
            </p>
            {!search && (
              <Button className="mt-4" onClick={() => navigate("/workshop/purchase-orders/new")}>
                <Plus className="w-4 h-4 mr-2" /> New Purchase Order
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/30">
                    <SortableHead label="PO Number" sortKey="poNumber" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                    <SortableHead label="Supplier" sortKey="supplierName" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                    <TableHead className="text-xs font-medium text-center whitespace-nowrap">Items</TableHead>
                    <SortableHead label="Total" sortKey="totalAmount" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="text-right whitespace-nowrap" />
                    <SortableHead label="Status" sortKey="status" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                    <SortableHead label="Order Date" sortKey="orderDate" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="whitespace-nowrap" />
                    <SortableHead label="Expected Delivery" sortKey="expectedDeliveryDate" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="whitespace-nowrap" />
                    <TableHead className="w-px" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPOs.map(po => {
                    const cfg = STATUS_CONFIG[po.status];
                    const overdue = isOverdue(po);
                    return (
                      <TableRow key={po.id} className="cursor-pointer hover:bg-secondary/20" onClick={() => navigate(`/workshop/purchase-orders/${po.id}`)}>
                        <TableCell>
                          <span className={cn("font-mono text-sm font-medium", po.status === "CANCELLED" && "line-through text-muted-foreground")}>
                            {po.poNumber}
                          </span>
                        </TableCell>
                        <TableCell>
                          {po.supplierName ? (
                            <span className="text-sm">{po.supplierName}</span>
                          ) : (
                            <span className="text-sm italic text-muted-foreground">Ad-hoc (No Supplier)</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{po.lines.length}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium text-sm">${po.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-[11px]", cfg.className)}>{cfg.label}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{po.orderDate || "—"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm text-muted-foreground">{po.expectedDeliveryDate || "—"}</span>
                            {overdue && <Badge variant="outline" className="text-[10px] bg-destructive/10 text-destructive border-destructive/20">Overdue</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/workshop/purchase-orders/${po.id}`)}>
                                <Eye className="w-4 h-4 mr-2" /> View
                              </DropdownMenuItem>
                              {po.status === "DRAFT" && (
                                <DropdownMenuItem onClick={() => setSubmitPOId(po.id)}>
                                  <Send className="w-4 h-4 mr-2" /> Submit Order
                                </DropdownMenuItem>
                              )}
                              {(po.status === "ORDERED" || po.status === "PARTIALLY_RECEIVED") && (
                                <DropdownMenuItem onClick={() => openReceiveDialog(po)}>
                                  <PackageCheck className="w-4 h-4 mr-2" /> Receive Goods
                                </DropdownMenuItem>
                              )}
                              {(po.status === "DRAFT" || po.status === "CANCELLED") && <DropdownMenuSeparator />}
                              {po.status === "DRAFT" && (
                                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => setCancelPOId(po.id)}>
                                  <XCircle className="w-4 h-4 mr-2" /> Cancel PO
                                </DropdownMenuItem>
                              )}
                              {(po.status === "DRAFT" || po.status === "CANCELLED") && (
                                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => setDeletePOId(po.id)}>
                                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </DropdownMenuItem>
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

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Rows per page</span>
                <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
                  <SelectTrigger className="h-7 w-[60px] text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map((s) => (
                      <SelectItem key={s} value={String(s)}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="ml-2">
                  {totalCount === 0 ? "0" : `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, totalCount)}`} of {totalCount}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Submit Order AlertDialog */}
      <AlertDialog open={submitPOId !== null} onOpenChange={open => { if (!open) setSubmitPOId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Order</AlertDialogTitle>
            <AlertDialogDescription>Submitting this order will notify your supplier. Continue?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleSubmitOrder}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel PO AlertDialog */}
      <AlertDialog open={cancelPOId !== null} onOpenChange={open => { if (!open) setCancelPOId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Purchase Order</AlertDialogTitle>
            <AlertDialogDescription>This PO will be cancelled. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleCancel}>Cancel PO</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete PO AlertDialog */}
      <AlertDialog open={deletePOId !== null} onOpenChange={open => { if (!open) setDeletePOId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Purchase Order</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the purchase order.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Receive Goods Dialog */}
      <Dialog open={receivePO !== null} onOpenChange={open => { if (!open) setReceivePO(null); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Receive Goods — {receivePO?.poNumber}</DialogTitle>
            <DialogDescription>Enter the quantities received for each item. You can receive partially.</DialogDescription>
          </DialogHeader>
          {receivePO && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50">
                      <TableHead className="text-xs">Item</TableHead>
                      <TableHead className="text-xs">SKU</TableHead>
                      <TableHead className="text-xs text-center">Ordered</TableHead>
                      <TableHead className="text-xs text-center">Already Received</TableHead>
                      <TableHead className="text-xs text-center">Receiving Now</TableHead>
                      <TableHead className="text-xs text-center">Remaining</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receivePO.lines.map(line => {
                      const receiving = receiveQtys[line.id] || 0;
                      const remaining = line.quantityOrdered - line.quantityReceived - receiving;
                      return (
                        <TableRow key={line.id}>
                          <TableCell className="text-sm font-medium">{line.name}</TableCell>
                          <TableCell className="text-xs font-mono text-muted-foreground">{line.sku}</TableCell>
                          <TableCell className="text-center text-sm">{line.quantityOrdered}</TableCell>
                          <TableCell className="text-center text-sm">{line.quantityReceived}</TableCell>
                          <TableCell className="text-center">
                            <Input
                              type="number"
                              min={0}
                              className="w-20 mx-auto text-center h-8 text-sm"
                              value={receiving}
                              onChange={e => setReceiveQtys(prev => ({ ...prev, [line.id]: Math.max(0, parseInt(e.target.value) || 0) }))}
                            />
                          </TableCell>
                          <TableCell className={cn("text-center text-sm font-medium", remaining < 0 && "text-destructive")}>
                            {remaining}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {hasOverReceipt && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-warning/10 border border-warning/20">
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                  <p className="text-xs text-warning">One or more items will be over-received. This is allowed but please verify quantities.</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex flex-row gap-2 sm:justify-end">
            <Button variant="ghost" onClick={() => setReceivePO(null)}>Cancel</Button>
            <Button className="bg-success text-success-foreground hover:bg-success/90" onClick={handleConfirmReceipt}>Confirm Receipt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
