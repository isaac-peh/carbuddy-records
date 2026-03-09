import { useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  ArrowLeft, CalendarIcon, Plus, Trash2, Save, Send,
  Package, FileText, StickyNote, RefreshCw, Truck,
} from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { mockParts, type Part } from "@/data/inventoryParts";
import { mockSuppliers } from "@/data/suppliersData";
import { mockPurchaseOrders, type PurchaseOrder, type PurchaseOrderLine } from "@/data/purchaseOrdersData";

// ── Helpers ─────────────────────────────────────────────────────────
let lineCounter = 0;
const nextId = () => `pol-${++lineCounter}`;
let dailyPOCounter = 0;

function generatePONumber(): string {
  dailyPOCounter++;
  const today = format(new Date(), "yyyyMMdd");
  return `PO-${today}-${String(dailyPOCounter).padStart(3, "0")}`;
}

function SectionHeader({ icon: Icon, title, accent }: { icon: React.ElementType; title: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
        accent ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <CardTitle className="text-base">{title}</CardTitle>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────
export default function CreatePurchaseOrder() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  // Load existing PO if editing
  const existingPO = isEdit ? mockPurchaseOrders.find(po => po.id === id) : null;

  // Redirect if editing non-DRAFT
  if (isEdit && existingPO && existingPO.status !== "DRAFT") {
    navigate(`/workshop/purchase-orders/${id}`, { replace: true });
    return null;
  }

  const [suggestedPONumber] = useState(() => existingPO?.poNumber || generatePONumber());
  const [poNumber, setPONumber] = useState(suggestedPONumber);
  const resetPONumber = useCallback(() => setPONumber(suggestedPONumber), [suggestedPONumber]);

  const [supplierId, setSupplierId] = useState<string | null>(existingPO?.supplierId ?? null);
  const [orderDate, setOrderDate] = useState<Date | undefined>(
    existingPO?.orderDate ? new Date(existingPO.orderDate) : new Date()
  );
  const [expectedDate, setExpectedDate] = useState<Date | undefined>(
    existingPO?.expectedDeliveryDate ? new Date(existingPO.expectedDeliveryDate) : undefined
  );
  const [notes, setNotes] = useState(existingPO?.notes || "");
  const [lines, setLines] = useState<PurchaseOrderLine[]>(existingPO?.lines || []);

  // Item picker
  const [itemSearchOpen, setItemSearchOpen] = useState(false);
  const [itemSearch, setItemSearch] = useState("");

  // Submit dialog
  const [submitOpen, setSubmitOpen] = useState(false);
  const [lineError, setLineError] = useState(false);

  const activeSuppliers = mockSuppliers.filter(s => s.isActive);
  const selectedSupplier = supplierId ? mockSuppliers.find(s => s.id === supplierId) : null;

  const orderTotal = useMemo(() => lines.reduce((s, l) => s + l.lineTotal, 0), [lines]);

  // ── Handlers ──────────────────────────────────────────────────────
  const addItem = (part: Part) => {
    const existing = lines.find(l => l.inventoryItemId === part.id);
    if (existing) {
      setLines(prev => prev.map(l =>
        l.inventoryItemId === part.id
          ? { ...l, quantityOrdered: l.quantityOrdered + 1, lineTotal: (l.quantityOrdered + 1) * l.unitCost }
          : l
      ));
    } else {
      setLines(prev => [...prev, {
        id: nextId(),
        inventoryItemId: part.id,
        name: part.name,
        sku: part.sku,
        uom: part.uom,
        quantityOrdered: 1,
        quantityReceived: 0,
        unitCost: part.costPrice,
        lineTotal: part.costPrice,
      }]);
    }
    setItemSearchOpen(false);
    setItemSearch("");
    setLineError(false);
  };

  const updateLine = (lineId: string, field: "quantityOrdered" | "unitCost", value: number) => {
    setLines(prev => prev.map(l => {
      if (l.id !== lineId) return l;
      const updated = { ...l, [field]: value };
      updated.lineTotal = updated.quantityOrdered * updated.unitCost;
      return updated;
    }));
  };

  const removeLine = (lineId: string) => setLines(prev => prev.filter(l => l.id !== lineId));

  const buildPO = (status: "DRAFT" | "ORDERED"): PurchaseOrder => ({
    id: id || `po-${Date.now()}`,
    poNumber,
    supplierId,
    supplierName: selectedSupplier?.name || null,
    status,
    orderDate: status === "ORDERED" ? (orderDate ? format(orderDate, "yyyy-MM-dd") : new Date().toISOString().slice(0, 10)) : null,
    expectedDeliveryDate: expectedDate ? format(expectedDate, "yyyy-MM-dd") : null,
    receivedDate: null,
    totalAmount: orderTotal,
    notes,
    lines,
    createdAt: existingPO?.createdAt || new Date().toISOString().slice(0, 10),
  });

  const handleSaveDraft = () => {
    const po = buildPO("DRAFT");
    toast.success("Draft saved");
    navigate(`/workshop/purchase-orders/${po.id}`);
  };

  const handleSubmitOrder = () => {
    if (lines.length === 0) {
      setLineError(true);
      return;
    }
    setSubmitOpen(true);
  };

  const confirmSubmit = () => {
    const po = buildPO("ORDERED");
    toast.success("Order submitted");
    navigate(`/workshop/purchase-orders/${po.id}`);
    setSubmitOpen(false);
  };

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 pb-8 min-w-0">
      {/* Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => navigate("/workshop/purchase-orders")}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">{isEdit ? "Edit Purchase Order" : "New Purchase Order"}</h1>
            <p className="text-xs text-muted-foreground">Create a purchase order for parts and supplies</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleSaveDraft}>
            <Save className="w-3.5 h-3.5" /> Save Draft
          </Button>
          <Button size="sm" className="gap-1.5 text-xs bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleSubmitOrder}>
            <Send className="w-3.5 h-3.5" /> Submit Order
          </Button>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start min-w-0">
        {/* Left column */}
        <div className="space-y-6">
          {/* PO Details */}
          <Card className="shadow-soft border-border/50 overflow-hidden">
            <CardHeader className="py-4 bg-secondary/20">
              <SectionHeader icon={FileText} title="PO Details" />
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">PO Number</Label>
                  <div className="relative">
                    <Input value={poNumber} onChange={e => setPONumber(e.target.value)} placeholder="PO-0001" className="pr-8 font-mono" />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" onClick={resetPONumber} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">Reset to generated PO number</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-[11px] text-muted-foreground/60">Auto-generated. Edit to use your own reference.</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Supplier</Label>
                  <Select value={supplierId || "none"} onValueChange={v => setSupplierId(v === "none" ? null : v)}>
                    <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Supplier (Ad-hoc)</SelectItem>
                      {activeSuppliers.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedSupplier && (
                    <p className="text-[11px] text-muted-foreground">{selectedSupplier.contactPerson} · {selectedSupplier.phone}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Order Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !orderDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 w-4 h-4" />
                        {orderDate ? format(orderDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={orderDate} onSelect={setOrderDate} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Expected Delivery</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !expectedDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 w-4 h-4" />
                        {expectedDate ? format(expectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={expectedDate}
                        onSelect={setExpectedDate}
                        disabled={d => orderDate ? d < orderDate : false}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {!expectedDate && <p className="text-[11px] text-warning">No expected delivery date set.</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Notes</Label>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Delivery instructions, payment terms, reference numbers..." rows={2} className="resize-none" />
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="shadow-soft border-border/50 overflow-hidden">
            <CardHeader className="py-4 bg-secondary/20">
              <div className="flex items-center justify-between">
                <SectionHeader icon={Package} title="Items" accent />
                <Popover open={itemSearchOpen} onOpenChange={setItemSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> Add Item
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[420px] p-0" align="end">
                    <Command>
                      <CommandInput placeholder="Search parts..." value={itemSearch} onValueChange={setItemSearch} />
                      <CommandList>
                        <CommandEmpty>No parts found.</CommandEmpty>
                        <CommandGroup>
                          {mockParts.map(part => (
                            <CommandItem key={part.id} value={`${part.name} ${part.sku}`} onSelect={() => addItem(part)} className="flex items-center justify-between gap-2 cursor-pointer">
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{part.name}</p>
                                <p className="text-xs text-muted-foreground/70">{part.sku} · ${part.costPrice.toFixed(2)}</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <Badge variant="secondary" className={cn("text-[10px]", part.stock <= part.minStock && "bg-warning/10 text-warning border-warning/20")}>
                                  Stock: {part.stock}
                                </Badge>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {lines.length === 0 ? (
                <div className="py-10 flex flex-col items-center justify-center text-center">
                  <Package className="w-8 h-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">No items added yet. Click 'Add Item' to begin.</p>
                  {lineError && <p className="text-xs text-destructive mt-2">Add at least one item before submitting.</p>}
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/20">
                        <TableHead className="text-xs">Item</TableHead>
                        <TableHead className="text-xs">UoM</TableHead>
                        <TableHead className="text-xs text-center w-20">Qty</TableHead>
                        <TableHead className="text-xs text-right w-28">Unit Cost</TableHead>
                        <TableHead className="text-xs text-right w-24">Line Total</TableHead>
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lines.map(line => (
                        <TableRow key={line.id}>
                          <TableCell>
                            <div className="text-sm font-medium">{line.name}</div>
                            <div className="text-xs text-muted-foreground/70">{line.sku}</div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{line.uom}</TableCell>
                          <TableCell className="text-center">
                            <Input
                              type="number"
                              min={1}
                              className="w-20 text-center h-8 text-sm"
                              value={line.quantityOrdered}
                              onChange={e => updateLine(line.id, "quantityOrdered", Math.max(1, parseInt(e.target.value) || 1))}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="relative inline-flex items-center">
                              <span className="absolute left-2 text-xs text-muted-foreground">$</span>
                              <Input
                                type="number"
                                min={0}
                                step={0.01}
                                className="w-28 text-right h-8 text-sm pl-5"
                                value={line.unitCost}
                                onChange={e => updateLine(line.id, "unitCost", Math.max(0, parseFloat(e.target.value) || 0))}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-sm font-semibold">${line.lineTotal.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:!text-destructive hover:bg-destructive/10" onClick={() => removeLine(line.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {lineError && <p className="text-xs text-destructive px-4 pb-3">Add at least one item before submitting.</p>}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column — sticky sidebar */}
        <div className="space-y-4 xl:sticky xl:top-[calc(3.5rem+1.5rem)]">
          {/* Order Summary */}
          <Card className="shadow-soft border-border/50">
            <CardHeader className="py-4 bg-secondary/20">
              <SectionHeader icon={FileText} title="Order Summary" accent />
            </CardHeader>
            <CardContent className="pt-5 space-y-2">
              {lines.map(l => (
                <div key={l.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate pr-2">{l.name}</span>
                  <span className="font-medium shrink-0">{l.quantityOrdered} × ${l.unitCost.toFixed(2)}</span>
                </div>
              ))}
              {lines.length > 0 && <Separator className="my-2" />}
              <div className="flex justify-between text-base font-bold">
                <span>Order Total</span>
                <span className="text-accent">${orderTotal.toFixed(2)}</span>
              </div>
              <Badge variant="secondary" className="text-xs">{lines.length} item{lines.length !== 1 ? "s" : ""}</Badge>
            </CardContent>
          </Card>

          {/* Supplier Info */}
          {selectedSupplier && (
            <Card className="shadow-soft border-border/50">
              <CardHeader className="py-4 bg-secondary/20">
                <SectionHeader icon={Truck} title="Supplier Info" />
              </CardHeader>
              <CardContent className="pt-5 space-y-2">
                <p className="text-sm font-bold">{selectedSupplier.name}</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{selectedSupplier.contactPerson}</p>
                  <p>{selectedSupplier.email}</p>
                  <p>{selectedSupplier.phone}</p>
                </div>
                {selectedSupplier.notes && (
                  <p className="text-xs text-muted-foreground italic mt-2">{selectedSupplier.notes}</p>
                )}
                <Button variant="ghost" size="sm" className="text-xs mt-2 p-0 h-auto text-accent" onClick={() => navigate("/workshop/suppliers")}>
                  View Supplier →
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Submit Order AlertDialog */}
      <AlertDialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Order</AlertDialogTitle>
            <AlertDialogDescription>Submitting this order will notify your supplier. Continue?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={confirmSubmit}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
